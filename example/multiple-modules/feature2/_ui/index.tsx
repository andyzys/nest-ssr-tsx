import React from 'react'
// @ts-ignore
import css from './index.less'
import Hello from './hello/test'

export default function(props: any) {
  return (
    <div>
      <h1 className={css.red}>{props.name}</h1>
      <p className={css.green}>这是模块2With prettified output</p>
      <Hello />
      <Hello />
      <Hello />
    </div>
  )
}

