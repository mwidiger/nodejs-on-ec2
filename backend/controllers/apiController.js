const express = require('express');
const router = express.Router();

// Server routing
router.get('/', (req, res) => {
  res.json({"users": ["userOne", "userTwo", "userThree", "userFour"] })
});

module.exports = router;
