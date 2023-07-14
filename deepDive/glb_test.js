import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";




const canvas = document.getElementById('renderCanvas')
const engine = new Engine(canvas,true)
export const createScene = async function (
)  {

  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "my first camera",
    0,
    Math.PI / 3,
    10,
    new Vector3(0, 0, 0),
    scene
  );
  camera.setTarget(Vector3.Zero());

  camera.attachControl(canvas, true);

  camera.useFramingBehavior = true;

  const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene
  );

  light.intensity = 0.7;

  const importResult = await SceneLoader.ImportMeshAsync(
    "",
    "/public/",
    'HVGirl.glb',
    scene,
    undefined,
    ".glb"
  );

  // just scale it so we can see it better
  importResult.meshes[0].scaling.scaleInPlace(10);

  return scene;
};
async function main(){
  const scene = await createScene()
  engine.runRenderLoop(function () {
    scene.render()
  })
  window.addEventListener('resize',function (){
    engine.resize()
  })
}
main()

