import { cover, contain } from 'intrinsic-scale';
import { StyleSheet, css } from 'aphrodite';

let baseRoute = "";
const isProd = process.env.NODE_ENV === "production"
if (isProd) {
baseRoute = "rad.-deuxtube"
} else if (process.env.NODE_ENV === "github") {

}

require('fastclick')(document.body);
var html = require('choo/html')
var log = require('choo-log')
var choo = require('choo')

var app = choo()
app.use(log())

function logger(state, emitter) {
  emitter.on('*', function(messageName, data) {
    console.log('event', messageName, data)
  })
}

if(!isProd){
  app.use(logger);
}
app.use(require('./models/videos'))

//VIEWS
var headerView = require('./views/header')
var threeView = require('./views/three')
var aboutView = require('./views/about')

const onload = (el) => {
  const header =  el.querySelector('.header')
  header.addEventListener('mouseover', (e) => {
    el.classList.add('is-over')
  })
  header.addEventListener('mouseleave', (e) => {
    el.classList.remove('is-over')
  })
  header.addEventListener('mouseout', (e) => {
    el.classList.remove('is-over')
  })
}

function mainView(state, prev, send) {
  return html `
    <div
    class="app"
    onload=${onload}
    >
      ${headerView(state.videos, prev, send)}
      ${threeView(state.videos, prev, send)}
      ${aboutView(state, prev, send)}
    </div>
  `
}
app.route(`/${baseRoute}`, mainView)

var tree = app.start()
document.body.appendChild(tree)
