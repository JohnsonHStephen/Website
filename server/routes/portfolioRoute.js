const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');

const Project   = require('../models/project')

router.get('/', (req, res) => {
  Project.find({}).sort({updated: -1}).exec(function(e, projects) {
    if (e) {
      console.log("Failed on router.get('/portfolio')\nError:".error, e.message.error + "\n");
      e.status = 406; next(e);
    } else {
      console.log("projects: ", projects);
      res.render('portfolio', {title: 'Portfolio', projects: projects});
    }
  });
});

module.exports = router;
