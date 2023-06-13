// import * as THREE from 'three'
// import GUI from 'lil-gui';
// import {OrbitControls} from 'three/addons/controls/OrbitControls';

// const gui = new GUI();

function px(v){
  return `${v|0}px`
}

// 色调 饱和度 亮度
function hsl(h,s,l){
  return `hsl(${h*360|0},${s*100|0}%,${l*100|0}%)`
}

function main(){
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

  function drawData(file){
    const {data,min,max,ncols, nrows,} = file
    const range = max-min
    const ctx = document.querySelector('canvas').getContext('2d')
    // 行是360单位
    ctx.canvas.width = ncols // 360
    // 高是145单位
    ctx.canvas.height = nrows // 145
    ctx.canvas.style.width = px(ncols*2)

    // 绘制底色
    ctx.fillStyle = '#ff0000';
    // 填充底色
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)
  //  绘制每一个点
  //   绘制每一行 每一列的点
    data.forEach((row,latNdx)=>{
      row.forEach((value,lonNdx)=>{
        // 取得对应点 value
        if(value===undefined) {
          return
        }
        const amount = (value-min)/range
        const hue = 1
        const saturation = 1
        const lightness = amount
        // 再次填充底色
        ctx.fillStyle = hsl(hue,saturation,lightness)
        // 绘制1像素的该底色
        ctx.fillRect(lonNdx,latNdx,1,1)
      })
    })
  }



  loadFile('resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014bt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(drawData)






//
//
//   const canvas = document.querySelector('#c')
//   const renderer = new THREE.WebGLRenderer({canvas})
//   function makeCamera (fov=40) {
//     const aspect = 2
//     const zNear = 0.1
//     const zFar = 1000
//     // 创建一个透视相机（视锥体）
//     return new THREE.PerspectiveCamera(fov,aspect,zNear,zFar)
//   }
//   const camera = makeCamera()
// //   相机朝向
//   camera.lookAt(0,0,0)
//
//   // 建立一个场景节点
//   const scene = new THREE.Scene()
//
//   const controls = new OrbitControls(camera,canvas)
//   controls.target.set(0, 5, 0);
//   controls.update();
//   // 在场景中添加光源
//   {
//     // 创建平行光
//     const light = new THREE.DirectionalLight(0x000fff,1)
//     //设置光源位置
//     light.position.set(0,20,0)
//     scene.add(light)
//   }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//   // 这里的time是毫秒级别
//   function render(time){
//     time *= 0.001
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     renderer.setSize(width, height, false);
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
//
//     renderer.render(scene, camera);
//     requestAnimationFrame(render)
//   }
//   requestAnimationFrame(render)












}
main()
