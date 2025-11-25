# Starred Job Search Application

A full-stack job search platform with AI-powered CV matching. Built with React, Express.js, SQLite, and OpenAI embeddings.

## 🎯 Features Implemented

### Core Features
- ✅ **Browse Jobs**: View paginated job listings from external API
- ✅ **Search**: Global search across all jobs by title and description
- ✅ **Favorites**: Save interesting jobs (per user)
- ✅ **User Selection**: Switch between seeded users to see their favorites

### AI Matching Feature
- ✅ **CV Upload**: Upload PDF CV and get AI-matched jobs
- ✅ **Smart Matching**: Uses OpenAI embeddings + cosine similarity
- ✅ **Vector Search**: Searches across all 95+ jobs in the database
- ✅ **Debug Info**: Shows CV text, embedding info, and similarity scores

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (tested with v22)
- npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/erik-lindberg-s/starred.git
cd starred
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

**⚠️ Note:** Replace `your-openai-api-key-here` with the actual API key (contact repository owner or get your own from https://platform.openai.com/api-keys).

4. **Initialize and seed the database**
```bash
npm run db:reset
```

This will:
- Create the SQLite database
- Create `user` and `favorite` tables
- Seed 11 test users into the database

5. **Start the backend server**
```bash
npm run server:start
```

Backend will run on: http://localhost:3001

6. **Start the frontend (in a new terminal)**
```bash
npm run client:dev
```

Frontend will run on: http://localhost:3000

## 📖 Usage

### Browsing Jobs
1. Navigate to http://localhost:3000
2. Browse through paginated job listings
3. Use search to filter by job title or description
4. Click hearts to favorite jobs
5. Switch users to see different favorite lists

### AI Job Matching
1. Click "✨ Try our newest feature: Let AI find the right job for you"
2. Upload your CV (PDF format)
3. Wait 30-60 seconds on first use (caches 95+ job embeddings)
4. View your top 10 matched jobs with similarity scores
5. See debug info: CV text, OpenAI API details, and embedding preview

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Backend
- **Express.js** - API server
- **SQLite** - Database
- **Multer** - File uploads
- **pdf-parse** - PDF text extraction

### AI Features
- **OpenAI API** - Text embeddings (text-embedding-3-small)
- **Cosine Similarity** - Vector matching algorithm
- **In-memory caching** - Fast subsequent matches

## 📁 Project Structure

```
starred-case/
├── src/                      # Frontend React code
│   ├── components/           # Reusable UI components
│   ├── pages/
│   │   ├── Jobs.jsx         # Main job listing page
│   │   └── AIMatch.jsx      # AI CV matching page
│   └── App.jsx              # Client-side routing
├── backend/
│   ├── routes/
│   │   ├── users.js         # User endpoints
│   │   └── favorites.js     # Favorites CRUD
│   ├── ai-matching/         # ✨ AI feature (isolated)
│   │   ├── vectorService.js # OpenAI + similarity logic
│   │   └── aiMatchRoute.js  # CV upload endpoint
│   └── app.js               # Express app configuration
├── db/
│   ├── schema.sql           # Database schema
│   ├── seed.js              # Database seeding script
│   └── db.js                # Database connection
├── vite.config.js           # Vite + proxy configuration
└── .env                     # Environment variables
```

## 🔧 Available Scripts

```bash
# Frontend
npm run client:dev        # Start Vite dev server (port 3000)
npm run client:build      # Build for production
npm run client:preview    # Preview production build

# Backend
npm run server:start      # Start Express server (port 3001)
npm run server:dev        # Start with nodemon (auto-reload)

# Database
npm run db:reset          # Drop, recreate, and seed database
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL
);
```

### Favorites Table
```sql
CREATE TABLE favorite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Backend Endpoints

**Users**
- `GET /users` - Get all users

**Favorites**
- `GET /favorites/:userId` - Get user's favorite job IDs
- `POST /favorites` - Add favorite (body: `{userId, jobId}`)
- `DELETE /favorites` - Remove favorite (body: `{userId, jobId}`)

**AI Matching**
- `POST /ai-match` - Upload CV and get matches (multipart/form-data, field: `cv`)
- `POST /ai-match/clear-cache` - Clear job embeddings cache

### External API
- `GET https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs?page=0&pageSize=10`
- `GET https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/:id`
- `POST https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/recommendations`

## 🤖 How AI Matching Works

1. **PDF Upload**: User uploads CV (PDF)
2. **Text Extraction**: Extract text from PDF using pdf-parse
3. **Fetch Jobs**: Retrieve all 95+ jobs from external API
4. **Create Embeddings**: 
   - Convert CV text → 1536-dimensional vector (OpenAI)
   - Convert each job → 1536-dimensional vector (cached)
5. **Calculate Similarity**: Use cosine similarity formula
   ```
   similarity = (A · B) / (|A| × |B|)
   ```
6. **Rank & Return**: Sort by similarity, return top 10

**Note:** First request takes ~60 seconds (embedding all jobs). Subsequent requests take ~2-3 seconds (only embed new CV).

## 🧪 Testing

### Test Users
The database is seeded with 11 users:
- IDs: 1-11
- Names: Laurel Paucek, Sven Wintheiser, etc.
- Switch between users to test favorites feature

### Test the AI Feature
1. Upload any PDF CV
2. Check terminal for embedding progress
3. View debug panel on the page
4. Verify top matches make sense

## 🎨 Design Choices

1. **Kept it Simple**: No LangChain, no external vector DB - just OpenAI + basic math
2. **Separate AI Module**: All AI code in `backend/ai-matching/` for easy removal
3. **In-Memory Cache**: Fast and simple (scales to ~1000 jobs)
4. **Client-Side Routing**: Simple history API, no react-router needed
5. **Vite Proxy**: Handles CORS for both external API and backend

## 📝 Notes

- **Performance**: First AI match is slow (creating embeddings), then fast (cached)
- **Cache**: Job embeddings clear on server restart
- **Pagination**: External API returns 10 jobs per page (0-indexed)
- **OpenAI Cost**: ~$0.001 per CV match after initial setup
- **File Size Limit**: 10MB for PDF uploads

## 🚧 Future Improvements

- Add real authentication
- Persist embeddings to disk/database
- Add job details page
- Implement real routing (react-router)
- Add loading states and better error handling
- Deploy to production
- Use proper environment variable management

## 📄 License

This is a demo project for Starred's application process.

---

**Built with ❤️ by Erik Lindberg**
