const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/random', auth, async (req, res) => {
  try {
    // Get the count from the URL query string, default to 15 if not provided
    const count = parseInt(req.query.count) || 15;

    // Fetch random questions from the database
    // ORDER BY RANDOM() shuffles all rows, LIMIT picks how many we want
    const result = await pool.query(
      'SELECT id, question, correct_answer, wrong_answers, category FROM questions ORDER BY RANDOM() LIMIT $1',
      [count]
    );

    // For each question, combine correct + wrong answers and shuffle them
    // So the correct answer isn't always in the same position
    const questions = result.rows.map(q => {
      const allOptions = [q.correct_answer, ...q.wrong_answers];
      const shuffled = allOptions.sort(() => Math.random() - 0.5);
      const correctIndex = shuffled.indexOf(q.correct_answer);

      return {
        id: q.id,
        question: q.question,
        category: q.category,
        options: shuffled,        // The 4 answers in random order
        correctIndex: correctIndex // Which position (0-3) is correct
      };
    });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;