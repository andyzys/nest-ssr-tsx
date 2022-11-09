import React from 'react'

import { ChildProps } from '../..'

// @ts-ignore
import css from '../../index.less'

/**
 * 内容标题
 * TODO
 */
export default function ContentTitle ({ctx, homePageCtx}: ChildProps): JSX.Element {
  const navType = homePageCtx.currentClick?.navType
  let show = navType && !['my'].includes(navType)

  if (navType === 'share' && !homePageCtx.HackSuperUser) {
    show = false
  }
  
  return (
    <div className={css.contentTitle}>
      <span
        className={`${css.icon} ${css.vatoLeft}`}
        style={{visibility: (ctx.openCard && ctx.showCard) ? 'hidden' : (!show ? 'hidden' : 'visible')}}
        onClick={() => {
          ctx.showCard = true
        }}
      />
    </div>
  )
}
