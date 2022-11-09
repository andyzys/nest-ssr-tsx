import React from 'react'

import { ChildProps } from '..'
import { Popover, Breadcrumb } from 'antd'
import { getIconInfo } from '../../../components/Icon'
import { SELECTED_BY_DEFAULT } from '../../../../common/const'
import { setLocalStorage, removeLocalStorage } from '../../../utils'

// @ts-ignore
import css from '../index.less'

/**
 * 当前路径
 */
export default function TitleBreadCrumb ({homePageCtx}: ChildProps): JSX.Element {
  let breadTitleAry: any[] = [...homePageCtx.breadTitleAry]

  const length: number = breadTitleAry.length
  const firstTitle: any = breadTitleAry[0]

  if (length > 3) {
    breadTitleAry = [firstTitle, breadTitleAry.slice(1, length - 1), breadTitleAry[length - 1]]
  }

  let iconKey: string = 'my'

  if (firstTitle) {
    iconKey = firstTitle.icon || 'fangzhou_icon_huojian'
  }

  return (
    <div className={css.breadCrumb}>
      {!length ? '暂无数据，请在左侧文件树选择' : <span className={css['title-breadcrumb-container-icon']}>
      {getIconInfo({key: iconKey, width: '32px'}).icon}
      </span>}
      <div className={css.path}>
        <Breadcrumb separator={<span className={css.rightIcon}/>}>
          {breadTitleAry.map((item, idx) => {
            if (Array.isArray(item)) {
              return (
                <Breadcrumb.Item key={idx}>
                  <Popover
                    placement='bottom'
                    overlayClassName='createPopover'
                    content={() => {
                      return (
                        <>
                          {item.map(t => {
                            return (
                              <div key={t.id} className='btn' onClick={async () => {
                                const { navType } = homePageCtx.currentClick

                                if (navType === 'unauthorizedGroup') {
                                  const { id, groupId } = t

                                  if (groupId) {
                                    homePageCtx.currentClick = {
                                      navType,
                                      groupId,
                                      folderId: t.id
                                    }
                                  } else if (id) {
                                    homePageCtx.currentClick = {
                                      navType,
                                      id: t.id
                                    }
                                  }

                                  homePageCtx.unauthorizedGroup()
                                } else {
                                  homePageCtx.currentClick = {...t, navType}
                                }
                                // const { navType } = homePageCtx.currentClick

                                // homePageCtx.currentClick = {...t, navType}

                                setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)

                                itemClick(homePageCtx)
                              }}>
                                {t.name}
                              </div>
                            )
                          })}
                        </>
                      )
                    }}
                  >
                    <div className={css.ellipsisIcon}>
                    </div>
                  </Popover>
                </Breadcrumb.Item>
              )
            }

            return (
              <Breadcrumb.Item
                key={idx}
                className={`${css.span} ${idx !== breadTitleAry.length - 1 ? css.link : ''}`}
                onClick={async () => {
                  if (idx !== breadTitleAry.length - 1) {
                    if (!item) {
                      homePageCtx.currentClick = null
                      removeLocalStorage(SELECTED_BY_DEFAULT)
                    } else {
                      const { navType } = homePageCtx.currentClick

                      if (navType === 'unauthorizedGroup') {
                        const { id, groupId } = item

                        if (groupId) {
                          homePageCtx.currentClick = {
                            navType,
                            groupId,
                            folderId: item.id
                          }
                        } else if (id) {
                          homePageCtx.currentClick = {
                            navType,
                            id: item.id
                          }
                        }

                        homePageCtx.unauthorizedGroup()
                      } else {
                        homePageCtx.currentClick = {...item, navType}
                      }

                      setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)
                    }
                    
                    itemClick(homePageCtx)
                  }
                }}
              >
                {item?.name || '我的'}
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      </div>
    </div>
  )
}

function itemClick(homePageCtx) {
  if (homePageCtx.isMy(homePageCtx.currentClick)) {
    homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
  } else if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
    homePageCtx.iJoinedCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
  } else if (homePageCtx.isOther(homePageCtx.currentClick)) {
    homePageCtx.otherCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
  } 
  // else if (homePageCtx.isShare(homePageCtx.currentClick)) {
  //   homePageCtx.shareCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
  // }
}
