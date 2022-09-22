import React from 'react'
// @ts-ignore
import css from './test.less'

export default function(props: any) {
  return (
    <div>
      <h1 className={css.red}>{props.name}</h1>
      <p className={css.yellow}>这是模块子模块</p>
    </div>
  )
}

