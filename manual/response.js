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
      color,
    })
    const cube = new THREE.Mesh(geometry,material)
    scene.add(cube)
    cube.position.x = x
    return cube
  }
  const cubes = [
    makeInstance(geometry,0x44aa88,0),
    makeInstance(geometry,0x8844aa,-2),
    makeInstance(geometry,0xaa8844,2),
  ]




























  // 这里的time是毫秒级别
  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    cubes.forEach((cube,ndx)=>{
      const speed = 1+ndx*.1
      const rot = time*speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
