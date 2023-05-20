import { join } from 'node:path'
import { createServer } from 'node:http'
import { createReadStream} from 'node:fs'

const __packagesPath = join(__filename, '../../')

enum proxyPath {
  '林建余考试' = '/test'
}

const app = createServer((req, res) => {
  console.log(req)
  if(req.url === proxyPath['林建余考试']) {
    // const readStream = createReadStream(join(__packagesPath, './liu-test/index.html'), 'utf8');
    const readStream = createReadStream(join(__packagesPath, './liu-test/dist/index.html'), 'utf8');
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    readStream.pipe(res);
    console.log(req.url.endsWith)
  }
})

// 监听指定的端口
const port = 10000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});