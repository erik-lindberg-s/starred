const OpenAI = require('openai');
const { PDFParse } = require('pdf-parse');

// In-memory cache
let jobEmbeddingsCache = null;
let jobsCache = [];

/**
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(buffer) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}

/**
 * Fetch all jobs from external API
 */
async function fetchAllJobs() {
  const allJobs = [];
  let page = 0;
  const pageSize = 10;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs?page=${page}&pageSize=${pageSize}`
    );
    const result = await response.json();
    
    if (result.data && result.data.length > 0) {
      allJobs.push(...result.data);
      page++;
      // Keep going if we got a full page
      hasMore = result.data.length === pageSize;
    } else {
      hasMore = false;
    }
  }

  return allJobs;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Initialize or return cached job embeddings
 */
async function getJobEmbeddings(openai) {
  if (jobEmbeddingsCache && jobsCache.length > 0) {
    return { embeddings: jobEmbeddingsCache, jobs: jobsCache };
  }

  const jobs = await fetchAllJobs();

  // Create text content for each job
  const jobTexts = jobs.map((job) => 
    `Job Title: ${job.job_title || ''}
Company: ${job.company || ''}
Description: ${job.description || ''}
Requirements: ${job.requirements || ''}
Location: ${job.location || ''}`
  );

  // Generate embeddings in batches (OpenAI allows up to 2048 inputs per request)
  const batchSize = 100;
  const allEmbeddings = [];
  
  for (let i = 0; i < jobTexts.length; i += batchSize) {
    const batch = jobTexts.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    allEmbeddings.push(...response.data.map(d => d.embedding));
  }

  // Cache the results
  jobEmbeddingsCache = allEmbeddings;
  jobsCache = jobs;

  return { embeddings: allEmbeddings, jobs };
}

/**
 * Find best job matches for a CV
 */
async function findJobMatches(cvBuffer, topK = 10) {
  try {
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Extract text from CV
    const cvText = await extractTextFromPDF(cvBuffer);
    
    if (!cvText || cvText.trim().length < 50) {
      throw new Error('Could not extract enough text from CV. Please ensure it\'s a valid PDF.');
    }

    // Get or create job embeddings
    const { embeddings, jobs } = await getJobEmbeddings(openai);

    // Create embedding for CV
    const cvEmbeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: cvText,
    });
    const cvEmbedding = cvEmbeddingResponse.data[0].embedding;

    // Calculate similarities
    const similarities = embeddings.map((jobEmbedding, index) => ({
      job: jobs[index],
      similarity: cosineSimilarity(cvEmbedding, jobEmbedding),
    }));

    // Sort by similarity and return top K
    const topMatches = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    // Return debug info along with matches
    return {
      matches: topMatches.map(m => m.job),
      debug: {
        cvText: cvText.substring(0, 500) + '...', // First 500 chars
        cvTextLength: cvText.length,
        totalJobsSearched: jobs.length,
        embeddingDimensions: cvEmbedding.length,
        openAIModel: cvEmbeddingResponse.model,
        openAIUsage: cvEmbeddingResponse.usage,
        embeddingPreview: cvEmbedding.slice(0, 20), // First 20 dimensions
        topScores: topMatches.slice(0, 5).map(m => ({
          jobTitle: m.job.job_title,
          company: m.job.company,
          similarity: Math.round(m.similarity * 10000) / 100 + '%'
        }))
      }
    };
  } catch (error) {
    console.error('Error in findJobMatches:', error);
    throw error;
  }
}

/**
 * Clear the cache
 */
function clearCache() {
  jobEmbeddingsCache = null;
  jobsCache = [];
}

module.exports = {
  findJobMatches,
  clearCache,
};
