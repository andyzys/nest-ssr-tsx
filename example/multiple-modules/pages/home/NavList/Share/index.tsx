import React, { useMemo, useEffect, useCallback } from 'react'

import FolderList from '../FolderList'
import { Layout, Tooltip } from 'antd'
// @ts-ignore
import remove from 'lodash/remove'
import { getLocalStorage, setLocalStorage } from '../../utils'
// @ts-ignore
import { evt, useComputed, useObservable } from '@mybricks/rxui'
import { HomePageCtx, deepFindFolder, transformFoldersTree } from '../../Home'
import { FANGZHOU_PASS_NAV_TEMPLATE, SELECTED_BY_DEFAULT } from '../../../common/const'

// @ts-ignore
import css from '../nav.less'
export class ShareCtx {
  open: boolean
  loading: boolean
  dataSource: Array<any>

  getLocalInfo: () => any

  fetch: (params: {
    linkageWithHome: boolean,
    item: any,
    pushState?: boolean
  }) => void
}

export default function({
  homePageCtx
}: {homePageCtx: HomePageCtx}) {

  const ctx: ShareCtx = useObservable(ShareCtx, next => {
    function getLocalInfo () {
      return getLocalStorage(FANGZHOU_PASS_NAV_TEMPLATE) || {}
    }

    const info = Object.assign(
      {open: false, dataSource: []},
      getLocalInfo()
    )

    next({
      dataSource: [],
      open: info.open,
      loading: info.open,
      getLocalInfo,
      async fetch({linkageWithHome, item, pushState}) {
        const { id, extName, groupId } = item
        if (linkageWithHome) {
          homePageCtx.tbLoading = true
        }

        const { files, folderTreeAry } = await homePageCtx.getFiles({
          params: item,
          pushState: linkageWithHome && pushState
        })

        const folders = remove(files, (file) => file.extName === 'folder')

        const firstId = groupId || id

        const group = ctx.dataSource.find(data => data.id === firstId)

        if (linkageWithHome) {
          homePageCtx.breadTitleAry = [group, ...folderTreeAry]
          homePageCtx.fiels = folders.concat(files)
          homePageCtx.tbLoading = false
        }

        const current = deepFindFolder(ctx.dataSource, item.id, item.groupId)

        if (current) {
          if (current.open) {
            const openMap = {}
            if (current.dataSource) {
              current.dataSource.forEach(i => {
                openMap[i.id] = {
                  open: !!i.open,
                  dataSource: i.dataSource
                }
              })
            }
  
            folders.forEach(folder => {
              const { id } = folder
              folder.open = openMap[id]?.open
              folder.dataSource = openMap[id]?.dataSource || []
            })
          }

          current.dataSource = folders
          current.open = true
          current.loading = false
        }
      }
    })
  })

  useEffect(() => {
    homePageCtx.shareCtx = ctx
    homePageCtx.getShareUserGroups().then(r => {
      ctx.dataSource = r
      ctx.loading = false

      const localInfo = ctx.getLocalInfo() || {dataSource: []}
      const dataMap = {}

      localInfo.dataSource?.forEach(({id, open, dataSource}) => {
        dataMap[id] = {
          open: !!open,
          dataSource: dataSource || []
        }
      })

      const { id: currentClickId, groupId } = homePageCtx.currentClick || {}
      
      ctx.dataSource.forEach((data) => {
        const { id } = data
        const info = dataMap[id]

        if (homePageCtx.currentClick) {
          if (homePageCtx.isGroup(homePageCtx.currentClick)) {
            if (currentClickId === id) {
              homePageCtx.currentClick.navType = 'share'
            }
          } else {
            if (groupId === id) {
              homePageCtx.currentClick.navType = 'share'
            }
          }
        }
        
        if (info?.open) {
          data.loading = true
          // 该协作组为展开状态，开始请求组下的文件
          homePageCtx.getFiles({
            params: data,
            pushState: false
          }).then(({folderTree}) => {

            const treeFolders = remove(folderTree, (file) => file.extName === 'folder')
            const dataSource = transformFoldersTree(treeFolders, info.dataSource)

            data.dataSource = dataSource
            data.open = true
            data.loading = false
          })
        }
      })

      if (homePageCtx.isShare(homePageCtx.currentClick)) {
        ctx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
      }
    })
  }, [])

  const createGroup = useCallback(() => {
    homePageCtx.createGroup({user: homePageCtx.user}).then(() => {
      ctx.loading = true
      homePageCtx.getUserGroups({params: {
        userId: homePageCtx.user.userId
      }}).then(r => {
        ctx.dataSource = r
        ctx.loading = false
      })
    })
  }, [])

  const clickSwitcher = useCallback(async (item?: any) => {
    if (!item) {
      ctx.open = !ctx.open
    } else {
      if (item.open) {
        item.open = false
      } else {
        item.loading = true
        await ctx.fetch({linkageWithHome: false, item})
      }
    }

    setLocalStorage(FANGZHOU_PASS_NAV_TEMPLATE, {
      open: ctx.open,
      dataSource: ctx.dataSource
    })
  }, [])

  const clickWrapper = useCallback(async (item?: any) => {
    if (!item) {
      if (!ctx.open) {
        ctx.open = true
      }
    } else {
      setLocalStorage(SELECTED_BY_DEFAULT, {...item, navType: 'share'})
      
      const { id, extName, groupId } = item
      const { id: currentId, extName: currentExtName } = homePageCtx.currentClick || {}

      homePageCtx.currentClick = {...item, navType: 'share'}

      if (extName !== currentExtName) {
        if (!item.open) {
          item.loading = true
        }

        await ctx.fetch({linkageWithHome: true, item: {...item, navType: 'share'}})
      } else if (id !== currentId) {
        if (!item.open) {
          item.loading = true
        }

        await ctx.fetch({linkageWithHome: true, item: {...item, navType: 'share'}})
      } else {
        if (!item.open) {
          item.loading = true
          await ctx.fetch({linkageWithHome: false, item})
        }
      }
    }

    setLocalStorage(FANGZHOU_PASS_NAV_TEMPLATE, {
      open: ctx.open,
      dataSource: ctx.dataSource
    })
  }, [])

  const RenderTreeSwitcher: JSX.Element = useComputed(() => {
    return (
      <span className={css.treeSwitcher} onClick={evt(() => clickSwitcher()).stop}>
      </span>
    )
  })

  const RenderWrapper: JSX.Element = useMemo(() => {
    return (
      <span className={css.wrapper}>
        <span className={css.title}>
          <i className={`${css.anticon} ${css.icon}`} >
            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="#945ffc" aria-hidden="true" focusable="false">
              <path d="M555.52 46.464l332.458667 191.936a97.92 97.92 0 0 1 48.96 84.8v377.6a97.92 97.92 0 0 1-48.96 84.8L555.52 977.536a87.04 87.04 0 0 1-87.04 0L136.021333 785.6a97.92 97.92 0 0 1-48.96-84.8v-377.6a97.92 97.92 0 0 1 48.96-84.8L468.48 46.464a87.04 87.04 0 0 1 87.04 0zM512 121.813333L179.541333 313.770667a10.88 10.88 0 0 0-5.269333 7.509333l-0.170667 1.92v377.6a10.88 10.88 0 0 0 3.882667 8.32l1.557333 1.109333L512 902.165333l332.458667-191.936a10.88 10.88 0 0 0 5.269333-7.509333l0.170667-1.92v-377.6a10.88 10.88 0 0 0-3.882667-8.32l-1.557333-1.109333L512 121.834667zM526.378667 320c15.616 0 28.288 12.672 28.288 28.288v177.194667l140.309333 81.024c13.397333 7.722667 17.984 24.853333 10.261333 38.250666l-14.656 25.386667a28.010667 28.010667 0 0 1-38.272 10.24l-136.234666-78.634667a28.16 28.16 0 0 1-4.096-2.88l-1.642667 1.322667-2.410667 1.557333-136.234666 78.656a28.010667 28.010667 0 0 1-36.693334-7.850666l-1.578666-2.410667-14.656-25.386667a28.010667 28.010667 0 0 1 7.850666-36.693333l2.410667-1.557333L469.333333 525.482667v-177.194667c0-15.616 12.672-28.288 28.288-28.288h28.757334z"/>
            </svg>
          </i>
          <div className={css.menu}>
            <span className={css.name}>
              <span>分享模版</span>
            </span>
          </div>
        </span>
      </span>
    )
  }, [])

  const RenderAction: JSX.Element = useComputed(() => {
    return homePageCtx.HackSuperUser && (
      <div className={css.actionContainer}>
        <div className={css.createGroup} onClick={evt(createGroup).stop}>
          <Tooltip placement='top' title={'新建协作组'}>
          </Tooltip>
        </div>
      </div>
    )
  })

  return (
    <div className={css.container}>
      <Layout>
        {RenderAction}
        <div className={css.nav}>
          <li onClick={evt(() => clickWrapper()).stop}>
            {RenderTreeSwitcher}
            {RenderWrapper}
          </li>
        </div>
        <div style={{display: ctx.open ? 'block' : 'none'}}>
          <FolderList
            active={homePageCtx.currentClick}
            dataSource={ctx.dataSource}
            clickWrapper={(item) => clickWrapper(item)}
            clickSwitcher={(item) => clickSwitcher(item)}
          />
        </div>
      </Layout>
    </div>
  )
}


