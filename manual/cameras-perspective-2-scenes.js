import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import GUI from 'lil-gui';

const gui = new GUI();

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}
function main(){
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=45) {
    const aspect = 2
    const zNear = 5
    const zFar = 100
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.set(0,10,20)
  function updateCamera() {
    camera.updateProjectionMatrix();
  }
  // const controls = new OrbitControls(camera,canvas)

  // 建立一个场景节点
  const scene = new THREE.Scene()

  scene.background = new THREE.Color('black');

  const color = 0xFFFFFF;
  const intensity = 1;
  // 添加一个环境光
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.y = 10
  light.target.position.x = -5
  scene.add(light);
  scene.add(light.target)
  function setScissorForElement(elem) {
    const elemRect = elem.getBoundingClientRect();

    // 计算画布中，该元素的相对长方形
    const right = elemRect.right;
    const left = elemRect.left;
    const bottom = elemRect.bottom;
    const top = elemRect.top;

    const width = right-left;
    const height = bottom-top;

    // scissor 剪切
    // setScissor 设置剪切范围内
    renderer.setScissor(left, top, width, height);
    // 设置渲染器视口范围
    renderer.setViewport(left, top, width, height);

    // 重新调整视野宽度
    // aspect 可以
    return width / height;
  }

    const cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper)



    const view1Elem = document.querySelector('#view1');
    const controls = new OrbitControls(camera, view1Elem);



    const view2Elem = document.querySelector('#view2');
  const camera2 = new THREE.PerspectiveCamera(
    60,  // fov
    2,   // aspect
    0.1, // near
    500, // far
  );
    camera2.position.set(40,10,40)
    const controls2 = new OrbitControls(camera2,view2Elem)











  {
    // 地平面
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('./resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // 对纹理细节所做的mipmap
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize/2
    texture.repeat.set(repeats,repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize,planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map:texture,
      side:THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(planeGeo,planeMat)
    mesh.rotation.x = Math.PI*-0.5
    scene.add(mesh)

  }
  {
    //   添加一个立方体
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(
      cubeSize,cubeSize,cubeSize
    )
    const cubeMat = new THREE.MeshPhongMaterial({
      color:'#8AC'
    })
    const mesh = new THREE.Mesh(
      cubeGeo,cubeMat
    )
    mesh.position.x = cubeSize
    mesh.position.y = cubeSize/2
    scene.add(mesh)
  }


  {
    //   添加一个球体
    const sphereRadius = 3
    const sphereWidthDivision = 32
    const sphereHeightDivision = 16
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,sphereWidthDivision,sphereHeightDivision
    )
    const sphereMat = new THREE.MeshPhongMaterial(
      {
        color:'#ca8'
      }
    )
    const mesh = new THREE.Mesh(
      sphereGeo,sphereMat
    )
    scene.add(mesh)
    mesh.position.y = sphereRadius + 2
    mesh.position.x = -sphereRadius - 1

  }











  {

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(
      camera, 'near', 'far', 0.1
    );
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1)
      .name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1)
      .name('far').onChange(updateCamera);


  }














  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);


    renderer.setScissorTest(true);
    {
      const aspect = setScissorForElement(view1Elem);

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();

      cameraHelper.visible = false;

      scene.background.set(0x000000);

      // render
      renderer.render(scene, camera);
    }

    // 需要渲染两次从而确保将两个相机的场景都渲染完成
    {
      // 在 setScissorForElement 函数中
      // 渲染器被设置了剪切范围 和 视口
      const aspect = setScissorForElement(view2Elem);

      //
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();


      cameraHelper.visible = true;

      scene.background.set(0x000040);
      // 渲染器将相机 camera2 的视图渲染在场景中
      renderer.render(scene, camera2);
    }

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
