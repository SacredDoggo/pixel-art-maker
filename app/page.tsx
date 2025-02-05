"use client";

import { PixelArtCanvas } from "@/components/canvas";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const HomePage = () => {
  const [showLine, setShowLine] = useState(true);

  return (
    <div>
      <Button onClick={() => setShowLine(!showLine)}>Toggle line</Button>
      <PixelArtCanvas
        height={16}
        width={16} 
        pixelSize={30}
        gridLinesView={showLine}
      />
    </div>
  );
};

export default HomePage;