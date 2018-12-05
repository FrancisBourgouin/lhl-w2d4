const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const methodOverride = require('method-override');

const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const users = {
  'eb849b1f-4642-4c16-a77b-71ac2f90996f': {
    id: 'eb849b1f-4642-4c16-a77b-71ac2f90996f',
    name: 'Kent Cook',
    email: 'really.kent.cook@kitchen.com',
  },
  '1dc937ec-7d71-4f37-9560-eef9d998a9b7': {
    id: '1dc937ec-7d71-4f37-9560-eef9d998a9b7',
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
  },
};

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

const quoteComments = {
  '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac': {
    id: '70fcf8bd-6cb0-42f3-9887-77aa9db4f0ac',
    comment: 'So awesome comment!',
    quoteId: 'd9424e04-9df6-4b76-86cc-9069ca8ee4bb',
  },
};

const quoteList = () => {
  const quotes = {};

  for (const quoteId in movieQuotesDb) {
    quotes[quoteId] = movieQuotesDb[quoteId];
    quotes[quoteId].comments = Object.keys(quoteComments)
      .filter(commentId => quoteComments[commentId].quoteId === quoteId)
      .map(commentId => quoteComments[commentId]);
  }
  return quotes;
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/quotes');
});

// END POINTS

// logPayload Middleware
function logPayload(req, res, next) {
  console.log(`Method: ${req.method} Url: ${req.url}`);
  console.log('URL Params: ', req.params);
  console.log('Query Params: ', req.query);
  console.log('Body Payload: ', req.body);
  next();
}

app.use(logPayload);

// DISPLAY A LIST OF QUOTES

app.get('/quotes', (req, res) => {
  const quotes = Object.values(quoteList());
  res.render('quotes', { quotes, user: null });
});

app.get('/quotes.json', (req, res) => {
  const quotes = Object.values(quoteList());
  res.json(quotes);
});

// DISPLAY THE FORM TO CREATE A NEW QUOTE
// quote_new

app.get('/quotes/new', (req, res) => {
  res.render('quote_new');
});

// CREATE QUOTE
app.post('/quotes', (req, res) => {
  const { quote } = req.body;
  const id = uuidv4();
  movieQuotesDb[id] = {
    id,
    quote,
  };
  res.redirect('/quotes');
});

// DISPLAY FORM TO EDIT QUOTE
app.get('/quotes/:id/', (req, res) => {
  const { id } = req.params;
  const quote = movieQuotesDb[id];
  res.render('quote_show', { quote });
});

// UPDATE A QUOTE
app.put('/quotes/:id', (req, res) => {
  const { id } = req.params;
  const { quote } = req.body;
  movieQuotesDb[id].quote = quote;
  res.redirect('/quotes');
});

// DISPLAY THE FORM TO CREATE A NEW COMMENT
app.get('/quotes/:id/comments/new', (req, res) => {
  const { id: quoteId } = req.params;

  res.render('comment_new', { quoteId });
});

// CREATE A COMMENT
app.post('/quotes/:id/comments', (req, res) => {
  const { id: quoteId } = req.params;
  const { comment } = req.body;
  const id = uuidv4();
  quoteComments[id] = {
    id,
    comment,
    quoteId,
  };
  res.redirect('/quotes');
});

// DISPLAY THE FORM TO EDIT COMMENT
app.get('/comments/:id/update', (req, res) => {
  const { id } = req.params;
  res.render('comment_show', { content: quoteComments[id] });
});

// UPDATE THE COMMENT
app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  quoteComments[id].comment = comment;

  res.redirect('/quotes');
});

// DELETE A QUOTE
app.delete('/quotes/:id', (req, res) => {
  const { id } = req.params;
  delete movieQuotesDb[id];
  res.redirect('/quotes');
});

// DELETE A COMMENT
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  delete quoteComments[id];
  res.redirect('/quotes');
});

app.listen(port, () => console.log(`Express server running on port ${port}`));
