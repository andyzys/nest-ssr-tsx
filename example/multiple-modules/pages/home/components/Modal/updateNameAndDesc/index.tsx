import React, { useState } from 'react'
import { formRulesMap } from '../utils'
import { Form, Input, message } from 'antd'
import { getIconInfo, fangzhouIconKeyAry } from '../../Icon'
import { post, deepFindFolder, setLocalStorage } from '../../../utils'

// @ts-ignore
import css from './index.less'

const { TextArea } = Input

export function updateNameAndDesc ({info, homePageCtx, modalCtx}) {
  let { id, name, description, groupId, icon: groupIcon } = info

  const isGroup = typeof groupId === 'undefined'
  const title = isGroup ? '协作组' : '文件夹'

  if (!groupIcon) {
    groupIcon = 'fangzhou_icon_huojian'
  }
  
  return {
    cb: (form: any, onCancel: Function) => {
      form.validateFields().then(values => {
        const { name, description, icon } = values

        modalCtx.confirmLoading = true

        let url = '/updateFolder'

        const params: any = {
          id,
          name,
          description,
          updatorId: homePageCtx.user.userId,
          updatorName: homePageCtx.user.name
        }

        if (isGroup) {
          url = '/api/paas/home/updateGroup'
          params.icon = icon
        }

        post(url, params, {
          'Content-Type': 'application/json'
        }).then(() => {
          message.info('修改成功')
          homePageCtx.currentClick.name = name
          homePageCtx.currentClick.description = description

          let dataSource = []

          if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
            dataSource = homePageCtx.iJoinedCtx.dataSource
          } 
          // else if (homePageCtx.isShare(homePageCtx.currentClick)) {
          //   dataSource = homePageCtx.shareCtx.dataSource
          // }

          const current = deepFindFolder(dataSource, homePageCtx.currentClick.id, homePageCtx.currentClick.groupId)

          current.name = name
          current.description = description

          const breadTitle = homePageCtx.breadTitleAry[homePageCtx.breadTitleAry.length  - 1]

          breadTitle.name = name
          breadTitle.description = description

          if (isGroup) {
            current.icon = icon
            breadTitle.icon = icon
          }

          setLocalStorage('SELECTED_BY_DEFAULT', homePageCtx.currentClick)
          onCancel()
        }).catch(e => {
          modalCtx.confirmLoading = false
          message.info(`更改名称和描述失败：${e?.message}`)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    title: `更改${title}名称与描述`,
    render: ({form, onOk}) => {
      let [icon, setIcon] = useState(groupIcon)

      return (
        <Form form={form} labelCol={{span: 3}}>
          <Form.Item
            label='名称'
            name='name'
            rules={formRulesMap['noEmpty']({errorMsg: `${title}名称不能为空`})}
          >
            <Input placeholder={`请输入${title}名称，最多50字`} autoFocus onPressEnter={onOk} maxLength={50}/>
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
          {isGroup && <Form.Item label='标志' name='icon'>
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
          </Form.Item>}
        </Form>
      )
    },
    init: ({form}) => {
      form.setFieldsValue({name, description, icon: groupIcon})
    }
  }
}
