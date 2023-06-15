import {state,init,pickPosition} from "./shared-picking";
function size(data){
  state.width = data.width
  state.height = data.height
}
function mouse(data){
  pickPosition.x = data.x
  pickPosition.y = data.y
}
const handlers = {
  init,mouse,size
}
self.onmessage = (e)=>{
  const fn = handlers[e.data.type]
  fn(e.data)
}

