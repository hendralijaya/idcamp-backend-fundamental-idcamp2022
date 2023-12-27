const { Pool } = require('pg');
const NotFoundError = require('./exceptions/NotFoundError');
     
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongsByPlaylistId(playlist) {
   const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [playlist.id],
    };
    const resultSongs = await this._pool.query(query);
    const result = {
      id: playlist.id,
      name: playlist.name,
      songs: resultSongs.rows,
    };
    return result;
  }
}

module.exports = PlaylistsService;
