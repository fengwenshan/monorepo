<template>
  <van-radio-group v-model="value" >
    <h2 
      :class="item.id"
    >
      {{ item.count }}. {{ item.title }} 
    <span 
      :class="['answer', submitStatus ? 'red': '']" 
      v-if="modal === 3 || modal === 2 || submitStatus"
    >
      {{ item.answerText }}
    </span>
  </h2>
    <div class="determine">
      <van-radio 
        :name="subItem.id" 
        v-for="subItem in item.list" 
        :key="subItem.id"
      >
        {{ subItem.name }}
      </van-radio>
    </div>
   
  </van-radio-group>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Item1Type extends Record<string, any>{
  count: number,
  answer: string
  title: string
  list: {
    id: string,
    name: string,
  }[]
}


const props = defineProps<{
  modelValue: string,
  item: Item1Type 
  modal: number
  submitStatus: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped>

</style>