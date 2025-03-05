"use client";

import React, { useRef, useEffect, JSX, useCallback, useState } from "react";

import { useColourToolStore } from "@/store/colour-tool-store";
import { createEmptyGrid } from "@/lib/utils";
import { useDatabase } from "@/hooks/use-database";
import { updateProject, updateProjectConfig } from "@/db/project";

import { Button } from "@/components/ui/button";
import { EraserIcon, Grid3X3Icon, PaintBucketIcon, PenIcon, Redo2Icon, SaveIcon, SquareArrowOutUpRightIcon, SquareXIcon, Undo2Icon } from "lucide-react";

import { UtilityButton } from "./utility-button-canvas";
import { NumberConstrainedUtilityInput } from "../number-constrained-utility-input";
import { useExportStore } from "@/store/export-store";
import { SwitchUtilityButton } from "../switch-utility-button";
import { useProjectStore } from "@/store/project-store";
import { makeToast } from "@/lib/toast-manager";

interface PixelArtMakerProps {
  project_id?: number;
  color?: string;
  width: number;
  height: number;
  gridDataPrev?: string[][];
}


const cloneGrid = (grid: string[][]): string[][] => {
  return grid.map((row) => [...row]);
};

export const PixelArtCanvas = ({
  project_id,
  width,
  height,
}: PixelArtMakerProps): JSX.Element => {
  // Database 
  const db = useDatabase();

  // Stores
  const es = useExportStore();
  const ps = useProjectStore();

  // Config Elements
  const [autoSave, setAutoSave] = useState(true);

  // The canvas ref.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Dummy canvas ref for downloading image
  const dummyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // The grid data holds the color for each cell.
  // gridData.current is a 2D array of size [height][width]
  const gridData = useRef<string[][]>(createEmptyGrid(width, height));

  // Pixel size data
  const [pixelSize, setPixelSize] = useState<number>(5);

  // Grid lines View
  const [gridLinesView, setGridLinesView] = useState(false);

  // Undo and redo stacks store snapshots of the grid.
  const undoStack = useRef<string[][][]>([]);
  const redoStack = useRef<string[][][]>([]);


  const isDrawing = useRef<boolean>(false);   // A flag to indicate whether the user is drawing.
  const isMouseInCanvas = useRef<boolean>(false); // A flag to indicate wether the pointer is inside the canvas or not.

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
    if (project_id && autoSave) {
      saveData();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = cts.currentTool === "eraser" ? "#ffffffff" : newColor;
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

  // Re-render the canvas if pixelSizeChanges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;

    drawCanvas();
  }, [pixelSize])

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

    const loadProjectConfig = async () => {
      if (!ps.currentProject) return;

      const grid_data = await JSON.parse(ps.currentProject.grid_data);
      const undo_stack_data = await JSON.parse(ps.currentProject.project_config.undo_stack)
      const redo_stack_data = await JSON.parse(ps.currentProject.project_config.redo_stack)
      gridData.current = grid_data;
      undoStack.current = undo_stack_data;
      redoStack.current = redo_stack_data;

      setAutoSave(!!ps.currentProject.project_config.autosave);
      setPixelSize(ps.currentProject.project_config.pixel_size);
      setGridLinesView(!!ps.currentProject.project_config.grid_lines_view);
      cts.setCurrentColour(ps.currentProject.project_config.last_selected_colour);
      cts.setCurrentTool(ps.currentProject.project_config.last_selected_tool);

      drawCanvas();
    }

    loadProjectConfig();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, project_id]);

  // Handle mouse down: start drawing and save grid snapshot.
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button != 0) return;
    // Declare that mouse is in canvas
    isMouseInCanvas.current = true;
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
      updateCell(col, row, "#ffffff00");
    }
  };

  // Handle mouse move: if drawing, update the corresponding cell.
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isMouseInCanvas.current) return;
    const { col, row } = getCellCoordinates(event);
    if (cts.currentTool === "pen")
      updateCell(col, row, cts.currentColour);
    if (cts.currentTool === "eraser")
      updateCell(col, row, "#ffffff00");
  };

  // End drawing.
  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    drawCanvas();
  };

  const handleMouseLeave = () => {
    if (!isDrawing.current) return;
    isMouseInCanvas.current = false;
    drawCanvas();
  };

  const handleMouseEnter = () => {
    isMouseInCanvas.current = true;
  }

  // Clear the entire canvas (reset grid data) and clear undo/redo stacks.
  const clearCanvas = () => {
    undoStack.current.push(cloneGrid(gridData.current));
    gridData.current = createEmptyGrid(width, height);
    if (project_id && autoSave) {
      saveData();
    }
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
      if (project_id && autoSave) {
        saveData();
      }
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
      if (project_id && autoSave) {
        saveData();
      }
      drawCanvas();
    }
  };

  const saveData = () => {
    if (!project_id) return;
    updateProject(db, project_id, undefined, gridData.current);
    updateProjectConfig(db, project_id, {
      autosave: autoSave ? 1 : 0,
      pixel_size: pixelSize,
      last_selected_colour: cts.currentColour,
      grid_lines_view: gridLinesView ? 1 : 0,
      last_selected_tool: cts.currentTool,
      undo_stack: undoStack.current,
      redo_stack: redoStack.current
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [gridLinesView]);

  useEffect(() => {
    saveData();
  }, [autoSave, cts.currentColour, cts.currentTool, pixelSize, gridLinesView, undo, redo]);



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
    } else if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "s")
    ) {
      event.preventDefault();
      handleSaveClick();
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
  };

  const handlePixelSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value < 1) setPixelSize(1);
      else if (value > 30) setPixelSize(30);
      else setPixelSize(value);
    }
  };

  const handleSaveClick = () => {
    try {
      saveData();
      makeToast({
        type: "success",
        message: "Saved"
      })
    } catch (error) {
      makeToast({
        type: "error",
        message: "Error while saving",
        description: JSON.stringify(error)
      })
    }
  }

  return (
    <>
      <div className="fixed top-6 h-12 items-center p-4 flex gap-2 bg-[#2f2f2f] w-full">
        <SwitchUtilityButton label="Autosave" checked={autoSave} setChecked={setAutoSave} />
        <div className="h-full w-[1px] bg-white" />
        <UtilityButton handleClick={handleSaveClick} toolTipMessage="Save (Ctrl + S)" icon={SaveIcon} />
        <div className="h-full w-[1px] bg-white" />
        <UtilityButton handleClick={clearCanvas} toolTipMessage={"Clear cnavas"} icon={SquareXIcon} />
        <UtilityButton handleClick={undo} toolTipMessage={"Undo"} icon={Undo2Icon} />
        <UtilityButton handleClick={redo} toolTipMessage={"Redo"} icon={Redo2Icon} />
        <div className="h-full w-[1px] bg-white" />
        <UtilityButton
          handleClick={() => cts.setCurrentTool("pen")}
          toolTipMessage={"Pen"}
          icon={PenIcon}
          active={cts.currentTool == "pen"}
        />
        <UtilityButton
          handleClick={() => cts.setCurrentTool("bucket")}
          toolTipMessage={"Bucket"}
          icon={PaintBucketIcon}
          active={cts.currentTool == "bucket"}
        />
        <UtilityButton
          handleClick={() => cts.setCurrentTool("eraser")}
          toolTipMessage={"Eraser"}
          icon={EraserIcon}
          active={cts.currentTool == "eraser"}
        />
        <div className="h-full w-[1px] bg-white" />
        <UtilityButton
          handleClick={() => setGridLinesView(prev => !prev)}
          toolTipMessage={"Grid lines"}
          icon={Grid3X3Icon}
          active={gridLinesView}
        />
        <div className="h-full w-[1px] bg-white" />
        <NumberConstrainedUtilityInput
          data={pixelSize}
          handleChange={handlePixelSizeChange}
          setData={setPixelSize}
        />
        <div className="h-full w-[1px] bg-white" />
        <UtilityButton handleClick={es.openExportModal} toolTipMessage="Export" icon={SquareArrowOutUpRightIcon} />
        {/* TODO */}
        <Button className="hidden" onClick={() => handleZoom("in")}>Zoom in</Button>
        <Button className="hidden" onClick={() => handleZoom("out")}>Zoom out</Button>
      </div>
      <div className="min-w-min min-h-min p-4 pt-20">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 cursor-crosshair bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        />
        <canvas
          ref={dummyCanvasRef}
          className="hidden"
        />
      </div>
    </>
  );
}