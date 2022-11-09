import React, { useCallback} from 'react'

import Main from './main'
import SearchModal from './searchModal'
import { HomePageCtx } from '../../Home'
import { useObservable } from 'rxui-lite'

//@ts-ignore
import css from './index.less'

class TitleCtx {
  mdListData: any[] = []
  mdVisible: boolean = false
  mdListLoading: boolean = false
}

export type ChildProps = {
  titleCtx: TitleCtx
  homePageCtx: HomePageCtx

  onCancel?: () => void
}

type Props = {
  homePageCtx: HomePageCtx
}

export default function Title({homePageCtx}: Props): JSX.Element {
  const titleCtx: TitleCtx = useObservable(TitleCtx)

  const onCancel: () => void = useCallback(() => {
    titleCtx.mdVisible = false
    titleCtx.mdListData = []
  }, [])

  return (
    <div className={css.container}>
      <Main homePageCtx={homePageCtx} titleCtx={titleCtx}/>
      <SearchModal homePageCtx={homePageCtx} titleCtx={titleCtx} onCancel={onCancel}/>
    </div>
  )
}
