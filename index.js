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
    comment: 'So awesome comment! I said this.',
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

// Display a list of quotes

app.get('/quotes', (req, res) => {
  const quotes = Object.values(quoteList());
  res.render('quotes', { quotes });
});

// Display the form to create a new quote
app.get('/quotes/new', (req, res) => {
  res.render('quote_new');
});

// create a new quote
app.post('/quotes', (req, res) => {
  const { quote: quoteContent } = req.body;
  const id = uuidv4();

  const quote = {
    id,
    quote: quoteContent,
  };

  movieQuotesDb[id] = quote;

  res.status(301).redirect('/quotes');
});

// edit a quote
app.get('/quotes/:id/edit', (req, res) => {
  const { id } = req.params;
  const quote = movieQuotesDb[id];
  res.render('quote_show', { quote });
});
// why not put? we need method override
app.put('/quotes/:id', (req, res) => {
  const { id } = req.params;
  const { quote } = req.body;
  movieQuotesDb[id].quote = quote;
  res.redirect('/quotes');
});

// Add Comment

// Display comment form
app.get('/quotes/:id/comments/new', (req, res) => {
  const { id: quoteId } = req.params;
  res.render('comment_new', {
    quote: { quoteId, quote: movieQuotesDb[quoteId].quote },
  });
});

// Create comment
app.post('/quotes/:id/comments', (req, res) => {
  const { id: quoteId } = req.params;
  const { comment } = req.body;
  const commentId = uuidv4();
  quoteComments[commentId] = {
    id: commentId,
    comment,
    quoteId,
  };

  res.redirect('/quotes');
});

// Edit comment

app.get('/comments/:commentId/update', (req, res) => {
  const { commentId } = req.params;

  res.render('comment_show', {
    content: quoteComments[commentId],
  });
});

app.put('/comments/:id', (req, res) => {
  const { id: commentId } = req.params;
  const { comment } = req.body;

  quoteComments[commentId].comment = comment;

  res.redirect('/quotes');
});

// Delete a quote
app.delete('/quotes/:id', (req, res) => {
  const { id } = req.params;
  delete movieQuotesDb[id];
  res.redirect('/quotes');
});

//Delete a comment
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  delete quoteComments[id];
  res.redirect('/quotes');
});

app.listen(port, () => console.log(`Express server running on port ${port}`));
