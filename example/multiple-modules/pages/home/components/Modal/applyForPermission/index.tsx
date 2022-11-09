import React, { useEffect } from 'react'

import { Form, Input, Popover, Checkbox, message, Spin } from 'antd'
import { post, get } from '../../../../common/utils'
import { useObservable, useComputed } from 'rxui-lite'

// @ts-ignore
import css from './index.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

const iconGou = (
  <svg width='20px' height='20px' fill="#0c63fa" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26978">
    <path d="M891.861333 255.637333l21.12 21.12a27.733333 27.733333 0 0 1 0 39.210667L464.96 763.989333a42.666667 42.666667 0 0 1-57.642667 2.496l-2.709333-2.496L149.589333 508.970667a27.733333 27.733333 0 0 1 0-39.210667l21.12-21.12a27.733333 27.733333 0 0 1 39.210667 0l224.853333 224.853333 417.856-417.856a27.733333 27.733333 0 0 1 39.232 0z"/>
  </svg>
)

const accessLevelOptions = [
  // { title: '可查看', description: '查看', accessLevel: '3' },
  { title: '可编辑', description: '查看和编辑', accessLevel: '2' },
  { title: '可管理', description: '查看、编辑和管理协作成员', accessLevel: '1' },
]

const accessLevelNumToExp = {
  1: '可管理',
  2: '可编辑',
  // 3: '可查看'
}

export function applyForPermission ({homePageCtx, modalCtx}) {
  const { id, groupId } = homePageCtx.currentClick
  const gId = typeof groupId === 'undefined' ? id : groupId
  modalCtx.openModal({
    cb: (form: any, onCancel: Function, config: any) => {
      modalCtx.confirmLoading = true

      const { selectedMap, currentAccessLevel } = config
      const formValues = form.getFieldsValue()
      const admins = []

      Object.keys(selectedMap).forEach(userId => {
        if (selectedMap[userId]) {
          admins.push(userId)
        }
      })

      post(`/api/openapi/v2/message/send/interactive`, {
        params: {
          admins,
          roleDesc: currentAccessLevel,
          reason: formValues.reason,
          groupId: gId,
          userId: homePageCtx.user.userId
        },
        type: 'accessLevelApply'
      }).then(r => {
        message.success('申请成功已通知审批人')
  
        onCancel()
      }).catch(e => {
        message.info(`申请失败：${e.message}`)
      }).finally(() => {
        modalCtx.confirmLoading = false
      })
    },
    title: '申请协作组权限',
    render: ({form, config, onOk}) => {

      const ctx = useObservable({
        spinning: true,
        admins: [],
        firstSelect: void 0,
        selectedCount: 1,
        options: accessLevelOptions,
        currentAccessLevel: '2',
        selectedMap: {},
        adminPopVisible: false,
        accessLevelPopVisible: false
      })

      useEffect(() => {
        get(`/getGroupUserList?groupId=${gId}&roleDesc=1`).then(r => {
          ctx.admins = r.map((user, idx) => {
            if (!idx) {
              user.selected = true
              ctx.firstSelect = user
            } else {
              user.selected = false
            }
            ctx.selectedMap[user.userId] = user.selected
            return user
          })
          ctx.spinning = false

          config.selectedMap = ctx.selectedMap
          config.currentAccessLevel = ctx.currentAccessLevel
          
        }).catch(e => {
          message.error(`获取管理员失败：${e?.message || e?.msg}`)
          console.error(e)
        })
      }, [])

      const Render = useComputed(() => {
        return (
          <Spin spinning={ctx.spinning}>
            <Form form={form}>
              <FormItem>
                <div className={css.permissionApplyTitle}>
                  向
                  <Popover
                    placement='bottomLeft'
                    overlayStyle={{width: 250}}
                    onVisibleChange={(bool) => {
                      ctx.adminPopVisible = bool
                    }}
                    content={() => {
                      return (
                        <div className={css.filterGroup}>
                          <div className={css.filterGroupTitle}>审批人</div>
                          {ctx.admins.map((admin, idx) => {
                            const { userId, avatar, name } = admin
                            return (
                              <div className={css.filterGroupItem} onClick={() => {
                                if (!ctx.selectedMap[userId]) {
                                  ctx.selectedMap[userId] = true
                                  admin.selected = true
                                  ctx.selectedCount = ctx.selectedCount + 1
                                } else {
                                  if (ctx.selectedCount > 1) {
                                    ctx.selectedMap[userId] = false
                                    admin.selected = false
                                    ctx.selectedCount = ctx.selectedCount - 1
                                  } else {
                                    message.info('请至少选择一位审批人')
                                  }
                                }
                                config.selectedMap = ctx.selectedMap
                                ctx.firstSelect = ctx.admins.find(admin => admin.selected)
                              }}>
                                <Checkbox checked={ctx.selectedMap[userId]}/>
                                <span><img src={avatar || '//f2.eckwai.com/kos/nlav12333/fangzhou/imgs/default_avatar.png'}/></span>
                                <span>{name}</span>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }}
                  >
                    <div className={css.permissionApplyTitleSpecial}>
                      <span>
                        <div className={css.avatar}>
                          <img src={ctx.firstSelect?.avatar || '//f2.eckwai.com/kos/nlav12333/fangzhou/imgs/default_avatar.png'}/>
                        </div>
                      </span>
                      <span className={css.currentManagerUserName}>
                        {ctx.firstSelect?.name} {ctx.selectedCount > 1 && `等${ctx.selectedCount}人`}
                      </span>
                    </div>
                  </Popover>
                  申请
                  <Popover
                    placement='bottomLeft'
                    overlayStyle={{width: 250}}
                    onVisibleChange={(bool) => {
                      ctx.accessLevelPopVisible = bool
                    }}
                    content={() => {
                      return (
                        <div className={`${css.accessLevelGroup} ${css.accessLevelGroup2}`}>
                          {ctx.options.map((option, idx) => {
                            const { title, accessLevel , description } = option
                            const selected = accessLevel === ctx.currentAccessLevel
  
                            return (
                              <div key={title} className={`${css.accessLevelGroupItem} ${selected ? css.accessLevelSelected : ''}`} onClick={() => {
                                ctx.currentAccessLevel = accessLevel
                                config.currentAccessLevel = accessLevel
                              }}>
                                <div className={css.optionLeft}>
                                  <div className={css.accessLevelTitle}>
                                    {title}
                                  </div>
                                  <div className={css.accessLevelDescription}>
                                    {description}
                                  </div>
                                </div>
                                <div className={css.optionRight}>
                                  {selected && iconGou}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }}
                  >
                    <div className={css.permissionApplyTitleSpecial}>
                      <span className={css.currentManagerUserName}>
                        {accessLevelNumToExp[ctx.currentAccessLevel]}
                      </span>
                    </div>
                  </Popover>
                  权限
                </div>
              </FormItem>
              <FormItem name='reason'>
                <TextArea 
                  placeholder={`申请理由（选填，50字）`}
                  autoFocus
                  onPressEnter={onOk}
                  maxLength={50}
                />
              </FormItem>
            </Form>
          </Spin>
        )
      })

      return Render
    },
    init: ({form}) => {
      form.resetFields()
    }
  })
}
