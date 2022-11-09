import React from 'react'

import { ChildProps } from '../'
import TitleActions from './titleActions'
import TitleBreadCrumb from './titleBreadCrumb'

// @ts-ignore
import css from '../index.less'

export default function Title (props: ChildProps) {
  return (
    <div className={css.title}>
      <TitleBreadCrumb {...props}/>
      <TitleActions {...props}/>
    </div>
  )
}