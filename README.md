# Taqdeer - AI-Powered Islamic Du'a Generator

Taqdeer is an application that provides authentic Islamic du'as (supplications) from the Quran and Hadith based on user queries. It uses AI to match user situations with relevant du'as, complete with Arabic text, transliteration, translation, and source references.

## Features

- AI-powered du'a recommendations based on user situations
- Authentic sources from Quran and Hadith
- Arabic text with transliteration and translation
- Source references with links to Quran.com and Sunnah.com
- Image sharing capability
- User feedback system

## Technology Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- AI: OpenAI API

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/lirumadev/taqdeer.git
   cd taqdeer
   ```

2. Install dependencies
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create environment variables
   ```
   # In the server directory, create a .env file with:
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=your_email@gmail.com
   ```

4. Start the application
   ```
   # Start the server
   cd server
   npm start

   # In a new terminal, start the client
   cd client
   npm start
   ```

## License

[Your chosen license]

## Contact

[Your contact information]
