const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assets: { // Track coins for each artist
    type: Map,
    of: Number,
    default: () => new Map([
      ['Taylor Swift', 0],
      ['Drake', 0],
      ['The Weeknd', 0],
      ['Beyonce', 0],
      ['Ed Sheeran', 0],
      ['BTS', 0],
      ['Olivia Rodrigo', 0],
      ['Doja Cat', 0],
      ['Bad Bunny', 0],
      ['Billie Eilish', 0],
      ['Travis Scott', 0],
      ['Ariana Grande', 0],
    ]),
  },
});

module.exports = mongoose.model('User', userSchema);