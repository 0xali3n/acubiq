import React, { useState } from "react";

interface LeftProps {
  onLayoutSelect: (modelNumber: number) => void;
}

const Left: React.FC<LeftProps> = ({ onLayoutSelect }) => {
  const sizes = [1650, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400];
  const [selectedSize, setSelectedSize] = useState<number>(0);

  const handleButtonClick = (size: number) => {
    setSelectedSize(size); // Update selected size
    onLayoutSelect(size + 10000); // Call the provided function
    console.log(size);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Make the image smaller */}
      <img
        src="/img/L2400.png"
        alt="Large Image"
        className="w-64 h-auto mb-6" // Adjust the width to make the image smaller
        onClick={() => onLayoutSelect(2400 + 10000)} // Pass 2400 as a number
      />
      <div className="grid grid-cols-3 gap-4">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleButtonClick(size)} // Pass size directly as a number
            className={`p-3 rounded-lg border transition duration-300 ease-in-out ${
              selectedSize === size
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-blue-600`}
          >
            <span>{size}</span>
            <span className="ml-1">mm</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Left;
