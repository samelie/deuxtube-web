const html = require('choo/html')

const Header = (auth, send) => {

  const onload = (el)=>{
    el.addEventListener('mouseover',(e)=>{
          el.classList.add('is-over')
    })
    el.addEventListener('mouseleave',(e)=>{
          el.classList.remove('is-over')
    })
    el.addEventListener('mouseout',(e)=>{
          el.classList.remove('is-over')
    })
  }

      return html`
        <header class="header"
        onload=${onload}
        >
          <span class="header--title">Deux Tube</span>
          <span class="header--download">
            <a href="" target="_blank">Download for MacOSX</a>
          </span>

        </header>
      `
}

module.exports = Header

