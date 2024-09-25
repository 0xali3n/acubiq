// Right.tsx
import React from "react";

interface RightProps {
  onLayoutSelect: (modelNumber: number) => void;
}

const Right: React.FC<RightProps> = ({ onLayoutSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <img
        src="/img/1.png"
        alt="Right Layout 1"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(1)}
      />
      <img
        src="/img/4.png"
        alt="Right Layout 4"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(4)}
      />
    </div>
  );
};

export default Right;
