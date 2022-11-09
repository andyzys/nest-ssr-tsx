import React, { useCallback, useMemo, useEffect } from 'react'

import FolderList from '../FolderList'
import { Layout, Tooltip } from 'antd'
// @ts-ignore
import { evt, useComputed, useObservable } from '@mybricks/rxui'

// @ts-ignore
import css from '../nav.less'
import { HomePageCtx, deepFindFolder, transformFoldersTree } from '../../Home'
import { getLocalStorage, setLocalStorage } from '../../utils'
import { FANGZHOU_PASS_NAV_OTHER, templateNamespaces, SELECTED_BY_DEFAULT } from '../../../common/const'
import remove from 'lodash/remove'

export class OtherCtx {
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
  const ctx: OtherCtx = useObservable(OtherCtx, next => {
    function getLocalInfo () {
      return getLocalStorage(FANGZHOU_PASS_NAV_OTHER) || {}
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
  }, {to: 'children'})

  useEffect(() => {
    if (homePageCtx.isSuperUser) {
      homePageCtx.otherCtx = ctx
      homePageCtx.getOtherUserGroups({params: {
        userId: homePageCtx.user.userId
      }}).then(r => {
        ctx.dataSource = r.filter(data => {
          return !templateNamespaces.includes(data.namespace)
        })
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
                homePageCtx.currentClick.navType = 'other'
              }
            } else {
              if (groupId === id) {
                homePageCtx.currentClick.navType = 'other'
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
  
        if (homePageCtx.isOther(homePageCtx.currentClick)) {
          ctx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
        }
      })
    }
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

    setLocalStorage(FANGZHOU_PASS_NAV_OTHER, {
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

      setLocalStorage(SELECTED_BY_DEFAULT, {...item, navType: 'other'})
      
      const { id, extName, groupId } = item
      const { id: currentId, extName: currentExtName } = homePageCtx.currentClick || {}

      homePageCtx.currentClick = {...item, navType: 'other'}
      if (extName !== currentExtName) {

        if (!item.open) {
          item.loading = true
        }

        await ctx.fetch({linkageWithHome: true, item: {...item, navType: 'other'}})

        
      } else if (id !== currentId) {

        if (!item.open) {
          item.loading = true
        }
        await ctx.fetch({linkageWithHome: true, item: {...item, navType: 'other'}})

      } else {
        if (!item.open) {
          item.loading = true
          await ctx.fetch({linkageWithHome: false, item})
        }
      }
    }
    setLocalStorage(FANGZHOU_PASS_NAV_OTHER, {
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
            <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="#0c87fa" aria-hidden="true" focusable="false">
            <path d="M150.186667 129.493333l2.282666 0.042667 2.282667 0.085333 238.272 12.544a171.093333 171.093333 0 0 1 119.552 57.749334 170.176 170.176 0 0 1 111.744-56.426667l6.72-0.469333 240.469333-12.650667 3.157334-0.064a85.333333 85.333333 0 0 1 85.226666 81.066667l0.106667 4.266666v554.730667l-0.106667 3.861333a64 64 0 0 1-52.565333 59.136l-3.84 0.554667-265.408 31.36-5.781333 0.810667a128.576 128.576 0 0 0-81.493334 49.066666l-5.568 7.616c-18.901333 23.829333-53.546667 19.328-68.586666-2.517333l-0.533334 0.384a127.722667 127.722667 0 0 0-84.544-53.717333l-5.76-0.810667-265.045333-31.296a65.28 65.28 0 0 1-57.514667-61.013333l-0.106666-3.818667V216.533333a87.04 87.04 0 0 1 87.04-87.04zM874.666667 215.637333l-239.146667 12.586667-4.352 0.341333a85.333333 85.333333 0 0 0-75.946667 75.114667c0.106667 1.493333 0.170667 2.944 0.213334 4.416l0.085333 5.333333V448h-0.874667L554.666667 601.024c0 14.656-11.136 26.688-25.386667 28.16l-2.901333 0.128h-28.757334a28.288 28.288 0 0 1-28.16-25.386667L469.333333 601.045333l-0.021333-153.066666-0.832 0.021333v-134.549333a84.48 84.48 0 0 0-75.733333-84.053334l-4.309334-0.32L150.186667 216.533333v534.101334l245.845333 29.034666a214.741333 214.741333 0 0 1 116.629333 51.989334 213.76 213.76 0 0 1 107.818667-50.112l7.594667-1.024L874.666667 751.402667V215.637333z"/>
            </svg>
          </i>
          <div className={css.menu}>
            <span className={css.name}>
              <span>其他协作组（管理可见）</span>
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


