<template>
  <div>
  	<!-- 此处注意写法v-model:content -->
    <QuillEditor ref="myQuillEditor"
      theme="snow"
      v-model:content="content"
      :options="data.editorOption"
      contentType="html"
      @update:content="setValue()"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const fileBtn = ref()

const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'header': 1 }, { 'header': 2 }],
        ['image'],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }]
      ]
    },
    placeholder: '请输入内容...'
  }
})



// onMounted(() => {
//   const quill = toRaw(myQuillEditor.value).getQuill()
//   if (myQuillEditor.value) {
//     quill.getModule('toolbar').addHandler('image', imgHandler)
//   }
// })


</script>