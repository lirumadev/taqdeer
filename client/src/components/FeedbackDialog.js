import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api'; // Import the API client if needed

/**
 * Dialog component for collecting user feedback about errors in du'a results
 */
const FeedbackDialog = ({ open, onClose, onSubmit, dua }) => {
  // No direct API calls in this component, it uses the onSubmit prop
  // which we've already updated in the Home component
  
  const [feedbackType, setFeedbackType] = useState('incorrect_translation');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please provide some details about the issue');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        feedbackType,
        comment,
        duaData: dua
      });
      
      // Reset form
      setComment('');
      setFeedbackType('incorrect_translation');
      onClose(true); // Close with success flag
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setComment('');
    setFeedbackType('incorrect_translation');
    setError('');
    onClose(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: '#1a1a1a',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 1
      }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', color: '#fff' }}>Report an Issue</Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Thank you for helping us improve Taqdeer. Please let us know what's wrong with this du'a.
        </Typography>
        
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel 
            component="legend" 
            sx={{ 
              color: '#fff !important', 
              fontWeight: 'medium', 
              mb: 1,
              '&.Mui-focused': {
                color: '#fff !important'
              }
            }}
          >
            What type of issue are you reporting?
          </FormLabel>
          <RadioGroup
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
          >
            <FormControlLabel value="incorrect_translation" control={<Radio />} label="Incorrect translation" />
            <FormControlLabel value="incorrect_arabic" control={<Radio />} label="Incorrect Arabic text" />
            <FormControlLabel value="incorrect_reference" control={<Radio />} label="Incorrect reference or source" />
            <FormControlLabel value="irrelevant_dua" control={<Radio />} label="Du'a not relevant to my query" />
            <FormControlLabel value="other" control={<Radio />} label="Other issue" />
          </RadioGroup>
        </FormControl>
        
        <TextField
          label="Additional Details"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please provide more details about the issue..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }
          }}
        />
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        justifyContent: 'space-between'
      }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog; 