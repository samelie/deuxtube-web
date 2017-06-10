const html = require('choo/html')
const Q = require('bluebird');
import scene from './three/scene'
import { map } from 'lodash'

const INFO_TEXT = html`
<div>
<div>An interface tool for music video creation.</div>
<div>\n</div>
<div>Control two youtube video streams and </div>
<div>mix them with simple effects.</div>
<div>\n</div>
<div>Record while listening to the tune,</div>
<div>Save and Upload back to Youtube.</div>
</div>
`

const PromiseDefer = () => {
  var resolve, reject;
  var promise = new Promise(function() {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
}

const videoEl = ({ video, onload }) => (
  html `
  <iframe
    class="youtube-video"
    onload=${onload}
    width="640"
    height="360"
    src=https://youtube.com/embed/${video.id.id}?rel=0&showinfo=0&enablejsapi=1&wmode=transparent&version=3&playerapiid=ytplayer&loop=1&modestbranding=true
    frameborder="0"
  ></iframe>`
)

const infoEl = (onload) => (
  html `
  <div
    onload=${onload}
    class="deux-tube-info"
  >
  ${INFO_TEXT}
  </div>`
)

const generateVideoEls = (videos) => (videos.map(video => videoEl(video)))

module.exports = (videos, emit) => {
  if (!videos.length) return html `<section></section>`

  const defers = videos.map(v => PromiseDefer());
  const sectionDefer = PromiseDefer()
  const infoDefer = PromiseDefer()
  defers.push(sectionDefer)
  defers.push(infoDefer)
  const newVideos = videos.map((video, i) => ({
    video,
    onload: defers[i].resolve
  }))

  let threeScene;

  const skip = ()=>{
    threeScene.skip()
  }

  Q.all(map(defers, "promise"))
    .then((frames) => {
      const el = document.getElementById("three")
      const sceneEl = document.querySelector(".three-scene")
      const iframes = el.querySelectorAll('iframe')
      threeScene = scene(sceneEl, iframes, videos);

      threeScene.addInfo(document.querySelector(".deux-tube-info"))
    }).finally()

  return html `
        <section
          id="three"
          onload=${sectionDefer.resolve}
          >
            <div class="three-scene">

            </div>
            ${generateVideoEls(newVideos)}
            <div class="three-ctrls">
              <span
              onclick=${skip}
              >next</span>
            </div>
            ${infoEl(infoDefer.resolve)}
        </section>
      `
}
