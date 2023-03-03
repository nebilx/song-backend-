const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "song title is required"],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, "song artist is required"],
    trim: true,
  },
  album: {
    type: String,
    required: [true, "song album is required"],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "song genre is required"],
    trim: true,
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
