const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
let crypto      = require('crypto');
const request   = require('request');

const Project   = require('./../models/project');

const secret    = "W1i8BrKNrKaQSMngG$Nh$aqB50&9Ts&w0&JPZKpY99#Gd5cXT3sC9695^1CTd*V1hjGNszWcB1C^jxHptKJlIiCiu&QbojqwBRd";

router.get('/', function(req, res) {
  //gets all of the projects in reverse chronological order (sorted by time of last push)
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

//called by GitHub webhook triggered by changes to the repositories
router.post('/update', function(req, res) {
  console.log("updating projects");

  //creating a hashed version of the secret key to compare with given key
  let sig = "sha1=" + crypto.createHmac('sha1', secret).update(JSON.stringify(req.body)).digest('hex');

  //checking if the hashed keys are identical (from github and not an unautherized user)
  if (req.headers['x-hub-signature'] == sig) {
    //getting all the repositories from the github api
    var options = {
      url: 'https://api.github.com/orgs/StephenHJohnson/repos',
      headers: {
        'User-Agent': 'JohnsonHStephen',
        'Accept': 'application/vnd.github.v3.full+json'
      }
    };

    request.get(options, function(error, response, body) {
      if(error) {
        console.log("Error reading from GitHub API: ", error);
        res.status(500).end();
      } else {
        //removing all projects currently stored in the database to remove duplicates and any removed repositories
        Project.deleteMany({}, function(e, result){
          if(e) {
            console.log("Error clearing mongodb myWebsite: ", e);
            res.status(500).end();
          } else {
            console.log("Clearing old projects.");
            //loop through each repository from github
            for(var project of JSON.parse(body)) {
              //creating a new database item from the gihub info
              var temp = new Project({
                name: project.name,
                gitUrl: project.html_url,
                description: project.description,
                updated: project.pushed_at,
                imagePath: "https://cdn.jsdelivr.net/gh/StephenHJohnson/" + project.name + "@master/img.jpeg"
              });

              //saving the project to the database
              temp.save(function(e, result) {
                if(e) {
                  console.log("Error saving to mongodb myWebsite: ", e);
                  res.status(500).end();
                } else {
                  console.log("inserted", temp);
                }
              });
            }
            //telling github the info was recieved properly
            res.status(200).end();
          }
        });
      }
    });
  }
});

module.exports = router;
