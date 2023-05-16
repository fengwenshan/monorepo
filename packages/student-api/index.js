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
  //   name: '第一名',
  //   studentId: 128,
  //   countFun: () => millisecondFun(),
  //   count: 0,
  // },
  {
    name: '都秀',
    studentId: 84, //134,
    countFun: () => millisecondFun() * 0,
    count: 0,
    start: 8,
    end: 21
  },
  {
    name: '雨晴',
    studentId: 40,
    countFun: () => millisecondFun() * 0,
    count: 0,
    start: 8,
    end: 21
  }
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
  // 'okBf96naeo-ncKzrposCidCTBYkM'
  const path = `/api/index/vote?${new URLSearchParams({ studentId: item.studentId, openid:  generateRandomString() })}`
  const req = https.request({
    hostname: 'admin.liuligen.com',
    path,
    mode: 'cors',
    credentials: 'omit',
    referrerPolicy: "strict-origin-when-cross-origin",
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-requested-with": "com.tencent.mm"
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


studentColl.forEach((item, index) => {
  loop(item, index)
})
