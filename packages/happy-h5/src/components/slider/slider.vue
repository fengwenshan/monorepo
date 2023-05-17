<template>
  <div class="slider">
    <div class="slider-container">
      <div
        class="slider-container__item"
        :key="item.id"
        v-for="item in imageList"
        :style="{
          transform: `translateX(${item.translateX})`,
        }"
      >
        <img :src="item.src"/>
      </div>
    </div>
  </div>


  </template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import Image1 from '@/assets/img/1.jpg'
import Image2 from '@/assets/img/2.jpg'
import Image3 from '@/assets/img/3.jpg'


const props = defineProps<{
  open: boolean
}>()
const unAutoPlay = ref()
const unTimeout = ref()
const imageList = ref([
  {
    id: '1',
    src: Image1,
    translateX: 0,
  },
  {
    id: '2',
    src: Image2,
    translateX: '100%'
  },
  {
    id: '3',
    src: Image3,
    translateX: '200%'
  },
])

watch(() => props.open, (newVal) => {
  setTimeout(() => {
    if(newVal) {
      unTimeout.value = setInterval(() => {
        autoPlay()
      }, 2000)
    } else {
      clearInterval(unTimeout.value)
      clearInterval(unAutoPlay.value)
    }
  }, 3000)
})

const autoPlay = () => {
  let flag = false
  clearInterval(unAutoPlay.value)
  unAutoPlay.value = setInterval(() => {
    imageList.value = imageList.value.map(item => {
      let num = Number(item.translateX.toString().split('%')[0]) + -1 // -0.25 // 100
      if(num === -200) {
        num = 100 * (imageList.value.length - 2)
      }
      if(num === 0) {
        flag = true
      }
      return {
        ...item,
        translateX: num + '%'
      }
    })
    if(flag) {
      clearInterval(unAutoPlay.value)
    }
  }, 1) // 200
}


onUnmounted(() => {
  clearInterval(unTimeout.value)
  clearInterval(unAutoPlay.value)
})
</script>



