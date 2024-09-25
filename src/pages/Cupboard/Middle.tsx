// Middle.tsx
import React from "react";

interface MiddleProps {
  onLayoutSelect: (modelNumber: number) => void;
}

const Middle: React.FC<MiddleProps> = ({ onLayoutSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <img
        src="/img/3.png"
        alt="Middle Layout 3"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(3)}
      />
      <img
        src="/img/4.png"
        alt="Middle Layout 4"
        className="w-32 h-auto cursor-pointer hover:scale-105 transition"
        onClick={() => onLayoutSelect(4)}
      />
    </div>
  );
};

export default Middle;
