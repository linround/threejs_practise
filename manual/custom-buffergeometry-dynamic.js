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
  camera.position.y = 10
  camera.position.z = 30
  camera.position.x = 10
  // 相机朝向
  camera.lookAt(0,0,0)

  // 建立一个场景节点
  const scene = new THREE.Scene()

  function addLight(...pos){
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(
      color,intensity
    )
    light.position.set(...pos)
    scene.add(light)
  }
  addLight(5,0,0)
  addLight(0,5,0)
  addLight(0,0,5)
  addLight(0,0,5)
  addLight(5,5,5)
  addLight(-5,-5,-5)

  function makeSpherePosition(segmentsAround,segmentsDown){
    // 顶点数
    const numVertices = segmentsAround*segmentsDown*4
    // 顶点是三维的
    const numComponents = 3
    // 总的坐标数是 顶点数乘以维度
    const positions = new Float32Array(numVertices * numComponents)
    // 坐标索引
    const indices = []
    // 经度   南北是经线 -90~90
    const longHelper = new THREE.Object3D()
  //   纬度 赤道是最长纬线 -180~180
    const latHelper = new THREE.Object3D()
    // 坐标点
    const pointerHelper = new THREE.Object3D()
    longHelper.add(latHelper)
    latHelper.add(pointerHelper)
    pointerHelper.position.z = 1
    const temp = new THREE.Vector3()
    function getPoint(lat,long){
      // 东西 纬线
      latHelper.rotation.x = lat
      // 南北 经线
      longHelper.rotation.y = long
      longHelper.updateMatrixWorld(true)
      return pointerHelper.getWorldPosition(temp).toArray()
    }
    let posNdx = 0
    let ndx = 0
    // 先使用维度 东西向
    for(let down=0;down<segmentsDown;down++){
      // 使用v1是为了 画一条线，从而确认边
      const v0 = down/segmentsDown // 0-1
      const v1 = (down+1)/segmentsDown
      const lat0 = (v0 -0.5)*Math.PI // -90~90
      const lat1 = (v1-0.5)*Math.PI
      // 在计算经度 南北向
      for(let across=0;across<segmentsAround;across++) {
        const u0 = across/segmentsAround //0-1
        const u1 = (across+1)/segmentsAround
        // 经度
        const long0 = u0* Math.PI * 2 // 0-2PI
        const long1 = u1*Math.PI*2
        // 设置某个小的四边形
        positions.set(getPoint(lat0,long0),posNdx)
        posNdx+=numComponents
        positions.set(getPoint(lat1,long0),posNdx)
        posNdx+=numComponents
        positions.set(getPoint(lat0,long1),posNdx)
        posNdx+=numComponents
        positions.set(getPoint(lat1,long1),posNdx)
        posNdx+=numComponents

        indices.push(
          ndx,ndx+1,ndx+2,// 第一个三角形
          ndx+2,ndx+1,ndx+3 //第二个三角形
        )
        // 由于四边形有四个顶点
        ndx+=4
      }
    }
    return {positions, indices}
  }
  // 制作球形
  const segmentsAround = 30
  const segmentsDown = 20
  const {
    positions,indices
  } = makeSpherePosition(segmentsAround,segmentsDown)

  // 球形坐标的点的法向量 就是球形坐标点本身
  // 因为球心与坐标点的连线垂直于球的表面
  const normals = positions.slice()

  const geometry = new THREE.BufferGeometry()
  const positionNumComponents = 3
  const normalNumComponents = 3
  const positionAttribute = new THREE.BufferAttribute(
    positions,positionNumComponents
  )
  const normalAttribute = new THREE.BufferAttribute(
    normals,normalNumComponents
  )

  geometry.setAttribute(
    'position',
    positionAttribute
  )
  geometry.setAttribute(
    'normal',
    normalAttribute
  )
  geometry.setIndex(indices)


  function makeInstance(geometry,color,x){
    const material = new THREE.MeshPhongMaterial({
      color,
      side: THREE.DoubleSide,
      shininess:1000,// 光滑程度。与反光有关
    })
    const cube = new THREE.Mesh(geometry,material)
    scene.add(cube)
    cube.position.x = x
    return cube
  }

  const cubes = [
    makeInstance(geometry,0xff0000,0)
  ]








  const controls = new OrbitControls(camera,canvas)
  // controls.target.set(0, 5, 0);
  controls.update();































  const cache = positions.slice()
  function updatePositions(time){
    const temp = new THREE.Vector3()
    for(let i=0;i<positions.length;i+=3){
      // 这是第几个四边形
      const quad = (i/12 | 0)
      // 这个四边形属于哪一个环 0~(segmentsAround-1)
      const ringId = quad/segmentsAround|0
      // 这是环中的第几个四边形
      const ringQuadId = quad%segmentsAround
      // 依次偏移量
      const ringU = ringQuadId/segmentsAround

      const angle = ringU*Math.PI*2
      //
      temp.fromArray(cache,i)
      temp.multiplyScalar(THREE.MathUtils.lerp(0,1,(angle+ringId)*1+0.2))
      temp.toArray(positions,i)

    }
  }

  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    updatePositions(time)


    positionAttribute.needsUpdate = true;
    cubes.forEach((cube,ndx)=>{
      const speed = -0.2+ndx*0.1
      const rot = time*speed
      cube.rotation.y = rot
    })



    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
