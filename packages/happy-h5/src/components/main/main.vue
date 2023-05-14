<template>
  <!--  -->
  <div ref="mainRef" :style="{ overflow: overflowValue }" :class="['main', scrollH5 ? 'scroll-h5' : '']">
    <PrintRichText 
      ref="printRichTextRef"
      :content='rich'
      @finish="handleFinish"
      @click="handleClick"
      :is-login="isExpandClass"
    />
    <Envelope  
      v-model:visible="visible"
      v-model:isExpandClass="isExpandClass"
    />
    <div 
      :class="LoveClass" 
      @click="isExpandClass = 'expand'"
      v-if="isExpandClass"
    >
      <Love />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { rich } from './rich'
import { PrintRichText, usePrintRichTextOp } from '../print-rich-text'
import { Envelope } from '../envelope'
import { Love } from '../love'
import {computed, onMounted, ref } from 'vue'
const visible = ref(false)
const overflowValue = ref<'hidden' | 'auto'>('hidden')
// 展开，收动画
const isExpandClass = ref<'expand' | 'contract'>()
const mainRef = ref<HTMLElement>()
const { instance: printRichTextRef } = usePrintRichTextOp()
let timer = 0
onMounted(() => {
  let oldValue = 0;
  timer = setInterval(() => {
    if(mainRef.value && printRichTextRef.value) {
      const containerHeight = mainRef.value.offsetHeight
      const height = printRichTextRef.value.scrollRef.offsetHeight
      const value = height - containerHeight
      if(value >= 0 && oldValue !== value) {
        mainRef.value.scrollTop = value
        oldValue = value
      }
    }
    
  }, 300)
})

const handleFinish = () => {
  setTimeout(() => {
    clearInterval(timer)
  }, 300)
  overflowValue.value = 'auto'
}

const LoveClass = computed(() => {
  if(isExpandClass.value === 'expand') { // 展开
    return 'love-expand love-com animation'
  } else if(isExpandClass.value === 'contract'){ // 收起
    return 'love-contract love-com animation'
  } 
  return 'love-com'
})

const handleClick = (status: boolean) => {
  if(status) {
    visible.value = true
  }
}

const scrollH5 = ref(false)
window.addEventListener('message', e => {
  if(e.data === 'admin-scroll') {
    console.log('中')
    scrollH5.value = true
  }
})
</script>