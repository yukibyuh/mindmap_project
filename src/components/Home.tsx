import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { MindmapItem } from '../types';

interface HomeProps {
  mindmaps: MindmapItem[];
  onAddMindmap: (newMindmap: MindmapItem) => void;
  onDeleteMindmap: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ mindmaps, onAddMindmap, onDeleteMindmap }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddMindmap = () => {
    const newMindmap: MindmapItem = {
      id: Date.now(),
      date,
      title,
      description,
      elements: []
    };
    onAddMindmap(newMindmap);
    setDate('');
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCardClick = (id: number) => {
    navigate(`/mindmap/${id}`);
  };

  return (
    <div className="home" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        MindMap
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen} style={{ backgroundColor: '#333', color: '#fff' }}>
          Add
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Mind Map</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMindmap} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mindmap-list" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {mindmaps.map((mindmap) => (
          <Card
            key={mindmap.id}
            className="mindmap-card"
            onClick={() => handleCardClick(mindmap.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {mindmap.date}
              </Typography>
              <Typography variant="h5" component="h2" style={{ marginBottom: '10px' }}>
                {mindmap.title}
              </Typography>
              <Typography color="textSecondary">
                {mindmap.description}
              </Typography>
            </CardContent>
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMindmap(mindmap.id);
              }}
              style={{ alignSelf: 'flex-end' }}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
