import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import GUI from 'lil-gui';

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

  // 建立一个场景节点
  const scene = new THREE.Scene()

  // const color = 0xFFFFFF;
  // 定义天空颜色
  const skyColor = 0xB1E1FF
  // 定义草地颜色
  const groundColor = 0xB97A20

  const intensity = 1;
  // 添加一个环境光
  // const light = new THREE.AmbientLight(color, intensity);

  // 添加半球光
  const light = new THREE.HemisphereLight(
    skyColor,groundColor,intensity
  )
  scene.add(light);

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

    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
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
