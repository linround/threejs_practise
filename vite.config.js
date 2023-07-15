const  fs = require('fs')


// 这里只配置了html文件的打包处理
// 对于某些资源文件，需要复制到对应路径下
const paths = {}
function getFiles(fold){
  // 读取文件夹下的所有文件
  const files = fs.readdirSync(fold)
  const htmlReg = /(.+(?=[.html]$))/
  // 匹配得到html文件
  const htmlFile = files.filter(file =>{
    return htmlReg.test(file)
  })
  // console.log(htmlFile)
  htmlFile.map(file =>{
    const index = file.indexOf('.html')
    const name = file.substring(0,index)
    paths[name] = `${fold}${file}`
  })
}
getFiles('./manual/')
getFiles('./babylon/')
getFiles('./deepDive/')


export default {
 build:{
   rollupOptions:{
     input:{
       default:'./index.html',
        ...paths
     },
   },
 },
}
