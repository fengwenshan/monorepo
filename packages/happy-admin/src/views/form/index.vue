<template>
  <a-spin :loading="allLoading" tip="加载中...">
    <div class="form-container">
      <a-form ref="formRef" :model="form" @submit-success="handleSubmit" :rules="rules" layout="vertical" :style="{ width: '600px' }" >
        <a-form-item field="phoneNumber" label="手机号" >
          <a-auto-complete 
            v-model="form.phoneNumber"
            :data="data" 
            @search="handleSearch"
            @select="handleSelect" 
            :allow-clear="true"
            placeholder="请输入手机号"
          >
            <template #option="{ data }">
              <div class="container">
                <a-popconfirm content="确认删除?" type="warning" @ok="handleDel(data.raw.value)">
                  <icon-close-circle class="icon-close-circle" @click="handleStopPropagation"/>
                </a-popconfirm>
                
                <div class="left">{{ data.raw.value }}</div>
                <div class="right">{{ data.raw.name }}</div>
              </div>
            </template>
          </a-auto-complete>
        </a-form-item>
        <a-form-item field="name" label="昵称" >
          <a-input v-model="form.name" placeholder="请输入昵称" />
        </a-form-item>

        <a-form-item field="content" label="信封内容">
          <QuillEditor 
            ref="myQuillEditor"
            theme="snow"
            v-model="form.content"
            v-model:content="form.content"
            :options="editordata.editorOption"
            contentType="html"
          />
        </a-form-item>
        <a-form-item class="btn-center">
          <a-space >
            <a-button html-type="submit" :loading="loading">提交</a-button>
            <!-- $refs.formRef.resetFields() -->
            <a-button @click="handleReset" :loading="loading">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <H5 />
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { FieldRule, Message, Form } from '@arco-design/web-vue'
import { IconCloseCircle } from '@arco-design/web-vue/es/icon'; 
import '@arco-design/web-vue/dist/arco.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const baseURL = 'http://124.221.248.143:8082'
import H5 from './h5.vue' 



const loading = ref(false)
const formRef = ref<InstanceType<typeof Form>>()
const editordata = reactive({
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

const form = reactive({
  id: undefined,
  name: '',
  phoneNumber: '',
  content: ''
})
const rules = reactive<Record<string, FieldRule | FieldRule[]>>({
  name: [
    { required:true, message:'请输入昵称' }
  ],
  phoneNumber: [
    { required:true, message:'请输入手机号' }
  ],
  content: [
    { required:true, message:'请输入信封内容' }
  ]
})
let origin: any[] = []
let dataMap: Record<string, { id: string, phoneNumber: string }> = {}
const data = ref<any[]>([])
const myQuillEditor=ref<InstanceType<typeof QuillEditor>>()
const allLoading = ref(false)
// 搜索
const handleSearch = (value: string) => {
  if(value) {
    data.value = origin.filter(item => item.value.indexOf(value) !== -1)
  } else {
    data.value = origin
  }
}
// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  myQuillEditor.value?.setText('')
}
// 提交
const handleSubmit = () => {
  loading.value = true
  axios.request({
    method: 'post',
    url: '/letter/contents/update',
    data: form,
    baseURL
  }).then(() => {
    Object.assign(form, {
      id: undefined,
      name: '',
      phoneNumber: '',
      content: ''
    })
    myQuillEditor.value?.setText('')
    handleQueryAll()
    Message.success('提交成功')
  }).catch(() => {
    console.log('提交失败')
  }).finally(() => {
    loading.value = false
  })
}
// 选中触发
const handleSelect = (value: any) => {
  allLoading.value = true
  axios.request({
    method: 'get',
    url: `/letter/contents/${value}`,
    baseURL,
  }).then(res => {
    const { name, content } = res.data.data
    Object.assign(form, { name, content })
    myQuillEditor.value?.setHTML(content)
  }).finally(() => {
    allLoading.value = false
  })
}
// 删除
const handleDel = (value: string) => {
  allLoading.value = true
  axios.request({
    method: 'post',
    url: `/letter/contents/delete/${value}`,
    baseURL
  }).then(() => {
    Message.success('删除成功')
    data.value = data.value.filter(item => item.id !== value)
    handleQueryAll(false)
  }).finally(() => {
    allLoading.value = false
  })
}
// 阻止冒泡
const handleStopPropagation = (e: Event) => {
  e.preventDefault();
  e.stopPropagation()
  return false
}

// 请求全部下啦数据
const handleQueryAll = (flag = true) => {
  allLoading.value = true
  axios.request({
    method: 'get',
    url: '/letter/contents/',
    baseURL
  }).then(res => {
    origin = res.data.data.map(item => ({
      value: item.phoneNumber,
      id: item.id,
      name: item.name
    }))
    res.data.data.forEach(item => {
      dataMap[item.phoneNumber] = item
    })
    if(flag) {
      data.value = origin
    }
  }).finally(() => {
    allLoading.value = false
  })
}
handleQueryAll()
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
}
.animation {
  width: 50px;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 5s steps(1000, end);
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    width: 200px;
  }
  .right {
    color: #bbb;
  }
}
.icon-close-circle {
  z-index: 1000;
  position: relative;
  color: red;
  width: 40px;
  font-size: 20px;
}
:deep(.arco-form-item-content-flex) {
  flex-direction: column;
  .ql-container {
    flex: 1;
    width: 100%;
    min-height: 400px;
  }
  .ql-editor {
    min-height: 400px;
    height: 100%;
  }
}
</style>

<style lang="scss">
.ck.ck-editor {
  color: #000;
  flex: 1;
  .ck.ck-editor__main {
    .ck-content {
      min-height: 500px;
      max-height: 800px;
      overflow-y: auto;
    }
    
  }
}
.btn-center {
  .arco-form-item-content {
    justify-content: center;
  }
}

</style>