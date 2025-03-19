# Taqdeer - Islamic Rulings & Du'a Guide

Taqdeer is an application that provides authentic Islamic rulings and du'as from the Quran, Hadith, and trusted scholarly works. Users can search for Islamic guidance on various matters and find relevant du'as with complete references, translations, and transliterations. The platform uses advanced search technology to match queries with verified Islamic content while ensuring all responses are based on authentic sources.

## Features

- Comprehensive Islamic rulings with scholarly opinions and evidence
- Authentic du'as with Arabic text, transliteration, and translation
- Direct source references from Quran and verified Hadith collections
- Links to Quran.com and Sunnah.com for verification
- Image sharing capability for du'as
- User feedback system for continuous improvement
- Privacy-focused design
- Advanced search powered by OpenAI technology (for query processing only)

## Technology Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Search Processing: OpenAI API (for query understanding)

## Note on Search Technology

While Taqdeer uses OpenAI's technology to process and understand user queries, all Islamic content, rulings, and du'as are sourced directly from authentic Islamic texts and scholarly works. The AI technology is used solely to improve search accuracy and query understanding, not for generating Islamic content.

## Local Development Setup

### Prerequisites
- Node.js
- MongoDB
- OpenAI API key (for search processing)

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

## Deployment

### MongoDB Atlas

1. Create a MongoDB Atlas account and cluster
2. Set up database access with a username and password
3. Configure network access to allow connections from anywhere
4. Get your connection string

### Railway (Backend)

1. Sign up/log in to Railway with GitHub
2. Create a new project from your GitHub repository
3. Configure the deployment:
   - Set the root directory to `/server`
   - Set the start command to `npm start`
4. Add environment variables:
   - MONGODB_URI
   - OPENAI_API_KEY (for search processing)
   - EMAIL_HOST
   - EMAIL_PORT
   - EMAIL_SECURE
   - EMAIL_USER
   - EMAIL_PASS
   - EMAIL_FROM

### Vercel (Frontend)

1. Sign up/log in to Vercel with GitHub
2. Create a new project from your GitHub repository
3. Configure the project:
   - Set the root directory to `/client`
   - Framework preset: Create React App
4. Add environment variables:
   - REACT_APP_API_URL (your Railway backend URL)
5. Deploy

## License

[MIT License](LICENSE)

## Contact

For questions or feedback, please open an issue on GitHub or contact the developer.
