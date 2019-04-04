const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
let crypto      = require('crypto');

const Project   = require('./../models/project');

const secret    = "W1i8BrKNrKaQSMngG$Nh$aqB50&9Ts&w0&JPZKpY99#Gd5cXT3sC9695^1CTd*V1hjGNszWcB1C^jxHptKJlIiCiu&QbojqwBRd";

router.get('/', function(req, res) {
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

router.get('/projects/:name', function(req, res) {
  res.render('project', {title: req.params.name, name: req.params.name});
});

router.post('/update', function(req, res) {
  console.log("updating shit");
  let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

  if (req.headers['x-hub-signature'] == sig) {
    var options = {
      url: 'https://api.github.com/orgs/StephenHJohnson/repos',
      headers: {
        'User-Agent': 'JohnsonHStephen'
      }
    };

    request.get(options, function(error, response, body) {
      if(error) {
        console.log("Error reading from GitHub API: ", error);
        res.status(500).end();
      } else {
        let Project = require('./models/project');

        // console.log(JSON.parse(body));
        Project.deleteMany({}, function(e, result){
          if(e) {
            console.log("Error clearing mongodb myWebsite: ", e);
            res.status(500).end();
          } else {
            // console.log("Clearing old projects.");
            for(var project of JSON.parse(body)) {
              if(project.language === "JavaScript" && project.name !== "Website") {
                var temp = new Project({
                  name: project.name,
                  gitUrl: project.html_url,
                  description: project.description,
                  updated: project.pushed_at,
                  imagePath: project.owner.avatar_url
                });

                temp.save(function(e, result) {
                  if(e) {
                    console.log("Error saving to mongodb myWebsite: ", e);
                    res.status(500).end();
                  } else {
                    // console.log("inserted", temp);
                    res.status(200).end();
                  }
                });
              }
            }
          }
        });
      }
    });
  }
});

module.exports = router;
