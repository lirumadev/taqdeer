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
        title="Privacy Policy - Taqdeer | Secure Islamic Guidance Platform"
        description="Learn how Taqdeer protects your privacy while providing authentic Islamic rulings and du'as. We prioritize data security and respect Islamic principles in handling your information."
        canonicalUrl="https://taqdeer.app/privacy"
        keywords="islamic app privacy, muslim data protection, taqdeer privacy policy, secure islamic platform, halal app privacy, shariah compliant privacy"
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
            <strong>Search Queries:</strong> When you use our Islamic rulings search or du'a search features, we process your queries to provide relevant responses. These queries are processed securely and are not stored with any personally identifiable information.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Feedback Information:</strong> If you submit feedback about a ruling or du'a, we collect the feedback type, your comments, and the associated content to improve our service and accuracy.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Usage Statistics:</strong> We collect anonymous usage statistics such as the number of searches performed and content shared to improve our service quality. This data is aggregated and contains no personal information.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Technical Data:</strong> We collect basic technical information such as browser type, device information, and pages visited to ensure optimal performance and compatibility.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            How We Use Your Information
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText primary="To provide accurate Islamic rulings and du'as based on your queries" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To improve the relevance and accuracy of our search results" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To enhance the user experience and interface" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To maintain and improve our service performance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To ensure the security and reliability of our platform" />
            </ListItem>
          </List>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We implement industry-standard security measures to protect your information. Your queries and feedback are processed securely, and we do not store personally identifiable information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We use trusted third-party services to process search queries and maintain our platform, including:
          </Typography>
          <List sx={{ color: 'text.secondary' }}>
            <ListItem>
              <ListItemText 
                primary="OpenAI API" 
                secondary="Used to process search queries and generate structured responses. Queries are processed securely and are not used for any purpose other than providing relevant Islamic content. No personal information is shared with OpenAI." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Infrastructure Services" 
                secondary="We use reliable hosting and database services to ensure platform stability and data security." 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            These services are carefully selected and bound by strict privacy requirements. We do not share your personal information with third parties except as necessary to provide our services.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Cookies and Local Storage
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We use cookies and local storage to enhance your experience and maintain your preferences. These are used to remember your settings and improve performance. You can manage cookie preferences through your browser settings, though this may affect certain features of our service.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Content Sharing
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            When you choose to share rulings or du'as, the shared content includes only the Islamic knowledge and references, never your personal information or search history. Image sharing features generate new images without storing personal data.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            While our content is suitable for all ages, our service is not specifically directed to children under 13. We do not knowingly collect or maintain information from children under 13. If you believe a child has provided us with personal information, please contact us for immediate removal.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Updates to Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We may update this Privacy Policy as our services evolve. Any changes will be posted on this page with an updated date. Significant changes will be notified through our website. Your continued use of our service after changes indicates acceptance of the updated policy.
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            If you have questions about this Privacy Policy or how we handle your information, please contact us through our Contact page. We are committed to addressing your concerns promptly and transparently.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy; 