const express   = require('express');
var hbs         = require('express-handlebars');
const path      = require('path');

const PORT      = process.env.PORT || 3000;
const app       = express();



app.use(express.static(__dirname + '/../client/public'));

app.set('views', path.join(__dirname, '/../views'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'mainLayout'}));
app.set('view engine', 'hbs');

app.get('/', (request, response) => {
  response.render('index', { title: 'Home' });
});

app.listen(PORT, err => {
  if(err) {
    console.log(err);
  } else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`Open at:`);
    console.log(`http://localhost:3000`);
  }
});
