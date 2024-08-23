import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // HashRouterに変更
import Home from './components/Home';
import MindMap from './components/MindMap';
import { MindmapItem } from './types';

const App: React.FC = () => {
  const [mindmaps, setMindmaps] = useState<MindmapItem[]>(() => {
    const savedMindmaps = localStorage.getItem('mindmaps');
    return savedMindmaps ? JSON.parse(savedMindmaps) : [];
  });

  const handleAddMindmap = (newMindmap: MindmapItem) => {
    setMindmaps((prevMindmaps) => {
      const updatedMindmaps = [...prevMindmaps, newMindmap];
      localStorage.setItem('mindmaps', JSON.stringify(updatedMindmaps));
      return updatedMindmaps;
    });
  };

  const handleDeleteMindmap = (id: number) => {
    setMindmaps((prevMindmaps) => {
      const updatedMindmaps = prevMindmaps.filter((mindmap) => mindmap.id !== id);
      localStorage.setItem('mindmaps', JSON.stringify(updatedMindmaps));
      return updatedMindmaps;
    });
  };

  const handleUpdateMindmaps = (updatedMindmaps: MindmapItem[]) => {
    setMindmaps(updatedMindmaps);
    localStorage.setItem('mindmaps', JSON.stringify(updatedMindmaps));
  };

  return (
    <Router> {/* HashRouterを使用 */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              mindmaps={mindmaps}
              onAddMindmap={handleAddMindmap}
              onDeleteMindmap={handleDeleteMindmap}
            />
          }
        />
        <Route
          path="/mindmap/:id"
          element={
            <MindMap
              mindmaps={mindmaps}
              onUpdateMindmaps={handleUpdateMindmaps}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
