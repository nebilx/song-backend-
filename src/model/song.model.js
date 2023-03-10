const mongoose = require("mongoose");
const Genre = require("../config/genre.config");

const songSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "song title is required"],
      trim: true,
      match: /^[a-zA-Z0-9-_$.]+$/,
    },
    artist: {
      type: String,
      required: [true, "song artist is required"],
      trim: true,
      match: /^[a-zA-Z-_$.]+$/,
    },
    album: {
      type: String,
      required: [true, "song album is required"],
      trim: true,
      match: /^[a-zA-Z-_$.]+$/,
    },
    genre: {
      type: String,
      required: [true, "song genre is required"],
      trim: true,
      enum: Genre,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
