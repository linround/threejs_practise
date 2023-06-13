import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 5
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.z = 2

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const controls = new OrbitControls(camera,canvas)
  controls.update();
  // 在场景中添加光源
  {
    // 创建平行光
    const light = new THREE.DirectionalLight(0xffffff,1)
    //设置光源位置
    light.position.set(-1,2,4)
    scene.add(light)
  }

  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(
    boxWidth,boxHeight,boxDepth
  )
  function makeInstance(geometry,color,x){
    const material = new THREE.MeshPhongMaterial({
      color
    })
    const cube = new THREE.Mesh(geometry,material)
    cube.position.x = x
    scene.add(cube)
    return cube
  }

  const cubes = [
    makeInstance(geometry,0x44aa88,0),
    makeInstance(geometry,0x8844aa,-2),
    makeInstance(geometry,0xaa8844,2),
  ]





















  // 由于性能和兼容性
  // 浏览器默认会清楚已经绘制好的 buffer

  // 为了捕获对应的帧
  // 必须要在捕获之前就调用render
  // 因为在 在后面才调用render的话。上一帧的buffer实际已经被清除，从而开始绘制第二帧



  const state = {
    time:0
  }


  function render(){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    cubes.forEach((cube,ndx)=>{
      const speed = 1+ndx*.1
      const rot = state.time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })




    renderer.render(scene, camera);
  }

  function animate(time){
    state.time = time*0.001
    render()
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)












  const saveBlob = (function (){
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    return function saveData(blob,fileName){
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
    }
  })()
//   保存视频帧
  const element = document.querySelector('#screenshot')
  element.addEventListener('click',()=>{
    render()
    canvas.toBlob((blob=>{
      saveBlob(blob,`screen-${canvas.width}x${canvas.height}`)
    }))
  })
}
main()
