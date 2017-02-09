import './App.css'
import { makeVars, makePath, makePathLine, makeEllipse, makeSpirograph, makeWebFontUrl } from './make-vars'

import React from 'react'

const apiKey = 'AIzaSyAicnK08BLBUTza7RBszpFmaNw6WQWamcg'

class App extends React.Component {
  state = {}

  fonts = []

  componentWillMount () {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
      .then((res) => res.json())
      .then((json) => {
        this.fonts = json.items
        this.makeVars()
      })
      .catch((err) => console.error('Could not fetch Google Fonts', err))
  }

  makeVars = () => {
    const vars = makeVars()
    const font = makeWebFontUrl(this.fonts)

    this.setState({
      path: makePath({ ...vars, pointFunc: makeEllipse }),
      font,
      ...vars
    })
  }

  render () {
    const { path, colors, kn, kd, l, numPaths, angMult, font, fontSize, fontPosition, fontColor } = this.state
    if (!path) return null
    const spirograph = makeSpirograph({ R: 70, kn, kd, l, numPoints: numPaths, colors })
    return (
      <div className='App'>
        <svg height={500} width={750} viewBox='-180 -120 360 240'>
          <defs>
            <style type='text/css'>
              @import url({font.url});
            </style>
          </defs>
          {spirograph.map(({ theta, x, y, color }, ind) => {
            const cosT = Math.cos(theta)
            const sinT = Math.sin(theta)
            const cosMT = Math.cos(theta * angMult)
            const sinMT = Math.sin(theta * angMult)
            return (
              <g key={ind} transform={`matrix(${cosT} ${sinT} ${-sinT} ${cosT} ${x} ${y})`}>
                <path d={path} stroke='none' fill={`#${color}`} transform={`matrix(${cosMT} ${sinMT} ${-sinMT} ${cosMT} 0 0)`} />
              </g>
            )
          })}
          <text
            fontSize={fontSize}
            fill={`#${fontColor}`}
            style={{ fontFamily: font.family, fontStyle: font.variant }}
            transform={`matrix(1 0 0 1 ${fontPosition.x} ${fontPosition.y})`}>
            Foobar
          </text>
        </svg>
        <div className='button-section'>
          <button onClick={this.makeVars}>New SVG</button>
        </div>
      </div>
    )
  }
}

export default App
