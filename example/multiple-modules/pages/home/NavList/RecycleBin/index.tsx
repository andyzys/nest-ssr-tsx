import React, { useMemo, useCallback, useEffect } from 'react'

// @ts-ignore
import { evt } from '@mybricks/rxui'
import { HomePageCtx } from '../../Home'
import { setLocalStorage }from '../../utils'
import { SELECTED_BY_DEFAULT } from '../../../common/const'

// @ts-ignore
import css from '../nav.less'

export default function({
  homePageCtx
}: {homePageCtx: HomePageCtx}) {

  useEffect(() => {
    if (homePageCtx.currentClick?.groupId === 'recycleBin') {
      homePageCtx.tbLoading = true
      homePageCtx.getRecycleBinFiles({params: {userId: homePageCtx.user.userId}, pushState: true}).then(files => {
        homePageCtx.fiels = files
        homePageCtx.tbLoading = false
        homePageCtx.breadTitleAry = [{name: '回收站', icon: 'recycleBin'}]
      })
    }
  }, [])

  const isActive: () => boolean = useCallback(() => {
    return homePageCtx.currentClick?.groupId === 'recycleBin'
  }, [homePageCtx.currentClick])


  const clickWrapper = useCallback(async () => {
    if (homePageCtx.currentClick?.groupId !== 'recycleBin') {
      homePageCtx.tbLoading = true
      homePageCtx.currentClick = {
        groupId: 'recycleBin'
      }

      setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)
      const files = await homePageCtx.getRecycleBinFiles({params: {userId: homePageCtx.user.userId}, pushState: true})

      homePageCtx.fiels = files
      homePageCtx.tbLoading = false
      homePageCtx.breadTitleAry = [{name: '回收站', icon: 'recycleBin'}]
    }
  }, [])

  const RenderWrapper: JSX.Element = useMemo(() => {
    return (
      <span className={css.wrapper}>
        <span className={`${css.title} ${css.noChild}`}>
          <i className={`${css.anticon} ${css.icon}`} >
            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="#658fbf" aria-hidden="true" focusable="false">
              <path d="M640 42.666667a42.666667 42.666667 0 0 1 39.893333 27.584l1.130667 3.370666 33.749333 118.165334H885.333333c1.386667 0 2.773333 0.064 4.117334 0.213333h64C968.874667 192 981.333333 204.48 981.333333 219.861333v29.610667c0 15.381333-12.48 27.861333-27.861333 27.861333h-29.674667l-70.506666 644.672a42.88 42.88 0 0 1-39.210667 38.08l-3.413333 0.128H213.333333a42.88 42.88 0 0 1-42.112-34.837333l-0.512-3.370667L100.181333 277.333333h-29.653333A27.882667 27.882667 0 0 1 42.666667 249.472v-29.610667C42.666667 204.48 55.146667 192 70.528 192h64l2.069333-0.170667 2.069334-0.042666h170.496l33.813333-118.186667a42.666667 42.666667 0 0 1 37.482667-30.784L384 42.666667h256z m197.482667 234.88H186.496l65.28 596.906666h520.426667l65.28-596.906666zM526.805333 426.666667c15.381333 0 27.861333 12.48 27.861334 27.861333v264.256c0 15.402667-12.48 27.882667-27.861334 27.882667h-29.589333A27.882667 27.882667 0 0 1 469.333333 718.805333V454.528c0-15.381333 12.48-27.861333 27.861334-27.861333h29.589333zM607.786667 128h-191.637334l-18.24 63.786667h228.096L607.808 128z"/>
            </svg>
          </i>
          <div className={css.menu}>
            <span className={css.name}>
              <span>回收站</span>
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
