import React from "react";
import Squares from "../ui/Squares";
import { Footer } from "./Footer";

interface BackgroundLayoutProps {
  children: React.ReactNode;
  squareSize?: number;
  speed?: number;
  direction?: "diagonal" | "up" | "right" | "down" | "left";
}

export function BackgroundLayout({
  children,
  squareSize = 40,
  speed = 0.3,
  direction = "diagonal",
}: BackgroundLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0">
        <Squares
          squareSize={squareSize}
          speed={speed}
          direction={direction}
          borderColor="#3d4757"
          hoverFillColor="#3b82f6"
        />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#010409]/80 via-[#1a1e2e]/75 to-[#2d3748]/80 pointer-events-none" />

      <div className="relative z-20 flex-1 flex flex-col">{children}</div>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
