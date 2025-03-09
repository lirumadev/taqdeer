import React from 'react';
import { Container, Typography, Paper, Box, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Divider } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Language Preferences
        </Typography>
        <Box mb={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Display Language</FormLabel>
            <RadioGroup defaultValue="english" name="language-group">
              <FormControlLabel value="english" control={<Radio />} label="English" />
              <FormControlLabel value="arabic" control={<Radio />} label="Arabic" />
              <FormControlLabel value="urdu" control={<Radio />} label="Urdu" />
            </RadioGroup>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Display Options
        </Typography>
        <Box mb={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Show</FormLabel>
            <RadioGroup defaultValue="all" name="display-group">
              <FormControlLabel value="all" control={<Radio />} label="Arabic, Transliteration, and Translation" />
              <FormControlLabel value="arabic-translation" control={<Radio />} label="Arabic and Translation only" />
              <FormControlLabel value="translation" control={<Radio />} label="Translation only" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 