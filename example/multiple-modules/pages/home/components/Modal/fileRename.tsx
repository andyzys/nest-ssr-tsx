import React from 'react'
import { post } from '../../utils'
import { formRulesMap } from './utils'
import { getIconInfo } from '../../components/Icon'

import { Form, Input, message } from 'antd'

const { TextArea } = Input

export function fileRename ({info, homePageCtx, modalCtx}) {
  const title = getIconInfo({key: info.extName}).title
  return {
    cb: (form: any, onCancel: Function) => {
      form.validateFields().then(values => {
        const { fileName, description } = values
        if (fileName === info.name && description === info.description) {
          onCancel()
        } else {
          modalCtx.confirmLoading = true
          post(`/api/paas/file/renameFile`, {
            fileId: info.id,
            fileName,
            description,
            updatorId: homePageCtx.user.userId,
            updatorName: homePageCtx.user.name
          }, {
            'Content-Type': 'application/json'
          }).then(async () => {
            onCancel()

            message.info('修改成功')
            if (homePageCtx.isMy(homePageCtx.currentClick)) {
              homePageCtx.myCtx.fetch({linkageWithHome: true, item: null})
            } else if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
              homePageCtx.iJoinedCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
            }
          }).catch(e => {
            modalCtx.confirmLoading = false
            message.info(`修改失败：${e?.message}`)
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    title: '修改名称和描述',
    render: ({form, onOk}) => {
      return (
        <Form form={form} labelCol={{span: 3}}>
          <Form.Item
            label='名称'
            name='fileName'
            rules={formRulesMap['noEmpty']({errorMsg: `${title}名称不能为空`})}
          >
            <Input
              placeholder={`请输入${title}名称，最多50字`}
              autoFocus
              onPressEnter={onOk}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            label='描述'
            name='description'
          >
            <TextArea
              autoSize={{
                minRows: 4,
                maxRows: 4
              }}
              placeholder={`请输入${title}描述，比如介绍用途、涵盖的内容等，最多256字（选填）`}
              maxLength={256}
            />
          </Form.Item>
        </Form>
      )
    },
    init: ({form}) => {
      form.setFieldsValue({fileName: info?.name || '', description: info?.description || ''})
    }
  }
}
