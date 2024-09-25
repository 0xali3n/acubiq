// Lighting.tsx
import { HemisphericLight, PointLight, Vector3, Scene } from "@babylonjs/core";

const addLighting = (scene: Scene) => {
  const hemisphericLight = new HemisphericLight(
    "hemisphericLight",
    new Vector3(0, 1, 0),
    scene
  );
  hemisphericLight.intensity = 0.8;

  // Optional: Adding an additional point light for better texture visibility
  const pointLight = new PointLight(
    "pointLight",
    new Vector3(10, 10, 10),
    scene
  );
  pointLight.intensity = 0.6;
};

export default addLighting;
