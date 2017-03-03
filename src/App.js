import 'tachyons/css/tachyons.css'
import qs from 'querystring'
import { makePath, makeEllipse, makeSpirograph, makeWebFontUrl, mergeColors } from './make-vars'
import makeVars, { schema, uiSchema } from './var-config'

import Slider, { Range } from 'rc-slider'
import Form from "react-jsonschema-form"
import 'rc-slider/assets/index.css'

import React from 'react'

const apiKey = 'AIzaSyAicnK08BLBUTza7RBszpFmaNw6WQWamcg'

class App extends React.Component {
  state = {
    textSize: { x: 80, y: 20 }
  }

  fonts = []

  componentWillMount () {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
      .then((res) => res.json())
      .then((json) => {
        this.fonts = json.items
        if (!this.readState()) this.makeVars()
      })
      .catch((err) => {
        console.error('Could not fetch Google Fonts', err)
        this.fonts = [{ family: 'sans-serif', variants: ['regular'] }]
        if (!this.readState()) this.makeVars()
      })
  }

  writeState = () => {
    const id = window.btoa(JSON.stringify(this.state))
    const querystring = qs.stringify({ id })
    const { origin, pathname } = window.location
    window.history.pushState({ id }, 'SVG', `${origin}${pathname}?${querystring}`)
  }

  readState = () => {
    const { search } = window.location
    const queryObj = search && qs.parse(search.slice(1))
    const state = queryObj ? JSON.parse(window.atob(queryObj.id)) : {}
    this.setState(state)
    return queryObj.id
  }

  componentDidMount () {
    this.storeTextSize()
    document.fonts.onloadingdone = () => this.storeTextSize()
    this.readState()
  }

  componentDidUpdate () {
    this.storeTextSize()
  }

  setTextNode = (c) => { this.textNode = c }

  storeTextSize = () => {
    setTimeout(() => {
      const { textNode } = this
      if (!textNode) return
      const textSize = {
        x: textNode.scrollWidth,
        y: textNode.scrollHeight
      }
      if (textSize.x === this.state.textSize.x && textSize.y === this.state.textSize.y) return
      this.setState({ textSize })
    }, 0)
  }

  makeVars = (cb) => {
    const vars = makeVars()
    const font = makeWebFontUrl(this.fonts)

    this.setState({
      font,
      ...vars
    }, () => {
      this.writeState()
      typeof cb === 'function' && cb()
    })
  }

  makeOnChange = (field) => {
    return (val) => this.setState({ [field]: val })
  }

  onChange = ({ formData }) => {
    this.setState(formData)
  }

  render () {
    const state = { ...this.state }
    const { onChange } = this
    if (!state.colors) return null
    state.path = makePath({ ...state, pointFunc: makeEllipse })
    state.fontColors = state.fontColorRatios.map((ratio) => mergeColors({ colors: state.colors, ratio }))

    return (
      <div className='App flex flex-row flex-wrap'>
        <div style={{ flex: '0 1 60%', minWidth: '600px' }}>
          <Logo state={state} setTextNode={this.setTextNode} />
        </div>
        <div style={{ flex: '1 0 40%' }} className='bg-red'>
          <Form schema={schema} uiSchema={uiSchema} formData={state} onChange={onChange}><div /></Form>
        </div>
        <div className='button-section'>
          <button onClick={this.makeVars}>New SVG</button>
        </div>
      </div>
    )
  }
}

const SliderInput = (props) => {
  let { onChange, label, value, defaultValue } = props

  return (
    <div className='pv1 ph2 ba bw1 b--dotted ma1'>
      <label htmlFor={label} className='db mb2'>{label}</label>
      <input name={label} className='w-100 input-reset' type='number' defaultValue={defaultValue} value={value} onChange={(evt) => onChange(parseInt(evt.target.value, 10))} />
      <Slider className='mt2' {...props} />
    </div>
  )
}

const Logo = ({ state, setTextNode }) => {
  const { viewBox, path, colors, k, l, numPaths, angMult, flipX, flipY, font, fontSize, fontPositionX, fontPositionY, textSize } = state
  const fontPosition = { x: fontPositionX, y: fontPositionY }
  if (!path) return null
  const spirograph = makeSpirograph({ R: 70, k, l, numPoints: numPaths, colors })
  const fontCoords = ['x', 'y'].reduce((coords, axis, ind) => {
    coords[axis] = (viewBox[ind + 2] - textSize[axis]) * fontPosition[axis] + viewBox[ind]
    return coords
  }, {})

  const style = {
    fontFamily: font.family,
    textShadow: `0 0 4px ${colors[1]}`
  }
  if (isNaN(parseInt(font.variant, 10))) style.fontStyle = font.variant
  else style.fontWeight = font.variant

  return (
    <svg style={{ width: '100%' }} viewBox={viewBox.join(' ')}>
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
        const _flipX = ind % flipX ? -1 : 1
        const _flipY = ind % flipY ? -1 : 1
        const matrix = `matrix(${cosMT * _flipX} ${sinMT * _flipY} ${-sinMT * _flipX} ${cosMT * _flipY} 0 0)`
        return (
          <g key={ind} transform={`matrix(${cosT} ${sinT} ${-sinT} ${cosT} ${x} ${y})`}>
            <path d={path} stroke='none' fill={`#${color}`} transform={matrix} />
          </g>
        )
      })}
      <text
        id='logo-text'
        fontSize={fontSize}
        fill={`${colors[0]}`}
        style={style}
        ref={setTextNode}
        transform={`matrix(1 0 0 1 ${fontCoords.x} ${fontCoords.y})`}>
        Foobar
      </text>
    </svg>
  )
}

export default App
