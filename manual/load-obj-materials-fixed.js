import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {OBJLoader} from "three/addons/loaders/OBJLoader";
import {MTLLoader} from "three/addons/loaders/MTLLoader";

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
  scene.background = new THREE.Color('black')
  {
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize/2
    texture.repeat.set(repeats,repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize,planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map:texture,
      side:THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(planeGeo,planeMat)
    mesh.rotation.x = Math.PI*-.5
    scene.add(mesh)
  }

  {
    const skyColor = 0xb1e1ff
    const groundColor = 0xb97a20
    const intensity = 0.6
    // 半球光  从天空色到草地的过渡
    const light = new THREE.HemisphereLight(
      skyColor,groundColor,intensity
    )
    scene.add(light)
  }


  // 在场景中添加光源
  {
    const color = 0xffffff
    const intensity = 0.8
    // 创建平行光
    const light = new THREE.DirectionalLight(color,intensity)
    //设置光源位置
    light.position.set(0,10,0)
    light.target.position.set(-5,0,0)
    scene.add(light)
    scene.add(light.target)
  }



  {
    const objLoader = new OBJLoader()
    const mtlLoader = new MTLLoader()
    mtlLoader.load('./resources/model/blend/windmill/windmill_001.mtl',mtl=>{
      mtl.preload()
      mtl.materials.Material.side = THREE.DoubleSide;
      objLoader.setMaterials(mtl)
      objLoader.load('./resources/model/blend/windmill/windmill_001.obj',(root)=>{
        scene.add(root)
      })

    })

  }




























  // 这里的time是毫秒级别
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
