<template>
12312
</template>

<script lang="ts" setup>
import axios from 'axios'


const handleRequest = () => {
  return new Promise((resolve, reject) => {
    axios.request({
      baseURL: 'https://admin.liuligen.com/',
      url: '/api/index/vote',
      method: 'get',
      params: {
        studentId: '134',
        openid: 'okBf96naeo-ncKzrposBYkM'
      },
      headers: {
        'Host': 'admin.liuligen.com',
        'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13; V2183A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 XWEB/5061 MMWEBSDK/20230303 MMWEBID/7747 MicroMessenger/8.0.34.2340(0x2800225F) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64',
        'origin': 'https://liuligen.com',
        'x-requested-with': 'com.tencent.mm',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://liuligen.com/',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}


const loop = () => {
  handleRequest().then(res => {
    setTimeout(() => {
      loop()
    }, 1000)
  })
}
loop()


</script>

<style lang="scss" scoped>

</style>