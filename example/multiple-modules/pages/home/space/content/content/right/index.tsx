import React from 'react'

import InfoCard from './infoCard'
import { ChildProps } from '../../'

// @ts-ignore
import css from '../../index.less'

export default function Right (props: ChildProps): JSX.Element {
  return (
    <div className={css.contentRight}>
      <InfoCard {...props}/>
    </div>
  )
}