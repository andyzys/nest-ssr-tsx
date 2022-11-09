import React, { useMemo, useEffect, useCallback } from 'react'

import { get } from '../../../common/utils'
import { useComputed } from 'rxui-lite'
import { fileNameClick } from '../content'
import { getIconInfo } from '../../components/Icon'
import debounce from 'lodash/debounce'

import {
  List,
  Input,
  Modal,
  Divider,
  ModalProps
} from 'antd'

// @ts-ignore
import css from './index.less'

import { ChildProps } from '.'

type Item = {
  name: string
  icon: string
  path: Array<Item>
  extName: string
  updateTime: string
  creatorName: string
  description: string
}

export default function SearchModal ({homePageCtx, titleCtx, onCancel}: ChildProps): JSX.Element {
  useEffect(() => {
    if (titleCtx.mdVisible) {

      getList({value: ''})
    }
  }, [titleCtx.mdVisible])
  /**
   * 文件类型跳转设计页
   */
  const ListItemClick: (e: any, item: Item) => void = useCallback((e, item) => {
    fileNameClick(e, {...item, navType: false}, homePageCtx)
    onCancel()
  }, [])

  const getList: ({value}: {value: string}) => void = useCallback(({value}) => {
    titleCtx.mdListLoading = true
    get(`/api/paas/home/globalSearch?name=${value}&userId=${homePageCtx.user.userId}&limit=20&offset=0`).then(res => {
      const { list, path } = res.data
      list.forEach((item, idx) => {
        item.path = path[idx]
      })
      titleCtx.mdListData = list
    }).catch((e) => {
      console.error(e)
    }).finally(() => {
      titleCtx.mdListLoading = false
    })
  }, [])

  const ModalTitle: JSX.Element = useMemo(() => {
    return (
      <div className={css.mdTitle}>
        <div className={css.left}>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12684" width="16px" height="16px"><path d="M862.4 940.6H160.2c-13.2 0-24-10.8-24-24V100.1c0-13.2 10.8-24 24-24h702.2c13.2 0 24 10.8 24 24v816.5c0 13.2-10.8 24-24 24z" fill="#999999" p-id="12685"></path><path d="M846.4 941.7H176.2c-22 0-40-18-40-40V117.2c0-22 18-40 40-40h670.2c22 0 40 18 40 40v784.5c0 22-18 40-40 40z" fill="#4692f3" p-id="12686"></path><path d="M291.2 291.5m-34.5 0a34.5 34.5 0 1 0 69 0 34.5 34.5 0 1 0-69 0Z" fill="#FCFCFC" p-id="12687"></path><path d="M755.1 326H398c-6.6 0-12-5.4-12-12v-44.9c0-6.6 5.4-12 12-12h357.2c6.6 0 12 5.4 12 12V314c-0.1 6.6-5.5 12-12.1 12z" fill="#FCFCFC" p-id="12688"></path><path d="M291.2 511.5m-34.5 0a34.5 34.5 0 1 0 69 0 34.5 34.5 0 1 0-69 0Z" fill="#FCFCFC" p-id="12689"></path><path d="M755.1 546H398c-6.6 0-12-5.4-12-12v-44.9c0-6.6 5.4-12 12-12h357.2c6.6 0 12 5.4 12 12V534c-0.1 6.6-5.5 12-12.1 12z" fill="#FCFCFC" p-id="12690"></path><path d="M291.2 731.5m-34.5 0a34.5 34.5 0 1 0 69 0 34.5 34.5 0 1 0-69 0Z" fill="#FCFCFC" p-id="12691"></path><path d="M755.1 766H398c-6.6 0-12-5.4-12-12v-44.9c0-6.6 5.4-12 12-12h357.2c6.6 0 12 5.4 12 12V754c-0.1 6.6-5.5 12-12.1 12z" fill="#FCFCFC" p-id="12692"></path></svg>
          <div className={css.content}>全局搜索</div>
        </div>
        <Divider type='vertical'/>
        <Input
          className={css.input}
          autoFocus
          allowClear
          placeholder='请输入关键词'
          prefix={<span className={css.icon}/>}
          //@ts-ignore
          onChange={debounce((e: any) => {
            const value = e?.target?.value
            if (!value) return

            getList({value});
          }, 500)}
        />
      </div>
    )
  }, [])

  const modalBasicConfig: () => ModalProps = useCallback(() => {
    return {
      width: '80%',
      footer: null,
      getContainer: false,
      style: {
        top: 80,
        bottom: 80,
        width: 1100,
        minWidth: 764,
        maxWidth: 1100
      },
      bodyStyle: {
        height: '80vh',
        minHeight: 400
      },
      onCancel
    }
  }, [])

  const Render = useComputed(() => {
    return (
      <Modal
        title={ModalTitle}
        visible={titleCtx.mdVisible}
        {...modalBasicConfig()}
      >
        {/* TODO,分页/虚拟滚动 */}
        <List
          className={css.list}
          itemLayout='horizontal'
          loading={titleCtx.mdListLoading}
          dataSource={titleCtx.mdListData}
          renderItem={(item: Item) => {
            const {
              name,
              icon,
              path,
              extName,
              creatorName,
              description,
              updateTime
            } = item
            const iconKey: string = extName
            let resDescription: string = typeof description === 'string' ? description.trim() : ''

            return (
              <List.Item
                className={css.listItem}
                onClick={(e) => ListItemClick(e, item)}
              >
                <List.Item.Meta
                  title={<div>{name}</div>}
                  description={(
                    <>
                      <div className={css.descText}>所有者：{creatorName}</div>
                      <div className={css.descText}>描述：{resDescription.length ? resDescription : '暂无描述'}</div>
                      <div className={css.descText}>更新时间：{updateTime}</div>
                      <div className={css.descText}>路径：<Path path={path} onClick={ListItemClick}/></div>
                    </>
                  )}
                  avatar={getIconInfo({key: iconKey === 'group' ? icon : iconKey, width: '32px'}).icon}
                />
              </List.Item>
            )
          }}
        />
      </Modal>
    )
  })

  return Render
}

function Path({path, onClick}) {
  const length = path.length - 1
  return path.map((item, idx) => {
    const { name, icon, extName } = item || {}
    const isMy = !item
    return (
      <div className={css.path}>
        {!idx && <span className={css.pathicon}>{getIconInfo({key: isMy ? 'my' : icon || 'fangzhou_icon_huojian', width: '16px'}).icon}</span>}
        <span className={css.pathname} onClick={(e) => {
          e.stopPropagation()
          onClick(e, {...item, extName: isMy ? 'my' : extName || 'group'})
        }}>{name || '我的'}</span>
        <span className={css.delimiter}>{idx !== length ? '>' : ''}</span>
      </div>
    )
  })
}
