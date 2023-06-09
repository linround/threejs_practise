import * as THREE from 'three'
import GUI from 'lil-gui';

import {OrbitControls} from 'three/addons/controls/OrbitControls';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=40) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 100
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }
  const camera = makeCamera()
  camera.position.set(0,25,40)
//   相机朝向
  camera.lookAt(0,0,0)

  // 建立一个场景节点
  const scene = new THREE.Scene()
  new OrbitControls(camera,canvas)
  scene.background = new THREE.Color(0XFFFFFF)


  const loader = new THREE.TextureLoader()
  {
    const planeSize = 40
    const texture = loader.load('./resources/images/checker.png')

    const repeats = planeSize/2
    texture.repeat.set(repeats,repeats)
    // 某个方向的重复规则（例如镜像）
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // 纹理覆盖多个像素，对纹理的采样规则
    texture.magFilter = THREE.NearestFilter
    // MeshPhongMaterial材质是，没有环境光的情况下会呈现黑色。
    // const light = new THREE.AmbientLight(0xffffff,1)
    // scene.add(light)

    const planeGeo = new THREE.PlaneGeometry(
      planeSize,planeSize
    )
    const planeMat = new THREE.MeshBasicMaterial({
      map:texture,
      side:THREE.DoubleSide
    })
    // planeMat.color.setRGB(1.5,1.5,1.5)

    const mesh = new THREE.Mesh(planeGeo,planeMat)
    mesh.rotation.x = Math.PI*-0.5
    scene.add(mesh)
  }

  const shadowTexture = loader.load('./resources/images/roundshadow.png')

  const sphereShadowBases = []

  const distanceY = 5
  {
    const sphereRadius = 1
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 32
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,sphereWidthDivisions,sphereHeightDivisions
    )

    {
      const sphereStaticMat = new THREE.MeshBasicMaterial({
        color:'red'
      })
      const meshStatic = new THREE.Mesh(
        sphereGeo,sphereStaticMat
      )

      meshStatic.position.y = distanceY
      scene.add(meshStatic)
    }




    // 阴影
    const planeSize = 1
    const shadowGeo = new THREE.PlaneGeometry(
      planeSize,planeSize
    )

    // 添加15个球体
    const numSpheres = 15
    for (let i=0;i<numSpheres;i++){
      const base = new THREE.Object3D()
      scene.add(base)



      const shadowMat = new THREE.MeshBasicMaterial({
        map:shadowTexture,
        transparent:true,
        depthWrite:false
      })
      const shadowMesh = new THREE.Mesh(
        shadowGeo,shadowMat
      )
      shadowMesh.position.y = 0.01 // 0.001 精度问题，造成阴影变化
      shadowMesh.rotation.x = Math.PI*-.5
      const shadowSize = sphereRadius*4
      shadowMesh.scale.set(shadowSize,shadowSize,shadowSize)
      base.add(shadowMesh)








      const u = i/numSpheres
      const sphereMat = new THREE.MeshPhongMaterial()

      sphereMat.color.setHSL(u,1,.75)
      const sphereMesh = new THREE.Mesh(
        sphereGeo,sphereMat
      )
      sphereMesh.position.set(0,sphereRadius + distanceY,0)
      base.add(sphereMesh)




      sphereShadowBases.push({
        base,
        sphereMesh,
        shadowMesh,
        y:sphereMesh.position.y,
      })

    }
  }
  {
    // 代替环境光
    const skyColor = 0xb1e1ff
    const groundColor = 0xb97a20
    const intensity = 0.25
    const light = new THREE.HemisphereLight(
      skyColor,groundColor,intensity
    )
    scene.add(light)
  }
  {
  //   直线光照
    const color = 0xffffff
    const intensity = 0.75
    const light = new THREE.DirectionalLight(
      color,intensity
    )
    light.position.set(0,10,5)
    light.target.position.set(-5,0,0)
    scene.add(light)
    scene.add(light.target)
  }



















  const vectors = [
    new THREE.Vector3(0,0,0)
  ]
  {
    const curve = new THREE.SplineCurve(vectors)
    const points = curve.getPoints(150)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 'red'
    })
    const splineObject = new THREE.Line(geometry, material)
    scene.add(splineObject)
  }




  function render(time){
    time *= 0.001
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();



    {
      sphereShadowBases.forEach((sphereShadowBase,ndx)=>{
        const {base,y,sphereMesh,shadowMesh} = sphereShadowBase
        const u = ndx/sphereShadowBases.length

        const speed = time*.2
        const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
        const radius = Math.sin(speed - ndx) * 10;
        base.position.set(Math.cos(angle)*radius,0,Math.sin(angle)*radius)

        const yOff = Math.abs(Math.sin(time*2+ndx))
        sphereMesh.position.y = y + THREE.MathUtils.lerp(-distanceY,0,yOff)


        shadowMesh.material.opacity = THREE.MathUtils.lerp(1,.0,yOff)
      })
    }









    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
