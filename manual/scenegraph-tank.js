import * as THREE from 'three'
function main(){
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
//   设置背景色
  renderer.setClearColor(0x000000)
  // 启用阴影渲染
  renderer.shadowMap.enabled = true
function makeCamera (fov=40) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 1000
  // 创建一个透视相机（视锥体）
  return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
}
const camera = makeCamera()
//   放置视锥体位置
camera.position.set(8,4,10).multiplyScalar(3)
//   相机朝向
camera.lookAt(0,0,0)


  // 建立一个场景节点
  const scene = new THREE.Scene()
  // 在场景中添加光源
  {
    // 创建平行光
    const light = new THREE.DirectionalLight(0xffffff,1)
  //
  }



  renderer.render(scene,camera)
}
main()
