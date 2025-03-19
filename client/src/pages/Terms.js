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
        title="Terms of Service - Taqdeer | Islamic Rulings & Du'a Platform"
        description="Read Taqdeer's terms of service to understand how we provide authentic Islamic rulings and du'as while protecting your privacy and maintaining Islamic principles."
        canonicalUrl="https://taqdeer.app/terms"
        keywords="islamic rulings terms, islamic app guidelines, taqdeer terms of service, halal app terms, islamic platform rules, shariah compliant service"
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
            Welcome to Taqdeer. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            By accessing or using Taqdeer, you acknowledge that you have read, understood, and agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please refrain from using our service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Taqdeer is a platform that provides access to Islamic rulings and du'as (supplications) sourced from the Quran, authentic hadith collections, and trusted scholarly works. Our service helps users find relevant Islamic guidance and supplications based on their queries.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            3. Islamic Content Disclaimer
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The rulings and du'as provided through Taqdeer are sourced from authentic Islamic references. However:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="Our service is intended as an educational resource and should not replace consultation with qualified Islamic scholars for complex matters." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Users should verify critical religious matters with local qualified scholars who can consider their specific circumstances." />
            </ListItem>
            <ListItem>
              <ListItemText primary="While we strive for accuracy, the application of rulings may vary based on individual circumstances and scholarly interpretations." />
            </ListItem>
            <ListItem>
              <ListItemText primary="The service aims to provide general guidance while acknowledging the depth and complexity of Islamic jurisprudence." />
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
              <ListItemText primary="Respect the sanctity of Islamic texts and teachings" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Share content responsibly and maintain its authenticity" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide constructive feedback to help improve the service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not misuse or attempt to manipulate the service" />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            5. Content Usage and Sharing
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The Islamic content provided through our service, including Quranic verses, hadith, and scholarly opinions, should be treated with utmost respect. You may:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="Share rulings and du'as for educational purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use the content for personal reference and learning" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Generate and share images of the content through our platform" />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            6. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            The platform's features, functionality, and original content are protected by copyright and other intellectual property laws. The Islamic texts we provide are from authentic sources and should be attributed appropriately when shared.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            7. Service Reliability
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            While we strive to maintain high availability and accuracy, we cannot guarantee uninterrupted access to our services. We regularly update our content and features to improve reliability and user experience.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            8. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Our service utilizes the OpenAI API and other trusted third-party services to process queries and provide Islamic content. Specifically:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText 
                primary="OpenAI API Integration" 
                secondary="We use OpenAI's API to help process your queries and structure responses from authentic Islamic sources. This integration is subject to OpenAI's terms of service and privacy policy." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Data Processing" 
                secondary="All query processing is done securely and in compliance with our privacy policy. We ensure that no personally identifiable information is included in API requests." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Service Quality" 
                secondary="While we use advanced technology to provide our service, all responses are based on authentic Islamic sources and are regularly reviewed for accuracy." 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Your use of Taqdeer is subject to these third-party terms and conditions, while we maintain our commitment to protecting your privacy and providing authentic Islamic content.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            9. Modifications to Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We may enhance, modify, or update our services to better serve our users. We reserve the right to make changes to the service, while striving to maintain its core functionality and value to the Muslim community.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            10. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            These Terms of Service may be updated periodically. We will notify users of significant changes through our website and update the "Last updated" date. Continued use of our service after changes indicates acceptance of the updated terms.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            11. Governing Law
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            These Terms shall be governed by and interpreted in accordance with applicable laws, while respecting Islamic principles and the diverse nature of our global Muslim community.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            12. Contact Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            If you have questions about these Terms or need clarification, please reach out through our Contact page. We are committed to addressing your concerns in a timely and transparent manner.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms; 