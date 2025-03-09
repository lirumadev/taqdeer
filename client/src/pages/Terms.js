import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SEO from '../components/SEO';

const Terms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        title="Terms of Service - Taqdeer"
        description="Read Taqdeer's terms of service to understand the rules and guidelines for using our Islamic du'a generator application."
        canonicalUrl="/terms"
        keywords="taqdeer terms of service, islamic app terms, dua generator guidelines"
      />
      
      <Container maxWidth="md">
        {/* Hero Section */}
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
            Terms of Service
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
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        <Paper 
          elevation={3}
          sx={{
            p: 4,
            mb: 5,
            background: 'linear-gradient(to right bottom, rgba(30, 30, 30, 0.7), rgba(20, 20, 20, 0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }}
        >
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Welcome to Taqdeer. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            By accessing or using Taqdeer, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Taqdeer is an AI-powered du'a generator that provides Islamic supplications from the Quran and authentic hadith based on user queries. While we strive for accuracy, we cannot guarantee that all generated content is 100% accurate or applicable to all situations.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            3. Islamic Content Disclaimer
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The du'as provided by Taqdeer are generated using AI technology based on authentic Islamic sources. However:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="We do not claim to provide religious rulings (fatwas) or replace scholarly guidance." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Users should verify important religious information with qualified Islamic scholars." />
            </ListItem>
            <ListItem>
              <ListItemText primary="The service is intended as a helpful resource, not as a definitive religious authority." />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            4. User Responsibilities
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            As a user of Taqdeer, you agree to:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="Use the service in accordance with Islamic ethics and principles" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not use the service for any unlawful purpose" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide feedback that is respectful and constructive" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not attempt to manipulate, hack, or disrupt the service" />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            5. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The content, features, and functionality of Taqdeer, including but not limited to text, graphics, logos, and software, are owned by or licensed to Taqdeer and are protected by copyright, trademark, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The Quranic verses and hadith provided through our service are from Islamic sources and should be treated with respect. You may share and use the du'as for personal and educational purposes.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Taqdeer and its developers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            7. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Our service may use third-party services, such as OpenAI's API. Your use of Taqdeer is also subject to any applicable third-party terms and conditions.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            8. Modifications to Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            10. Governing Law
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the service is operated, without regard to its conflict of law provisions.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            11. Contact Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            If you have any questions about these Terms, please contact us through our Contact page.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms; 