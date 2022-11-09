import React, { useMemo } from 'react'

import { Popover } from 'antd'
import { ChildProps } from '..'
import { roleDescMap, extNames } from '../../../../common/const'
import { getIconInfo } from '../../../components/Icon'

// @ts-ignore
import css from '../index.less'

// TODO hidden，暂时不开放，超级管理员小组可见，后续提供人员配置应用
/**
 * titleActions
 * @param key         对应file表ext_name
 * @param title       title
 * @param hidden      暂时不开放，超级管理员小组可见，后续提供人员配置应用
 * @param useDivider  是否在按钮上方画一条分割线
 * @param useForGroup 是否只用于协作组
 */
export const titleActions: Array<{
  key: string
  title: string
  hidden?: boolean
  useDivider?: boolean
  useForGroup?: boolean
}> = [
  // {title: '电商营销活动', key: 'eca', hidden: true},
  {title: '文件夹', key: 'folder'},
  {title: 'H5页面', key: 'kh5', useDivider: true},
  {title: '营销活动', key: 'h5act'},
  {title: 'C端大促', key: 'promotion', hidden: true},
  {title: 'KRN页面（内测）', key: 'krn', hidden: true},
  {title: '一码多端（内测）', key: 'ktaro', hidden: true},
  {title: '中后台页面', key: 'pcspa', useDivider: true},
  {title: '海报图片（战报、公告等）', key: 'poster', hidden: false},
  {title: '云组件', key: 'cdm', useDivider: true},
  { title: "卡片", key: "card" },
  {title: 'Kconf配置', key: 'kconf'},
  { title: '模版向导', key: 'tplg', useDivider: true, hidden: true },
  {title: '服务接口（内测）', key: 'service', hidden: true},
  {title: '接口模板（内测）', key: 'service-tpl', hidden: true},
  {title: '组件库', key: 'comlib', useForGroup: true},
  // {title: 'h5组件', key: 'kh5com', hidden: true}
  // {title: '文件夹', key: 'folder', useDivider: true}
  // TODO: 隐藏纪元选项
  {title: '纪元页面', key: 'dynamics', useDivider: true, hidden: true},
  { title: '流程页面', key: extNames.PROC_PCSPA, hidden: true },
]

/**
 * 操作，当前仅新建
 */
export default function TitleActions ({ctx, modalCtx, homePageCtx}: ChildProps): JSX.Element {
  const Render: JSX.Element = useMemo(() => {
    const isEditRole = homePageCtx?.currentPermission === roleDescMap.EDITOR
    const isAdmin = homePageCtx?.currentPermission === roleDescMap.ADMIN
    const createRole = !homePageCtx.currentClick || (isEditRole || isAdmin)

    const { groupId } = homePageCtx.currentClick || {}

    let show = !homePageCtx.isShare(homePageCtx.currentClick) && createRole

    if (groupId === 'recycleBin') {
      show = false
    } else if (homePageCtx.HackSuperUser) {
      show = true
    }

    const isMy = homePageCtx.isMy(homePageCtx.currentClick)

    return (
      <div className={css.actions}>
         {
            show && (
              <div className={css.btn}>
                <div className={css.actions}>
                  <Popover
                    placement='bottomRight'
                    overlayClassName='createPopover'
                    overlayStyle={{
                      width: 230
                    }}
                    onVisibleChange={(v) => {
                      ctx.createVisible = v
                    }}
                    visible={ctx.createVisible}
                    content={() => {
                      return (
                        <div className={css.popoverContentWrapper}>
                          {titleActions.filter(t => {
                            // return true;
                            if (t.key === 'card') {
                              return homePageCtx.isSuperUser
                            } else {
                              return true
                            }
                          }).map(({
                            key,
                            title,
                            hidden,
                            useDivider,
                            useForGroup
                          }) => (
                            (!hidden || homePageCtx.isSuperUser) && (isMy ? !useForGroup : true) &&  <>
                            {useDivider && <div className='divider' style={{margin: '6px 0'}}/>}
                            <div className={css.contentBtn} onClick={() => {
                              ctx.createVisible = false
                              homePageCtx.createFile(key, modalCtx)
                            }}>
                              <span style={{marginRight: 8, display: 'flex'}}>{getIconInfo({key, width: '32px'}).icon}</span>
                              {title}
                            </div>
                            </>
                          ))}
                          
                        </div>
                      )
                    }}
                  >
                    <div className={css.btn}>
                      <span>新建</span>
                    </div>
                  </Popover>
                </div>
              </div>
            )
          }
      </div>
    )
  }, [ctx.createVisible, homePageCtx?.currentPermission])

  return Render
}
