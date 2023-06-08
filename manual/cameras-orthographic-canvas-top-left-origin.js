import * as THREE from 'three'
import GUI from 'lil-gui';

const gui = new GUI();

function main(){

  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  function makeCamera (fov=40) {
    const left = 0
    const right = 300
    const top = 0
    const bottom = 150
    const near = -1
    const far = 1

    // 创建一个透视相机（视锥体）
    return new THREE.OrthographicCamera(
      left,right,top,bottom,near,far
    )
  }
  const camera = makeCamera()
  camera.zoom = 1

  // 建立一个场景节点
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black');
  // 在场景中添加光源
  // {
  //   // 创建平行光
  //   const light = new THREE.DirectionalLight(0x000fff,1)
  //   //设置光源位置
  //   light.position.set(0,20,0)
  //   scene.add(light)
  // }
  const loader = new THREE.TextureLoader();
  const textures = [
    loader.load('./resources/images/flower-1.jpg'),
    loader.load('./resources/images/flower-2.jpg'),
    loader.load('./resources/images/flower-3.jpg'),
    loader.load('./resources/images/flower-4.jpg'),
    loader.load('./resources/images/flower-5.jpg'),
    loader.load('./resources/images/flower-6.jpg'),
  ];
  const planeSize = 256;
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planes = textures.map((texture) => {
    const planePivot = new THREE.Object3D();
    scene.add(planePivot);
    texture.magFilter = THREE.NearestFilter;
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    planePivot.add(mesh);
    // move plane so top left corner is origin
    mesh.position.set(planeSize / 2, planeSize / 2, 0);
    return planePivot;
  });























  function render(time){
    time *= 0.001


    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.right = canvas.clientWidth;
    camera.bottom = canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);


    const distAcross = Math.max(20, canvas.width - planeSize);
    const distDown = Math.max(20, canvas.height - planeSize);
    const xRange = distAcross * 2;
    const yRange = distDown * 2;
    const speed = 180;
    planes.forEach((plane, ndx) => {
      // compute a unique time for each plane
      const t = time * speed + ndx * 300;

      // get a value between 0 and range
      const xt = t % xRange;
      const yt = t % yRange;

      // set our position going forward if 0 to half of range
      // and backward if half of range to range
      const x = xt < distAcross ? xt : xRange - xt;
      const y = yt < distDown   ? yt : yRange - yt;

      plane.position.set(x, y, 0);
    });




    renderer.render(scene, camera);
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
