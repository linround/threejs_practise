import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls";


class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster()
    this.pickedObject = null
    this.pickedObjectSaveColor = 0
  }
  pick(normalizedPosition,scene,camera,time){
    if(this.pickedObject){
      // 设置材质的发光颜色
      this.pickedObject.material.emissive.setHex(this.pickedObjectSaveColor)
      this.pickedObject = undefined
    }
    // 从相机位置投影
    this.raycaster.setFromCamera(normalizedPosition,camera)
    // 找到与这个光光线相交的对象
    const intersectedObjects = this.raycaster.intersectObjects(scene.children)
    if(intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object
      // 保存之前的颜色
      this.pickedObjectSaveColor = this.pickedObject.material.emissive.getHex()
      // 设置新的颜色
      this.pickedObject.material.emissive.setHex(
        (time*8)%2>1?0x00ff00:0xffffff
      )
    }
  }
}








export const state = {
  width: 300,   // canvas default
  height: 150,  // canvas default
};
export const pickPosition = {
  x:0,
  y:0
}

export function init(data) {
  const {canvas,inputElement} = data;
  const renderer = new THREE.WebGLRenderer({canvas});

  // state.width = canvas.width;
  // state.height = canvas.height;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;

  const controls = new OrbitControls(camera,inputElement)
  controls.target.set(0,0,0)
  controls.update()

  const scene = new THREE.Scene();

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
    const material = new THREE.MeshPhongMaterial({
      color,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];
  const pickPosition = {x:-2,y:-2}
  const pickHelper = new PickHelper()
  clearPickPosition()



  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = inputElement.width;
    const height = inputElement.height;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = inputElement.clientWidth / inputElement.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    pickHelper.pick(pickPosition,scene,camera,time)
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);



  function getCanvasRelativePosition(event){
    const rect = inputElement.getBoundingClientRect()
    return {
      x:event.clientX - rect.left,
      y:event.clientY-rect.top
    }
  }

  function setPickPosition(event){
    const pos = getCanvasRelativePosition(event)
    pickPosition.x = (pos.x / inputElement.clientWidth ) *  2 - 1;
    pickPosition.y = (pos.y / inputElement.clientHeight) * -2 + 1;
  }
  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
  inputElement.addEventListener('mousemove', setPickPosition);
  inputElement.addEventListener('mouseout', clearPickPosition);
  inputElement.addEventListener('mouseleave', clearPickPosition);

}

function size(data) {
  state.width = data.width;
  state.height = data.height;
}

const handlers = {
  init,
  size,
};

self.onmessage = function(e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
