const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const methodOverride = require('method-override');

const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

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

// DISPLAY A LIST OF QUOTES

app.get('/quotes', (req, res) => {
  const quotes = Object.values(quoteList());
  res.render('quotes', { quotes });
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
// const quote = movieQuotesDb[id];
// quote_show
app.get('/quotes/:id/', (req, res) => {
  const { id } = req.params;
  const quote = movieQuotesDb[id];
  res.render('quote_show', { quote });
});

// UPDATE A QUOTE
// method override
// id from params, quote from body
app.put('/quotes/:id', (req, res) => {
  const { id } = req.params;
  const { quote } = req.body;
  movieQuotesDb[id].quote = quote;
  res.redirect('/quotes');
});

// DISPLAY THE FORM TO CREATE A NEW COMMENT
// nested resources
// comment_new { quoteId }

app.get('/quotes/:id/comments/new', (req, res) => {
  const { id: quoteId } = req.params;

  res.render('comment_new', { quoteId });
});

// CREATE A COMMENT
// id from params, comment from body
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
// comment_show {content: ...}

app.get('/comments/:id/update', (req, res) => {
  const { id } = req.params;
  res.render('comment_show', { content: quoteComments[id] });
});

// UPDATE THE COMMENT
// id from params, comment from body

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
