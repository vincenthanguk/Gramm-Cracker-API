const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// NOTE: -------- MIDDLEWARES --------

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('HELLO FROM THE MIDDLEWARE');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const decks = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/decks.json`)
);

// NOTE: -------- HANDLERS --------

const getAllDecks = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: decks.length,
    data: {
      decks: decks,
    },
  });
};

const getDeck = (req, res) => {
  //   find element that has id equal to req.params
  //   convert string to number with * 1
  const id = req.params.id * 1;

  if (id > decks.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  const deck = decks.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      deck,
    },
  });
};

const createDeck = (req, res) => {
  const newId = decks[decks.length - 1].id + 1;
  const newDeck = Object.assign({ id: newId }, req.body);

  decks.push(newDeck);

  fs.writeFile(
    `${__dirname}/dev-data/data/decks.json`,
    JSON.stringify(decks),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          decks: newDeck,
        },
      });
    }
  );
};

const updateDeck = (req, res) => {
  if (req.params.id * 1 > decks.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      decks: '<updated decks here>',
    },
  });
};

const deleteDeck = (req, res) => {
  if (req.params.id * 1 > decks.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// NOTE: -------- Routes --------
// app.get('/api/v1/decks', getAllDecks);
// app.post('/api/v1/decks', createDeck);
// app.get('/api/v1/decks/:id', getDeck);
// app.patch('/api/v1/decks/:id', updateDeck);
// app.delete('/api/v1/decks/:id', deleteDeck);
// --- slicker and more readable version below ---
app.route('/api/v1/decks').get(getAllDecks).post(createDeck);

app
  .route('/api/v1/decks/:id')
  .get(getDeck)
  .patch(updateDeck)
  .delete(deleteDeck);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});