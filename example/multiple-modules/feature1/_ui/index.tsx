import React from 'react'
// @ts-ignore
import css from './index.less'

export default function(props: any) {
  return (
    <div>
      <h1 className={css.red}>{props.name}</h1>
      <p className={css.green}>这是模块1With prettified output</p>
    </div>
  )
}

