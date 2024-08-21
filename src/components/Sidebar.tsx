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
      <Button variant="contained" onClick={closeSidebar} startIcon={<CloseIcon />} style={{ display: 'block', margin: '10px' }}>
        Close
      </Button>
      <Divider style={{ margin: '10px 0' }} />
      <Typography variant="h6" gutterBottom>Add</Typography>
      <Button
        variant="text"
        onClick={addBlackRectangle}
        startIcon={<SquareIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start' }}
      >
        Black
      </Button>
      <Button
        variant="text"
        onClick={addGrayRectangle}
        startIcon={<RectangleIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start' }}
      >
        Gray
      </Button>
      <Button
        variant="text"
        onClick={addLine}
        startIcon={<LineWeightIcon />}
        style={{ display: 'block', textAlign: 'left', margin: '10px', justifyContent: 'flex-start' }}
      >
        Line
      </Button>
    </div>
  );
};

export default Sidebar;
