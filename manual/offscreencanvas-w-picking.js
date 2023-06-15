import {state,init,pickPosition} from "./shared-picking";


let sendMouse

function startWorker(canvas){
  const offscreen = canvas.transferControlToOffscreen()
  const worker = new Worker(
    'offscreencanvas-worker-picking.js',
    {type:'module'}
  )
  worker.postMessage(
    {type:'init',canvas:offscreen},[offscreen]
  )
  sendMouse = (x,y)=>{
    worker.postMessage({
      type:'mouse',
      x,y
    })
  }
  function sendSize(){
    worker.postMessage({
      type:'size',
      width:canvas.clientWidth,
      height:canvas.clientHeight
    })
  }
  window.addEventListener('resize',sendSize)
  sendSize()
}


function startMainPage(canvas){
  init({canvas})
  sendMouse = (x,y)=>{
    pickPosition.x = x
    pickPosition.y = y
  }
  function sendSize(){
    state.height  = canvas.clientHeight
    state.width = canvas.clientWidth
  }
  window.addEventListener('resize',sendSize)
  sendSize()
}

function main(){
  const canvas = document.querySelector('#c')
  const {transferControlToOffscreen} =canvas
  if(transferControlToOffscreen){
    startWorker(canvas)
  } else {
    startMainPage(canvas)
  }
  function getCanvasRelativePosition(event){
    const rect = canvas.getBoundingClientRect()
    return {
      x:event.clientX-rect.left,
      y:event.clientY - rect.top,
    }
  }
  function setPickPosition(event){
    const pos = getCanvasRelativePosition(event)
    sendMouse(
      (pos.x/canvas.width)*2-1,// -1~1
      (pos.y/canvas.height)*-2+1 // -1~1
    )
  }

  function clearPickPosition(){
    sendMouse(-10000,-10000)
  }
  window.addEventListener('mousemove',setPickPosition)
  window.addEventListener('mouseout',clearPickPosition)
  window.addEventListener('mouseleave',clearPickPosition)

}
main()
