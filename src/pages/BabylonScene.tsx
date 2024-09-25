import React, { useRef, useEffect, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Color4,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  StandardMaterial,
  Texture,
  PBRMaterial,
  Color3,
  PointLight,
} from "@babylonjs/core";
import "@babylonjs/loaders";

interface ModelConfig {
  position: Vector3;
  rotation: Vector3;
}

const modelConfigurations: Record<string, ModelConfig> = {
  "1": { position: new Vector3(-9, 0, -21), rotation: new Vector3(0, 0, 0) },
  "2": {
    position: new Vector3(15, 0, 3),
    rotation: new Vector3(0, Math.PI, 0),
  },
  "3": {
    position: new Vector3(20, 0, 3),
    rotation: new Vector3(0, Math.PI, 0),
  },
  "4": {
    position: new Vector3(25, 0, 3),
    rotation: new Vector3(0, Math.PI, 0),
  },
};

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

      const hemisphericLight = new HemisphericLight(
        "hemisphericLight",
        new Vector3(0, 1, 0),
        newScene
      );
      hemisphericLight.intensity = 0.8;

      // Optional: Adding an additional point light for better texture visibility
      const pointLight = new PointLight(
        "pointLight",
        new Vector3(10, 10, 10),
        newScene
      );
      pointLight.intensity = 0.6;

      createRoom(newScene);

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
  }, [roomWidth, layout, height]);

  useEffect(() => {
    if (scene) {
      if (currentModel) {
        currentModel.dispose();
      }

      const modelFileName = layout;
      const modelConfig = modelConfigurations[layout];

      SceneLoader.ImportMesh(
        "",
        "/models/",
        `${modelFileName}.glb`,
        scene,
        (meshes) => {
          if (meshes.length > 0) {
            const model = meshes[0] as AbstractMesh;

            model.position = modelConfig.position;
            model.rotation = modelConfig.rotation;

            // Apply a uniform texture to all meshes
            const floorTexture = new Texture(
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ2OBtCyO9PKGxZtLENIe09f3kBsxPZezjSA&s",
              scene
            );

            model.getChildMeshes().forEach((mesh) => {
              if (mesh.material) {
                if (mesh.material instanceof StandardMaterial) {
                  const stdMaterial = mesh.material as StandardMaterial;
                  stdMaterial.diffuseTexture = floorTexture.clone();
                  stdMaterial.diffuseTexture.hasAlpha = true;
                  stdMaterial.useAlphaFromDiffuseTexture = true;
                  stdMaterial.specularColor = new Color3(0, 0, 0); // No specular highlights
                  stdMaterial.emissiveColor = new Color3(1, 1, 1); // Slightly illuminated
                } else if (mesh.material instanceof PBRMaterial) {
                  const pbrMaterial = mesh.material as PBRMaterial;
                  pbrMaterial.albedoTexture = floorTexture.clone();
                  pbrMaterial.albedoTexture.hasAlpha = true;
                  pbrMaterial.useAlphaFromAlbedoTexture = true;
                  pbrMaterial.metallic = 0; // Non-metallic
                  pbrMaterial.roughness = 1; // Rough surface
                }
              }
            });

            setCurrentModel(model);
          }
        },
        null,
        (_scene, message) => {
          console.error("Error loading model:", message);
        }
      );
    }
  }, [scene, layout, height, roomWidth]);

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
            stdMaterial.specularColor = new Color3(0, 0, 0); // No specular highlights
            stdMaterial.emissiveColor = new Color3(1, 1, 1); // Slightly illuminated
          } else if (mesh.material instanceof PBRMaterial) {
            const pbrMaterial = mesh.material as PBRMaterial;
            pbrMaterial.albedoTexture = newTexture.clone();
            pbrMaterial.albedoTexture.hasAlpha = true;
            pbrMaterial.useAlphaFromAlbedoTexture = true;
            pbrMaterial.metallic = 0; // Non-metallic
            pbrMaterial.roughness = 1; // Rough surface
          }
        }
      });
    }
  }, [scene, currentModel, colorTexture]);

  const createRoom = (scene: Scene) => {
    const roomDepth = 45;

    // Create floor with a wooden texture
    const floorMat = new StandardMaterial("floorMat", scene);
    floorMat.diffuseTexture = new Texture(
      "https://www.babylonjs-playground.com/textures/wood.jpg",
      scene
    );
    const floor = MeshBuilder.CreateGround(
      "floor",
      { width: roomWidth, height: roomDepth },
      scene
    );
    floor.material = floorMat;
    floor.position.y = -0.1;

    // Create walls
    const wallMatLight = new StandardMaterial("wallMatLight", scene);
    wallMatLight.diffuseColor = new Color3(1.0, 1.0, 1.0);

    const wallParams = [
      {
        name: "backWall",
        width: roomWidth,
        height: height,
        position: new Vector3(0, height / 2, -roomDepth / 2),
        rotation: Math.PI,
      },
      {
        name: "frontWall",
        width: roomWidth,
        height: height,
        position: new Vector3(0, height / 2, roomDepth / 2),
        rotation: 0,
      },
      {
        name: "leftWall",
        width: roomDepth,
        height: height,
        position: new Vector3(-roomWidth / 2, height / 2, 0),
        rotation: -Math.PI / 2,
      },
      {
        name: "rightWall",
        width: roomDepth,
        height: height,
        position: new Vector3(roomWidth / 2, height / 2, 0),
        rotation: Math.PI / 2,
      },
    ];

    wallParams.forEach(({ name, width, height, position, rotation }) => {
      const wall = MeshBuilder.CreatePlane(name, { width, height }, scene);
      wall.material = wallMatLight;
      wall.position = position;
      wall.rotation.y = rotation;
    });
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BabylonScene;
