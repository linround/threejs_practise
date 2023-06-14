import * as THREE from 'three'
import GUI from 'lil-gui';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  function makeCamera (fov=75) {
    const aspect = 2
    const zNear = 0.1
    const zFar = 5
    // 创建一个透视相机（视锥体）
    return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
  }


  const camera = makeCamera()
  // 注意设置相机的位置
  camera.position.z = 2
//   相机朝向
  camera.lookAt(0,0,0)

  // 建立一个场景节点
  const scene = new THREE.Scene()

  const controls = new OrbitControls(camera,canvas)
  // 添加阻尼后
  // 我们需要在render函数中调用 controls.update，以便轨道控制器能够继续给我们一个新的相机设置（平滑滚动影响）
  // 这就意味这我们不能在change事件中调用render
  // 控制器会发送change事件去调用render,render会更新控制器，控制器会继续发送change事件
  // 所以我们只需要渲染新的帧
  controls.enableDamping = true
  controls.update();
  // 在场景中添加光源
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }



  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/images/world.jpg', render);
    // texture.wrapS=THREE.RepeatWrapping
    // texture.wrapT=THREE.RepeatWrapping
    // // 对纹理细节所做的mipmap
    // texture.magFilter = THREE.NearestFilter
    // const repeats = 500/2
    // texture.repeat.set(repeats,repeats)
    // 纹理映射
    // 通常几何信息中包含自己的uv坐标
    const geometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshBasicMaterial({map: texture});
    scene.add(new THREE.Mesh(geometry, material));
  }















  window.THREE = THREE

  function addBoxes(file){
    console.log('***addBox')
    const {min,max,data} = file
    const range = max - min

    // const boxWidth = 1
    // const boxHeight = 1
    // const boxDepth = 1
    // const geometry = new THREE.BoxGeometry(
    //   boxWidth,boxHeight,boxDepth
    // )
    // // 该球体会在z轴平移0.5
    // geometry.applyMatrix4(
    //   new THREE.Matrix4().makeTranslation(0,0,0.5)
    // )














    const lonHelper = new THREE.Object3D()
    scene.add(lonHelper)
    const latHelper = new THREE.Object3D()
    lonHelper.add(latHelper)

    const positionHelper = new THREE.Object3D()
    positionHelper.position.z = 1
    latHelper.add(positionHelper)



    // 优化后的代码
    const originHelper = new THREE.Object3D()
    originHelper.position.z = 0.5
    positionHelper.add(originHelper)
    const geometries = []










    const lonFudge = Math.PI*.5
    const latFudge = Math.PI*-0.135

    const color = new THREE.Color()

    // 纬度 赤道是最长的纬线
    data.forEach((row,latNdx)=>{
      // 经线圈
      row.forEach((value,lonNdx)=>{
        if(value===undefined){
          return
        }
        const amount = (value-min)/range






        // const material = new THREE.MeshBasicMaterial()
        // const hue = THREE.MathUtils.lerp(0.7,0.3,amount)
        // const saturation = 1
        //
        // const lightness = THREE.MathUtils.lerp(0.7,.3,amount)
        //
        // material.color.setHSL(hue,saturation,lightness)
        // const mesh = new THREE.Mesh(geometry,material)
        // 这里为每一个像素点都添加了一个box
        // scene.add(mesh)
        const boxWidth = 1
        const boxHeight = 1
        const boxDepth = 1

        const geometry = new THREE.BoxGeometry(
          boxWidth,boxHeight,boxDepth
        )













        lonHelper.rotation.y = THREE.MathUtils.degToRad(
          lonNdx+file.xllcorner) + lonFudge
        latHelper.rotation.x = THREE.MathUtils.degToRad(
          latNdx+file.yllcorner) + latFudge



        // 计算一个颜色
        const hue = THREE.MathUtils.lerp(0.7,0.3,amount)
        const saturation = 1
        const lightness = THREE.MathUtils.lerp(0.4,1,amount)
        color.setHSL(hue,saturation,lightness)
        const rgb = color.toArray().map(v=>v*255)
        const numVerts = geometry.getAttribute('position').count
        const itemSize = 3
        const colors = new Uint8Array(itemSize*numVerts)
        colors.forEach((v,ndx)=>{
          colors[ndx] = rgb[ndx%3]
        })
        const colorAttrib = new THREE.BufferAttribute(colors,itemSize,true)
        geometry.setAttribute('color',colorAttrib)








        //
        // positionHelper.updateWorldMatrix(true,false)
        // mesh.applyMatrix4(positionHelper.matrixWorld)
        // mesh.scale.set(
        //   0.005,0.005,THREE.MathUtils.lerp(0.01,0.5,amount)
        // )
        positionHelper.scale.set(0.005,0.005,THREE.MathUtils.lerp(0.01,0.5,amount))
        originHelper.updateWorldMatrix(true,false)
        geometry.applyMatrix4(originHelper.matrixWorld)
        geometries.push(geometry)

      })
    })

  //   合并 所有的几何
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geometries,false
    )
    const material = new THREE.MeshBasicMaterial({
      vertexColors:true
    })
    const mesh = new THREE.Mesh(mergedGeometry,material)
    scene.add(mesh)

  }































  // 加载文本文件
  async function loadFile(url){
    const req = await fetch(url)
    return req.text()
  }
  // 解析文本
  // 有几行是键值对
  // 余下的是数据点
  function parseData(text){
    const data = []
    const settings = {data}
    let max
    let min
    text.split('\n').forEach(line=>{
      const parts = line.trim().split(/\s+/)
      if(parts.length === 2){
        // 这是键值对
        settings[parts[0]] = parseFloat(parts[1])
      } else if(parts.length>2){

        // 所有的数据在
        const values = parts.map(v=>{
          const value = parseFloat(v)
          if (value === settings.NODATA_value) {
            return undefined;
          }
          max = Math.max(max===undefined?value:max,value)
          min = Math.min(min===undefined?value:min,value)
          return value
        })
        data.push(values)
      }
    })
    const result = {...settings,min,max,}
    console.log(result)
    return result
  }


  loadFile('./resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(addBoxes)
    .then(render);





  let renderRequested = false

  // 这里的time是毫秒级别
  function render(){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderRequested = false
    controls.update();
    renderer.render(scene, camera);
  }
  render()


  // 发生change事件
  // renderRequested false => renderRequested = true,防止render触发过快;触发render
  // render函数中 在触发控制器update之前 设置renderRequested=false,方便下一次触发change事件，再继续触发render，render
  //  render函数中始终会设置 renderRequested = false
  // 由于阻尼的存在 直到最终不再触发change事件
  function requestRenderIfNotRequested(){
    if(!renderRequested) {
      renderRequested = true
      requestAnimationFrame(render)
    }
  }
  controls.addEventListener('change',requestRenderIfNotRequested)

  window.addEventListener('resize', requestRenderIfNotRequested);

}
main()
