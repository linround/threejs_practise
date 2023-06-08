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



  // 正交相加的前后  左右 之间的比例问题会影响到图像的比例问题
  const left = 0
  // 这里的值的单位 和平面单位
  const right = 300
  // 越靠近中心点的就是顶部
  const top = 0
  const bottom = 300
  const near = -1
  const far = 1
  // camera渲染了一个平面
  const camera = new THREE.OrthographicCamera(
    left,right,top,bottom,near,far
  )

  camera.zoom = 1
  // camera.position.set(0,10,20)
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







  const planes = []

  {
    const planeSize = 20;
    const planeGeo = new THREE.PlaneGeometry(planeSize,planeSize)
    const loader = new THREE.TextureLoader();
    const textures = [
      loader.load('./resources/images/flower-1.jpg'),
      loader.load('./resources/images/flower-2.jpg'),
      loader.load('./resources/images/flower-3.jpg'),
      loader.load('./resources/images/flower-4.jpg'),
      loader.load('./resources/images/flower-5.jpg'),
      loader.load('./resources/images/flower-6.jpg'),
    ];
    textures.forEach(texture =>{
      const planePivot = new THREE.Object3D();
      scene.add(planePivot);
      planes.push(planePivot)
      texture.magFilter = THREE.NearestFilter;
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.position.set(planeSize / 2, planeSize / 2, 0);
      planePivot.add(mesh);
    })

  }


  // 地平面
  const planeSize = 40
  {
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

    const minMaxGUIHelper = new MinMaxGUIHelper(
      camera, 'near', 'far', 0.1
    );
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1)
      .name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1)
      .name('far').onChange(updateCamera);
    gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();

  }














  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);


    const distAcross =  canvas.width - planeSize
    const distDown = canvas.height - planeSize


    const speed = 45
    planes.forEach((plane,ndx)=>{
      const t = time * speed +ndx*660
      const odx = Math.floor(t/right)%2===0
      const ody = Math.floor(t/bottom)%2===0
      console.log(odx,ody)

      const tx = t%right
      const ty = t%bottom
      plane.position.x = odx? tx : (right-tx)
      plane.position.y = ody? ty :(bottom-ty)

    })
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
