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

const Privacy = () => {
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
        title="Privacy Policy - Taqdeer"
        description="Learn how Taqdeer protects your privacy and handles your data. Our privacy policy explains what information we collect and how we use it."
        canonicalUrl="/privacy"
        keywords="taqdeer privacy policy, islamic app privacy, dua generator data protection"
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
            Privacy Policy
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
            At Taqdeer, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Du'a Queries:</strong> When you use our du'a generator, we process your queries to provide relevant du'as. These queries are not stored with any personally identifiable information.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Feedback Information:</strong> If you submit feedback about a du'a, we collect the feedback type, your comments, and the du'a data to improve our service.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Contact Information:</strong> When you contact us through our contact form, we collect your name, email address, and message content.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Usage Data:</strong> We collect anonymous usage data such as browser type, device information, and pages visited to improve our service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            How We Use Your Information
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="To provide and maintain our service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To improve the accuracy and relevance of du'as" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To respond to your inquiries and support requests" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To monitor usage patterns and improve user experience" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To address technical issues and maintain security" />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We use OpenAI's API to generate du'as. Your queries are processed according to OpenAI's privacy policy. We do not share your personal information with OpenAI or other third parties except as necessary to provide our services.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We use cookies and similar tracking technologies to enhance your experience on our website. You can set your browser to refuse all or some browser cookies, but this may affect certain features of our service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Our service is not directed to anyone under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            If you have any questions about this Privacy Policy, please contact us through our Contact page.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy; 