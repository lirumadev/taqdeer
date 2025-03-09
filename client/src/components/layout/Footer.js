import React from 'react';
import { Box, Container, Typography, Link, Divider, Button, useTheme, useMediaQuery } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: isMobile ? 2 : 0 }}
          >
            © {currentYear} Taqdeer. Made with <FavoriteIcon sx={{ fontSize: 14, color: theme.palette.primary.main, verticalAlign: 'middle', mx: 0.5 }} /> for the Ummah.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<VolunteerActivismIcon />}
              component="a"
              href="https://ko-fi.com/lirumadev"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                mr: 2,
                borderColor: 'rgba(142, 90, 45, 0.5)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(142, 90, 45, 0.1)',
                }
              }}
            >
              Support Developer
            </Button>
            
            <Link 
              href="/privacy" 
              color="text.secondary"
              underline="hover"
              sx={{ mr: 2 }}
            >
              Privacy
            </Link>
            
            <Link 
              href="/terms" 
              color="text.secondary"
              underline="hover"
            >
              Terms
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 