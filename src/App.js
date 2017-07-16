import 'tachyons/css/tachyons.css'
import qs from 'querystring'
import eql from 'deep-eql'
import Draggable from 'react-draggable'
import merge from 'lodash.merge'
import { makePath, makeEllipse, makeSpirograph, mergeColors } from './make-vars'
import makeVars, { schema, uiSchema, makeWebFontUrl } from './var-config'
import { FieldTemplate } from './form-components'

import Form from 'react-jsonschema-form'
import 'rc-slider/assets/index.css'

import React from 'react'

const apiKey = 'AIzaSyAicnK08BLBUTza7RBszpFmaNw6WQWamcg'

class App extends React.Component {
  state = {}

  componentWillMount () {
    window.fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ fonts: json.items })
      })
      .catch((err) => {
        console.error('Could not fetch Google Fonts', err)
        this.setState({ fonts: [{ family: 'sans-serif', variants: ['regular'] }] })
      })
  }

  render () {
    const { fonts } = this.state
    if (!fonts) return null

    return <Page fonts={fonts} />
  }
}

export default App

class Page extends React.Component {
  state = {
    repositioned: false
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
    if (!this.readState()) this.makeVars()
  }

  makeVars = (cb) => {
    makeVars(this.props)
      .then((vars) => {
        this.setState({ ...vars, repositioned: false }, () => {
          this.writeState()
          typeof cb === 'function' && cb()
        })
      })
      .catch((err) => {
        console.error('Error making variables', err)
      })
  }

  onChange = (data) => {
    this.setState((s) => merge(s, data))
  }

  onResetPositioning = () => {
    this.setState({ repositioned: true })
  }

  render () {
    const data = { ...this.state }
    const { fonts } = this.props
    const { onChange } = this
    if (!data.colors) return null
    data.graphic.path = makePath({ ...data.graphic, pointFunc: makeEllipse })
    data.text.textColors = data.text.textColorRatios.map((ratio) => mergeColors({ colors: data.colors, ratio }))

    return (
      <div className='App flex flex-row flex-wrap'>
        <div style={{ flex: '0 1 60%', minWidth: '600px' }}>
          <Logo data={data} onChange={onChange} repositioned={this.state.repositioned} />
          <div className='button-section'>
            <button onClick={this.makeVars} className='f6 link dim br3 ba bw1 ph3 pv2 mb2 dib dark-gray bg-transparent b--dark-gray'>New SVG</button>
          </div>
        </div>
        <div style={{ flex: '1 0 40%' }} className='bg-red vh-100 overflow-scroll'>
          <Form
            schema={schema(fonts, data.text.font.family)}
            uiSchema={uiSchema}
            formData={data}
            onChange={({ formData }) => onChange(formData)}
            FieldTemplate={FieldTemplate}>
            <div />
          </Form>
        </div>
      </div>
    )
  }
}

class Logo extends React.Component {
  state = {
    graphic: {
      x: 0,
      y: 0,
      bBox: { height: 0, width: 0, x: 0, y: 0 }
    },
    text: {
      x: 0,
      y: 0,
      bBox: { height: 0, width: 0, x: 0, y: 0 }
    }
  }

  componentDidMount () {
    this.storeSizes()
    document.fonts.onloadingdone = this.storeSizes
  }

  componentDidUpdate () {
    this.storeSizes()
  }

  setGraphicNode = (c) => { this.graphicNode = c }
  setTextNode = (c) => { this.textNode = c }

  storeSizes = () => {
    return Promise.all([this.storeGraphicSize(), this.storeTextSize()])
      .then(([graphicBBox, textBBox]) => {
        console.log(graphicBBox.width)
        if (this.props.repositioned) return
        const { graphic } = this.state
        graphic.scale = 180 / graphicBBox.width
        this.setState({ graphic })
      })
      .catch((err) => console.error(err))
  }

