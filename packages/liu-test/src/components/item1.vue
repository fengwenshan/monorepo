<template>
  <van-radio-group v-model="value">
    <h2 
      :id="item.id.toString()"
    >
      {{ item.count }}. {{ item.title }} 
      <span 
        :class="[
          'answer',
          submitStatus ? 'red' : ''
        ]" 
        v-if="modal === 3 || modal === 2 || submitStatus"
      >
        {{ item.answerText }}
      </span>
    </h2>
    <template v-if="modal !== 2">
      <van-radio 
        :name="subItem.id" 
        v-for="subItem in item.list" 
        :key="subItem.id"
      >
        {{ subItem.id }}: {{ subItem.name }}
      </van-radio>
    </template>
  </van-radio-group>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Item1Type extends Record<string, any>{
  count: number,
  answer: string
  answerText: string
  title: string
  list: {
    id: string,
    name: string,
  }[]
}

const props = defineProps<{
  modelValue: string,
  item: Item1Type,
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