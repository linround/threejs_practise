import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import GUI from 'lil-gui';
import {RectAreaLightHelper} from "three/addons/helpers/RectAreaLightHelper";


const gui = new GUI();
function main(){
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=45) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 100
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.set(0,10,20)

  const controls = new OrbitControls(camera,canvas)

  controls.target.set(0, 5, 0);
  controls.update();
  // 建立一个场景节点
  const scene = new THREE.Scene()

  const color = 0xFFFFFF;

  const intensity = 1;
  // 添加一个环境光
  const ambientLight = new THREE.AmbientLight('black', 1);
  scene.add(ambientLight)
  // 添加一个矩形区域光
  const width = 12
  const height = 4
  const light = new THREE.RectAreaLight(
    color,intensity,width,height
  )
  light.position.y = 10
  light.rotation.x = THREE.MathUtils.degToRad(-90);

  scene.add(light);

  const helper = new RectAreaLightHelper(light)
  light.add(helper)



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

    // 矩形光照  只对MeshStandardMaterial  和 MeshPhysicalMaterial有效
    const planeGeo = new THREE.PlaneGeometry(planeSize,planeSize)
    const planeMat = new THREE.MeshStandardMaterial({
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
    const cubeMat = new THREE.MeshStandardMaterial({
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
    const sphereMat = new THREE.MeshStandardMaterial(
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
    class DegRadHelper {
      constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
      }
      get value() {
        return THREE.MathUtils.radToDeg(this.obj[this.prop]);
      }
      set value(v) {
        this.obj[this.prop] = THREE.MathUtils.degToRad(v);
      }
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

    function makeXYZGUI(gui,vector3,name,onChangeFn) {
      const folder = gui.addFolder(name)
      folder.add(vector3,'x',-10,10).onChange(onChangeFn)
      folder.add(vector3,'y',0,10).onChange(onChangeFn)
      folder.add(vector3,'z',-10,10).onChange(onChangeFn)
      folder.open()
    }
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01)
    gui.add(light, 'width', 0, 20);
    gui.add(light, 'height', 0, 20);
    gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
    gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
    gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');




    makeXYZGUI(gui, light.position, 'position')
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
