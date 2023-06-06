import * as THREE from 'three'
import GUI from 'lil-gui';

const gui = new GUI();


function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 5
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
//   放置视锥体位置
  camera.position.z=2

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1

  const geometry = new THREE.BoxGeometry(
    boxWidth,boxHeight,boxDepth
  )

  const cubes = []
  // 纹理解析工具
  const loader = new THREE.TextureLoader()

  // 等待纹理下载完成后再形成材质
  // loader.load('./resources/images/wall.jpg',texture=>{
  //
  // //   利用纹理创建材质
  //   const material = new THREE.MeshBasicMaterial({
  //     map:texture
  //   })
  //
  //
  //   const cube = new THREE.Mesh(geometry,material)
  //   scene.add(cube)
  //   cubes.push(cube)
  // })

  // 创建纹理 利用图片
  // 这里不需要等待纹理加载完成，而是立刻开始渲染

  const texture = loader.load('./resources/images/sun-set.jpg');
  const material = new THREE.MeshBasicMaterial({
    map:texture,
  })

  const cube = new THREE.Mesh(geometry,material)
  scene.add(cube)
  cubes.push(cube)








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

  class StringToNumberHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return this.obj[this.prop];
    }
    set value(v) {
      this.obj[this.prop] = parseFloat(v);
    }
  }

  const wrapModes = {
    'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
    'RepeatWrapping': THREE.RepeatWrapping,
    'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
  };



  function updateTexture() {
    texture.needsUpdate = true;
  }



  const gui = new GUI();
  gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
    .name('texture.wrapS')
    .onChange(updateTexture);
  gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
    .name('texture.wrapT')
    .onChange(updateTexture);
  // text.repeat.x属性 属于0-5 每一步增加0.01 文字标签是 texture.repeat.x
  gui.add(texture.repeat, 'x', 0, 5, .01).name('texture.repeat.x');
  gui.add(texture.repeat, 'y', 0, 5, .01).name('texture.repeat.y');
  gui.add(texture.offset, 'x', -2, 2, .01).name('texture.offset.x');
  gui.add(texture.offset, 'y', -2, 2, .01).name('texture.offset.y');
  gui.add(texture.center, 'x', -.5, 1.5, .01).name('texture.center.x');
  gui.add(texture.center, 'y', -.5, 1.5, .01).name('texture.center.y');
  gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
    .name('texture.rotation');















  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    cubes.forEach((cub)=>{
      const speed = 0.2
      const rot = time *speed
      cub.rotation.x = rot
      cub.rotation.y = rot
    })


    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
