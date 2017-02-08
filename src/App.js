import './App.css'
import { makeVars, makePath, makeEllipse, makeSpirograph } from './make-vars'

import React from 'react'

class App extends React.Component {
  constructor (props) {
    super(props)
    const vars = makeVars()

    this.state = {
      path: makePath({ ...vars, pointFunc: makeEllipse }),
      ...vars
    }
  }

  render () {
    const { path, colors, kn, kd, l, numPaths } = this.state
    const spirograph = makeSpirograph({ R: 70, kn, kd, l, numPoints: numPaths, colors })
    return <div className='App'>
      <svg height={500} width={500} viewBox='-120 -120 240 240'>
        {spirograph.map(({ theta, x, y, color }, ind) => {
          const cosT = Math.cos(theta)
          const sinT = Math.sin(theta)
          return <path key={ind} d={path} stroke='none' fill={`#${color}`} transform={`matrix(${cosT} ${sinT} ${-sinT} ${cosT} ${x} ${y})`} />
        })}
      </svg>
    </div>
  }
}

export default App
