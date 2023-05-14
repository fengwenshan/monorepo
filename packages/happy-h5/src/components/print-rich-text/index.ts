import { ref } from 'vue'

export { default as PrintRichText } from './print-rich-text.vue'
import PrintRichText from './print-rich-text.vue'

export const usePrintRichTextOp = () => {
  const instance = ref<typeof PrintRichText>()
  return {
    instance
  }
}