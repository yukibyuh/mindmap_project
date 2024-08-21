import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { MindmapItem } from '../types'; // Import the centralized type

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
      elements: [] // Initialize an empty array for elements
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
    <div className="home">
      <Typography variant="h4">MindMap</Typography>
      <div className="add-button">
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
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

      <div className="mindmap-list">
        {mindmaps.map((mindmap) => (
          <Card
            key={mindmap.id}
            className="mindmap-card"
            onClick={() => handleCardClick(mindmap.id)}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {mindmap.date}
              </Typography>
              <Typography variant="h5" component="h2">
                {mindmap.title}
              </Typography>
              <Typography color="textSecondary">
                {mindmap.description}
              </Typography>
            </CardContent>
            <IconButton aria-label="delete" onClick={(e) => {
              e.stopPropagation();
              onDeleteMindmap(mindmap.id);
            }}>
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
