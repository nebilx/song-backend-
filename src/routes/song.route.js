const express = require("express");
const songRouter = express.Router();
const {
  create_song,
  get_song,
  update_song,
  remove_song,
  generate_statistics,
  genre,
} = require("../controller/song.controller");

songRouter.route("/").post(create_song).get(get_song);
songRouter.route("/:id").put(update_song).delete(remove_song);
songRouter.route("/statistics").get(generate_statistics);
songRouter.route("/genre").get(genre);
module.exports = songRouter;
