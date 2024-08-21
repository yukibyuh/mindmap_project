import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { IconButton, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { MindmapItem, MindmapElement } from '../types';

const EDGE_DETECTION_THRESHOLD = 10;

const MindMap: React.FC<{ mindmaps: MindmapItem[]; onUpdateMindmaps: (updatedMindmaps: MindmapItem[]) => void }> = ({ mindmaps, onUpdateMindmaps }) => {
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [elements, setElements] = useState<MindmapElement[]>([]);
  const [draggingElement, setDraggingElement] = useState<MindmapElement | null>(null);
  const [resizingElement, setResizingElement] = useState<MindmapElement | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeSide, setResizeSide] = useState<'left' | 'right' | 'top' | 'bottom' | 'bottomRight' | null>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; element: MindmapElement | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentMindmap = mindmaps.find((map) => map.id.toString() === id);
    if (currentMindmap) {
      setElements(currentMindmap.elements);
    }
  }, [id]);

  useEffect(() => {
    const updatedMindmaps = mindmaps.map((map) =>
      map.id.toString() === id ? { ...map, elements } : map
    );
    onUpdateMindmaps(updatedMindmaps);
  }, [elements]);

  const handleBackClick = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addBlackRectangle = () => {
    const newElement: MindmapElement = {
      id: Date.now(),
      type: 'rectangle',
      color: 'black',
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      content: '',
    };
    setElements((prevElements) => [...prevElements, newElement]);
  };

  const addGrayRectangle = () => {
    const newElement: MindmapElement = {
      id: Date.now(),
      type: 'rectangle',
      color: 'lightgray',
      x: 100,
      y: 200,
      width: 120,
      height: 50,
      content: '',
    };
    setElements((prevElements) => [...prevElements, newElement]);
  };

  const addLine = () => {
    const newElement: MindmapElement = {
      id: Date.now(),
      type: 'line',
      color: 'black',
      x: 100,
      y: 300,
      width: 100,
      height: 2,
      content: '',
      endX: 200,
      endY: 300,
    };
    setElements((prevElements) => [...prevElements, newElement]);
  };

  const handleContentChange = (elementId: number, newContent: string) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === elementId ? { ...element, content: newContent } : element
      )
    );
  };

  const detectResizeSide = (e: React.MouseEvent, element: MindmapElement) => {
    if (element.type === 'rectangle') {
      const withinRightEdge = Math.abs(e.clientX - (element.x + element.width)) < EDGE_DETECTION_THRESHOLD;
      const withinLeftEdge = Math.abs(e.clientX - element.x) < EDGE_DETECTION_THRESHOLD;
      const withinTopEdge = Math.abs(e.clientY - element.y) < EDGE_DETECTION_THRESHOLD;
      const withinBottomEdge = Math.abs(e.clientY - (element.y + element.height)) < EDGE_DETECTION_THRESHOLD;

      if (withinRightEdge && withinBottomEdge) return 'bottomRight';
      if (withinRightEdge) return 'right';
      if (withinLeftEdge) return 'left';
      if (withinTopEdge) return 'top';
      if (withinBottomEdge) return 'bottom';
    } else if (element.type === 'line' && element.endX !== undefined && element.endY !== undefined) {
      const distanceToLeftEdge = Math.hypot(e.clientX - element.x, e.clientY - element.y);
      const distanceToRightEdge = Math.hypot(e.clientX - element.endX, e.clientY - element.endY);

      if (distanceToRightEdge < EDGE_DETECTION_THRESHOLD) {
        return 'right';
      } else if (distanceToLeftEdge < EDGE_DETECTION_THRESHOLD) {
        return 'left';
      }
    }
    return null;
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    element: MindmapElement,
    isResize: boolean = false,
    side: 'left' | 'right' | 'top' | 'bottom' | 'bottomRight' | null = null
  ) => {
    e.stopPropagation();
    const detectedSide = detectResizeSide(e, element);

    if (isResize && side) {
      setResizingElement(element);
      setResizeSide(side);
    } else if (detectedSide) {
      setResizingElement(element);
      setResizeSide(detectedSide);
    } else {
      setDraggingElement(element);
      setDragOffset({ x: e.clientX - element.x, y: e.clientY - element.y });
      setResizeSide(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (resizingElement && resizeSide) {
      setElements((prevElements) =>
        prevElements.map((el) => {
          if (el.id === resizingElement.id) {
            if (el.type === 'rectangle') {
              if (resizeSide === 'right') {
                return { ...el, width: e.clientX - el.x };
              } else if (resizeSide === 'left') {
                return { ...el, x: e.clientX, width: el.width + (el.x - e.clientX) };
              } else if (resizeSide === 'top') {
                return { ...el, y: e.clientY, height: el.height + (el.y - e.clientY) };
              } else if (resizeSide === 'bottom') {
                return { ...el, height: e.clientY - el.y };
              } else if (resizeSide === 'bottomRight') {
                return { ...el, width: e.clientX - el.x, height: e.clientY - el.y };
              }
            } else if (el.type === 'line' && el.endX !== undefined && el.endY !== undefined) {
              if (resizeSide === 'right') {
                return { ...el, endX: e.clientX, endY: e.clientY };
              } else if (resizeSide === 'left') {
                return { ...el, x: e.clientX, y: e.clientY };
              }
            }
          }
          return el;
        })
      );
    } else if (draggingElement) {
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === draggingElement.id
            ? { ...el, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
    setResizingElement(null);
    setResizeSide(null);
  };

  const handleContextMenu = (event: React.MouseEvent, element: MindmapElement) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      element,
    });
  };

  const handleDelete = () => {
    if (contextMenu?.element) {
      setElements((prevElements) =>
        prevElements.filter((el) => el.id !== contextMenu.element?.id)
      );
    }
    setContextMenu(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="mindmap-creator" style={{ display: 'flex', transition: 'all 0.3s ease' }} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {isSidebarOpen && (
        <Sidebar
          addBlackRectangle={addBlackRectangle}
          addGrayRectangle={addGrayRectangle}
          addLine={addLine}
          closeSidebar={toggleSidebar}
        />
      )}
      <div
        className="mindmap-canvas"
        style={{ position: 'relative', width: '100%', height: '100vh', left: isSidebarOpen ? '200px' : '0', transition: 'left 0.3s ease', outline: 'none', border: 'none' }}
      >
        <div style={{ position: 'fixed', top: 10, left: isSidebarOpen ? 210 : 10, display: 'flex', alignItems: 'center', zIndex: 1000, transition: 'left 0.3s ease' }}>
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        </div>
        {elements.map((element) => (
          <div
            key={element.id}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onContextMenu={(e) => handleContextMenu(e, element)}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              cursor: 'move',
              ...(element.type === 'rectangle' && {
                width: `${element.width}px`,
                height: `${element.height}px`,
                backgroundColor: element.color,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                boxSizing: 'border-box',
                color: element.color === 'black' ? 'white' : 'black',
                outline: 'none',
              }),
              ...(element.type === 'line' && {
                width: `${Math.sqrt((element.endX! - element.x) ** 2 + (element.endY! - element.y) ** 2)}px`,
                height: '2px',
                backgroundColor: 'black',
                transformOrigin: 'left',
                transform: `rotate(${Math.atan2((element.endY || 0) - element.y, (element.endX || 0) - element.x)}rad)`,
              }),
            }}
          >
            {element.type === 'rectangle' && (
              <>
                <textarea
                  value={element.content}
                  onChange={(e) => handleContentChange(element.id, e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    textAlign: 'center',
                    fontSize: `${Math.min(element.width / 10, element.height / 2)}px`,
                    outline: 'none',
                    resize: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    padding: '4px',
                    boxSizing: 'border-box',
                  }}
                />
                {/* Resize controls */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'right')}
                  style={{
                    width: '10px',
                    height: '100%',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right: 0,
                    cursor: 'ew-resize',
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'left')}
                  style={{
                    width: '10px',
                    height: '100%',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    left: 0,
                    cursor: 'ew-resize',
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'bottom')}
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    bottom: 0,
                    cursor: 'ns-resize',
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'top')}
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    cursor: 'ns-resize',
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'bottomRight')}
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    cursor: 'nwse-resize',
                  }}
                />
              </>
            )}
            {element.type === 'line' && (
              <>
                {/* Resize controls for lines */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'right')}
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right: 0,
                    top: -4,
                    cursor: 'ew-resize',
                    transform: 'translateX(50%)',
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, element, true, 'left')}
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    left: 0,
                    top: -4,
                    cursor: 'ew-resize',
                    transform: 'translateX(-50%)',
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default MindMap;
