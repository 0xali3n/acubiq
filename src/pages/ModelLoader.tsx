import {
  SceneLoader,
  AbstractMesh,
  StandardMaterial,
  PBRMaterial,
  Texture,
  Color3,
  Vector3,
} from "@babylonjs/core";

// Model configurations with positions and rotations
const modelConfigurations: Record<
  string,
  { position: Vector3; rotation: Vector3 }
> = {
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

const loadModel = (
  scene: any,
  layout: string,
  setCurrentModel: (model: AbstractMesh | null) => void
) => {
  const modelConfig = modelConfigurations[layout];

  SceneLoader.ImportMesh(
    "",
    "/models/",
    `${layout}.glb`,
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
              stdMaterial.specularColor = new Color3(0, 0, 0); // Use Color3 for specularColor
              stdMaterial.emissiveColor = new Color3(1, 1, 1);
            } else if (mesh.material instanceof PBRMaterial) {
              const pbrMaterial = mesh.material as PBRMaterial;
              pbrMaterial.albedoTexture = floorTexture.clone();
              pbrMaterial.albedoTexture.hasAlpha = true;
              pbrMaterial.useAlphaFromAlbedoTexture = true;
              pbrMaterial.metallic = 0;
              pbrMaterial.roughness = 1;
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
};

export default loadModel;
