const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume' });
});

module.exports = router;