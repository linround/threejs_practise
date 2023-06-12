import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 100
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.z = 5

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const controls = new OrbitControls(camera,canvas)
  controls.update();
  // 在场景中添加光源
  {
    const color = 0xffffff
    const intensity = 1
    // 创建平行光
    const light = new THREE.DirectionalLight(color,intensity)
    //设置光源位置
    light.position.set(-1,2,4)
    scene.add(light)
  }



  const vertices = [
    // front
    { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
    { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
    { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },

    // { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
    // { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
    { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
    // right
    { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
    { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
    { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },

    // { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
    // { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
    { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
    // back
    { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
    { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
    { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },

    // { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
    // { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
    { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
    // left
    { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], },
    { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
    { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },

    // { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
    { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], },
    // top
    { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], },
    { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
    { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },

    // { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
    // { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
    { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], },
    // bottom
    { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], },
    { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
    { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },

    // { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
    { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], },
  ];

  const positions = []
  const normals = []
  const uvs = []

  for (const vertex of vertices){
    positions.push(...vertex.pos)
    normals.push(...vertex.norm)
    uvs.push(...vertex.uv)
  }

  const geometry = new THREE.BufferGeometry()
  const positionNumComponents = 3
  const normalNumComponents = 3
  const uvNumComponents = 2
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents))
  geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents))
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents))

  // 设置引用顶点
  geometry.setIndex([
    0,1,2,2,1,3,
    4,5,6,6,5,7,
    8,9,10,10,9,11,
    12,13,14,14,13,15,
    16,17,18,18,17,19,
    20,21,22,22,21,23
  ])



  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/images/star.png');

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color, map: texture});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x88FF88,  0),
    makeInstance(geometry, 0x8888FF, -4),
    makeInstance(geometry, 0xFF8888,  4),
  ];
























  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();


    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
