import React, { useMemo, useCallback } from 'react'

// @ts-ignore
import { evt } from '@mybricks/rxui'
import { HomePageCtx } from '../../Home'
import { setLocalStorage }from '../../utils'
import { SELECTED_BY_DEFAULT } from '../../../common/const'
import crypto from 'crypto-js'

// @ts-ignore
import css from '../nav.less'

export default function workspace ({
  homePageCtx
}: {homePageCtx: HomePageCtx}) {

  const isActive: () => boolean = useCallback(() => {
    return homePageCtx.currentClick?.groupId === 'home'
  }, [homePageCtx.currentClick])

  const clickWrapper = useCallback(async () => {
    if (homePageCtx.currentClick?.groupId !== 'home') {
      homePageCtx.currentClick = {
        groupId: 'home'
      }
      setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)

      // const ciphertext = crypto.AES.encrypt('home', 'lianglihao').toString()
      // window.history.pushState({current: JSON.stringify({groupId: 'home'})}, '', `/paas/${ciphertext}`)

      window.history.pushState({current: JSON.stringify({groupId: 'home'})}, '', '?groupId=home')
    }
  }, [])

  const RenderWrapper: JSX.Element = useMemo(() => {
    return (
      <span className={css.wrapper}>
        <span className={`${css.title} ${css.noChild}`}>
          <i className={`${css.anticon} ${css.icon}`} >
            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="#0c63fa" aria-hidden="true" focusable="false">
              <path d="M563.968 82.261333l338.090667 257.6a128.64 128.64 0 0 1 49.898666 116.522667l-47.488 427.306667A85.76 85.76 0 0 1 819.242667 960H204.757333a85.76 85.76 0 0 1-85.226666-76.288l-47.488-427.306667a128.64 128.64 0 0 1 49.898666-116.544L460.032 82.261333a85.76 85.76 0 0 1 103.936 0zM512 150.485333L173.909333 408.085333a42.88 42.88 0 0 0-16.874666 35.392l0.234666 3.434667L204.757333 874.24h614.485334l47.488-427.306667a42.88 42.88 0 0 0-13.973334-36.650666l-2.666666-2.197334L512 150.485333zM526.805333 448c15.381333 0 27.861333 12.48 27.861334 27.861333v285.589334c0 15.402667-12.48 27.882667-27.861334 27.882666h-29.589333A27.882667 27.882667 0 0 1 469.333333 761.450667V475.861333c0-15.381333 12.48-27.861333 27.882667-27.861333h29.589333z"></path>
            </svg>
          </i>
          <div className={css.menu}>
            <span className={css.name}>
              <span>首页</span>
            </span>
          </div>
        </span>
      </span>
    )
  }, [])

  return (
    <div className={css.nav}>
      <li
        className={`${isActive() ? css.active : '' }`}
        onClick={evt(clickWrapper).stop}
      >
        {RenderWrapper}
      </li>
    </div>
  )
}