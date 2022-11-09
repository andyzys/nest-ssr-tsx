import React from 'react'

import Left from './left'
import Right from './right'

import { ChildProps } from '..'

// @ts-ignore
import css from '../index.less'

export default function Content (props: ChildProps): JSX.Element {
  return (
    <div className={css.content}>
      <Left {...props}/>
      <Right {...props}/>
    </div>
  )
}