// server/generate-questions.js
// Run with: cd server && node generate-questions.js

require('dotenv').config();

const Anthropic = require('@anthropic-ai/sdk');
const { Pool } = require('pg');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function generateBatch(batchNumber) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `Generate 20 unique trivia questions suitable for a Kahoot-style game. 
      Mix categories: science, history, geography, pop culture, sports, technology, nature, food.
      Make them challenging but fair — most adults should have a shot at getting them right.
      
      Respond with ONLY a JSON array, no other text. Each item:
      {
        "question": "the question text",
        "correct": "the correct answer",
        "wrong": ["wrong answer 1", "wrong answer 2", "wrong answer 3"],
        "category": "category name"
      }
      
      IMPORTANT: All 4 answer options should be similar in length and plausibility. 
      Don't make wrong answers obviously silly — this is a competitive game.
      This is batch ${batchNumber}, so make sure these are different from common trivia questions.`
    }]
  });
  const text = response.content[0].text
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .trim();
  return JSON.parse(text);
}

async function main() {
  const TOTAL_BATCHES = 10;
  let totalInserted = 0;

  for (let i = 1; i <= TOTAL_BATCHES; i++) {
    console.log(`Generating batch ${i}/${TOTAL_BATCHES}...`);
    
    const questions = await generateBatch(i);

    for (const q of questions) {
      await pool.query(
        'INSERT INTO questions (question, correct_answer, wrong_answers, category) VALUES ($1, $2, $3, $4)',
        [q.question, q.correct, q.wrong, q.category]
      );
      totalInserted++;
    }

    if (i < TOTAL_BATCHES) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`Done! ${totalInserted} questions saved to database.`);
  pool.end();
}

main().catch(console.error);