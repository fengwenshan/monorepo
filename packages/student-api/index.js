import https from 'node:https'
import net from 'node:net'
import { URLSearchParams } from 'node:url'

// https://admin.liuligen.com/api/index/vote?studentId=134&openid=okBf96naeo-ncKzrposCidCTBYkM

// 模拟生成微信id
function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
  const length = Math.floor(Math.random() * (26 - 5 + 5)) + 5;;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


function hourFun() {
  const oneHourInMilliseconds = 3600 * 1000;
  const threeHourInMilliseconds = oneHourInMilliseconds * 3
  return  Math.floor(Math.random() * (threeHourInMilliseconds - oneHourInMilliseconds + oneHourInMilliseconds)) + oneHourInMilliseconds;
  // 这里是3小时内
  // const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;
  // return Math.floor(Math.random() * threeHoursInMilliseconds);
}
// 1- 3分钟随机生成数
function millisecondFun() {
  const randomMinutes = Math.floor(Math.random() * (3 - 1 + 1)) + 1;;
  return randomMinutes * 60 // * 1000;
}

const studentColl = [
  // {
  //   name: '谭茹萱',
  //   studentId: 90, // 128 182
  //   countFun: () => millisecondFun(),
  //   count: 0,
  // },
  // {
  //   name: '李萌',
  //   studentId: 52, // 128 182 52 92
  //   countFun: () => millisecondFun(),
  //   count: 0,
  // },
  {
    name: '王智宸',
    studentId: 92, // 128 182 52 92 145
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '李俊',
    studentId: 145, // 128 182 52 92 145 102
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '黄睿棋',
    studentId: 102, // 128 182 52 92 145 102 谭希辰 80
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '谭希辰',
    studentId: 80, // 128 182 52 92 145 102 谭希辰 80 程子依 45
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '程俊泽',
    studentId: 114, // 128 182 52 92 145 102 谭希辰 80 程子依 45 程俊泽 114 65 巢文静
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '巢文静',
    studentId: 65, // 128 182 52 92 145 102 谭希辰 80 程子依 45 程俊泽 114 65 巢文静 谭佳琪 160
    countFun: () => millisecondFun(),
    count: 0,
  },
  {
    name: '谭佳琪',
    studentId: 160, // 128 182 52 92 145 102 谭希辰 80 程子依 45 程俊泽 114 65 巢文静 谭佳琪 160
    countFun: () => millisecondFun(),
    count: 0,
  },
  // {
  //   name: '都秀',
  //   studentId: 134,
  //   countFun: () => 0,
  //   count: 0,
  //   start: 8,
  //   end: 21
  // },
  // {
  //   name: '雨晴',
  //   studentId: 40,
  //   countFun: () => millisecondFun() * 0,
  //   count: 0,
  //   start: 8,
  //   end: 21
  // }
]

const parseTime = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return {
    hour, minute
  }
}
const loop = (item, index) => {
  // 'okBf96naeo-ncKzrposCidCTBYkM' generateRandomString()
  const path = `/api/index/vote?${new URLSearchParams({ studentId: item.studentId, openid:  generateRandomString() })}`
  const req = https.request({
    hostname: 'admin.liuligen.com',
    path,
    headers: {
      'Host': 'admin.liuligen.com',
      'content-type': 'application/json',
      'accept':	'application/json, text/plain, */*',
      'origin':	'https://liuligen.com',
      'user-agent':	'Mozilla/5.0 (Linux; Android 13; V2183A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 XWEB/5061 MMWEBSDK/20230303 MMWEBID/7747 MicroMessenger/8.0.34.2340(0x2800225F) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
      // 'x-requested-with':	'com.tencent.mm',
      // 'sec-fetch-site':	'same-site',
      // 'sec-fetch-mode':	'cors',
      // 'sec-fetch-dest':	'empty',
      // 'referer':	'https://liuligen.com/',
      // 'accept-encoding':	'gzip, deflate',
      // 'accept-language':	'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      // 'agent': new https.Agent({
      //   // Charles 默认监听 8888 端口
      //   proxy: 'http://192.168.3.2:10086'
      // })
    }
  }, res => {
    res.on('data', (chunk) => {
      item.count += 1
      let name = []
      studentColl.forEach(item => {
        name.push(`${item.name}: ${item.count}`)
      })
      let delay = 0
      const { hour } = parseTime()
      if(!(item.start === undefined && item.end === undefined) && (item.start > hour || item.end < hour)) {
        delay = hourFun()
      } 
      console.log(chunk.toString(), name.join('、'))
      setTimeout(() => {
        loop(item, index)
      }, delay || item.countFun())
    })
  })
  req.on('error', (error) => { 
    console.log('12312')
   })
  req.end()
}
// Array(60).fill({
//   name: '第一名',
//   studentId: 90,
//   countFun: () => millisecondFun(),
//   count: 0,
// }).forEach(item => {
//   loop(item)
// }) 

studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})
studentColl.forEach((item, index) => {
  loop(item, index)
})

