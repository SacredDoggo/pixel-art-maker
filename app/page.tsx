"use client";

import { useEffect } from "react";
import { testDB } from "@/db/tauri-sqlite-db";

import { useDatabase } from "@/hooks/use-database";
import { PixelArtCanvas } from "@/components/canvas";
import { Button } from "@/components/ui/button";
import { useColourToolStore } from "@/store/colour-tool-store";


const HomePage = () => {
  const db = useDatabase();
  const cts = useColourToolStore();
  useEffect(() => {
    console.log("here");
    if (db)
      testDB(db);
  }, [db]);

  return (
    <div>
      <Button onClick={() => cts.setCurrentTool("pen")}>Pen</Button>
      <Button onClick={() => cts.setCurrentTool("bucket")}>Bucket</Button>
      <Button onClick={() => cts.setCurrentTool("eraser")}>Eraser</Button>
      <PixelArtCanvas 
        height={32}
        width={32}
        pixelSize={10}
        gridLinesView
      />
    </div>
  );
};

export default HomePage;