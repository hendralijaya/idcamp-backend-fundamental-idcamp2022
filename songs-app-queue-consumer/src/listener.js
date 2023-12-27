const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }
 
  async listen(message) {
    try {
      const { playlistId , targetEmail } = JSON.parse(message.content.toString());
      const playlistWithoutSong = await this._playlistsService.getPlaylistById(playlistId);
      const playlist = await this._playlistsService.getSongsByPlaylistId(playlistWithoutSong);
      const result = {
        playlist,
      }
      console.log(result);
      await this._mailSender.sendEmail(targetEmail, JSON.stringify(result));
      
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
