import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Stack,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import html2canvas from 'html2canvas';
import api from '../api'; // Import the API client if needed

/**
 * Component for generating shareable images from du'a content
 */
const DuaImageGenerator = ({ dua, onSuccess, onError, onClose }) => {
  const [generating, setGenerating] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Generate image automatically when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      generateImage();
    }, 100); // Small delay to ensure component is fully mounted
    
    return () => clearTimeout(timer);
  }, []);

  const generateImage = async () => {
    if (!dua || !containerRef.current) return;
    
    setGenerating(true);
    
    try {
      // Generate the image
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: '#121212',
        logging: false,
        allowTaint: true,
        useCORS: true,
      });
      
      // Convert to image
      const image = canvas.toDataURL('image/png');
      setImageUrl(image);
      setDialogOpen(true);
      setGenerating(false); // Ensure generating state is set to false
      
      if (onSuccess) onSuccess(image);
    } catch (error) {
      console.error('Error generating image:', error);
      setGenerating(false); // Ensure generating state is set to false even on error
      if (onError) onError(error);
    }
  };

  const handleSaveImage = () => {
    if (!imageUrl) return;
    
    const fileName = `${dua.title ? dua.title.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '') : 'Taqdeer_Dua'}.png`;
    
    // Create download link
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!imageUrl || !imageRef.current) return;
    
    try {
      // For modern browsers
      if (navigator.clipboard && navigator.clipboard.write) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }
      
      // Fallback for older browsers
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    } catch (err) {
      console.error('Failed to copy image: ', err);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  // This component renders a hidden version of the du'a optimized for image capture
  return (
    <>
      {/* Hidden container for image generation */}
      <Box 
        ref={containerRef}
        sx={{ 
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '600px',
          backgroundColor: '#121212',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'none',
        }}
      >
        {/* Title */}
        <Box 
          sx={{ 
            p: 2,
            background: 'linear-gradient(to right, rgba(142, 90, 45, 0.2), rgba(20, 20, 20, 0.8))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography 
            variant="h6" 
            color="#8E5A2D"
            sx={{ fontWeight: 'bold' }}
          >
            {dua.title}
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Narrator */}
          {dua.narrator && (
            <Box 
              sx={{ 
                p: 1.5, 
                mb: 2,
                borderRadius: 2, 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>
                Narrated by {dua.narrator}:
              </Typography>
            </Box>
          )}
          
          {/* Context */}
          {dua.context && (
            <Typography 
              variant="body2" 
              paragraph 
              sx={{ 
                fontStyle: 'italic',
                mb: 2,
                color: 'rgba(255,255,255,0.8)',
                pl: 2,
                borderLeft: '2px solid rgba(142, 90, 45, 0.3)',
              }}
            >
              {dua.context}
            </Typography>
          )}
          
          {/* Arabic */}
          {dua.arabic && (
            <Box
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography 
                variant="h5" 
                align="right" 
                sx={{ 
                  fontFamily: '"Scheherazade New", serif',
                  fontSize: '1.8rem',
                  lineHeight: 2,
                  direction: 'rtl',
                  color: 'white',
                }}
              >
                {dua.arabic}
              </Typography>
            </Box>
          )}
          
          {/* Transliteration */}
          {dua.transliteration && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="#8E5A2D" gutterBottom>
                Transliteration:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontStyle: 'italic', 
                  color: 'rgba(255,255,255,0.9)',
                  pl: 2,
                  borderLeft: '2px solid rgba(142, 90, 45, 0.5)',
                }}
              >
                {dua.transliteration}
              </Typography>
            </Box>
          )}
          
          {/* Translation */}
          {dua.translation && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="#8E5A2D" gutterBottom>
                Translation:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  pl: 2,
                  borderLeft: '2px solid rgba(142, 90, 45, 0.5)',
                }}
              >
                {dua.translation}
              </Typography>
            </Box>
          )}
          
          {/* Source */}
          {dua.source && (
            <Box 
              sx={{ 
                p: 1.5, 
                mt: 2,
                borderRadius: 2, 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Source: {dua.source}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Branding */}
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
            backgroundColor: '#0a0a0a',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
            Generated by Taqdeer.app
          </Typography>
        </Box>
      </Box>
      
      {/* Dialog to display the generated image */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
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
          <Typography variant="h6" color="primary">Share Du'a</Typography>
          <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 2, mt: 1 }}>
          {generating ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 4 
            }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Generating image...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              p: 1,
              backgroundColor: '#0a0a0a',
              borderRadius: 1,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <img 
                ref={imageRef}
                src={imageUrl} 
                alt="Generated Du'a" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: 4,
                }} 
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyImage}
              disabled={generating || !imageUrl}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleSaveImage}
              disabled={generating || !imageUrl}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DuaImageGenerator; 