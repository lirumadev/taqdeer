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
import api from '../api'; // Import the API client instead of axios
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PrayingHandsIcon from '@mui/icons-material/PanTool'; // Using PanTool as praying hands

// Lazy load the DuaImageGenerator component
const DuaImageGenerator = lazy(() => import('../components/DuaImageGenerator'));

const Home = () => {
  const [query, setQuery] = useState('');
  const [dua, setDua] = useState(null);
  const [ruling, setRuling] = useState(null);
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
  const [apiError, setApiError] = useState(false);
  const [searchMode, setSearchMode] = useState('ruling'); // Changed default to 'ruling'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const duaCardRef = useRef(null);

  // Track unique visitor and fetch stats
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Only track if this is a new session
        if (!sessionStorage.getItem('visited')) {
          await api.post('/api/stats/visitor');
          sessionStorage.setItem('visited', 'true');
        }
        
        // Fetch current stats
        const response = await api.get('/api/stats');
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

  const handleSearchModeChange = (event, newMode) => {
    if (newMode !== null) {
      setSearchMode(newMode);
      setDua(null);
      setRuling(null);
      setError(null);
      setQuery(''); // Clear the input field when switching modes
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!query.trim()) {
      setSnackbarMessage('Please enter a question');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    setDua(null);
    setRuling(null);
    setError(null);
    setApiError(false);
    
    try {
      // Track visitor (don't wait for response)
      api.post('/api/stats/visitor').catch(err => console.error('Error tracking visitor:', err));
      
      // Generate response based on search mode
      const endpoint = searchMode === 'dua' ? '/api/dua/generate' : '/api/ruling/search';
      const response = await api.post(endpoint, { query });
      
      if (searchMode === 'dua') {
        setDua(response.data);
      } else {
        setRuling(response.data);
      }
      setLoading(false);
      
      // Scroll to the result after a short delay
      setTimeout(() => {
        if (duaCardRef.current) {
          const rect = duaCardRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 80;
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }, 200);
    } catch (error) {
      console.error('Error generating response:', error);
      setLoading(false);
      
      if (error.isTimeout) {
        setError('Request took longer than expected. Please try again.');
      } else if (error.message === 'Network Error') {
        setApiError(true);
      } else {
        setError(error.message || 'Failed to generate response. Please try again.');
      }
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
    
    // Show the image generator component without the redundant snackbar
    setShowImageGenerator(true);
    
    // Track the share event
    try {
      api.post('/api/stats/shared');
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
    
    // Check if it's a Quran reference - updated regex to be more flexible
    const quranMatch = source.match(/(?:Quran|Qur'an|القرآن)\s*(\d+):(\d+)/i);
    if (quranMatch) {
      const [_, surah, ayah] = quranMatch;
      return {
        url: `https://quran.com/${surah}/${ayah}`,
        label: 'View on Quran.com',
        isQuran: true
      };
    }
    
    // Check for Sahih Bukhari
    const bukhariMatch = source.match(/Sahih al-Bukhari\s+(\d+)/i) || source.match(/Bukhari\s+(\d+)/i);
    if (bukhariMatch) {
      const [_, hadithNumber] = bukhariMatch;
      return {
        url: `https://sunnah.com/bukhari:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Sahih Muslim
    const muslimMatch = source.match(/Sahih Muslim\s+(\d+)/i) || source.match(/Muslim\s+(\d+)/i);
    if (muslimMatch) {
      const [_, hadithNumber] = muslimMatch;
      return {
        url: `https://sunnah.com/muslim:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Sunan Abu Dawood
    const abuDawoodMatch = source.match(/Sunan Abu Da(w|v)ood\s+(\d+)/i) || source.match(/Abu Da(w|v)ood\s+(\d+)/i);
    if (abuDawoodMatch) {
      const hadithNumber = abuDawoodMatch[2];
      return {
        url: `https://sunnah.com/abudawud:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Jami at-Tirmidhi
    const tirmidhiMatch = source.match(/Jami[' ]at-Tirmidhi\s+(\d+)/i) || source.match(/Tirmidhi\s+(\d+)/i);
    if (tirmidhiMatch) {
      const [_, hadithNumber] = tirmidhiMatch;
      return {
        url: `https://sunnah.com/tirmidhi:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Sunan an-Nasa'i
    const nasaiMatch = source.match(/Sunan an-Nasa['i]\s+(\d+)/i) || source.match(/Nasa['i]\s+(\d+)/i);
    if (nasaiMatch) {
      const [_, hadithNumber] = nasaiMatch;
      return {
        url: `https://sunnah.com/nasai:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Sunan Ibn Majah
    const ibnMajahMatch = source.match(/Sunan Ibn Majah\s+(\d+)/i) || source.match(/Ibn Majah\s+(\d+)/i);
    if (ibnMajahMatch) {
      const [_, hadithNumber] = ibnMajahMatch;
      return {
        url: `https://sunnah.com/ibnmajah:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Muwatta Malik
    const malikMatch = source.match(/Muwatta Malik\s+(\d+)/i) || source.match(/Malik\s+(\d+)/i);
    if (malikMatch) {
      const [_, hadithNumber] = malikMatch;
      return {
        url: `https://sunnah.com/malik:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Check for Riyad as-Salihin
    const riyadMatch = source.match(/Riyad as-Salihin\s+(\d+)/i);
    if (riyadMatch) {
      const [_, hadithNumber] = riyadMatch;
      return {
        url: `https://sunnah.com/riyadussalihin:${hadithNumber}`,
        label: 'View on Sunnah.com',
        isQuran: false
      };
    }
    
    // Generic hadith search as fallback
    const genericHadithMatch = source.match(/hadith/i);
    if (genericHadithMatch) {
      // Create a search query from the source text
      const searchQuery = encodeURIComponent(source.replace(/\|.*$/, '').trim());
      return {
        url: `https://sunnah.com/search?q=${searchQuery}`,
        label: 'Search on Sunnah.com',
        isQuran: false
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
      await api.post('/api/feedback', feedbackData);
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
        title="Taqdeer - Authentic Islamic Rulings & Du'a Guide"
        description="Find authentic Islamic rulings and du'as from Quran and Hadith. Get verified answers about Islamic practices and supplications with scholarly references."
        canonicalUrl="https://taqdeer.app/"
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
            },
            "author": {
              "@type": "Person",
              "name": "Muslim Developer from Malaysia",
              "url": "https://taqdeer.app/about"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://taqdeer.app/?query={search_term_string}"
              },
              "query-input": "required name=search_term_string"
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
            Your Trusted Guide to Islamic Rulings & Knowledge
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
            Discover authentic answers about Islamic practices from verified Quran and Hadith sources, with clear explanations and scholarly guidance.
          </Typography>
          
          {/* Search Mode Toggle - Reordered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={searchMode}
              exclusive
              onChange={handleSearchModeChange}
              aria-label="search mode"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                '& .MuiToggleButton-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: '#8E5A2D',
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                  },
                },
              }}
            >
              <ToggleButton value="ruling" aria-label="ruling search">
                <MenuBookIcon sx={{ mr: 1 }} />
                Islamic Rulings
              </ToggleButton>
              <ToggleButton value="dua" aria-label="dua search">
                <PrayingHandsIcon sx={{ mr: 1 }} />
                Du'a Search
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Example Questions */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: 1,
              mt: 3,
              mb: 2
            }}
          >
            {searchMode === 'ruling' ? (
              <>
                <Chip 
                  label="Is music allowed in Islam?" 
                  size="small" 
                  onClick={() => setQuery("Is music allowed in Islam?")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
                <Chip 
                  label="How to perform wudu correctly?" 
                  size="small" 
                  onClick={() => setQuery("How to perform wudu correctly?")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
                <Chip 
                  label="Can I pray while sitting?" 
                  size="small" 
                  onClick={() => setQuery("Can I pray while sitting?")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
              </>
            ) : (
              <>
                <Chip 
                  label="Du'a for anxiety" 
                  size="small" 
                  onClick={() => setQuery("Du'a for anxiety")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
                <Chip 
                  label="Du'a before exam" 
                  size="small" 
                  onClick={() => setQuery("Du'a before exam")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
                <Chip 
                  label="Du'a for parents" 
                  size="small" 
                  onClick={() => setQuery("Du'a for parents")}
                  sx={{ 
                    backgroundColor: 'rgba(142, 90, 45, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(142, 90, 45, 0.2)' }
                  }}
                />
              </>
            )}
          </Box>

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
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={searchMode === 'dua' 
                  ? "e.g., I need strength for an exam, I'm feeling anxious..."
                  : "e.g., Is cutting nails on Monday a sunnah? What is the ruling on..."
                }
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
                    searchMode === 'dua' ? 'Find Du\'a' : 'Search Ruling'
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

        {apiError && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mt: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 0, 0, 0.05)',
              border: '1px solid rgba(255, 0, 0, 0.1)'
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Server Connection Error
            </Typography>
            <Typography variant="body1" paragraph>
              We're unable to connect to our servers at the moment. This could be due to:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Temporary server maintenance
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Network connectivity issues
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  High server load
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please try again in a few minutes. If the problem persists, please contact us.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Paper>
        )}

        {/* Results Section */}
        {(dua || ruling) && (
          <Card 
            id="result-card"
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
                {dua ? (dua.title || "Du'a for " + query) : (ruling.title || "Ruling on " + query)}
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
              {dua ? (
                <>
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
                        <MenuBookIcon 
                          sx={{ 
                            mr: 1, 
                            color: dua.source?.toLowerCase().includes('quran') ? '#4CAF50' : '#8E5A2D', 
                            flexShrink: 0 
                          }} 
                        />
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
                              color: dua.source?.toLowerCase().includes('quran') ? '#4CAF50' : theme.palette.primary.light,
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
                </>
              ) : ruling && (
                <>
                  {/* Main Summary Section */}
                  <Box 
                    sx={{ 
                      mb: 4,
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(142, 90, 45, 0.1)',
                      border: '1px solid rgba(142, 90, 45, 0.2)',
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {ruling.summary}
                    </Typography>
                  </Box>

                  {/* Evidences Section */}
                  {ruling.evidences?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        <MenuBookIcon />
                        Evidence from Quran and Sunnah
                      </Typography>
                      
                      {ruling.evidences.map((evidence, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            mb: 2,
                            p: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                          }}
                        >
                          {/* Arabic Text */}
                          {evidence.arabic && (
                            <Typography 
                              variant="h6" 
                              align="right" 
                              paragraph
                              className="arabic-text"
                              sx={{ 
                                mb: 2,
                                lineHeight: 2,
                                fontSize: '1.8rem',
                                color: theme.palette.primary.light
                              }}
                            >
                              {evidence.arabic}
                            </Typography>
                          )}
                          
                          {/* Translation */}
                          <Typography 
                            variant="body1" 
                            paragraph
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.9)',
                              mb: 3,
                              lineHeight: 1.8
                            }}
                          >
                            {evidence.translation}
                          </Typography>
                          
                          {/* Source and Grade */}
                          <Box 
                            sx={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              pt: 1,
                              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                              <MenuBookIcon 
                                fontSize="small" 
                                sx={{ 
                                  color: evidence.source?.toLowerCase().includes('quran') ? '#4CAF50' : '#8E5A2D' 
                                }} 
                              />
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                              >
                                {evidence.source}
                              </Typography>
                              {generateReferenceLink(evidence.source) && (
                                <Link
                                  href={generateReferenceLink(evidence.source).url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: evidence.source?.toLowerCase().includes('quran') ? '#4CAF50' : theme.palette.primary.light,
                                    textDecoration: 'none',
                                    fontSize: '0.8rem',
                                    ml: 1,
                                    '&:hover': {
                                      textDecoration: 'underline',
                                    }
                                  }}
                                >
                                  {generateReferenceLink(evidence.source).label}
                                  <LaunchIcon sx={{ ml: 0.5, fontSize: '0.9rem' }} />
                                </Link>
                              )}
                            </Box>
                            {evidence.grade && !evidence.source?.toLowerCase().includes('quran') && (
                              <Chip 
                                label={evidence.grade}
                                size="small"
                                color={getHadithGradeColor(evidence.grade)}
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {/* Scholars' Opinions Section */}
                  {ruling.scholarOpinions?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        <PersonIcon />
                        Scholarly Views
                      </Typography>
                      
                      {ruling.scholarOpinions.map((opinion, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            mb: 2,
                            p: 2.5,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            color="primary"
                            sx={{ mb: 1 }}
                          >
                            {opinion.scholar}
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.8)',
                              lineHeight: 1.7
                            }}
                          >
                            {opinion.opinion}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {/* Additional Notes Section */}
                  {ruling.notes && (
                    <Box 
                      sx={{ 
                        mb: 4,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        <FormatQuoteIcon />
                        Important Notes
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.7
                        }}
                      >
                        {ruling.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* References Section */}
                  {ruling.references?.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="subtitle2" 
                        color="primary" 
                        gutterBottom
                      >
                        Additional References:
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 1
                        }}
                      >
                        {ruling.references.map((reference, index) => (
                          <Chip
                            key={index}
                            label={reference}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(142, 90, 45, 0.1)',
                              borderColor: 'rgba(142, 90, 45, 0.2)',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Feedback Section */}
                  <Box 
                    sx={{ 
                      mt: 4,
                      pt: 2,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      Note: For complex matters, please consult with a qualified scholar in your area.
                    </Typography>
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
                </>
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