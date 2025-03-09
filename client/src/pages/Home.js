import React, { useState, useRef, lazy, Suspense, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LaunchIcon from '@mui/icons-material/Launch';
import FlagIcon from '@mui/icons-material/Flag';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImageIcon from '@mui/icons-material/Image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import html2canvas from 'html2canvas';
import FeedbackDialog from '../components/FeedbackDialog';
import SEO from '../components/SEO';

// Lazy load the DuaImageGenerator component
const DuaImageGenerator = lazy(() => import('../components/DuaImageGenerator'));

const Home = () => {
  const [query, setQuery] = useState('');
  const [dua, setDua] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    uniqueVisitors: '0+',
    duasGenerated: '0+',
    duasShared: '0+',
    rawUniqueVisitors: 0,
    rawDuasGenerated: 0,
    rawDuasShared: 0
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const duaCardRef = useRef(null);

  // Track unique visitor and fetch stats
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Only track if this is a new session
        if (!sessionStorage.getItem('visited')) {
          await axios.post('/api/stats/visitor');
          sessionStorage.setItem('visited', 'true');
        }
        
        // Fetch current stats
        const response = await axios.get('/api/stats');
        if (response.data) {
          setStats({
            uniqueVisitors: formatNumber(response.data.uniqueVisitors),
            duasGenerated: formatNumber(response.data.duasGenerated),
            duasShared: formatNumber(response.data.duasShared),
            rawUniqueVisitors: response.data.uniqueVisitors,
            rawDuasGenerated: response.data.duasGenerated,
            rawDuasShared: response.data.duasShared
          });
        }
      } catch (error) {
        console.error('Error with stats:', error);
        // Keep the default stats if there's an error
      }
    };
    
    trackVisitor();
  }, []);
  
  // Helper function to format numbers with commas and + sign
  const formatNumber = (num) => {
    return num.toLocaleString() + '+';
  };

  // Check if we should show the stats (when any stat reaches 1000)
  const shouldShowStats = () => {
    return (
      (stats.rawUniqueVisitors >= 1000) || 
      (stats.rawDuasGenerated >= 1000) || 
      (stats.rawDuasShared >= 1000)
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/dua/generate', { query });
      setDua(response.data);
      
      // Improved scrolling to ensure the title is visible
      setTimeout(() => {
        // Try to scroll to the title first, fall back to the result card
        const titleElement = document.getElementById('dua-result-title');
        const resultElement = document.getElementById('dua-result');
        const targetElement = titleElement || resultElement;
        
        if (targetElement) {
          // Get the header height to use as offset
          const headerHeight = document.querySelector('header') ? 
            document.querySelector('header').offsetHeight : 80;
          
          // Calculate position with offset
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 20);
          
          // Scroll with smooth behavior
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 200);
    } catch (err) {
      console.error('Error generating dua:', err);
      setError('Failed to generate du\'a. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
    console.log('Bookmarking:', dua);
  };

  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleShareAsImage = () => {
    // Close the menu
    handleShareClose();
    
    if (!dua) return;
    
    setSnackbarMessage('Generating image...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    // Show the image generator component
    setShowImageGenerator(true);
    
    // Track the share event
    try {
      axios.post('/api/stats/shared');
    } catch (error) {
      console.error('Error tracking share:', error);
      // Continue even if tracking fails
    }
  };

  const handleImageGenerationSuccess = (imageUrl) => {
    // The success is now handled in the DuaImageGenerator component with the dialog
    // We don't need to show a snackbar message here anymore
    console.log('Image generated successfully');
  };

  const handleImageGenerationError = (error) => {
    setSnackbarMessage('Failed to generate image. Please try again.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    setShowImageGenerator(false);
  };
  
  const handleImageGeneratorClose = () => {
    setShowImageGenerator(false);
  };

  const handleCopyText = () => {
    // Close the menu
    handleShareClose();
    
    if (!dua) return;
    
    // Format the text nicely
    const textToCopy = `
${dua.title}

${dua.arabic}

Transliteration:
${dua.transliteration}

Translation:
${dua.translation}

Source: ${dua.source}
${dua.narrator ? `Narrated by: ${dua.narrator}` : ''}

Shared via Taqdeer.app
    `.trim();
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setSnackbarMessage('Du\'a copied to clipboard');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setSnackbarMessage('Failed to copy text');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Helper function to determine hadith grade color
  const getHadithGradeColor = (grade) => {
    if (!grade) return 'default';
    
    const gradeLower = grade.toLowerCase();
    if (gradeLower.includes('sahih') || gradeLower.includes('authentic')) return 'success';
    if (gradeLower.includes('hasan') || gradeLower.includes('good')) return 'primary';
    if (gradeLower.includes('acceptable')) return 'info';
    if (gradeLower.includes('weak') || gradeLower.includes('da\'if')) return 'warning';
    return 'default';
  };

  // Helper function to extract hadith grade from source
  const extractHadithGrade = (source) => {
    if (!source) return null;
    
    const gradeMatches = source.match(/\|\s*(Sahih|Hasan|Da'if|Weak|Good|Acceptable)/i);
    return gradeMatches ? gradeMatches[1] : null;
  };

  // Helper function to generate reference links based on source
  const generateReferenceLink = (source) => {
    if (!source) return null;
    
    // Check if it's a Quran reference
    const quranMatch = source.match(/Quran\s+(\d+):(\d+)/i);
    if (quranMatch) {
      const [_, surah, ayah] = quranMatch;
      return {
        url: `https://quran.com/${surah}/${ayah}`,
        label: 'View on Quran.com'
      };
    }
    
    // Check for Sahih Bukhari
    const bukhariMatch = source.match(/Sahih al-Bukhari\s+(\d+)/i) || source.match(/Bukhari\s+(\d+)/i);
    if (bukhariMatch) {
      const [_, hadithNumber] = bukhariMatch;
      return {
        url: `https://sunnah.com/bukhari:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Sahih Muslim
    const muslimMatch = source.match(/Sahih Muslim\s+(\d+)/i) || source.match(/Muslim\s+(\d+)/i);
    if (muslimMatch) {
      const [_, hadithNumber] = muslimMatch;
      return {
        url: `https://sunnah.com/muslim:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Sunan Abu Dawood
    const abuDawoodMatch = source.match(/Sunan Abu Da(w|v)ood\s+(\d+)/i) || source.match(/Abu Da(w|v)ood\s+(\d+)/i);
    if (abuDawoodMatch) {
      const hadithNumber = abuDawoodMatch[2];
      return {
        url: `https://sunnah.com/abudawud:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Jami at-Tirmidhi
    const tirmidhiMatch = source.match(/Jami[' ]at-Tirmidhi\s+(\d+)/i) || source.match(/Tirmidhi\s+(\d+)/i);
    if (tirmidhiMatch) {
      const [_, hadithNumber] = tirmidhiMatch;
      return {
        url: `https://sunnah.com/tirmidhi:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Sunan an-Nasa'i
    const nasaiMatch = source.match(/Sunan an-Nasa['i]\s+(\d+)/i) || source.match(/Nasa['i]\s+(\d+)/i);
    if (nasaiMatch) {
      const [_, hadithNumber] = nasaiMatch;
      return {
        url: `https://sunnah.com/nasai:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Sunan Ibn Majah
    const ibnMajahMatch = source.match(/Sunan Ibn Majah\s+(\d+)/i) || source.match(/Ibn Majah\s+(\d+)/i);
    if (ibnMajahMatch) {
      const [_, hadithNumber] = ibnMajahMatch;
      return {
        url: `https://sunnah.com/ibnmajah:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Muwatta Malik
    const malikMatch = source.match(/Muwatta Malik\s+(\d+)/i) || source.match(/Malik\s+(\d+)/i);
    if (malikMatch) {
      const [_, hadithNumber] = malikMatch;
      return {
        url: `https://sunnah.com/malik:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Check for Riyad as-Salihin
    const riyadMatch = source.match(/Riyad as-Salihin\s+(\d+)/i);
    if (riyadMatch) {
      const [_, hadithNumber] = riyadMatch;
      return {
        url: `https://sunnah.com/riyadussalihin:${hadithNumber}`,
        label: 'View on Sunnah.com'
      };
    }
    
    // Generic hadith search as fallback
    const genericHadithMatch = source.match(/hadith/i);
    if (genericHadithMatch) {
      // Create a search query from the source text
      const searchQuery = encodeURIComponent(source.replace(/\|.*$/, '').trim());
      return {
        url: `https://sunnah.com/search?q=${searchQuery}`,
        label: 'Search on Sunnah.com'
      };
    }
    
    return null;
  };

  const handleOpenFeedbackDialog = () => {
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = (success) => {
    setFeedbackDialogOpen(false);
    if (success) {
      setSnackbarMessage('Thank you for your feedback!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      // Send feedback to the server
      await axios.post('/api/feedback', feedbackData);
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return Promise.reject(error);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        pb: 4
      }}
    >
      <SEO 
        title="Taqdeer - AI-Powered Islamic Du'a Generator"
        description="Find authentic du'as from Quran and Hadith for any situation. Taqdeer uses AI to provide personalized Islamic supplications with references and translations."
        canonicalUrl="/"
        keywords="islamic dua, dua generator, islamic supplications, quran dua, hadith dua, muslim prayers, authentic duas, islamic app"
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Taqdeer",
            "url": "https://taqdeer.app",
            "description": "AI-Powered Islamic Du'a Generator providing authentic supplications from Quran and Hadith",
            "applicationCategory": "ReligiousApp",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "120"
            }
          })}
        </script>
      </SEO>
      
      <Container maxWidth="md" sx={{ mt: isMobile ? 4 : 8, mb: 4, flexGrow: 1 }}>
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
            Taqdeer
          </Typography>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            color="textSecondary" 
            gutterBottom
            sx={{ mb: 2 }}
          >
            AI-Powered Personalized Du'a Generator
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
            Describe your situation, feelings, or needs, and receive relevant du'as from the Quran and authentic Hadith.
          </Typography>
          
          {/* Credibility Indicators - Only show when threshold is reached */}
          {shouldShowStats() && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                mb: 3,
                opacity: 0.8,
                '&:hover': {
                  opacity: 1
                },
                transition: 'opacity 0.3s ease'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mx: 2,
                  px: 2,
                  borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  pb: isMobile ? 1 : 0,
                  ...(isMobile && {
                    width: '33%',
                  })
                }}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    color: theme.palette.primary.light,
                    fontWeight: 'bold'
                  }}
                >
                  {stats.uniqueVisitors}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: isMobile ? '0.7rem' : '0.75rem'
                  }}
                >
                  Unique Visitors
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mx: 2,
                  px: 2,
                  borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  pb: isMobile ? 1 : 0,
                  ...(isMobile && {
                    width: '33%',
                  })
                }}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    color: theme.palette.primary.light,
                    fontWeight: 'bold'
                  }}
                >
                  {stats.duasGenerated}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: isMobile ? '0.7rem' : '0.75rem'
                  }}
                >
                  Du'as Generated
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mx: 2,
                  px: 2,
                  ...(isMobile && {
                    width: '33%',
                  })
                }}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    color: theme.palette.primary.light,
                    fontWeight: 'bold'
                  }}
                >
                  {stats.duasShared}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: isMobile ? '0.7rem' : '0.75rem'
                  }}
                >
                  Du'as Shared
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Search Section */}
        <Card 
          elevation={4} 
          sx={{ 
            mb: 5,
            background: 'linear-gradient(to right bottom, rgba(30, 30, 30, 0.7), rgba(20, 20, 20, 0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., I need strength for an exam, I'm feeling anxious..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  size="large"
                  sx={{ 
                    minWidth: '150px',
                    borderRadius: 2,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Find Du\'a'
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 4, 
              borderRadius: 2, 
              backgroundColor: 'rgba(211, 47, 47, 0.1)', 
              border: '1px solid rgba(211, 47, 47, 0.3)' 
            }}
          >
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        )}

        {/* Results Section */}
        {dua && (
          <Card 
            id="dua-result"
            ref={duaCardRef}
            elevation={6} 
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(to right bottom, #1a1a1a, #0d0d0d)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              animation: 'fadeIn 0.5s ease-in-out',
              mb: 4,
            }}
          >
            {/* Title Bar */}
            <Box 
              id="dua-result-title"
              sx={{ 
                p: 2, 
                px: 3,
                background: 'linear-gradient(to right, rgba(142, 90, 45, 0.2), rgba(20, 20, 20, 0.8))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                {dua.title || "Du'a for " + query.charAt(0).toUpperCase() + query.slice(1)}
              </Typography>
              <Box>
                <Tooltip title="Share">
                  <IconButton onClick={handleShareClick} sx={{ color: 'white' }}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={shareAnchorEl}
                  open={Boolean(shareAnchorEl)}
                  onClose={handleShareClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleShareAsImage}>
                    <ListItemIcon>
                      <ImageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share as Image</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleCopyText}>
                    <ListItemIcon>
                      <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Text</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              {/* Narrator Information */}
              {dua.narrator && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  mb={2}
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)' 
                  }}
                >
                  <PersonIcon sx={{ mr: 1, color: '#8E5A2D' }} />
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Narrated by {dua.narrator}:
                  </Typography>
                </Box>
              )}
              
              {/* Context/Introduction */}
              {dua.context && (
                <Box 
                  sx={{ 
                    position: 'relative',
                    pl: 4,
                    pr: 2,
                    py: 2,
                    mb: 3,
                  }}
                >
                  <FormatQuoteIcon 
                    sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      color: 'rgba(142, 90, 45, 0.3)',
                      fontSize: '2rem'
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      fontStyle: 'italic',
                      mb: 0,
                      color: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    {dua.context}
                  </Typography>
                </Box>
              )}
              
              {/* Arabic Text */}
              {dua.arabic && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    align="right" 
                    paragraph 
                    className="arabic-text"
                    sx={{ 
                      fontSize: '1.8rem',
                      mb: 0,
                      lineHeight: 2,
                    }}
                  >
                    {dua.arabic}
                  </Typography>
                </Paper>
              )}
              
              {/* Transliteration */}
              {dua.transliteration && (
                <Box mb={3}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Transliteration:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
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
                <Box mb={3}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Translation:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph 
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
              
              {/* Source with Hadith Grade and Reference Link */}
              {dua.source && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    mt: 3,
                  }}
                >
                  <Box 
                    display="flex" 
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{
                      mb: generateReferenceLink(dua.source) ? 1 : 0,
                    }}
                  >
                    <MenuBookIcon sx={{ mr: 1, color: '#8E5A2D', flexShrink: 0 }} />
                    <Typography 
                      variant="body2" 
                      color="rgba(255,255,255,0.7)"
                      sx={{ flexGrow: 1 }}
                    >
                      {dua.source}
                    </Typography>
                    
                    {extractHadithGrade(dua.source) && (
                      <Chip 
                        label={extractHadithGrade(dua.source)} 
                        size="small" 
                        color={getHadithGradeColor(extractHadithGrade(dua.source))}
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem', flexShrink: 0 }}
                      />
                    )}
                  </Box>
                  
                  {/* Reference Link and Report Error */}
                  <Box 
                    sx={{ 
                      mt: 1, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      pt: 1,
                    }}
                  >
                    {generateReferenceLink(dua.source) && (
                      <Link
                        href={generateReferenceLink(dua.source).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: theme.palette.primary.light,
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        {generateReferenceLink(dua.source).label}
                        <LaunchIcon sx={{ ml: 0.5, fontSize: '0.9rem' }} />
                      </Link>
                    )}
                    
                    <Link
                      component="button"
                      onClick={handleOpenFeedbackDialog}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'rgba(255, 255, 255, 0.8)',
                        }
                      }}
                    >
                      <FlagIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                      Report an issue
                    </Link>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Image Generator */}
      {showImageGenerator && (
        <Suspense fallback={<CircularProgress />}>
          <DuaImageGenerator 
            dua={dua} 
            onSuccess={handleImageGenerationSuccess}
            onError={handleImageGenerationError}
            onClose={handleImageGeneratorClose}
          />
        </Suspense>
      )}
      
      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedbackDialog}
        onSubmit={handleSubmitFeedback}
        dua={dua}
      />
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home; 