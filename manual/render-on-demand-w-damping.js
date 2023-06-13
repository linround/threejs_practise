import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 5
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }


  const camera = makeCamera()
  // 注意设置相机的位置
  camera.position.z = 2
//   相机朝向
  camera.lookAt(0,0,0)

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const controls = new OrbitControls(camera,canvas)
  // 添加阻尼后
  // 我们需要在render函数中调用 controls.update，以便轨道控制器能够继续给我们一个新的相机设置（平滑滚动影响）
  // 这就意味这我们不能在change事件中调用render
  // 控制器会发送change事件去调用render,render会更新控制器，控制器会继续发送change事件
  // 所以我们只需要渲染新的帧
  controls.enableDamping = true
  controls.update();
  // 在场景中添加光源
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }


  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }
  makeInstance(geometry, 0x44aa88,  0);
  makeInstance(geometry, 0x8844aa, -2);
  makeInstance(geometry, 0xaa8844,  2);



























  let renderRequested = false

  // 这里的time是毫秒级别
  function render(){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderRequested = false
    console.log('update')
    controls.update();
    renderer.render(scene, camera);
  }
  render()


  // 发生change事件
  // renderRequested false => renderRequested = true,防止render触发过快;触发render
  // render函数中 在触发控制器update之前 设置renderRequested=false,方便下一次触发change事件，再继续触发render
  function requestRenderIfNotRequested(){
    console.log('88')
    if(!renderRequested) {
      renderRequested = true
      requestAnimationFrame(render)
    }
  }
  controls.addEventListener('change',requestRenderIfNotRequested)

  window.addEventListener('resize', requestRenderIfNotRequested);

}
main()
