import React, { useState } from "react";
import BabylonScene from "./BabylonScene";
import { colorOptions } from "./colors";
import Left from "./Cupboard/Left"; // Import Left component
import Middle from "./Cupboard/Middle"; // Import Middle component
import Right from "./Cupboard/Right"; // Import Right component

const Layout: React.FC = () => {
  const INITIAL_ROOM_WIDTH = 2400;
  const INITIAL_LAYOUT = "11650";
  const INITIAL_COLOR = "";

  const [roomWidth, setRoomWidth] = useState<number>(INITIAL_ROOM_WIDTH);
  const [layout, setLayout] = useState<string>(INITIAL_LAYOUT);
  const [selectedColor, setSelectedColor] = useState<string>(INITIAL_COLOR);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentColorSet, setCurrentColorSet] = useState<"lam" | "pu">("lam");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [layoutPosition, setLayoutPosition] = useState<string | null>("left");

  const handleRoomWidthChange = (width: number) => {
    setRoomWidth(width);
  };

  const handleLayoutImageClick = (modelNumber: number) => {
    setLayout(`${modelNumber}`);
  };

  const handleColorSetSelection = (colorSet: "lam" | "pu") => {
    setCurrentColorSet(colorSet);
    setShowModal(true);
  };

  const handleColorSelect = (colorSrc: string) => {
    setSelectedColor(colorSrc);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const colors = colorOptions[currentColorSet] || [];

  const Menu: React.FC = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Customize Room</h2>
      <div className="flex flex-col space-y-2">
        <h3
          className="text-xl font-semibold cursor-pointer bg-gray-200 p-4 rounded-lg text-gray-700 hover:bg-gray-300 transition"
          onClick={() => setActiveSection("roomWidth")}
        >
          Room Width
        </h3>
        <h3
          className="text-xl font-semibold cursor-pointer bg-gray-200 p-4 rounded-lg text-gray-700 hover:bg-gray-300 transition"
          onClick={() => setActiveSection("layout")}
        >
          Layout
        </h3>
        <h3
          className="text-xl font-semibold cursor-pointer bg-gray-200 p-4 rounded-lg text-gray-700 hover:bg-gray-300 transition"
          onClick={() => setActiveSection("color")}
        >
          Color
        </h3>
      </div>
    </div>
  );

  const RoomWidthMenu: React.FC = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-3">Select Room Width</h3>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 flex flex-wrap gap-4">
        {[2400, 3000, 3600].map((width) => (
          <button
            key={width}
            onClick={() => handleRoomWidthChange(width)}
            className={`p-3 rounded-lg border transition duration-300 ease-in-out ${
              roomWidth === width
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-blue-600`}
          >
            {width / 300} ft
          </button>
        ))}
      </div>
      <button
        onClick={() => setActiveSection(null)}
        className="mt-4 w-full bg-gray-300 p-3 rounded hover:bg-gray-400 transition"
      >
        Back
      </button>
    </div>
  );

  const LayoutMenu: React.FC = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-3">Select Layout Position</h3>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setLayoutPosition("left")}
          className="w-full bg-gray-200 p-3 rounded hover:bg-gray-300 transition"
        >
          Left
        </button>
        <button
          onClick={() => setLayoutPosition("middle")}
          className="w-full bg-gray-200 p-3 rounded hover:bg-gray-300 transition"
        >
          Middle
        </button>
        <button
          onClick={() => setLayoutPosition("right")}
          className="w-full bg-gray-200 p-3 rounded hover:bg-gray-300 transition"
        >
          Right
        </button>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
        {layoutPosition === "left" && (
          <Left onLayoutSelect={handleLayoutImageClick} />
        )}
        {layoutPosition === "middle" && (
          <Middle onLayoutSelect={handleLayoutImageClick} />
        )}
        {layoutPosition === "right" && (
          <Right onLayoutSelect={handleLayoutImageClick} />
        )}
      </div>
      <button
        onClick={() => setActiveSection(null)}
        className="mt-4 w-full bg-gray-300 p-3 rounded hover:bg-gray-400 transition"
      >
        Back
      </button>
    </div>
  );

  const ColorMenu: React.FC = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-3">Select Color</h3>
      <button
        onClick={() => handleColorSetSelection("lam")}
        className="w-full bg-blue-500 text-white py-3 rounded mb-2 hover:bg-blue-600 transition"
      >
        Select Laminate Exclusive Color
      </button>
      <button
        onClick={() => handleColorSetSelection("pu")}
        className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
      >
        Select PU Color
      </button>
      <button
        onClick={() => setActiveSection(null)}
        className="mt-4 w-full bg-gray-300 p-3 rounded hover:bg-gray-400 transition"
      >
        Back
      </button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-4 bg-gray-100 overflow-hidden">
        <BabylonScene
          roomWidth={roomWidth}
          layout={layout}
          height={3000}
          colorTexture={selectedColor}
        />
      </div>
      <div className="w-full md:w-1/3 p-6 bg-white shadow-md rounded-lg flex flex-col space-y-6">
        {activeSection === null && <Menu />}
        {activeSection === "roomWidth" && <RoomWidthMenu />}
        {activeSection === "layout" && <LayoutMenu />}
        {activeSection === "color" && <ColorMenu />}
      </div>

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
                  className="border p-2 rounded-lg cursor-pointer transition transform hover:scale-105"
                  onClick={() => handleColorSelect(color.src)}
                >
                  <img
                    src={color.src}
                    alt={color.name}
                    className="w-full h-24 object-cover mb-2 rounded"
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
