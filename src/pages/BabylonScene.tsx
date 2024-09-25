import React, { useRef, useEffect, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Color4,
  AbstractMesh,
  Texture,
  Color3,
  PBRMaterial,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import createRoom from "./Room";
import addLighting from "./Lighting";
import loadModel from "./ModelLoader";

interface BabylonSceneProps {
  roomWidth: number;
  layout: string;
  height: number;
  colorTexture: string;
}

const BabylonScene: React.FC<BabylonSceneProps> = ({
  roomWidth,
  layout,
  height,
  colorTexture,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [currentModel, setCurrentModel] = useState<AbstractMesh | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const engine = new Engine(canvas, true);
      const newScene = new Scene(engine);

      newScene.clearColor = new Color4(0.9, 0.9, 0.9, 1.0);

      // Set up camera
      const camera = new ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2.5,
        Math.max(roomWidth, height) * 1.5,
        new Vector3(0, height / 2, 0),
        newScene
      );
      camera.attachControl(canvas, true);
      camera.lowerAlphaLimit = -Math.PI;
      camera.upperAlphaLimit = Math.PI;
      camera.lowerBetaLimit = Math.PI / 4;
      camera.upperBetaLimit = Math.PI / 2;
      camera.lowerRadiusLimit = Math.max(roomWidth, height) / 2;
      camera.upperRadiusLimit = Math.max(roomWidth, height) * 3;

      // Add lighting
      addLighting(newScene);

      // Create room
      createRoom(newScene, roomWidth, height);

      engine.runRenderLoop(() => {
        newScene.render();
      });

      const handleResize = () => {
        engine.resize();
      };

      window.addEventListener("resize", handleResize);

      setScene(newScene);

      return () => {
        window.removeEventListener("resize", handleResize);
        engine.dispose();
        newScene.dispose();
      };
    }
  }, [roomWidth, height]);

  useEffect(() => {
    if (scene) {
      if (currentModel) {
        currentModel.dispose();
      }

      loadModel(scene, layout, setCurrentModel);
    }
  }, [scene, layout]);

  useEffect(() => {
    if (scene && currentModel && colorTexture) {
      const newTexture = new Texture(colorTexture, scene);

      currentModel.getChildMeshes().forEach((mesh) => {
        if (mesh.material) {
          if (mesh.material instanceof StandardMaterial) {
            const stdMaterial = mesh.material as StandardMaterial;
            stdMaterial.diffuseTexture = newTexture.clone();
            stdMaterial.diffuseTexture.hasAlpha = true;
            stdMaterial.useAlphaFromDiffuseTexture = true;
            stdMaterial.specularColor = new Color3(0, 0, 0);
            stdMaterial.emissiveColor = new Color3(1, 1, 1);
          } else if (mesh.material instanceof PBRMaterial) {
            const pbrMaterial = mesh.material as PBRMaterial;
            pbrMaterial.albedoTexture = newTexture.clone();
            pbrMaterial.albedoTexture.hasAlpha = true;
            pbrMaterial.useAlphaFromAlbedoTexture = true;
            pbrMaterial.metallic = 0;
            pbrMaterial.roughness = 1;
          }
        }
      });
    }
  }, [scene, currentModel, colorTexture]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BabylonScene;
