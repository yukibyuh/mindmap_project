export interface MindmapItem {
    id: number;
    date: string;
    title: string;
    description: string;
    elements: MindmapElement[]; // To store the elements like rectangles, lines, etc.
  }
  
  export interface MindmapElement {
    id: number;
    type: 'rectangle' | 'line';
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    endX?: number;
    endY?: number;
  }
  