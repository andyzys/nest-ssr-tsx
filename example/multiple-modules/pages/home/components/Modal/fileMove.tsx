import React from 'react'
import { Form, message } from 'antd'
import remove from 'lodash/remove'
// @ts-ignore
import { useObservable } from '@mybricks/rxui'
import FolderList from '../../NavList/FolderList'
import { post, getFoldersParent, deepCopy } from '../../utils'

import { ModalCtx, HomePageCtx } from '../../Home'

class Ctx {
  active: any
  dataSource: any[]
}

export function fileMove ({info, homePageCtx, modalCtx}: {info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx}) {
  return {
    cb: (form: any, onCancel: Function) => {
      const { moveInfo } = form.getFieldsValue()
      if (!moveInfo) {
        message.info('请选择要移入的协作组或文件夹')
        return
      }
      const { id, groupId } = moveInfo

      if (info.id === id) {
        message.info(`目标文件夹${moveInfo.name}已被选中，无法移动`)
        return
      }

      modalCtx.confirmLoading = true

      const isGroup = typeof groupId === 'undefined'
      const params: any = {
        fileId: info.id,
      }

      if (isGroup) {
        params.toGroupId = id
      } else {
        params.toFileId = id
      }

      post(`/api/paas/file/moveFile`, params, {
        'Content-Type': 'application/json'
      }).then(async r => {
        const { data } = r
        if (typeof data === 'string') {
          message.success(data)
        } else {
          message.success('移动成功')
          onCancel()

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

          // 移动到哪里
          let moveTo

          if (isGroup) {
            moveTo = homePageCtx.iJoinedCtx.dataSource.find(data => data.id === id)
          } else {
            moveTo = getFoldersParent(homePageCtx.iJoinedCtx.dataSource, id)
          }

          if (moveTo?.open) {
            homePageCtx.iJoinedCtx.fetch({linkageWithHome: false, item: moveTo})
          }
        }
        modalCtx.confirmLoading = false
      }).catch(e => {
        console.log(e, 'e')
        message.error(`移动失败：${e?.message}`)
        modalCtx.confirmLoading = false
      })
    },
    title: `将“${info.name}”移动到`,
    render: ({form}) => {
      const ctx = useObservable(Ctx, next => {
        homePageCtx.getUserGroups({params: {
          userId: homePageCtx.user.userId
        }}).then((r) => {
          modalCtx.bodyLoading = false

          next({
            dataSource: r.filter(group => {
              return ['1', '2'].includes(group.roleDesc)
            })
          })
        })

        next({
          active: {},
          dataSource: []
        })
      })

      return (
        <Form form={form}>
          <Form.Item name='moveInfo'>
            <FolderList
              active={ctx.active}
              bodyStyle={{marginLeft: 0}}
              dataSource={ctx.dataSource}
              clickWrapper={async (item) => {
                ctx.active.id = item.id

                if (!item.open) {
                  item.loading = true

                  const { files } = await homePageCtx.getFiles({
                    params: item,
                    pushState: false
                  })
                  let folders = remove(files, (info) => info.extName === 'folder')

                  item.dataSource = folders
                  item.open = true
                  item.loading = false
                }

                form.setFieldsValue({moveInfo: {id: item.id, groupId: item.groupId}})
              }}
              clickSwitcher={async (item) => {
                if (item.open) {
                  item.open = false
                } else {
                  item.loading = true

                  const { files } = await homePageCtx.getFiles({
                    params: item,
                    pushState: false
                  })
                  let folders = remove(files, (info) => info.extName === 'folder')

                  item.dataSource = folders
                  item.open = true
                  item.loading = false
                }
              }}
            />
          </Form.Item>
        </Form>
      )
    },
    init: ({form}) => {
      modalCtx.bodyLoading = true
      form.setFieldsValue({moveFile: void 0})
    },
    height: 500
  }
}
