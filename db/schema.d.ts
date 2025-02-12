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
    grid_data: string[][];
}