import * as THREE from 'three'
import {texture} from "three/nodes";

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 5
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
//   放置视锥体位置
  camera.position.z=2

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1

  const geometry = new THREE.BoxGeometry(
    boxWidth,boxHeight,boxDepth
  )

  const cubes = []
  // 纹理解析工具
  const loader = new THREE.TextureLoader()

  // 等待纹理下载完成后再形成材质
  loader.load('./resources/images/wall.jpg',texture=>{
  //   利用纹理创建材质
    const material = new THREE.MeshBasicMaterial({
      map:texture
    })

    const cube = new THREE.Mesh(geometry,material)
    scene.add(cube)
    cubes.push(cube)
  })

  // 创建纹理 利用图片
  // 这里不需要等待纹理加载完成，而是立刻开始渲染
  // const material = new THREE.MeshBasicMaterial({
  //   map:loader.load('./resources/images/wall.jpg'),
  // })
  //
  // const cube = new THREE.Mesh(geometry,material)
  // scene.add(cube)
  // cubes.push(cube)































  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    cubes.forEach((cub)=>{
      const speed = 0.2
      const rot = time *speed
      cub.rotation.x = rot
      cub.rotation.y = rot
    })


    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
