import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
    { text: 'Contact Us', icon: <EmailIcon />, path: '/contact' },
  ];

  const drawer = (
    <Box
      sx={{ 
        width: 250,
        backgroundColor: theme.palette.background.default,
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Taqdeer
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(142, 90, 45, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold',
              letterSpacing: 0.5,
            }}
          >
            Taqdeer
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    width: '100%', 
                    maxWidth: '280px',
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                    overflowX: 'hidden'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'linear-gradient(to right, rgba(142, 90, 45, 0.1), rgba(20, 20, 20, 0))'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #8E5A2D 30%, #D4AF37 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Taqdeer
                  </Typography>
                  <IconButton 
                    onClick={handleMobileMenuClose} 
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ p: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Button 
                          key={item.text}
                          component={Link} 
                          to={item.path} 
                          color="inherit" 
                          onClick={handleMobileMenuClose}
                          sx={{ 
                            py: 2,
                            px: 2,
                            justifyContent: 'flex-start',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 0,
                            backgroundColor: isActive ? 'rgba(142, 90, 45, 0.15)' : 'transparent',
                            position: 'relative',
                            '&::before': isActive ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '4px',
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: '0 2px 2px 0'
                            } : {},
                            '&:hover': { 
                              backgroundColor: isActive ? 'rgba(142, 90, 45, 0.2)' : 'rgba(142, 90, 45, 0.1)'
                            }
                          }}
                          startIcon={
                            <Box component="span" sx={{ 
                              color: isActive ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.6)',
                              fontSize: '1.2rem'
                            }}>
                              {item.icon}
                            </Box>
                          }
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: isActive ? 'bold' : 'normal',
                              color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)'
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={
                      <Box component="span" sx={{ 
                        color: isActive ? theme.palette.primary.main : 'inherit'
                      }}>
                        {item.icon}
                      </Box>
                    }
                    sx={{ 
                      ml: 1, 
                      color: isActive ? theme.palette.primary.main : 'text.primary',
                      fontWeight: isActive ? 'bold' : 'normal',
                      position: 'relative',
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: '10%',
                        right: '10%',
                        bottom: '5px',
                        height: '2px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '1px'
                      } : {},
                      '&:hover': {
                        backgroundColor: 'rgba(142, 90, 45, 0.1)',
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 