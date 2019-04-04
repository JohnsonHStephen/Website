const express   = require('express');
const hbs       = require('express-handlebars');
const path      = require('path');
const mongoose  = require('mongoose');
const request   = require('request');


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

app.listen(PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`Open at:`);
    console.log(`http://localhost:3000`);

    // var options = {
    //   url: 'https://api.github.com/users/JohnsonHStephen/repos',
    //   headers: {
    //     'User-Agent': 'JohnsonHStephen'
    //   }
    // };
    //
    // request.get(options, function(error, response, body) {
    //   if(error) {
    //     console.log("Error reading from GitHub API: ", error);
    //   } else {
    //     console.log(JSON.parse(body));
    //   }
    // });
  }
});
