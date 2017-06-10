const xhr = require('xhr-request');
const Q = require('bluebird');

const {JSON_PATH} = require('../constants')

const VideoDataLoader = () => {
  return new Q((yes, no) => {
    xhr(`${JSON_PATH}chewb-recent.json?z=${Math.random()}`, {
      json: true
    }, function(err, data) {
      if (err) {
        no(err)
      } else {
        yes(data.map(str=>JSON.parse(str)))
      }
    })
  })
}

module.exports = (state, emitter) => {
  state.videos = []
  VideoDataLoader().then(data => {
    data = data.map(d=>{
      d.id = d.id[0]
      return d
    })
    state.videos = data
    emitter.emit('render')
  })
}
