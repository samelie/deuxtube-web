import createLoop from 'raf-loop'
import THREE from './three'
const OrbitControls = require('three-orbit-controls')(THREE)
import SceneObject from './sceneObject'
import Ease from './ease-numbers'
import VideoPlayer from './videoPlayer';

const { Vector2, Vector3 } = THREE

const MAX_X = 60
const MAX_Y = 60
const MAX_Z = 1000

export default function Scene(target, elements, data) {
  var camera, scene, renderer, controls, width, height;

  const sceneObjects = []
  let activeIndex = 0

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, -500, 1000);
  camera.position.set(0, 0, 200);

  scene = new THREE.Scene();


  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  target.appendChild(renderer.domElement);

  elements.forEach((element, i) => {
    var object = new THREE.CSS3DObject(element);
    scene.add(object);
    sceneObjects.push(new SceneObject(object, element, data[i], MAX_Z));
  })

  //controls = new OrbitControls(camera)


  /*  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 200;

    //controls = new OrbitControls(camera)

    scene = new THREE.Scene();
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    //renderer.domElement.style.top = '0';
    //renderer.domElement.style.left = '0';
    target.appendChild(renderer.domElement);

    const sceneObjects = [];
    elements.forEach((element, i) => {

      //element.classList.add('youtube-video');
      console.log(i);
      if (i === 0) {
        var object = new THREE.CSS3DObject(document.querySelector('.sq'));
        scene.add(object);
        console.log(object);
      }
      sceneObjects.push(new SceneObject(object, element, data[i], MAX_Z));
      resetObjects(sceneObjects[sceneObjects.length - 1], sceneObjects.length)
    })*/

  const easeX = Ease.addNew()
  const easeY = Ease.addNew()
  const easeZ = Ease.addNew()
  const loop = createLoop(render).start();
  window.addEventListener('resize', resize, false);
  window.addEventListener('mousemove', (e) => {
    const { pageX, pageY } = e
    const x = pageX / window.innerWidth * 2 - 1
    const y = pageY / window.innerHeight * 2 - 1
    easeX.target = x
    easeY.target = y
    easeZ.value += 0.1
  });
  resize();

  function resize() {
    width = target.offsetWidth
    height = target.offsetHeight
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render(dt) {
    Ease.update()
    camera.rotation.y = 0.1 * easeX.value
    camera.rotation.x = 0.1 * easeY.value
    sceneObjects.forEach(p => p.move(easeZ.value))

    //plotParticles()
    renderer.render(scene, camera);
  }

  let playTO;

  function getNextIndex() {
    let a = activeIndex
    a++
    if (a >= data.length) {
      a = 0
    }
    return a
  }

  function play() {
    const d = data[activeIndex]
    const sceneObject = sceneObjects[activeIndex]
    const nextSceneObject = sceneObjects[getNextIndex()]
    sceneObject.start()
    nextSceneObject.backgroundStart()
    clearTimeout(playTO)
    playTO = setTimeout(() => {
      sceneObjects[activeIndex].stop()
      activeIndex++
      if (activeIndex >= data.length) {
        activeIndex = 0
      }
      play()
    }, d.duration * 1000)
  }

  play()

  function skip() {
    clearTimeout(playTO)
    sceneObjects[activeIndex].stop()
    activeIndex++
    if (activeIndex >= data.length) {
      activeIndex = 0
    }
    play()
  }


  function addInfo(el) {
    var object = new THREE.CSS3DObject(el);
    object.position.z = -50;
    scene.add(object);
  }

  return {
    addInfo: addInfo,
    skip: skip
  }
}
