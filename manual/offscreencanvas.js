import GUI from 'lil-gui';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const {transferControlToOffscreen} = canvas;

  // 检查浏览器是否支持该属性
  if(!transferControlToOffscreen) {
    canvas.style.display = 'none'
    document.querySelector('#noOffscreenCanvas').style.display = ''
    return
  }
  const offscreen = canvas.transferControlToOffscreen()
  // type module 是因为 offscreencanvas-cubes.js 中使用了import语法
  // type classic 就是传统的 js文件
  const worker = new Worker('offscreencanvas-cubes.js',{type:'module'})
  worker.postMessage({type:'main',canvas:offscreen},[offscreen])
  function sendSize(){
    worker.postMessage({
      type:'size',
      width:canvas.clientWidth,
      height:canvas.clientHeight
    })
  }
  sendSize()
  window.addEventListener('resize',sendSize)
}
main()