  storeGraphicSize = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { graphicNode } = this
        if (!graphicNode) return
        const bBox = graphicNode.getBBox()
        if (eql(this.state.graphic.bBox, bBox)) return
        this.setState((state) => {
          Object.assign(state.graphic, { bBox })
          return state
        }, () => resolve(bBox))
      }, 0)
    })
  }

  storeTextSize = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { textNode } = this
        if (!textNode) return
        const bBox = textNode.getBBox()
        if (eql(this.state.text.bBox, bBox)) return
        this.setState((state) => {
          Object.assign(state.text, { bBox })
          return state
        }, () => resolve(bBox))
      }, 0)
    })
  }

  getCoords = (position, elementName) => {
    const { viewBox } = this.props.data
    const bBox = this.state[elementName].bBox

    return {
      x: (viewBox[2] - bBox.width) * position.x + viewBox[0] - bBox.x,
      y: (viewBox[3] - bBox.height) * position.y + viewBox[1] - bBox.y
    }
  }

  updatePosition = (elementName) => (_, { x, y }) => {
    const { onChange, data: { viewBox } } = this.props
    const bBox = this.state[elementName].bBox
    const newPosition = {
      x: (x - viewBox[0] + bBox.x) / (viewBox[2] - bBox.width),
      y: (y - viewBox[1] + bBox.y) / (viewBox[3] - bBox.height)
    }

    onChange({ [elementName]: { position: newPosition } })
  }

  render () {
    const data = { ...this.props.data }
    data.graphic = { ...data.graphic, scale: data.graphic.scale * this.state.graphic.scale }
    const { viewBox, colors } = data
    const { path, k, l, numPaths } = data.graphic
    const { font, textColors, name, textTransform, letterSpacing } = data.text
    const { setTextNode, setGraphicNode, getCoords, updatePosition } = this
    if (!path) return null

    const spirograph = makeSpirograph({ R: 70, k, l, numPoints: numPaths, colors })
    const graphicCoords = getCoords(data.graphic.position, 'graphic')
    const textCoords = getCoords(data.text.position, 'text')

    const style = {
      fontFamily: font.family,
      userSelect: 'none',
      textTransform,
      letterSpacing
      // textShadow: `0 0 4px ${colors[1]}`
    }

    if (isNaN(parseInt(font.variant, 10))) style.fontStyle = font.variant
    else style.fontWeight = font.variant

    return (
      <svg className='ba' style={{ width: '100%' }} viewBox={viewBox.join(' ')}>
        <defs>
          <style type='text/css'>
            @import url({makeWebFontUrl(font)})
          </style>
        </defs>
        <LogoGraphic {...data.graphic} spirograph={spirograph} setGraphicNode={setGraphicNode} graphicCoords={graphicCoords} onDrag={updatePosition('graphic')} />
        <LogoText {...data.text} color={textColors[0]} style={style} setTextNode={setTextNode} textCoords={textCoords} name={name} onDrag={updatePosition('text')} />
      </svg>
    )
  }
}

const LogoText = ({ fontSize, color, style, setTextNode, textCoords, name, onDrag }) => (
  <Draggable position={textCoords} onDrag={onDrag}>
    <text
      id='logo-text'
      fontSize={fontSize}
      fill={`${color}`}
      style={style}
      ref={setTextNode}>
      {name}
    </text>
  </Draggable>
)

const LogoGraphic = ({ spirograph, flipX, flipY, setGraphicNode, graphicCoords, path, scale, angMult, onDrag }) => (
  <Draggable position={graphicCoords} onDrag={onDrag}>
    <g ref={setGraphicNode}>
      <g transform={`matrix(${scale} 0 0 ${scale} 0 0)`}>
        {spirograph.map(({ theta, x, y, color }, ind) => {
          if (!ind) console.log('Scale', scale)
          const cosT = Math.cos(theta)
          const sinT = Math.sin(theta)
          const cosMT = Math.cos(theta * angMult)
          const sinMT = Math.sin(theta * angMult)
          const _flipX = ind % flipX ? -1 : 1
          const _flipY = ind % flipY ? -1 : 1
          const matrix = `matrix(${cosMT * _flipX} ${sinMT * _flipY} ${-sinMT * _flipX} ${cosMT * _flipY} 0 0)`
          return (
            <g key={ind} transform={`matrix(${cosT} ${sinT} ${-sinT} ${cosT} ${x} ${y})`}>
              <path d={path} stroke='none' fill={`${color}`} transform={matrix} />
            </g>
          )
        })}
      </g>
    </g>
  </Draggable>
)
