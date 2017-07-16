import React from 'react'
import SliderComponent from 'rc-slider'

export function FieldTemplate ({id, classNames, label, help, required, description, errors, children}) {
  return (
    <div className={`pa1 ${classNames}`}>
      <label htmlFor={id} className='f6 b db mb2'>{label}</label>
      {children}
      {description}
      {help}
    </div>
  )
}

export function Slider ({ value, onChange, schema }) {
  return (
    <div className='flex row items-center'>
      <SliderComponent value={value} onChange={onChange} min={schema.minimum} max={schema.maximum} step={schema.type === 'integer' ? 1 : numString(schema.multipleOf)} />
      <div className='f3 ml3'>
        <input className='mw4' type='number' step={schema.multipleOf} value={value} onChange={(evt) => onChange(evt.target.value)} />
      </div>
    </div>
  )
}

function numString (num) {
  const str = num.toString()
  const expData = str.match(/^(\d)(?:\.(\d+))?e([\+\-])(\d+)$/)
  if (!expData) return str
  if (expData[3] === '-') {
    return '0.' + Array(parseInt(expData[4], 10) - 1).fill(0).join('') + expData[1] + (expData[2] || '')
  }
}
