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
  Color3,
  PointLight,
} from "@babylonjs/core";
import "@babylonjs/loaders";

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
  const [modelFilename, setModelFilename] = useState(layout);
  const [isOpen, setIsOpen] = useState(true); // State to track if the door is open

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
      camera.upperRadiusLimit = Math.max(roomWidth, height) * 2;
      camera.wheelDeltaPercentage = 0.05;

      const hemisphericLight = new HemisphericLight(
        "hemisphericLight",
        new Vector3(0, 1, 0),
        newScene
      );
      hemisphericLight.intensity = 0.8;

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
  }, [roomWidth, height]);

  useEffect(() => {
    if (scene) {
      if (currentModel) {
        currentModel.dispose();
      }

      SceneLoader.ImportMesh(
        "",
        "/models/",
        `${modelFilename}.glb`,
        scene,
        (meshes) => {
          if (meshes.length > 0) {
            const model = meshes[0] as AbstractMesh;
            model.position = new Vector3(900, 0, -300);
            setCurrentModel(model);
            console.log(modelFilename);
          }
        },
        null,
        (_scene, message) => {
          console.error("Error loading model:", message);
        }
      );
    }
  }, [scene, modelFilename]);

  const createRoom = (scene: Scene) => {
    const roomDepth = 2000;

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

  const handleToggleDoor = () => {
    if (isOpen) {
      // If currently open, close the door
      const newFilename = (parseInt(modelFilename) + 10000).toString();
      setModelFilename(newFilename);
      console.log(newFilename);
    } else {
      // If currently closed, open the door
      setModelFilename(layout);
      console.log(layout);
    }

    setIsOpen(!isOpen); // Toggle the state
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 flex">
        <button
          className="px-3 py-1 text-white font-bold rounded-lg bg-green-500 hover:bg-green-600 shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
          onClick={handleToggleDoor}
        >
          {isOpen ? "Close Door" : "Open Door"}
        </button>
      </div>
    </div>
  );
};

export default BabylonScene;
