const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Card = require('./cardModel');
const Studysession = require('./studysessionModel');

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [20, 'Deck name must be 20 characters or less!'],
      required: [true, 'Deck must have a name!'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Deck must contain reference to a user!'],
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  { timestamps: true }
);

// middleware for removing referenced cards and studysessions upon deck deletion
deckSchema.post('findOneAndDelete', async function (doc, next) {
  try {
    console.log(doc._id);
    if (doc) {
      const deleteCardResult = await Card.deleteMany({
        deck: doc._id,
      });
      console.log('Card delete result: ', deleteCardResult);

      const deleteStudysessionResult = await Studysession.deleteMany({
        deck: doc._id,
      });
      console.log('Studysession delete result: ', deleteStudysessionResult);
    }
    next();
  } catch (err) {
    next(err);
  }
});

deckSchema.post('save', function (doc, next) {
  console.log('new Deck saved', doc);
  next();
});
const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
