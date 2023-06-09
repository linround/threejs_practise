import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

const gui = new GUI();

function main(){
  //
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const rtWidth = 400;
  const rtHeight = 400;
  // renderTarget就是将渲染的结果作为纹理进行渲染到另一个
  const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight,{
    depthBuffer: false,
    stencilBuffer: false,
  });


  // 设置renderTarget的渲染效果
  const rtFov = 90;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 5;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 2;

  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('skyblue');

  {
    const color = 0x11ff11;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-10, 20, 45);
    rtScene.add(light);
  }




  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);


  function makeInstance(geometry,color,x){
    const material = new THREE.MeshPhongMaterial({color})
    const cube = new THREE.Mesh(geometry,material)
    // 在renderTarget上添加物体
    rtScene.add(cube)
    cube.position.x = x
    return cube
  }
  const rtCubes = [
    makeInstance(geometry,0x44aa88,0),
    makeInstance(geometry,0x8844aa,-2),
    makeInstance(geometry,0xaa8844,2),
  ]









  // 以下是当前相机的正常视图渲染
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
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    //设置光源位置
    light.position.set(-1,2,4)
    scene.add(light)
  }


//   这里的纹理采用的之前设置的renderTarget
const material = new THREE.MeshPhongMaterial({
  map:renderTarget.texture
})
  const cube = new THREE.Mesh(geometry,material)
  scene.add(cube)


























  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;

    /*
    * todo 处理renderTarget模糊的问题
    * */
    // renderTarget.setSize(canvas.width, canvas.height);
    // rtCamera.aspect = camera.aspect;
    // rtCamera.updateProjectionMatrix();


    camera.updateProjectionMatrix();

    rtCubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });


    {
      renderer.setRenderTarget(renderTarget)
      renderer.render(rtScene,rtCamera)
      renderer.setRenderTarget(null)
      cube.rotation.x = time
      cube.rotation.y = time*1.1
    }


    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
