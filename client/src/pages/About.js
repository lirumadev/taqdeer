import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import MosqueIcon from '@mui/icons-material/Mosque';
import TranslateIcon from '@mui/icons-material/Translate';
import SEO from '../components/SEO';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Authentic Sources',
      description: 'All du\'as are sourced from the Quran and sahih (authentic) hadith collections.',
      icon: <MenuBookIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    },
    {
      title: 'Accurate Translations',
      description: 'Carefully translated to preserve the original meaning and context.',
      icon: <TranslateIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    },
    {
      title: 'Privacy Focused',
      description: 'Your queries are never stored or shared with third parties.',
      icon: <SecurityIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
    }
  ];

  const principles = [
    'Adherence to authentic Islamic sources',
    'Respect for diverse Islamic scholarly opinions',
    'Commitment to accuracy in translation',
    'Accessibility for Muslims of all backgrounds',
    'Continuous improvement based on user feedback'
  ];

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
        title="About Taqdeer - Our Mission and Values"
        description="Learn about Taqdeer's mission to provide authentic Islamic du'as from Quran and Hadith. Discover our commitment to accuracy, authenticity, and accessibility."
        canonicalUrl="/about"
        keywords="about taqdeer, islamic dua app, authentic hadith, quran supplications, islamic technology"
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Taqdeer",
            "description": "Learn about Taqdeer's mission to provide authentic Islamic du'as from Quran and Hadith",
            "mainEntity": {
              "@type": "Organization",
              "name": "Taqdeer",
              "description": "AI-Powered Islamic Du'a Generator providing authentic supplications from Quran and Hadith",
              "url": "https://taqdeer.app",
              "sameAs": [
                "https://github.com/taqdeer-app"
              ]
            }
          })}
        </script>
      </SEO>
      
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
            About Taqdeer
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
            Discover our mission to make authentic Islamic du'as accessible to everyone through modern technology.
          </Typography>
        </Box>

        {/* Our Mission Section */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MosqueIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" color="primary">Our Mission</Typography>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
            Taqdeer was created with a simple yet profound mission: to help Muslims connect with their faith through authentic du'as (supplications) that are relevant to their daily lives and challenges.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            In a world where misinformation is common, we strive to provide a reliable source of Islamic supplications directly from the Quran and authentic hadith collections. Our AI-powered platform makes it easy to find the right du'a for any situation, while ensuring accuracy and authenticity.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Our Guiding Principles
            </Typography>
            <List>
              {principles.map((principle, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={principle} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      color: 'text.secondary'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        {/* Features Section */}
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ 
            mb: 4,
            color: theme.palette.primary.light,
            fontWeight: 'medium'
          }}
        >
          What Makes Taqdeer Special
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(to right bottom, rgba(30, 30, 30, 0.7), rgba(20, 20, 20, 0.9))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Technology Section */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CodeIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" color="primary">Our Technology</Typography>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Taqdeer combines modern AI technology with traditional Islamic scholarship. Our platform uses advanced natural language processing to understand your needs and match them with relevant du'as from authentic sources.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We continuously refine our system based on user feedback and scholarly input to ensure the highest level of accuracy and relevance. Our commitment to technological excellence is matched only by our dedication to Islamic authenticity.
          </Typography>
        </Paper>

        {/* Team/Creator Section */}
        <Box textAlign="center" sx={{ mt: 6, mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              color: theme.palette.primary.light,
              fontWeight: 'medium'
            }}
          >
            Created with Faith & Technology
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
            Taqdeer was created by a solo Muslim developer from Malaysia 🇲🇾 with a passion for combining technology with Islamic knowledge.
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 3 }}>
            "Our goal is to make it easy for every Muslim to find the right du'a for any moment in their life, directly from authentic sources."
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About; 