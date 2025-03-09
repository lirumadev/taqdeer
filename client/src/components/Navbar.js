import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const Navbar = () => {
  const location = window.location;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button 
        component={Link} 
        to="/" 
        color="inherit" 
        sx={{ 
          mr: 2,
          opacity: location.pathname === '/' ? 1 : 0.7,
          '&:hover': { opacity: 1 }
        }}
      >
        Home
      </Button>
      <Button 
        component={Link} 
        to="/about" 
        color="inherit" 
        sx={{ 
          mr: 2,
          opacity: location.pathname === '/about' ? 1 : 0.7,
          '&:hover': { opacity: 1 }
        }}
      >
        About
      </Button>
      <Button 
        component={Link} 
        to="/contact" 
        color="inherit" 
        sx={{ 
          opacity: location.pathname === '/contact' ? 1 : 0.7,
          '&:hover': { opacity: 1 }
        }}
      >
        Contact Us
      </Button>
    </Box>
  );
};

export default Navbar; 