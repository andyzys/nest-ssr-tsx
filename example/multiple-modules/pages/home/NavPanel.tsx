import React, { useMemo } from 'react'

import NavList from './NavList'
//@ts-ignore
import css from './NavPanel.less'

export default function NavPanel(): JSX.Element {

  const Render = useMemo(() => {
    return (
      <>
        <div className={css['k-sider']}>
          <div className={css['k-common-navigator__logo']}>
            <img draggable={false} src='https://f2.eckwai.com/kos/nlav12333/fangzhou/imgs/icon.png'/>
            <span >方舟</span>
          </div>
  
          <div className={css['k-common-navigator__logo_holder']} />
  
          <div className={css['k-common-navigator']}>
            <div className={`${css['k-home-k-sider-menu']} ${css['k-common-navigator__sider_mine']}`}>
              <NavList />
            </div>
          </div>
        </div>
  
        <div className={css['sider-slider']}>
          <div className={css['sider-slider--visible']} />
        </div>
      </>
    )
  }, [])

  return Render
}
