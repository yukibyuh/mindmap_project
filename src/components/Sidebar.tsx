import React from 'react';
import { Button, Divider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SquareIcon from '@mui/icons-material/Square';
import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LineWeightIcon from '@mui/icons-material/LineWeight';

interface SidebarProps {
  addBlackRectangle: () => void;
  addGrayRectangle: () => void;
  addLine: () => void;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ addBlackRectangle, addGrayRectangle, addLine, closeSidebar }) => {
  return (
    <div className="sidebar" style={{ width: '200px', background: '#e0e0e0', position: 'absolute', left: 0, top: 0, height: '100vh', padding: '10px' }}>
      {/* Close Button moved slightly to the left */}
      <Button
        variant="contained"
        onClick={closeSidebar}
        startIcon={<CloseIcon />}
        style={{ display: 'block', margin: '10px 0 10px 5px', width: '90%', padding: '12px' }} // Adjusted margin to move left
      >
        Close
      </Button>
      <Divider style={{ margin: '10px 0' }} />
      <Typography variant="h6" gutterBottom>
        Add
      </Typography>

      {/* Updated Add buttons for wider clickable area */}
      <Button
        variant="text"
        onClick={addBlackRectangle}
        startIcon={<SquareIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start', width: '100%' }} // Full-width button for easier clicking
      >
        Black
      </Button>
      <Button
        variant="text"
        onClick={addGrayRectangle}
        startIcon={<RectangleIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start', width: '100%' }} // Full-width button for easier clicking
      >
        Gray
      </Button>
      <Button
        variant="text"
        onClick={addLine}
        startIcon={<LineWeightIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start', width: '100%' }} // Full-width button for easier clicking
      >
        Line
      </Button>
    </div>
  );
};

export default Sidebar;
