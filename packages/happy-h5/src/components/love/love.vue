<template>
  <!-- 爱心 -->
  <div 
   :class="[
     'love',
     animationStatus ? 'run' : 'stop'
   ]"
   ></div>
 </template>
 
 <script setup lang="ts">
 withDefaults(defineProps<{
  animationStatus: boolean
 }>(), {
  animationStatus: true
 })

 </script>
 
 <style lang="less" scoped>
 
 
 </style>