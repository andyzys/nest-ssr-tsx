import React from 'react'
import { formRulesMap } from './utils'
import { Form, Input, message } from 'antd'
import { SELECTED_BY_DEFAULT } from '../../../common/const'
import { post, removeLocalStorage } from '../../utils'

export function userGroupDelete ({info, homePageCtx, modalCtx}) {
  const { id, name: infoName } = info

  return {
    cb: (form: any, onCancel: Function) => {

      form.validateFields().then(() => {
        modalCtx.confirmLoading = true
        const url: string = '/deleteUserGroup'
        const param: any = {
          groupId: id,
          updatorId: homePageCtx.user.userId,
          updatorName: homePageCtx.user.name
        }
        post(url, param).then(async () => {
          message.info('删除成功')
          onCancel()

          if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
            const index = homePageCtx.iJoinedCtx.dataSource.findIndex(data => data.id === id)
            homePageCtx.iJoinedCtx.dataSource.splice(index, 1)
          } 
          // else if (homePageCtx.isShare(homePageCtx.currentClick)) {
          //   const index = homePageCtx.shareCtx.dataSource.findIndex(data => data.id === id)
          //   homePageCtx.shareCtx.dataSource.splice(index, 1)
          // }

          homePageCtx.currentClick = void 0

          removeLocalStorage(SELECTED_BY_DEFAULT)

          homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
        }).catch(e => {
          message.info(`删除失败：${e?.message}`)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    content: '',
    type: '',
    title: `您确定要删除该协作组吗？`,
    init: ({form}) => {
      form.setFieldsValue({name: void 0})
    },
    render: ({form, onOk}) => {
      return (
        <Form form={form}>
          <Form.Item name='name' rules={formRulesMap['public']({
            emptyMsg: '请输入当前协作组名称以确认删除',
            errorMsg: '当前输入与协作组名称不同，无法删除',
            regexp: new RegExp(infoName)
          })}>
            <Input
              placeholder='请输入当前协作组名称以确认删除'
              autoFocus
              onPressEnter={onOk}
            />
          </Form.Item>
        </Form>
      )
    },
  }
}
