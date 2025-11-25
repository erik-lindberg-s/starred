var express = require('express');
var router = express.Router();
var db = require('../../db/db.js');

// Get all favorites for a user
router.get('/:userId', function(req, res, next) {
  const userId = req.params.userId;
  db.all("SELECT job_id FROM favorite WHERE user_id = ?", [userId], (error, rows) => {
    if (error) {
      return res.status(400).json({error: error.message})
    }
    res.json({
      data: rows.map(row => row.job_id),
      error: {}
    });
  })
});

// Add a favorite
router.post('/', function(req, res, next) {
  const { user_id, job_id } = req.body;
  db.run("INSERT INTO favorite (user_id, job_id) VALUES (?, ?)", [user_id, job_id], function(error) {
    if (error) {
      return res.status(400).json({error: error.message})
    }
    res.json({
      data: { id: this.lastID, user_id, job_id },
      error: {}
    });
  })
});

// Remove a favorite
router.delete('/', function(req, res, next) {
  const { user_id, job_id } = req.body;
  db.run("DELETE FROM favorite WHERE user_id = ? AND job_id = ?", [user_id, job_id], function(error) {
    if (error) {
      return res.status(400).json({error: error.message})
    }
    res.json({
      data: { deleted: this.changes },
      error: {}
    });
  })
});

module.exports = router;

