<template>
  <teleport to="body">
    <div 
      :class="[
        'envelope-dialog',
        'animation',
        loginClass,
        isExpandClass,
        visibleClass
      ]"
    >
      <div class="envelope-container" @click="handleClose">
        <div class="envelope-content" @click="e => handleClose(e, true)">
          <!-- 反面手机号码 -->
          <div class="opposite animation"></div>
          <!-- 手机号码数据内容 -->
          <div class="phone animation">
            <h2 class="title">祝福信</h2>
            <div class="form-container">
              <label for="message">手机号：</label>
              <input 
                id="message" 
                type="number" 
                class="number-input"
                name="message"
                :disabled="loading"
                v-model="value" 
                placeholder="输入手机号领取祝福"
              />
              <div class="error" v-if="isError">请输入合法的手机号</div>
            </div>
            <button type="button" @click="handleSubmit">提交</button>
          </div>
          <div class="front animation">
            <!-- 正面左门 -->
            <div class="front-left animation"></div>
            <!-- 正面右门 -->
            <div class="front-right animation"></div>
          </div>
          <!-- 信内容 -->
          <div class="paper animation">
            <div class="paper-slider">
              <div class="paper-slider-border">
                <Slider :open="loginClass === 'open'" />
              </div>
            </div>
            <div class="paper-container" ref="paperContentRef">
              <div class="paper-container-rich" v-html="state.content" ></div>
            </div>
            <div :class="['send', state.isFocus ?  'focus' : 'no-focus']">
              <textarea 
                v-model="state.remark" 
                class="input" 
                rows="5" cols="1"
                :style="{ resize: 'none' }"
                placeholder="请输入您的祝福～"
                @focus="state.isFocus = true"
                @blur="state.isFocus = false"
              />
              <button class="send-btn" @click="handleSend">
                <span>祝福</span>
              </button>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <span 
            class="iconfont icon-guanbi animation" 
            @click="handleCloseBtn"
          />
        </div>
      </div>
      <Toast 
        v-model:visible="toastVisible" 
        :content="toastContent"
      />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios'
import { baseURL } from '@/store'
import { Slider } from '../slider'
import { Toast } from '../toast';
const props = defineProps<{
  visible?: boolean
  isExpandClass?: 'expand' | 'contract'
}>()
const emits = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'update:isExpandClass', value?: 'expand' | 'contract'): void
}>()
const paperContentRef = ref<Element>()
const state = reactive<{
  phone?: number
  content?: string
  remark?: string // 留言
  isFocus?: boolean // 留言框是否获得焦点
}>({
  phone: undefined,
  content: undefined,
  remark: undefined,
  isFocus: false 
})

const toastContent = ref('祝福成功～')
const toastVisible = ref(false)
const value = ref<number>()
// 未登陆的开关动画
const visibleClass = ref<string>()
// 登陆动画
const loginClass = ref<'no-login' | 'login' | 'open' | 'close'>()


// loading
const loading = ref(false)
const isError = ref(false)

watch(() => props.visible, () => {
  value.value = undefined
  // 显示且登陆过(左下角展开，收缩)
  if(!state.phone) {
    // 处理未登陆的开关动画
    if(props.visible) {
      visibleClass.value = 'show'
    } else {
      visibleClass.value = 'hidden'
    }
  }
  // props.visible && !state.phone
  if(!state.phone) {
    loginClass.value = 'no-login'
  }
}, {
  immediate: true
})

watch(() => props.isExpandClass, newVal => {
  if(newVal === 'expand') {
    if(paperContentRef.value) {
      paperContentRef.value.scrollTop = 0
    }
    setTimeout(() => {
      emits('update:isExpandClass')
      loginClass.value = 'open'
    }, 1000)
  }
})

const handleSend = () => {
  if(!state.remark) {
    toastContent.value = '请说点什么吧！'
    toastVisible.value = true
    return
  }
  
  axios.request({
    baseURL,
    url: `/benediction/`,
    method: 'post',
    data: {
      phoneNumber: state.phone,
      content: state.remark
    }
  }).then(() => {
    toastContent.value = '祝福成功～'
    toastVisible.value = true
    state.remark = ''
  })
  
}

const handleSubmit = () => {
  if(loading.value) return
  if(value.value && /^1(3|4|5|6|7|8|9)\d{9}$/.test(value.value.toString())) {
    isError.value = false  
    axios.request({
      baseURL,
      url: `/letter/contents/${value.value}`,
      method: 'get'
    }).then(res => {
      state.content = res?.data?.data?.content || ''
      state.phone = value.value
      loginClass.value = 'login'
      // 过几秒删除login
      setTimeout(() => {
        loginClass.value = 'open'
      }, 800)
    }).finally(() => {
      loading.value = false
    })
  } else {
    isError.value = true
  }  
}

// 打开以后不能点击蒙版关闭
const handleClose = (e: Event, flag = false) => {
  if(loginClass.value === 'open' || flag) {
    e.preventDefault();
    e.stopPropagation()
    return false
  }
  emits('update:visible', false)
}
// 关闭按钮
const handleCloseBtn = () => {
  loginClass.value = 'close'
  setTimeout(() => {
    emits('update:isExpandClass', 'contract')
  }, 3500)
}
</script>