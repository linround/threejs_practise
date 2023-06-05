import * as THREE from 'three'
function main(){
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
//   设置背景色
  renderer.setClearColor(0x666666)
  // 启用阴影渲染
  renderer.shadowMap.enabled = true
function makeCamera (fov=40) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 1000
  // 创建一个透视相机（视锥体）
  return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
}
const camera = makeCamera()
//   放置视锥体位置
camera.position.set(8,4,10).multiplyScalar(3)
//   相机朝向
camera.lookAt(0,0,0)


  // 建立一个场景节点
  const scene = new THREE.Scene()
  // 在场景中添加光源
  {
    // 创建平行光
    const light = new THREE.DirectionalLight(0x000fff,1)
  //设置光源位置
    light.position.set(0,20,0)
    scene.add(light)
  }
  {
    const light = new THREE.DirectionalLight(0xfff000, 1);
    light.position.set(1, 2, 4);
    scene.add(light);
  }


  // 地面  平面几何
  const groundGeometry = new THREE.PlaneGeometry(50,50)
  // 地面材质
  const groundMaterial = new THREE.MeshPhongMaterial({
    color:0xffffff})
  //使用材质和几何生成网格模型
  const groundMesh = new THREE.Mesh(groundGeometry,groundMaterial)
  groundMesh.rotation.x = Math.PI* -0.5
  scene.add(groundMesh)

  // 定义车辆模型
  const carWidth = 4
  const carHeight = 1
  const carLength = 8

  // 创建一个独立的坦克区域空间
  const tank = new THREE.Object3D()
  scene.add(tank)



  // 车体
  const bodyGeometry = new THREE.BoxGeometry(carWidth,carHeight,carLength)
  const bodyMaterial = new THREE.MeshPhongMaterial({color:0x6688AA})
  const bodyMesh = new THREE.Mesh(bodyGeometry,bodyMaterial)
  // 这里设置的是顶部的高度
  bodyMesh.position.y=1.4
  tank.add(bodyMesh)

  /**
   *
   * todo 轮子 使用柱体
   */
  const wheelRadius = 1
  // 厚度
  const wheelThickness = 0.5
  // 圆的边数
  const wheelSegments = 6

  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelThickness,
    wheelSegments
  )
  const wheelMaterial = new THREE.MeshPhongMaterial({color:0x888888})
  const wheelPositions = [
    [-carWidth/2 - wheelThickness/2,-carHeight/2,carLength/3], //右前轮
    [carWidth/2 + wheelThickness/2,-carHeight/2,carLength/3], //左前轮
    [-carWidth/2 - wheelThickness/2,-carHeight/2,0], //右中轮
    [carWidth/2 + wheelThickness/2,-carHeight/2,0], //左中轮
    [-carWidth/2 - wheelThickness/2,-carHeight/2,-carLength/3], //右后轮
    [carWidth/2 + wheelThickness/2,-carHeight/2,-carLength/3], //左后轮
  ]
  const wheelMeshes = wheelPositions.map((position)=>{
    const mesh = new THREE.Mesh(wheelGeometry,wheelMaterial)
    mesh.position.set(...position)
    mesh.rotation.z = Math.PI*0.5
    bodyMesh.add(mesh)
    return mesh
  })


  /**
   * todo 坦克顶部
   * 以极坐标系 构建的球体
   */
  const domeRadius = 2
  // 与球体的细腻程度相关
  const domeWidthSubDivisions = 12
  const domeHeightSubDivisions = 12
  // 方位角(赤道面（由 x 轴与 y 轴确定的平面）上起始于 x 轴，沿逆时针方向量出的角度，通常用 φ 表示。)
  const domePhiStart = 0
  const domePhiEnd = Math.PI*2
  // 极角（球心与点的连线与正z轴的夹角）
  const domeThetaStart = 0
  // 渲染一个半球
  const domeThetaEnd = Math.PI*0.5
  const demoGeometry = new THREE.SphereGeometry(
    domeRadius,domeWidthSubDivisions,domeHeightSubDivisions,
    domePhiStart,domePhiEnd,
    domeThetaStart,domeThetaEnd
  )
  const domeMesh = new THREE.Mesh(demoGeometry,bodyMaterial)
  domeMesh.position.y = .5
  bodyMesh.add(domeMesh)




  // 定义炮台
  const turretWidth = .5
  const turretHeight = .5
  const turretLength = carLength
  const turretGeometry = new THREE.BoxGeometry(
    turretWidth,turretHeight,turretLength
  )
  const turretMesh = new THREE.Mesh(turretGeometry,bodyMaterial)
  // 炮台的枢纽
  const turretPivot = new THREE.Object3D()
  turretPivot.position.y=1
  turretPivot.add(turretMesh)
  turretMesh.position.z =  turretLength*0.5
  bodyMesh.add(turretPivot)
  turretPivot.lookAt(2,5,6)



  const targetGeometry = new THREE.SphereGeometry(
    1,30,30)
  const targetMaterial = new THREE.MeshPhongMaterial({
    color:0x543a3a,flatShading:true
  })
  const targetMesh = new THREE.Mesh(targetGeometry,targetMaterial)

  // 给该目标定义一个轨道
  const targetOrbit = new THREE.Object3D()
  // 目标高度
  const targetElevation = new THREE.Object3D()
  scene.add(targetOrbit)
  targetOrbit.add(targetElevation)
  targetElevation.position.z = 2*carLength
  targetElevation.position.y = 8
  targetElevation.add(targetMesh)







  const curve = new THREE.SplineCurve([
    new THREE.Vector2(-10,0),
    new THREE.Vector2(-5,5),
    new THREE.Vector2(0,0),
    new THREE.Vector2(5,-5),
    new THREE.Vector2(10,0),
    new THREE.Vector2(5,10),
    new THREE.Vector2(-5,10),
    new THREE.Vector2(-10,-10),
    new THREE.Vector2(-15,-8),
    new THREE.Vector2(-10,0),
  ])
  const points = curve.getPoints(150)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({color:0xfff000})
  const splineObject = new THREE.Line(geometry,material)
  splineObject.rotation.x = Math.PI*.5
  splineObject.position.y=0.05
  scene.add(splineObject)









  const cameras = [
    { cam: camera, desc: 'detached camera', },
  ];


  const tankPosition = new THREE.Vector2()
  const tankTarget = new THREE.Vector2()
  const targetPosition = new THREE.Vector3()
  function render(time) {
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    cameras.forEach((cameraInfo) => {
      const camera = cameraInfo.cam;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });


    // 移动目标点
    targetOrbit.rotation.y = time*0.5



    const tankTime = time*0.05
    // 获取曲线上的某一点坐标
    curve.getPointAt((tankTime%1),tankPosition)
    // 获取下一点的坐标，即可以作为tank下一点的坐标
    curve.getPointAt((tankTime+0.01)%1,tankTarget)

    // 设置tank的新的位置
    tank.position.set(tankPosition.x,0,tankPosition.y)
    // 设置tank的转向
    tank.lookAt(tankTarget.x,0,tankTarget.y)
    wheelMeshes.forEach((obj) => {
      obj.rotation.x = time * 3;
    });


    targetMesh.getWorldPosition(targetPosition)
    turretPivot.lookAt(targetPosition)


    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
main()
