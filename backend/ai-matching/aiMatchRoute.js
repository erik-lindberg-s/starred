var express = require('express');
var router = express.Router();
var multer = require('multer');
var { findJobMatches, clearCache } = require('./vectorService');

// Configure multer for file uploads (memory storage)
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

/**
 * POST /ai-match
 * Upload CV and get job matches
 */
router.post('/', upload.single('cv'), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file' 
      });
    }

    // Find matching jobs
    const result = await findJobMatches(req.file.buffer, 10);

    res.json({
      message: 'Successfully found job matches',
      matches: result.matches,
      count: result.matches.length,
      debug: result.debug,
    });
  } catch (error) {
    console.error('Error in /ai-match:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process CV and find matches' 
    });
  }
});

/**
 * POST /ai-match/clear-cache
 * Clear the job vector store cache (for testing/debugging)
 */
router.post('/clear-cache', function (req, res) {
  try {
    clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

module.exports = router;

