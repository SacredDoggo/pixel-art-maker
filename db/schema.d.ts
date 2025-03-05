// Colour Palette 
interface ColourPalette {
  id: number;
  colour: string;
  project_id?: number;
  palette_group_id?: number;
}

// Colour Palette Group
interface PaletteGroup {
  id: number;
  group_name: string;
}

// Project
interface Project {
  id: number;
  project_name: string;
  height: number;
  width: number;
  grid_data: string;
  project_config: ProjectConfig;
}

// Project Config
interface ProjectConfig {
  id: number;
  autosave: 0 | 1;
  pixel_size: number;
  last_selected_colour: string;
  grid_lines_view: 0 | 1;
  last_selected_tool: "pen" | "bucket" | "eraser";
  undo_stack: string;
  redo_stack: string;
}

interface SoftwareState {
  id: number;
  last_project_id: number;
}