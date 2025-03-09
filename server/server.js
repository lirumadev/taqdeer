const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { Configuration, OpenAIApi } = require('openai');
const OpenAI = require('openai');
const http = require('http');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue running with limited functionality');
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://taqdeer.vercel.app',
    'https://taqdeer-app.vercel.app',
    'https://taqdeer.app',
    'https://www.taqdeer.app',
    'https://taqdeer-git-main-lirumadevs-projects.vercel.app',
    // Allow requests from any subdomain of vercel.app
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  // Add more detailed CORS configuration
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));
app.use(express.json());

// Import models
const Feedback = require('./models/Feedback');
const Stats = require('./models/Stats');

// Routes
// Add root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Taqdeer API', 
    version: '1.0.0',
    endpoints: {
      api: '/api',
      stats: '/api/stats',
      generateDua: '/api/dua/generate',
      contact: '/api/contact',
      feedback: '/api/feedback'
    }
  });
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthcheck);
});

app.get('/api', (req, res) => {
  res.json({ message: 'Taqdeer API is working!' });
});

// Get usage statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // If not connected, return default stats
      return res.json({
        uniqueVisitors: 0,
        duasGenerated: 0,
        duasShared: 0
      });
    }
    
    const stats = await Stats.getSingletonStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    res.json({
      uniqueVisitors: 0,
      duasGenerated: 0,
      duasShared: 0
    });
  }
});

// Track unique visitor
app.post('/api/stats/visitor', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, message: 'Database not available, visitor not tracked' });
    }
    
    await Stats.incrementVisitors();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(200).json({ success: true, message: 'Error tracking visitor, but request successful' });
  }
});

// Track shared du'a
app.post('/api/stats/shared', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, message: 'Database not available, share not tracked' });
    }
    
    await Stats.incrementDuasShared();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking shared du\'a:', error);
    res.status(200).json({ success: true, message: 'Error tracking share, but request successful' });
  }
});

// Du'a generation endpoint
app.post('/api/dua/generate', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Log the query for debugging
    console.log('Generating du\'a for query:', query);
    
    // Generate du'a using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an Islamic scholar specializing in du'as (supplications) from the Quran and authentic Hadith.
          When given a situation, emotion, or request, provide an authentic du'a that would be appropriate.
          Format your response as a JSON object with the following fields:
          - title: A concise title for the du'a
          - arabic: The du'a in Arabic script
          - transliteration: The transliteration of the Arabic
          - translation: The English translation
          - source: Where this du'a is from (Quran chapter/verse or Hadith collection)
          - narrator: Who narrated this Hadith (if applicable)
          - context: A brief explanation of when/why this du'a is recited (optional)
          
          Only include du'as that are authentically reported in Islamic sources. If you cannot find an authentic du'a for the specific request, provide the closest appropriate authentic du'a and explain why you chose it.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    try {
      const duaData = JSON.parse(completion.choices[0].message.content);
      
      // Validate the response has the required fields
      if (!duaData.title || !duaData.arabic || !duaData.translation) {
        console.error('Invalid response format from OpenAI:', duaData);
        return res.status(500).json({ error: 'Invalid response format from AI service' });
      }
      
      // Increment the dua generation count
      if (mongoose.connection.readyState === 1) {
        try {
          await Stats.incrementDuasGenerated();
        } catch (error) {
          console.error('Error incrementing dua count:', error);
          // Continue even if tracking fails
        }
      }
      
      res.json(duaData);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', completion.choices[0].message.content);
      return res.status(500).json({ error: 'Failed to parse AI response', details: parseError.message });
    }
  } catch (error) {
    console.error('Error generating du\'a:', error);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'APIError') {
      if (error.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      } else if (error.status === 401) {
        return res.status(500).json({ error: 'Authentication error with AI service' });
      }
    }
    
    res.status(500).json({ error: 'Failed to generate du\'a', details: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create nodemailer transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `Taqdeer Contact: ${subject || 'New message from website'}`,
      html: `
        <h3>New Contact Message from Taqdeer</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { feedbackType, comment, duaData } = req.body;
    
    if (!feedbackType || !comment || !duaData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new feedback entry
    const feedback = new Feedback({
      feedbackType,
      comment,
      duaData
    });
    
    // Save to database
    await feedback.save();
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep the server alive by pinging the health endpoint every 5 minutes
const keepAliveInterval = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  console.log('Performing keep-alive ping...');
  try {
    // Make a request to the health endpoint to keep the server active
    http.get(`http://localhost:${PORT}/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('Keep-alive ping successful');
      });
    }).on('error', (err) => {
      console.error('Keep-alive ping failed:', err);
    });
  } catch (error) {
    console.error('Error during keep-alive ping:', error);
  }
}, keepAliveInterval);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
}); 