const express     = require('express');
const hbs         = require('express-handlebars');
const path        = require('path');
const mongoose    = require('mongoose');
const request     = require('request');
const bodyParser  = require('body-parser');


mongoose.connect('mongodb://localhost:27017/myWebsite', { useNewUrlParser: true, useCreateIndex: true, autoIndex: false });

const PORT      = process.env.PORT || 80;
const app       = express();


app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.static(__dirname + '/../client/public'));

app.set('views', path.join(__dirname, '/../client/views'));
//using the express handlebars template mechanism
app.engine('hbs', hbs({extname: 'hbs',
defaultLayout: 'mainLayout',
helpers: {
  //takes the 2 values compares them and returns the whenTrue argument when they are equal
  //  returns the whenFalse when they are not and a blanck string when they are not equal
  //  and whenFalse is not defined
  compare: function(lvalue, rvalue, whenTrue, whenFalse) {
    if (arguments.length < 4) {
      throw new Error("Handlerbars Helper 'compare' needs 3 parameters");
    }

    if(lvalue === rvalue) {
      return whenTrue;
    } else {
      if(whenFalse) {
        return whenFalse;
      }
    }
    return '';
  }
}}));
app.set('view engine', 'hbs');

app.use('/', require('./routes/indexRoute'));
app.use('/resume', require('./routes/resumeRoute'));
app.use('/portfolio', require('./routes/portfolioRoute'));

app.listen(PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log(`Open at:`);
    console.log(`http://johnsonhstephen.com`);

    //update the database when the server is started
    var options = {
      url: 'https://api.github.com/orgs/StephenHJohnson/repos',
      headers: {
        'User-Agent': 'JohnsonHStephen',
        'Accept': 'application/vnd.github.v3.full+json'
      }
    };

    //getting all the current public repositories on github
    request.get(options, function(error, response, body) {
      if(error) {
        console.log("Error reading from GitHub API: ", error);
      } else {
        let Project = require('./models/project');

        //emptying the database of any currently saved projects
        Project.deleteMany({}, function(e, result){
          if(e) {
            console.log("Error clearing mongodb myWebsite: ", e);
          } else {
            console.log("Clearing old projects.");

            //loops through each project imported from GitHub
            for(var project of JSON.parse(body)) {
              //saves the each project to the database
              var temp = new Project({
                name: project.name,
                gitUrl: project.html_url,
                description: project.description,
                updated: project.pushed_at,
                imagePath: "https://cdn.jsdelivr.net/gh/StephenHJohnson/" + project.name + "@latest/img.jpeg"
              });

              temp.save(function(e, result) {
                if(e) {
                  console.log("Error saving to mongodb myWebsite: ", e);
                } else {
                  console.log("inserted", temp);
                }
              });
            }
          }
        });
      }
    });
  }
});
