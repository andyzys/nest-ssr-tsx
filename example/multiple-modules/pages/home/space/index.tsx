import React from 'react'

import Title from './title'
import Content from './content/index'
import WorkSpace from './WorkSpace'
import { HomePageCtx, ModalCtx } from '../Home'
import { observe, useComputed } from '@mybricks/rxui'

//@ts-ignore
import css from './index.less'

/**
 * space
 * @param param0 
 * @returns 
 */
export default function (): JSX.Element {
  const modalCtx = observe(ModalCtx, {from: 'parents'})
  const homePageCtx = observe(HomePageCtx, {from: 'parents'})
  /**
   * 右侧内容
   */
  const RenderSpace: JSX.Element = useComputed(() => {
    return (
      <div className={css.space}>
        <Title homePageCtx={homePageCtx}/>
        <div className={css.content}>
          {
            homePageCtx.currentClick?.groupId === 'home' ?
              <WorkSpace /> :
              <Content homePageCtx={homePageCtx} modalCtx={modalCtx}/>
          }
        </div>
      </div>
    )
  })

  return RenderSpace
}
