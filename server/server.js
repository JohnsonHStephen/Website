const express   = require('express');
const hbs       = require('express-handlebars');
const path      = require('path');
const mongoose  = require('mongoose');
const request   = require('request');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};


mongoose.connect('mongodb://localhost:27017/myWebsite', { useNewUrlParser: true, useCreateIndex: true, autoIndex: false });

const PORT      = process.env.PORT || 3000;
const app       = express();



app.use(express.static(__dirname + '/../client/public'));

app.set('views', path.join(__dirname, '/../client/views'));
app.engine('hbs', hbs({extname: 'hbs',
defaultLayout: 'mainLayout',
helpers: {
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

var httpServer = http.createServer(app).listen(PORT);
var httpsServer = https.createServer(credentials, app).listen(PORT + 443);

// app.listen(PORT, err => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(`Server listening on port: ${PORT}`);
//     console.log(`Open at:`);
//     console.log(`http://localhost:3000`);
//
//     var options = {
//       url: 'https://api.github.com/orgs/StephenHJohnson/repos',
//       headers: {
//         'User-Agent': 'JohnsonHStephen'
//       }
//     };
//
//     request.get(options, function(error, response, body) {
//       if(error) {
//         console.log("Error reading from GitHub API: ", error);
//       } else {
//         let Project = require('./models/project');
//
//         // console.log(JSON.parse(body));
//         Project.deleteMany({}, function(e, result){
//           if(e) {
//             console.log("Error clearing mongodb myWebsite: ", e);
//           } else {
//             console.log("Clearing old projects.");
//             for(var project of JSON.parse(body)) {
//               if(project.language === "JavaScript" && project.name !== "Website") {
//                 var temp = new Project({
//                   name: project.name,
//                   gitUrl: project.html_url,
//                   description: project.description,
//                   updated: project.pushed_at,
//                   imagePath: project.owner.avatar_url
//                 });
//
//                 temp.save(function(e, result) {
//                   if(e) {
//                     console.log("Error saving to mongodb myWebsite: ", e);
//                   } else {
//                     console.log("inserted", temp);
//                   }
//                 });
//               }
//             }
//           }
//         });
//       }
//     });
//   }
// });
