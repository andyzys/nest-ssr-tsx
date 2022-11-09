import React, { useState } from 'react'
import { formRulesMap } from '../utils'
import { message, Form, Input } from 'antd'
import { getIconInfo, fangzhouIconKeyAry } from '../../Icon'
import { post, regexNamespace, strUid } from '../../../utils'

// @ts-ignore
import css from './index.less'

const { TextArea } = Input

export function userGroupCreate ({user, modalCtx, resolve}) {
  return {
    cb: (form: any, onCancel: Function) => {

      form.validateFields().then(values => {
        const { name, description = '', namespace, icon } = values

        modalCtx.confirmLoading = true
        post('/createGroup', {
          name,
          icon,
          namespace,
          description,
          creatorName: user.name,
          creatorId: user.userId
        }).then((r) => {
          if (r.status === 0) {
            modalCtx.confirmLoading = false
            message.info(r.msg)
          } else {
            message.info('新建协作组成功')
  
            onCancel()
            resolve()
          }
        }).catch(e => {
          modalCtx.confirmLoading = false
          message.info(`新建协作组失败：${e?.message}`)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    title: '新建协作组',
    render: ({form, onOk}) => {

      let [icon, setIcon] = useState('fangzhou_icon_huojian')
      
      return (
        <Form form={form} labelCol={{span: 4}} wrapperCol={{span: 20}}>
          <Form.Item
            label='名称'
            name='name'
            rules={formRulesMap['noEmpty']({errorMsg: '协作组名称不能为空'})}
          >
            <Input placeholder='请输入协作组名称，最多50字' autoFocus onPressEnter={onOk} maxLength={50}/>
          </Form.Item>
          <Form.Item
            label='命名空间'
            name='namespace'
            rules={formRulesMap['public']({
              errorMsg: '命名空间只能输入英文数字以及下划线',
              emptyMsg: '协作组名称不能为空',
              regexp: regexNamespace
            })}
          >
            <Input placeholder='请输入命名空间（协作组的唯一标识）最多50字' onPressEnter={onOk} maxLength={50}/>
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
              placeholder='请输入协作组描述，比如介绍用途、涵盖的内容等，最多256字（选填）'
              maxLength={256}
            />
          </Form.Item>
          <Form.Item label='标志' name='icon'>
            <div className={css.iconList}>
              {fangzhouIconKeyAry.map(key => {
                return (
                  <div
                    key={key}
                    className={`${css.icon} ${icon === key ? css.active : ''}`}
                    onClick={() => {
                      setIcon(key)
                      form.setFieldsValue({icon: key})
                    }}
                  >
                    {getIconInfo({key, width: 20}).icon}
                  </div>
                )
              })}
            </div>
          </Form.Item>
        </Form>
      )
    },
    init: ({form}) => {
      form.setFieldsValue({name: void 0, namespace: strUid(12), description: void 0, icon: 'fangzhou_icon_huojian'})
    }
  }
}