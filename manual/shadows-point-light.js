import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

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
  // 可渲染render
  renderer.shadowMap.enabled = true
  function makeCamera (fov=45) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 100
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.set(0, 10, 20);
//   相机朝向
  camera.lookAt(0,0,0)



  const controls = new OrbitControls(camera,canvas)
  controls.target.set(0, 5, 0);
  controls.update();


  // 建立一个场景节点
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  {
    const planeSize =40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('./resources/images/checker.png')


    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    // mipmap
    texture.magFilter = THREE.NearestFilter

    const repeats = planeSize/2
    texture.repeat.set(repeats,repeats)

    const  planeGeo = new THREE.PlaneGeometry(planeSize,planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map:texture,
      side:THREE.BackSide
    })
    const mesh = new THREE.Mesh(
      planeGeo,planeMat
    )
    // 平面可接收阴影
    mesh.receiveShadow = true
    mesh.rotation.x = Math.PI*-.5
    scene.add(mesh)


  }




  {
    const cubeSize =4
    const cubeGeo = new THREE.BoxGeometry(
      cubeSize,cubeSize,cubeSize
    )
    const cubeMat = new THREE.MeshPhongMaterial({
      color:'#8AC'
    })
    const mesh = new THREE.Mesh(cubeGeo,cubeMat)
    // 可投射阴影
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh)
  }

  {
    const sphereRadius = 3
    const sphereWidthDivision = 32
    const sphereHeightDivision = 32
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivision,
      sphereHeightDivision
    )
    const sphereMat = new THREE.MeshPhongMaterial({
      color:'#ca8'
    })
    const mesh = new THREE.Mesh(sphereGeo,sphereMat)

    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(-sphereRadius-1,sphereRadius+2,0)
    scene.add(mesh)
  }















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
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  }


  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  }

  class DimensionGUIHelper {
    constructor(obj, minProp, maxProp) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
    }
    get value() {
      return this.obj[this.maxProp] * 2;
    }
    set value(v) {
      this.obj[this.maxProp] = v /  2;
      this.obj[this.minProp] = v / -2;
    }
  }
  {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light)
  }

  // 在场景中添加光源
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    // 创建平行光
    const light = new THREE.PointLight(color, intensity);
    // 开启光的阴影投射
    light.castShadow = true
    //设置光源位置
    light.position.set(0,10,0)
    // light.target.position.set(-4,0,-4)
    scene.add(light)
    // scene.add(light.target)

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(cameraHelper);




    const onChange = () => {
      // light.target.updateMatrixWorld();
      helper.update();
    };
    onChange();
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    makeXYZGUI(gui, light.position, 'position', onChange);
    // makeXYZGUI(gui, light.target.position, 'target', onChange);


    function updateCamera() {
      // light.target.updateMatrixWorld();
      helper.update();
      light.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    }
    updateCamera();

    {
      const folder = gui.addFolder('Shadow Camera');
      folder.open();
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100)
        .name('width')
        .onChange(updateCamera);
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100)
        .name('height')
        .onChange(updateCamera);
      const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1);
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
      folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera);
    }
  }












  {
    const cubeSize = 10;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({
      color: '#CCC',

      side: THREE.BackSide,// 可设置渲染内部还是外部
    });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.receiveShadow = true;
    mesh.position.set(0, 10, 0);
    scene.add(mesh);
  }



  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
