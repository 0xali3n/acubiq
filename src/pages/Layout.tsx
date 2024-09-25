import React, { useState } from "react";
import BabylonScene from "./BabylonScene";
import { colorOptions } from "./colors"; // Import your colors.ts for color data

const Layout: React.FC = () => {
  const INITIAL_ROOM_WIDTH = 50;
  const INITIAL_LAYOUT = "1";
  const INITIAL_COLOR = "";

  const [roomWidth, setRoomWidth] = useState<number>(INITIAL_ROOM_WIDTH);
  const [layout, setLayout] = useState<string>(INITIAL_LAYOUT);
  const [selectedColor, setSelectedColor] = useState<string>(INITIAL_COLOR);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentColorSet, setCurrentColorSet] = useState<"lam" | "pu">("lam");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Handle room width change
  const handleRoomWidthChange = (width: number) => {
    setRoomWidth(width);
  };

  // Handle layout image click
  const handleLayoutImageClick = (modelNumber: number) => {
    setLayout(`${modelNumber}`);
  };

  // Handle color set selection
  const handleColorSetSelection = (colorSet: "lam" | "pu") => {
    setCurrentColorSet(colorSet);
    setShowModal(true);
  };

  // Function to handle color selection
  const handleColorSelect = (colorSrc: string) => {
    setSelectedColor(colorSrc);
    setShowModal(false);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Get colors based on the selected color set
  const colors = colorOptions[currentColorSet] || [];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-4 bg-gray-100 overflow-hidden">
        <BabylonScene
          roomWidth={roomWidth}
          layout={layout}
          height={100}
          colorTexture={selectedColor}
        />
      </div>
      <div className="w-full md:w-1/3 p-6 bg-white shadow-md rounded-lg flex flex-col space-y-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Customize Room
        </h2>

        {/* Room Width Section */}
        <div className="space-y-2">
          <h3
            className="text-xl font-semibold cursor-pointer bg-gray-200 p-3 rounded-lg text-gray-700"
            onClick={() =>
              setActiveSection(
                activeSection === "roomWidth" ? null : "roomWidth"
              )
            }
          >
            Room Width
          </h3>
          {activeSection === "roomWidth" && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 flex flex-wrap gap-2">
              {[48, 72, 96].map((width) => (
                <button
                  key={width}
                  onClick={() => handleRoomWidthChange(width)}
                  className={`p-2 rounded-lg border ${
                    roomWidth === width
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {width / 12} ft
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout Section */}
        <div className="space-y-2">
          <h3
            className="text-xl font-semibold cursor-pointer bg-gray-200 p-3 rounded-lg text-gray-700"
            onClick={() =>
              setActiveSection(activeSection === "layout" ? null : "layout")
            }
          >
            Layout
          </h3>
          {activeSection === "layout" && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 flex flex-col items-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                <img
                  src="/img/1.png"
                  alt="Layout 1"
                  className={`w-32 h-auto cursor-pointer ${
                    layout === "1" ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleLayoutImageClick(1)}
                  style={{ objectFit: "cover" }}
                />
                <img
                  src="/img/2.png"
                  alt="Layout 2"
                  className={`w-32 h-auto cursor-pointer ${
                    layout === "2" ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleLayoutImageClick(2)}
                  style={{ objectFit: "cover" }}
                />
                <img
                  src="/img/3.png"
                  alt="Layout 3"
                  className={`w-32 h-auto cursor-pointer ${
                    layout === "3" ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleLayoutImageClick(3)}
                  style={{ objectFit: "cover" }}
                />
                <img
                  src="/img/4.png"
                  alt="Layout 4"
                  className={`w-32 h-auto cursor-pointer ${
                    layout === "4" ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleLayoutImageClick(4)}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Color Selection Section */}
        <div className="space-y-2">
          <h3
            className="text-xl font-semibold cursor-pointer bg-gray-200 p-3 rounded-lg text-gray-700"
            onClick={() =>
              setActiveSection(activeSection === "color" ? null : "color")
            }
          >
            Color
          </h3>
          {activeSection === "color" && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 flex flex-col space-y-4">
              <button
                onClick={() => handleColorSetSelection("lam")}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
              >
                Select Laminate Exclusive Color
              </button>
              <button
                onClick={() => handleColorSetSelection("pu")}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Select PU Color
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Color selection modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-4/5 max-w-2xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Select a Color</h2>
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {colors.map((color) => (
                <div
                  key={color.src}
                  className="border p-2 rounded-lg cursor-pointer"
                  onClick={() => handleColorSelect(color.src)}
                >
                  <img
                    src={color.src}
                    alt={color.name}
                    className="w-full h-24 object-cover mb-2"
                  />
                  <p className="text-center">{color.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
