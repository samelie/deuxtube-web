import TweenLite from 'gsap'
export default class VideoPlayer {
  constructor(el) {
    this.iframe = el
    console.log(this.iframe.contentWindow);
    this.playing = false
  }



  play() {
    this.iframe.contentWindow.postMessage(
      '{"event":"command","func":"' + 'playVideo' + '","args":""}',
      '*');
    this.unmute()
    this.setPlaybackQuality("default")
    this.setPlaybackRate(1)
    this.playing = true
  }

  pause() {
    this.iframe.contentWindow.postMessage(
      '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
      '*');
    this.playing = false
  }

  mute(){
    this.iframe.contentWindow.postMessage(
      '{"event":"command","func":"' + 'mute' + '","args":""}',
      '*');
  }

  unmute(){
    this.iframe.contentWindow.postMessage(
      '{"event":"command","func":"' + 'unMute' + '","args":""}',
      '*');
  }

  setPlaybackQuality(q){
    const data = {event: 'command', func: 'setPlaybackQuality', args: [q]};
    const message = JSON.stringify(data);
     this.iframe.contentWindow.postMessage(message,'*');
  }

  setPlaybackRate(r){
    const data = {event: 'command', func: 'setPlaybackRate', args: [r]};
    const message = JSON.stringify(data);
    this.iframe.contentWindow.postMessage(message,'*');
  }

  update(pos) {
    if(pos.z < -1000 && this.playing){
      this.pause()
    }
  }
}
