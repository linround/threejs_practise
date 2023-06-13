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



  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/images/checker.png', render);
    // texture.wrapS=THREE.RepeatWrapping
    // texture.wrapT=THREE.RepeatWrapping
    // // 对纹理细节所做的mipmap
    // texture.magFilter = THREE.NearestFilter
    // const repeats = 500/2
    // texture.repeat.set(repeats,repeats)
    // 纹理映射
    // 通常几何信息中包含自己的uv坐标
    const geometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshBasicMaterial({map: texture});
    scene.add(new THREE.Mesh(geometry, material));
  }















window.THREE = THREE

  function addBoxes(file){
    const {min,max,data} = file
    const range = max - min

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(
      boxWidth,boxHeight,boxDepth
    )
    // 该球体会在z轴平移0.5
    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0,0,0.5)
    )

    const lonHelper = new THREE.Object3D()
    scene.add(lonHelper)
    const latHelper = new THREE.Object3D()
    lonHelper.add(latHelper)

    const positionHelper = new THREE.Object3D()
    positionHelper.position.z = 1
    latHelper.add(positionHelper)

  }









































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
    controls.update();
    renderer.render(scene, camera);
  }
  render()


  // 发生change事件
  // renderRequested false => renderRequested = true,防止render触发过快;触发render
  // render函数中 在触发控制器update之前 设置renderRequested=false,方便下一次触发change事件，再继续触发render，render
  //  render函数中始终会设置 renderRequested = false
  // 由于阻尼的存在 直到最终不再触发change事件
  function requestRenderIfNotRequested(){
    if(!renderRequested) {
      renderRequested = true
      requestAnimationFrame(render)
    }
  }
  controls.addEventListener('change',requestRenderIfNotRequested)

  window.addEventListener('resize', requestRenderIfNotRequested);

}
main()
