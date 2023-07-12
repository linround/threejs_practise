const  fs = require('fs')


const paths = {}
function getFiles(fold){
  const files = fs.readdirSync(fold)
  const htmlReg = /(.+(?=[.html]$))/
  const htmlFile = files.filter(file =>{
    return htmlReg.test(file)
  })
  htmlFile.map(file =>{
    const index = file.indexOf('.html')
    const name = file.substring(0,index)
    paths[name] = `${fold}${file}`
  })
}
getFiles('./manual/')
getFiles('./babylon/')


export default {
 build:{
   rollupOptions:{
     input:{
       default:'./index.html',
        ...paths
     },
   },
 }
}
