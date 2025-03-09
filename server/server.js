const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { Configuration, OpenAIApi } = require('openai');

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
    'https://taqdeer-git-main-lirumadevs-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// For preflight requests
app.options('*', cors());

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
    
    const prompt = `
      Generate a relevant Islamic du'a (supplication) based on the following situation or need:
      "${query}"
      
      Important guidelines:
      1. Only provide du'as from the Quran or authentic (sahih) hadith collections. If you're unsure about authenticity, choose a well-known du'a with verified sources.
      
      2. Format the response as a JSON object with the following structure:
      {
        "title": "Descriptive title for this du'a",
        "narrator": "Name of the narrator (if from hadith)",
        "context": "Brief context about when/how the Prophet (SAW) said this du'a (if applicable)",
        "arabic": "Arabic text of the du'a",
        "transliteration": "English transliteration",
        "translation": "English translation",
        "source": "Source with specific reference format (see below)"
      }
      
      3. For the "source" field, follow these EXACT formatting guidelines:
         - For Quran: "Quran chapter:verse" (e.g., "Quran 2:186")
         - For Bukhari: "Sahih al-Bukhari hadith_number" (e.g., "Sahih al-Bukhari 1234")
         - For Muslim: "Sahih Muslim hadith_number" (e.g., "Sahih Muslim 2345")
         - For Abu Dawood: "Sunan Abu Dawood hadith_number" (e.g., "Sunan Abu Dawood 1234")
         - For Tirmidhi: "Jami at-Tirmidhi hadith_number" (e.g., "Jami at-Tirmidhi 3456")
         - For Nasa'i: "Sunan an-Nasa'i hadith_number" (e.g., "Sunan an-Nasa'i 1234")
         - For Ibn Majah: "Sunan Ibn Majah hadith_number" (e.g., "Sunan Ibn Majah 4321")
         - Always include the hadith number for hadith sources
         - Always include the authenticity grade at the end in this format: " | Sahih", " | Hasan", " | Da'if", etc.
      
      4. Examples of correctly formatted sources:
         - "Quran 2:186"
         - "Sahih al-Bukhari 6307 | Sahih"
         - "Sunan Abu Dawood 1517 | Hasan"
         - "Jami at-Tirmidhi 3599 | Sahih"
      
      5. Make sure the Arabic text is correct and properly formatted.
      
      6. If no specific du'a exists for this situation, provide a general du'a from the Quran or authentic hadith that would be appropriate, and clearly indicate this in the context field.
      
      7. Double-check the hadith number and reference before providing it. Incorrect references will mislead users.
    `;
    
    // Updated to use chat completions API with gpt-4o-mini model
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a knowledgeable Islamic scholar who provides authentic Islamic du'as (supplications) from the Quran and sahih hadith (preferrably from Quran.com for Quran and Sunnah.com for hadith). You format your responses in clean JSON format and ensure Arabic text is accurate." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });
    
    // Parse the response as JSON
    const responseText = completion.data.choices[0].message.content.trim();
    let duaData;
    
    try {
      // Handle markdown-formatted JSON by removing markdown code blocks if present
      let jsonText = responseText;
      
      // Check if the response is wrapped in markdown code blocks
      if (jsonText.startsWith('```json') || jsonText.startsWith('```')) {
        // Remove the opening markdown
        jsonText = jsonText.replace(/^```json\s*|^```\s*/g, '');
        // Remove the closing markdown
        jsonText = jsonText.replace(/\s*```\s*$/g, '');
      }
      
      duaData = JSON.parse(jsonText);
      
      // Ensure all expected fields exist
      duaData = {
        title: duaData.title || `Du'a for ${query}`,
        narrator: duaData.narrator || null,
        context: duaData.context || null,
        arabic: duaData.arabic || "",
        transliteration: duaData.transliteration || "",
        translation: duaData.translation || "",
        source: duaData.source || "Source not specified"
      };
      
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.error('Raw response:', responseText);
      // If JSON parsing fails, create a structured response
      duaData = {
        title: `Du'a for ${query}`,
        narrator: "Abu Hurairah (RA)",
        context: null,
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
        translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
        source: "Quran 2:201"
      };
    }
    
    // Increment the dua generation count - only if database is connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Stats.incrementDuasGenerated();
      } catch (error) {
        console.error('Error incrementing dua count:', error);
        // Continue even if tracking fails
      }
    }
    
    res.json(duaData);
  } catch (error) {
    console.error('Error generating du\'a:', error);
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 