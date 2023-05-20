<template>
  <van-config-provider :theme="theme">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="城市"
      placeholder="选择城市"
      @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

    <h1>试卷：{{ title }}</h1>
    <van-button type="primary" @click="handleSubmit">提交</van-button>
    <component 
       v-for="item in list" 
      :modal="modal"
      :is="item.component || ''" 
      v-model="form[item.id || '']"
      :key="item.id"
      :item="item"
      :submit-status="isSubmitShowAnswer(item.id)"
    />
    <van-button type="primary" @click="handleSubmit">提交</van-button>
  </van-config-provider>
</template>

<script lang="ts" setup>
import { markRaw, onMounted, reactive, ref } from 'vue';
import { Item1, Item2, Item3 } from './components'
import JSON1 from '@/assets/json/1.json'
import { showNotify } from 'vant';
const { practiseName: title , questionVos } = JSON1.data

const form = reactive<Record<string, string | string[]>>({})

const theme = ref<'light' | 'dark'>('light');
const submitStatus = ref<boolean>()

const showPicker = ref(false)
const fieldValue = ref<string>('考试模式')

// 答案映射
const answerMap = reactive<Record<string, string>>({})

type ColumnsType = {
  text: string,
  value: number
}

const strSort = (str: string) => {
  return str.split('').sort().join('')
}
// true 显示答案
const isSubmitShowAnswer = (id: string) => {
  if(submitStatus.value) {
    if(typeof form[id] === 'string') {
      if(answerMap[id] !== form[id]) {
        return true
      }
    } else {
      return (form[id] as string[]).join('') !== answerMap[id]
    } 
  } 
  return false
} 

const handleSubmit = () => {
  let key_val = undefined
  let errorCount = 0
  Object.keys(form).every(key => {
    if(typeof form[key] === 'string') {
      if(form[key] === '') {
        key_val = key
        return false
      } else if(form[key] !== answerMap[key]){
          errorCount += 1
      }
    } else {
      if(form[key].length === 0) {
        key_val = key
        return false
      } else if(strSort((form[key] as string[]).join('')) !== answerMap[key]) {
         errorCount += 1
      }
    }
    return true
  })

  if(!key_val) {
    if(errorCount) {
      submitStatus.value = true
      showNotify({ type: 'danger', message: `${list.length}个，错误${errorCount}个` });
    } else {
      showNotify({ type: 'primary', message: '满分' });
    }
  } else {
    document.querySelector(`#${key_val}`)?.scrollIntoView({
      behavior: 'smooth', // 平滑滚动
      block: 'center', // 元素将与视口的顶部对齐
      inline: 'nearest' // 元素将尽可能靠近视口
    })
  }
}



const modal = ref<number>(1)

const columns: ColumnsType[]  = [
  { text: '考试模式', value: 1 },
  { text: '背题模式', value: 2 },
  { text: '显示答案', value: 3 },
  // { text: '做下一题，校验上一题', value: 4 },
];

const onConfirm = ({ selectedOptions }: { selectedOptions: ColumnsType[]}) => {
  showPicker.value = false;
  fieldValue.value = selectedOptions[0].text;
  modal.value = selectedOptions[0].value
  submitStatus.value = false
  Object.keys(form).forEach(key => {
    form[key] = typeof form[key] === 'string' ? '' : []
  })
};

onMounted(() => {
  /*判断是否处于深色模式*/
  if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      theme.value = 'dark'
  }
})

const list: any[] = questionVos.map((item, index) => {
  const { answer, title, choiceA, choiceB, choiceC, choiceD, questionId } = item
  const optionsMap: Record<string, string> = {
    A: choiceA,
    B: choiceB,
    C: choiceC,
    D: choiceD
  }
  const id = `A_${questionId}`
  answerMap[id] = answer
  form[id] = ''
  if(item.type === 1) { // 单选
    form[id] = ''
    return {
      id,
      count: index + 1,
      answer,
      answerText: optionsMap[answer],
      title,
      list: [
        { id: 'A', name: choiceA },
        { id: 'B', name: choiceB },
        { id: 'C', name: choiceC },
        { id: 'D', name: choiceD }
      ],
      component: markRaw(Item1)
    }
  } else if(item.type === 2) { // 多选
    form[id] = [] as string[]
    const answerStr: string[] = []
    strSort(answer).split('').forEach(item => {
      answerStr.push(optionsMap[item])
    })
    return {
      id,
      count: index + 1,
      answer: strSort(answer),
      answerText: answerStr.join('、'),
      title,
      list: [
        { id: 'A', name: choiceA },
        { id: 'B', name: choiceB },
        { id: 'C', name: choiceC },
        { id: 'D', name: choiceD }
      ],
      component: markRaw(Item2)
    }
  } else if(item.type === 3) { // 判断
    return {
      id,
      count: index + 1,
      answer,
      answerText: answer === '对' ? ' 对' : ' 错',
      title,
      list: [
        { id: '对', name: '对' },
        { id: '错', name: '错' },
      ],
      component: markRaw(Item3)
    }
  } else {
    console.log(item, 'item')
  }
})


</script>

<style lang="scss" scoped>

</style>