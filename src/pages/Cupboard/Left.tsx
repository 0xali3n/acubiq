// Left.tsx
import React from "react";

interface LeftProps {
  onLayoutSelect: (modelNumber: number) => void;
}

const Left: React.FC<LeftProps> = ({ onLayoutSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <img
        src="/img/1.png"
        alt="Left Layout 1"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(1)}
      />
      <img
        src="/img/2.png"
        alt="Left Layout 2"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(2)}
      />
    </div>
  );
};

export default Left; // Ensure this line is present
