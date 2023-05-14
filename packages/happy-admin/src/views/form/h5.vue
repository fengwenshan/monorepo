<template>
  <div class="iphone6">
    <iframe src="http://124.221.248.143:80/" frameborder="0" height="667px" width="350px" scrolling="no" ref="frameRef"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';

const frameRef = ref<HTMLIFrameElement>()

onMounted(() => {
 setTimeout(() => {
  frameRef.value?.contentWindow?.postMessage('admin-scroll', '*');
 }, 1000)
})
</script>

<style lang="scss" scoped>
.iphone6 {
  width: 350px;
  height: 667px;
  margin-left: 20px;
  margin-top: 20px;
  border: 1px solid #fff;
  // border-radius: 5px;
}

/* 修改滚动条的样式 */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

</style>