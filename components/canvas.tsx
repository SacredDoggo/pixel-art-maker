"use client";

import React, { useRef, useEffect, JSX, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColourToolStore } from "@/store/colour-tool-store";

interface PixelArtMakerProps {
  color?: string;
  width: number;
  height: number;
  pixelSize: number;
  gridLinesView?: boolean;
  gridDataPrev?: string[][];
}


const createEmptyGrid = (width: number, height: number): string[][] => {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "#ffffff")
  );
};

const cloneGrid = (grid: string[][]): string[][] => {
  return grid.map((row) => [...row]);
};

export const PixelArtCanvas = ({
  width,
  height,
  pixelSize,
  gridLinesView = false,
  gridDataPrev
}: PixelArtMakerProps): JSX.Element => {
  // The canvas ref.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Dummy canvas ref for downloading image
  const dummyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // The grid data holds the color for each cell.
  // gridData.current is a 2D array of size [height][width]
  const gridData = useRef<string[][]>(gridDataPrev ? gridDataPrev : createEmptyGrid(width, height));

  // Undo and redo stacks store snapshots of the grid.
  const undoStack = useRef<string[][][]>([]);
  const redoStack = useRef<string[][][]>([]);

  // A flag to indicate whether the user is drawing.
  const isDrawing = useRef<boolean>(false);

  // Colour Tool Store
  const cts = useColourToolStore();

  // Zoom state of canvas
  const [zoom, setZoom] = useState(1);

  // Draws the entire canvas from gridData.
  const drawCanvas = (
    theCanvasRef: React.RefObject<HTMLCanvasElement | null> = canvasRef,
    pixel_size: number = pixelSize,
    grid_lines_view: boolean = gridLinesView
  ) => {
    const canvas = theCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clear entire canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each cell from gridData.
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        ctx.fillStyle = gridData.current[row][col];
        ctx.fillRect(col * pixel_size, row * pixel_size, pixel_size, pixel_size);
      }
    }

    // Optionally draw grid lines on top.
    if (grid_lines_view) {
      ctx.strokeStyle = "#ccc";
      // Vertical lines.
      for (let x = 0; x <= width * pixel_size; x += pixel_size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height * pixel_size);
        ctx.stroke();
      }
      // Horizontal lines.
      for (let y = 0; y <= height * pixel_size; y += pixel_size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width * pixel_size, y);
        ctx.stroke();
      }
    }
  };

  const bucketBrushHandler = (col: number, row: number, cellColour: string, fillColour: string) => {
    if (col < 0 || col > width - 1 || row < 0 || row > height - 1 || gridData.current[row][col] !== cellColour) return;

    updateCell(col, row, fillColour);

    bucketBrushHandler(col - 1, row, cellColour, fillColour);
    bucketBrushHandler(col + 1, row, cellColour, fillColour);
    bucketBrushHandler(col, row - 1, cellColour, fillColour);
    bucketBrushHandler(col, row + 1, cellColour, fillColour);
  }

  // Update the color of a specific cell in the grid and draw it.
  const updateCell = (col: number, row: number, newColor: string) => {
    // Ignore if out-of-bounds.
    if (col < 0 || col >= width || row < 0 || row >= height) return;
    // Only update if the cell color is different.
    if (gridData.current[row][col] === newColor) return;

    gridData.current[row][col] = newColor;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = newColor;
    ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);

    // If grid lines are enabled, re-draw them over this cell.
    if (gridLinesView) {
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    }
  };

  // Given a mouse event, determine the grid cell coordinates.
  const getCellCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { col: 0, row: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);
    return { col, row };
  };

  // Initialize the canvas and grid data.
  useEffect(() => {
    // When width, height, or pixelSize changes, update the canvas size.
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;

    // When width, height, or pixelSize changes, update the dummy canvas size too.
    const dummyCanvas = dummyCanvasRef.current;
    if (!dummyCanvas) return;
    dummyCanvas.width = width;
    dummyCanvas.height = height;

    // If gridData is not already the correct size, reinitialize it.
    if (
      gridData.current.length !== height ||
      gridData.current[0]?.length !== width
    ) {
      gridData.current = createEmptyGrid(width, height);
      // Clear undo/redo stacks since the canvas dimensions changed.
      undoStack.current = [];
      redoStack.current = [];
    }

    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, pixelSize, gridLinesView]);

  // Handle mouse down: start drawing and save grid snapshot.
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Save a snapshot of the current grid for undo.
    undoStack.current.push(cloneGrid(gridData.current));
    // Clear redo stack.
    redoStack.current = [];
    // Check what brush user has selected
    if (cts.currentTool === "pen") {
      isDrawing.current = true;
      const { col, row } = getCellCoordinates(event);
      updateCell(col, row, cts.currentColour);
    }
    if (cts.currentTool === "bucket") {
      const { col, row } = getCellCoordinates(event);
      if (gridData.current[row][col] !== cts.currentColour) {
        bucketBrushHandler(col, row, gridData.current[row][col], cts.currentColour);
        drawCanvas();
      }
    }
    if (cts.currentTool === "eraser") {
      isDrawing.current = true;
      const { col, row } = getCellCoordinates(event);
      updateCell(col, row, "#ffffff");
    }
  };

  // Handle mouse move: if drawing, update the corresponding cell.
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { col, row } = getCellCoordinates(event);
    if (cts.currentTool === "pen")
      updateCell(col, row, cts.currentColour);
    if (cts.currentTool === "eraser")
      updateCell(col, row, "#ffffff");
  };

  // End drawing.
  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    drawCanvas();
  };

  const handleMouseLeave = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    drawCanvas();
  };

  // Clear the entire canvas (reset grid data) and clear undo/redo stacks.
  const clearCanvas = () => {
    undoStack.current.push(cloneGrid(gridData.current));
    gridData.current = createEmptyGrid(width, height);
    redoStack.current = [];
    drawCanvas();
  };

  // Undo: restore the previous grid snapshot.
  const undo = () => {
    if (undoStack.current.length === 0) return;
    // Save current state for redo.
    redoStack.current.push(cloneGrid(gridData.current));
    const previousGrid = undoStack.current.pop();
    if (previousGrid) {
      gridData.current = previousGrid;
      drawCanvas();
    }
  };

  // Redo: restore the next grid snapshot.
  const redo = () => {
    if (redoStack.current.length === 0) return;
    // Save current state for undo.
    undoStack.current.push(cloneGrid(gridData.current));
    const nextGrid = redoStack.current.pop();
    if (nextGrid) {
      gridData.current = nextGrid;
      drawCanvas();
    }
  };

  // Keyboard shortcuts for undo (Ctrl+Z/Cmd+Z) and redo (Ctrl+Y or Ctrl+Shift+Z).
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "y" || (event.shiftKey && event.key === "Z"))
    ) {
      event.preventDefault();
      redo();
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const exportCanvas = (format: "png" | "jpeg" = "png") => {
    const dummyCanvas = dummyCanvasRef.current;
    if (!dummyCanvas) return;
    drawCanvas(dummyCanvasRef, 1, false);
    // Convert canvas to data URL (MIME type image/png or image/jpeg)
    const dataUrl = dummyCanvas.toDataURL(`image/${format}`);
    // Create an anchor element and trigger a download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `canvas.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoom = (value: "in" | "out") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let newZoom = zoom + (value === "in" ? 0.25 : -0.25);
    newZoom = Math.min(Math.max(newZoom, 0.25), 2); // Keep between 0.25x and 2x

    setZoom(newZoom);
    // Clear and reset canvas before applying zoom
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Apply new zoom level
    ctx.scale(newZoom, newZoom);

    // Redraw existing canvas content
    drawCanvas();
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={clearCanvas}>Clear Canvas</Button>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={() => exportCanvas("png")}>Export PNG</Button>
        <Button onClick={() => exportCanvas("jpeg")}>Export JPEG</Button>
        <Button className="hidden" onClick={() => handleZoom("in")}>Zoom in</Button>
        <Button className="hidden" onClick={() => handleZoom("out")}>Zoom out</Button>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <canvas
        ref={dummyCanvasRef}
        className="hidden"
      />
    </div>
  );
}