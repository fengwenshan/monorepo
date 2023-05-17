<template>
  <div ref="scrollRef" :class="['scroll-container']">
    <span class="rich-content"></span>
    <div
      class="build-item"
      v-for="(item, index) in list"
      :key="index"
    >
      <div v-if="item.status" class="item">
        <div class="build-before">~</div>
          <div class="build-day">[{{ item.date }}]</div>
          <div class="build-day">{{ item.name }}</div>
          <span class="iconfont icon-loading" v-if="!item.time"></span>
          <div class="build-time" v-else>[{{ item.time }}]ms</div>
      </div>
    </div>
    <div class="progress" v-if="progressCount">
      <div class="build-before">~</div>
      <div class="build-progress">{{ progressContent }}</div>
      <div class="build-before">{{ Math.round(progressCount * 100) / 100 }}%</div>
    </div>
    <div class="receive" v-if="dropLoopTimerValue && !isLogin">
<!--      <div class="receive-before">~</div>-->
<!--      <div class="receive-time">[{{ dropLoopTimerValue }}]</div>-->
      <div class="receive-progress">是否查收来自贺怡衡&单慧的信件{{ dropLoopValue }}</div>
    </div>
    <div class="main-btn" v-if="dropLoopValue && dropLoopValue === '。。。' && !isLogin">
      <button @click="$emit('click', true)">【是】</button>
      <button @click="$emit('click', false)">【否】</button>
    </div>
    <div :style="{ height: isLogin ? '200px' : '100px' }"></div>
  </div>


</template>

<script lang="ts" setup>
import Typed from 'typed.js'
import { onMounted, ref } from 'vue';

const props = defineProps<{
  content: string,
  isLogin?: string
}>()
const emits = defineEmits<{
  (e: 'finish'): void
  (e: 'click', status: boolean): void
}>()

const scrollRef = ref<HTMLElement>()
const getCurrentTime = () => {
  const padZero = (num: number) => {
    return num < 10 ? "0" + num : num;
  }
  const now = new Date();
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  return `${hours}:${minutes}:${seconds}`
}

const list = ref([
  {
    status: false,
    name: '初始化',
    time: 0,
    date: ''
  },
  {
    status: false,
    name: '解压中',
    time: 0,
    date: ''
  },
  {
    status: false,
    name: '组装中',
    time: 0,
    date: ''
  },
  {
    status: false,
    name: '打包中',
    time: 0,
    date: ''
  },
  {
    status: false,
    name: '微笑🙂',
    time: '',
    date: ''
  },
  {
    status: false,
    name: '大笑😄',
    time: '',
    date: ''
  },
  {
    status: false,
    name: '编译中...',
    time: '',
    date: ''
  }
])

const timer = ref(50)

onMounted(() => {
  if(window.location.href.indexOf('query') !== -1) {
    console.log(window.location.href)
    timer.value = 0
  }

  new Typed('.rich-content', {
    strings: [props.content],
    typeSpeed: timer.value, // 50,
    backSpeed: timer.value,
    smartBackspace: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    contentType: 'html',
    onComplete: () => {
      buildProcess()
    }
  });
})

const currentIndex = ref(0)
const progressContent = ref('')
let progressCount = ref(0);
let intervalId = 0
const buildProcess = () => {
  list.value[currentIndex.value].status = true
  const min = 800;
  const max = 2000;
  const value =  Math.floor(Math.random() * (max - min + 1) + min);
  list.value[currentIndex.value].date = getCurrentTime()
  setTimeout(() => {
    list.value[currentIndex.value].time = value
    if(currentIndex.value === list.value.length - 1) {
      // 执行完成
      buildProcessV2()
    } else {
      currentIndex.value += 1
      setTimeout(() => {
        buildProcess()
      }, 300)
    }

  },timer.value === 50 ? value : timer.value)
}

const buildProcessV2 = () => {
  const time = 50 / 500
  intervalId = setInterval(() => {
    progressCount.value += time
    const value = parseInt((progressCount.value / 10).toString())
    progressContent.value = ''
    for(let i = 0; i < value; i++) {
      progressContent.value += '#'
    }
    if(progressCount.value >= 100) {
      progressCount.value = 100
      clearInterval(intervalId)
      dropLoop()
      return
    }
  }, time)
}


// 点循环
const dropLoopValue = ref('')
const dropLoopTimerValue = ref('')
const dropLoop = () => {
  const timer = setInterval(() => {
    dropLoopTimerValue.value = getCurrentTime()
    dropLoopValue.value += '。'
    if(dropLoopValue.value === '。。。') {
      clearInterval(timer)
      emits('finish')
    }
  }, 200)
}

defineExpose({
  scrollRef
})



</script>
