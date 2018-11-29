const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));

const movieQuotesDb = {
  'd9424e04-9df6-4b76-86cc-9069ca8ee4bb': {
    id: 'd9424e04-9df6-4b76-86cc-9069ca8ee4bb',
    quote: 'Why so serious?',
  },
  '27b03e95-27d3-4ad1-9781-f4556c1dee3e': {
    id: '27b03e95-27d3-4ad1-9781-f4556c1dee3e',
    quote: 'YOU SHALL NOT PASS!',
  },
  '5b2cdbcb-7b77-4b23-939f-5096300e1100': {
    id: '5b2cdbcb-7b77-4b23-939f-5096300e1100',
    quote: "It's called a hustle, sweetheart.",
  },
  '917d445c-e8ae-4ed9-8609-4bf305de8ba8': {
    id: '917d445c-e8ae-4ed9-8609-4bf305de8ba8',
    quote: 'The greatest teacher, failure is.',
  },
  '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe': {
    id: '4ad11feb-a76a-42ae-a1c6-8e30dc12c3fe',
    quote: 'Speak Friend and Enter',
  },
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/quotes');
});

app.get('/quotes', (req, res) => {
  const quotes = Object.values(movieQuotesDb);
  res.render('quotes', { quotes });
});

// Display the form to create a new quote
app.get('/quotes/new', (req, res) => {
  res.render('quote_new');
});

// create a new quote
app.post('/quotes', (req, res) => {
  const quoteContent = req.body.quote;
  const id = uuidv4();

  const quote = {
    id,
    quote: quoteContent,
  };

  movieQuotesDb[id] = quote;

  res.status(301).redirect('/quotes ');
});

// edit a quote
app.get('/quotes/:id', (req, res) => {
  const id = req.params.id;
  const quote = movieQuotesDb[id];
  res.render('quote_show', { quote });
});
// why not put? we need method everride
app.post('/quotes/:id', (req, res) => {
  const id = req.params.id;
  const quote = req.body.quote;
  movieQuotesDb[id].quote = quote;
  res.redirect('/quotes');
});

app.listen(port, () => console.log(`Express server running on port ${port}`));
