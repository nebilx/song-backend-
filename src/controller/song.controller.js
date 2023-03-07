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

    return res.status(201).json({ success: true, message: `Song Created` });
  } catch (e) {
    res.status(500).json({ success: false, message: e });
  }
};

const get_song = async (req, res) => {
  try {
    const song = await Song.find();

    if (!song)
      return res.status(204).json({ success: false, message: "No Song Found" });

    return res.status(200).json(song);
  } catch (e) {
    res.status(500).json({ success: false, message: e });
  }
};

const update_song = async (req, res) => {
  const { id } = req.params;
  const { title, artist, album, genre } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Song Id Required" });

  const songExist = await Song.findById({ _id: id });

  if (!songExist)
    return res.status(204).json({ success: false, message: "No Song Found" });

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

    return res.status(201).json({ success: true, message: `Song is Updated` });
  } catch (e) {
    res.status(500).json({ success: false, message: e });
  }
};

const remove_song = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Song Id Required" });

    const songExist = await Song.findOne({ _id: id });

    if (!songExist)
      return res.status(204).json({ success: false, message: "No Song Found" });

    await Song.findByIdAndDelete({ _id: id });

    return res.status(201).json({ success: true, message: `Song is Deleted` });
  } catch (e) {
    res.status(500).json({ success: false, message: e });
  }
};

const generate_statistics = async (req, res) => {
  try {
    const noSongTotal = await Song.aggregate([
      {
        $group: {
          _id: null,
          noSong: {
            $addToSet: "$title",
          },
          noAlbum: {
            $addToSet: "$album",
          },
          noArtist: {
            $addToSet: "$artist",
          },
          noGenre: {
            $addToSet: "$genre",
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: {
            $size: "$noSong",
          },
          album: {
            $size: "$noAlbum",
          },
          artist: {
            $size: "$noArtist",
          },
          genre: {
            $size: "$noGenre",
          },
        },
      },
    ]);

    const noSongGenre = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          noSong: {
            $addToSet: "$title",
          },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          song: {
            $size: "$noSong",
          },
        },
      },
    ]);

    // number of song artist has
    const noSongArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          noSong: {
            $addToSet: "$title",
          },
        },
      },
      {
        $project: {
          _id: 0,
          artist: "$_id",
          song: {
            $size: "$noSong",
          },
        },
      },
    ]);
    //number of song and album artist has
    const noSongAndAlbumArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          noSong: {
            $addToSet: "$title",
          },
          noAlbum: {
            $addToSet: "$album",
          },
        },
      },
      {
        $project: {
          _id: 0,
          artist: "$_id",
          song: {
            $size: "$noSong",
          },
          album: {
            $size: "$noAlbum",
          },
        },
      },
    ]);
    // number of song each album
    const noSongAlbum = await Song.aggregate([
      {
        $group: {
          _id: "$album",
          noSong: {
            $addToSet: "$title",
          },
        },
      },
      {
        $project: {
          song: {
            $size: "$noSong",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        noSongTotal,
        noSongGenre,
        noSongArtist,
        noSongAndAlbumArtist,
        noSongAlbum,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e });
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
