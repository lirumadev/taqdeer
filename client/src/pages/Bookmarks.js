import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Bookmarks = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Bookmarked Du'as
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="body1">
            You haven't bookmarked any du'as yet. When you find a du'a you like, click the bookmark icon to save it here.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Bookmarks; 