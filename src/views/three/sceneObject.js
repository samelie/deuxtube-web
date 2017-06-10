import THREE from './three'
import VideoPlayer from './videoPlayer';

const Vector2 = THREE.Vector2
const Vector3 = THREE.Vector3

const getAngle = (vector) => (Math.atan2(vector.y, vector.x))

export default class SceneObject {
  constructor(threeObj, el, data, MAX_Z) {
    //this.position = new Vector2(threeObj.position.x, threeObj.position.y);
    this.position = new Vector3(threeObj.position.x, threeObj.position.y, 200);
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.threeObj = threeObj
    this.videoPlayer = new VideoPlayer(el)
    this._incre = MAX_Z / data.duration / 60
    this.baseZ = 0
    this.MAX_Z = MAX_Z


    //const x = Math.cos(75 *  THREE.Math.DEG2RAD) * 800
    const maxX = Math.cos(75 *  THREE.Math.DEG2RAD) * 800
    const maxY = Math.sin(75 *  THREE.Math.DEG2RAD) * 800

    const x = Math.random() * (maxX * 2) - maxX
    this.startPosition = new Vector3()

    this.active = false
  }

  reset(){
    this.videoPlayer.stop()
    this.baseZ = 0
    this.threeObj.position.set(0,0, 400)
  }

  get position() {
    return this.threeObj.position
  }

  set position(vec) {
    if (this.threeObj) {
      this.threeObj.position = vec
    }
  }

  get active() {
    return this._active
  }

  set active(a) {
    this.threeObj.element.style.opacity = a ? 1 : 0
    this.threeObj.element.style.display = a ? "block" : "none"
    this.reset()
    this._active = a
  }

  reset() {
    clearInterval(this.playInterval)
    clearInterval(this.bgplayInterval)
    this.velocity.set(new Vector2(0, 0))
  }

  stop(){
    this.active = false
    clearInterval(this.playInterval)
    clearInterval(this.bgplayInterval)
    this.videoPlayer.pause()
  }

  move(z) {
    if(!this._active){
      return
    }
    this.threeObj.position.x = this.threeObj.position.x
    this.threeObj.position.y = this.threeObj.position.y
    this.baseZ -= this._incre
    this.threeObj.position.z = this.baseZ  + (this.MAX_Z/2 * (Math.abs(this.baseZ) / this.MAX_Z) * z)

    this.videoPlayer.update(this.threeObj.position)
  }

  backgroundStart(){
    clearInterval(this.bgplayInterval)
    this.bgplayInterval = setInterval(()=>{
      this.threeObj.position.set(0,0, -2)
      this.videoPlayer.setPlaybackQuality("small")
      this.videoPlayer.setPlaybackRate("0.25")
      this.videoPlayer.play()
      this.videoPlayer.mute()
    }, 1000)
    this.threeObj.element.style.opacity = 0.2
    this.threeObj.element.style.display = "block"
  }

  start() {
    this.active = true
    clearInterval(this.playInterval)
    clearInterval(this.bgplayInterval)
    this.playInterval = setInterval(()=>{
      this.videoPlayer.play()
    }, 1000)
  }
}
