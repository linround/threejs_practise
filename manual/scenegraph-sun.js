import * as THREE from 'three'
import GUI from 'lil-gui';

const gui = new GUI();

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});


const scene = new THREE.Scene();


/**
 * 视锥体
 */
const fov = 40;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
// z轴位置
camera.up.set(0, 0, 1);
// y轴是高度。xz组成画布平面
camera.lookAt(0, 0, 0);

renderer.render( scene, camera );


{
  /***
   * 点光源
   */
  // 光颜色
  const color = 0xFFFFFF;
  // 光的强度
  const intensity = 10;
  // 点光源
  const light = new THREE.PointLight(color, intensity);
  // 将点光源添加到场景中
  scene.add(light);
}
/**
 * 太阳系中
 * 太阳地球轨道
 * 地球月亮轨道
 */
const objects = [];

const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
// 球体
const sphereGeometry = new THREE.SphereGeometry(
  radius, widthSegments, heightSegments);





const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);





// 创建一个材质
const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});

// 太阳
// 使用 材质+球体几何 创建一个新的网格
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
// scene.add(sunMesh);
solarSystem.add(sunMesh);
objects.push(sunMesh);









// 添加地球轨道
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
// 地球轨道也属于太阳系空间
solarSystem.add(earthOrbit);
objects.push(earthOrbit);











// 地球

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
// earthMesh.position.x = 10;
// earthMesh.position.z = 10;
// scene.add(earthMesh);
/***
 * 可以将 sunMesh 看成一个独立的场景
 * 将 earthMesh 添加到了sunMesh这个场景中
 */
// sunMesh.add(earthMesh);


// solarSystem.add(earthMesh);
earthOrbit.add(earthMesh)
objects.push(earthMesh);



const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);





















objects.forEach((node) => {
  // const axes = new THREE.AxesHelper();
  // axes.material.depthTest = false;
  // axes.renderOrder = 1;
  // node.add(axes);
});
class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;  // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}

makeAxisGrid(solarSystem, 'solarSystem', 25);
makeAxisGrid(sunMesh, 'sunMesh');
makeAxisGrid(earthOrbit, 'earthOrbit');
makeAxisGrid(earthMesh, 'earthMesh');
makeAxisGrid(moonOrbit, 'moonOrbit');
makeAxisGrid(moonMesh, 'moonMesh');


function render(time) {
  time *= 0.001;
  // 设置宽高 处理锯齿问题
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);

  // 这只纵横比；处理变形问题
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();


  objects.forEach((obj) => {
    obj.rotation.y = time;
  });
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
