import React from 'react'
import { Form, message } from 'antd'
// @ts-ignore
import { observable } from '@mybricks/rxui'
import { post, deepCopy } from '../../utils'
import FolderList from '../../NavList/FolderList'


const shareMap = {
  'kh5': ['fangzhou_share_h5_page'],
  'pcspa': ['fangzhou_share_pc_page']
}

export function fileShare ({info, homePageCtx, modalCtx}) {
  return {
    cb: (form: any, onCancel: Function) => {
      const { moveInfo } = form.getFieldsValue()

      if (!moveInfo?.groupId) {
        message.info('请选择分享的类别')
        return
      }
      modalCtx.confirmLoading = true
      const { id, groupId } = moveInfo

      const isGroup = typeof groupId === 'undefined'
      const params: any = {
        fileId: info.id
      }

      if (isGroup) {
        params.toGroupId = id
      } else {
        params.toFileId = id
      }

      post('/shareFile', params).then(res => {
        const { code, message: msg } = res

        message.info(msg)

        if (code === 1) {
          onCancel()
        }

        modalCtx.confirmLoading = false
        // 分享后不需要更新视图，只能分享文件
      }).catch(e => {
        modalCtx.confirmLoading = false
      })
    },
    title: `将“${info.name}”分享到`,
    render: ({form}) => {
      let active = observable({})

      return (
        <Form form={form}>
          <Form.Item name='moveInfo'>
            <FolderList
              active={active}
              bodyStyle={{marginLeft: 0}}
              dataSource={observable(deepCopy(homePageCtx.shareCtx.dataSource.map(data => {
                return {...data, open: true}
              })).filter(data => {
                return data.namespace.includes(shareMap[info.extName])
              }))}
              clickWrapper={async (item) => {
                if (item.groupId) {
                  active.id = item.id
                  form.setFieldsValue({moveInfo: {id: item.id, groupId: item.groupId}})
                }
              }}
            />
          </Form.Item>
        </Form>
      )
    },
    init: ({form}) => {
      form.setFieldsValue({moveFile: void 0})
    },
    height: 300
  }
}
