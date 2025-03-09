import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Send the form data to the server
      const response = await axios.post('/api/contact', formData);
      
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        py: 6
      }}
    >
      <SEO 
        title="Contact Taqdeer - Get in Touch With Us"
        description="Have questions or feedback about Taqdeer? Contact our team for support, suggestions, or to report issues with our Islamic du'a generator."
        canonicalUrl="/contact"
        keywords="contact taqdeer, islamic app support, dua generator feedback, islamic technology help"
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Taqdeer",
            "description": "Get in touch with the Taqdeer team",
            "mainEntity": {
              "@type": "Organization",
              "name": "Taqdeer",
              "email": "support@taqdeer.app",
              "url": "https://taqdeer.app/contact",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@taqdeer.app",
                "url": "https://taqdeer.app/contact"
              }
            }
          })}
        </script>
      </SEO>
      
      <Container maxWidth="md">
        <Box 
          textAlign="center" 
          mb={6}
          sx={{
            animation: 'fadeIn 0.8s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #8E5A2D 30%, #D4AF37 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Have questions, suggestions, or feedback about Taqdeer? We'd love to hear from you!
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(to right bottom, rgba(30, 30, 30, 0.7), rgba(20, 20, 20, 0.9))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" color="primary">Get in Touch</Typography>
              </Box>
              
              <Typography variant="body2" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
                We value your input and strive to improve Taqdeer based on your feedback. Whether you have suggestions for new features, found a bug, or just want to say hello, please don't hesitate to reach out.
              </Typography>
              
              <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
                Our team is dedicated to providing authentic Islamic content and a seamless user experience. Your feedback helps us fulfill this mission.
              </Typography>
              
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={3}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 3,
                background: 'linear-gradient(to right bottom, rgba(30, 30, 30, 0.7), rgba(20, 20, 20, 0.9))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Send a Message
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={5}
                    variant="outlined"
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      py: 1,
                      px: 4
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 