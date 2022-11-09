import { useMemo } from 'react'

import Workspace from './workspace'
import My, { MyCtx } from './My'
import Other, { OtherCtx } from './Other'
import IJoined, { IJoinedCtx } from './IJoined'
// import Share, { ShareCtx } from './Share'
import RecycleBin from './RecycleBin'

import { HomePageCtx } from '../Home'
import { observe } from '@mybricks/rxui'
// @ts-ignore
import css from './index.less'

export {
  MyCtx,
  // ShareCtx,
  OtherCtx,
  IJoinedCtx
}

export default function(): JSX.Element {
  const homePageCtx = observe(HomePageCtx, {from: 'parents'})

  const RenderGapline = useMemo(() => {
    return (
      <div className={css.slider}></div>
    )
  }, [])

  return homePageCtx && (
    <div className={css.container}>
      <Workspace homePageCtx={homePageCtx}/>
      {RenderGapline}
      <My homePageCtx={homePageCtx}/>
      <IJoined homePageCtx={homePageCtx}/>
      {homePageCtx.isSuperUser && <Other homePageCtx={homePageCtx}/>}
      {/* <Share homePageCtx={homePageCtx}/> */}
      {RenderGapline}
      <RecycleBin homePageCtx={homePageCtx}/>
    </div>
  )
}
