const Song = require("../model/song.model");
const Genre = require("../config/genre.config");

const genre = async (req, res) => {
  res.status(200).json({ data: Genre });
};

const create_song = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;

    const song = new Song({ title, artist, album, genre });
    await song.save();

    return res.status(201).json({ success: `Song Created` + song });
  } catch (e) {
    res.status(500).send(e);
  }
};

const get_song = async (req, res) => {
  try {
    const song = await Song.find();

    if (!song) return res.status(204).json({ message: "No Song Found" });

    return res.status(200).json(song);
  } catch (e) {
    res.status(500).send(e);
  }
};

const update_song = async (req, res) => {
  const { id } = req.params;
  const { title, artist, album, genre } = req.body;

  if (!id) return res.status(400).json({ message: "Song Id Required" });

  const songExist = await Song.findById({ _id: id });

  if (!songExist) return res.status(204).json({ message: "No Song Found" });

  try {
    const song = await Song.findByIdAndUpdate(
      { _id: id },
      {
        $set: { title },
        $set: { artist },
        $set: { album },
        $set: { genre },
      }
    );

    song.save();

    return res.status(201).json({ success: `Song is Updated` + song });
  } catch (e) {
    res.status(500).send(e);
  }
};

const remove_song = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Song Id Required" });

    const songExist = await Song.findOne({ _id: id });

    if (!songExist) return res.status(204).json({ message: "No Song Found" });

    const song = await Song.findByIdAndDelete({ _id: id });

    return res.status(201).json({ success: `Song is Deleted` + song });
  } catch (e) {
    res.status(500).send(e);
  }
};

const generate_statistics = async (req, res) => {
  try {
    const noSongTotal = await Song.aggregate([
      {
        $group: {
          _id: null,
          title: {
            $sum: 1,
          },
          artist: {
            $sum: 1,
          },
          album: {
            $sum: 1,
          },
          genre: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: "$title",
          artist: "$artist",
          album: "$album",
          genre: "$genre",
        },
      },
    ]);

    const noSongGenre = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          totalSongs: "$total",
        },
      },
    ]);

    // number of song artist has
    const noSongArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          artist: "$_id",
          totalSongs: "$total",
        },
      },
    ]);
    //number of song and album artist has
    const noSongAndAlbumArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",

          title: {
            $sum: 1,
          },
          album: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          artist: "$_id",
          totalSongs: "$title",
          totalAlbum: "$album",
        },
      },
    ]);
    // number of song each album
    const noSongAlbum = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          totalSongs: "$total",
        },
      },
    ]);

    return res.status(200).json({
      noSongTotal,
      noSongGenre,
      noSongArtist,
      noSongAndAlbumArtist,
      noSongAlbum,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  create_song,
  get_song,
  update_song,
  remove_song,
  generate_statistics,
  genre,
};
