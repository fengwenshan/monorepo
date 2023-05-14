<template>
  <teleport to="body">
    <div :class="['toast', 'animation', trendsClass]" >
      {{ content }}
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean,
  content: string,
  showTime?: number
}>()

const trendsClass = ref()

watch(() => props.visible, () => {
  trendsClass.value = props.visible ? 'show' : ''
})


const emits = defineEmits<{
  (e: 'update:visible', bool: boolean): void
}>()

watch(() => props.visible, () => {
  if(props.visible) {
    setTimeout(() => {
      emits('update:visible', false)
    }, props.showTime || 3000)
  }
})
</script>