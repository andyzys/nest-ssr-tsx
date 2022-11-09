import React, { useMemo, useEffect, useCallback } from 'react'

import { Layout } from 'antd'
import FolderList from '../FolderList'
import remove from 'lodash/remove'
// @ts-ignore
import { evt, useComputed, useObservable } from '@mybricks/rxui'
import { FANGZHOU_PASS_NAV_MY, SELECTED_BY_DEFAULT } from '../../../common/const'
import { HomePageCtx, deepFindFolder, transformFoldersTree } from '../../Home'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../../utils'

// @ts-ignore
import css from '../nav.less'

class Ctx {
  open
  active
  loading
  dataSource
  clickWrapper
  clickSwitcher
}

export class MyCtx {
  root: boolean
  open: boolean
  loading: boolean
  dataSource: Array<any>

  fetch: (params: {
    linkageWithHome: boolean,
    item: any,
    pushState?: boolean
  }) => void
}

export default function({
  homePageCtx
}: {homePageCtx: HomePageCtx}) {

  const ctx: MyCtx = useObservable(MyCtx, next => {
    const info = Object.assign(
      {open: false, loading: false},
      getLocalStorage(FANGZHOU_PASS_NAV_MY) || {}
    )

    next({
      root: true,
      dataSource: [],
      open: info.open,
      loading: info.open,

      /**
       * 
       * @param linkageWithHome 是否和home数据联动 
       */
      async fetch({linkageWithHome, item, pushState}) {
        // const { id } = homePageCtx.currentClick || {}
        // 表格加载
        if (linkageWithHome) {
          homePageCtx.tbLoading = true
          homePageCtx.currentPermission = '1'
        }

        let params = item

        if (!item) {
          params = null
        } else if (item.root) {
          params = null
        }

        const { files, folderTreeAry, folderTree } = await homePageCtx.getFiles({
          // params: linkageWithHome ? homePageCtx.currentClick : (item || null)
          // 如果和首页有响应关系的话，当前item肯定是homePageCtx.currentClick
          params: linkageWithHome ? homePageCtx.currentClick : params,
          pushState: linkageWithHome && pushState
        })

        // 将文件夹提前
        let folders = remove(files, (file) => file.extName === 'folder')

        if (item?.id) {
          // 文件
          if (linkageWithHome) {
            homePageCtx.breadTitleAry = [void 0, ...folderTreeAry]
            homePageCtx.fiels = folders.concat(files)
            homePageCtx.tbLoading = false
          }

          const openMap = {}

          const currentItem = deepFindFolder(ctx.dataSource, item.id, item.groupId || null)

          if (currentItem.dataSource) {
            currentItem.dataSource.forEach(i => {
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

          currentItem.dataSource = folders
          currentItem.open = true
          currentItem.loading = false
        } else  {
          // 我的
          const myInfo = getLocalStorage(FANGZHOU_PASS_NAV_MY)
          const treeFolders = remove(folderTree, (file) => file.extName === 'folder')
  
          ctx.dataSource = transformFoldersTree(treeFolders, myInfo?.dataSource || [])
          ctx.open = true
          ctx.loading = false
  
          if (linkageWithHome) {
            homePageCtx.breadTitleAry = [void 0, ...folderTreeAry]
            homePageCtx.fiels = (Array.isArray(folders) ? folders : []).concat(files)
            homePageCtx.tbLoading = false
          }
        }
      }
    })
  })

  useEffect(() => {
    homePageCtx.myCtx = ctx
    if (homePageCtx.isMy(homePageCtx.currentClick)) {
      ctx.fetch({linkageWithHome: true, item: ctx})
    } else {
      ctx.fetch({linkageWithHome: false, item: ctx})
    }
  }, [])

  const isActive: () => boolean = useCallback(() => {
    return !!homePageCtx.currentClick
  }, [homePageCtx.currentClick])

  const clickWrapper = useCallback(async (item?: any) => {
    // “我的”被点击，均为管理员权限
    // 点击我的，查询我的下面的文件
    if (!item) {
      if (homePageCtx.currentClick) {
        homePageCtx.currentClick = null

        if (!ctx.open) {
          ctx.loading = true
        }

        await ctx.fetch({linkageWithHome: true, item: ctx})
      } else {
        if (!ctx.open) {

          // 开始加载，并且调用getFiles
          ctx.loading = true

          await ctx.fetch({linkageWithHome: true, item: ctx})
        } else {
          // 如果已经展开的话 就不需要其余操作了
        }
      }
    } else {
      if (item.id !== homePageCtx.currentClick?.id) {
        homePageCtx.currentClick = {...item, navType: 'my'}

        if (!item.open) {
          item.loading = true
        }

        await ctx.fetch({linkageWithHome: true, item})
      } else {
        if (!item.open) {
          item.loading = true
          await ctx.fetch({linkageWithHome: true, item})
        } else {
        }
      }
    }

    if (homePageCtx.currentClick) {
      setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)
    } else {
      removeLocalStorage(SELECTED_BY_DEFAULT)
    }

    setLocalStorage(FANGZHOU_PASS_NAV_MY, {
      open: ctx.open,
      dataSource: ctx.dataSource
    })
  }, [])

  const clickSwitcher = useCallback(async (item?: any) => {
    if (!item) {
      if (ctx.open) {
        ctx.open = false
      } else {

        // 开始加载，并且调用getFiles
        ctx.loading = true

        await ctx.fetch({linkageWithHome: false, item: ctx})

      }
    } else {
      if (item.open) {
        item.open = false
      } else {
        item.loading = true

        await ctx.fetch({linkageWithHome: false, item})
      }
    }

    setLocalStorage(FANGZHOU_PASS_NAV_MY, {
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
            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="#37acff" aria-hidden="true" focusable="false">
              <path d="M512 64c164.949333 0 298.666667 133.717333 298.666667 298.666667 0 7.829333-0.298667 15.594667-0.896 23.296C930.581333 401.237333 1024 504.362667 1024 629.333333c0 95.338667-53.013333 179.754667-132.394667 220.437334l-17.770666 8.725333a897.962667 897.962667 0 0 1-723.669334 0l-12.117333-5.888C55.466667 813.098667 0 726.954667 0 629.333333c0-124.970667 93.44-228.096 214.229333-243.392A297.813333 297.813333 0 0 1 213.333333 362.666667c0-164.949333 133.717333-298.666667 298.666667-298.666667z m0 87.04c-116.885333 0-211.626667 94.741333-211.626667 211.626667l0.149334 8.32 0.490666 8.149333 6.485334 82.752-82.346667 10.410667c-78.485333 9.941333-138.112 77.098667-138.112 157.034666 0 60.906667 32.981333 115.584 83.904 142.4l5.141333 2.581334 10.133334 4.928 10.005333 4.330666c201.834667 85.333333 429.717333 85.333333 631.552 0l9.749333-4.224 10.794667-5.248c51.669333-24.746667 86.357333-78.293333 88.533333-138.709333l0.106667-6.058667a158.357333 158.357333 0 0 0-132.906667-156.288l-5.205333-0.725333-82.24-10.410667 6.4-82.645333c0.405333-5.504 0.618667-11.029333 0.618667-16.597333 0-116.885333-94.741333-211.626667-211.626667-211.626667z m-117.909333 460.586667c1.557333 0.256 3.093333 0.618667 4.629333 1.066666 35.157333 10.389333 72.917333 15.573333 113.28 15.573334 40.362667 0 78.122667-5.184 113.28-15.573334a39.082667 39.082667 0 0 1 49.621333 31.04l1.578667 9.386667a43.52 43.52 0 0 1-31.061333 49.045333c-44.48 12.586667-88.96 18.901333-133.418667 18.901334-44.48 0-88.96-6.293333-133.418667-18.901334a43.52 43.52 0 0 1-31.061333-49.066666l1.578667-9.365334a39.082667 39.082667 0 0 1 44.992-32.106666z"/>
            </svg>
          </i>
          <div className={css.menu}>
            <span className={css.name}>
              <span>我的</span>
            </span>
          </div>
        </span>
      </span>
    )
  }, [])

  return (
    <div className={css.container}>
      <Layout>
        <div className={css.nav}>
          <li
            className={`${isActive() ? '' : css.active}`}
            onClick={evt(() => clickWrapper()).stop}
          >
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
