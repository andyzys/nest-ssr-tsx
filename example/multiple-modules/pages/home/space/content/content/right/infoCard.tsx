import React, { useMemo } from 'react'

import { del } from '../left/contentTable'
import { get, post } from '../../../../utils'
import { Ctx, ChildProps, getUsers } from '../..'
import { roleDescMap } from '../../../../../common/const'
import UserList from '../../../../components/UserList'
import { ModalCtx, HomePageCtx } from '../../../../Home'
import { formRulesMap } from '../../../../components/Modal/utils'
import { Modal } from 'antd'
import debounce from 'lodash/debounce'
/**
 * 用户权限设置暂时不拿出去，要改版
 */
import { userGroupDelete, updateNameAndDesc as updateNameAndDescModal, applyForPermission } from '../../../../components/Modal'

import { MySelect } from '../../../../components/Select'

import {
  Form,
  Input,
  Select,
  Button,
  Popover,
  message,
  Spin
} from 'antd'

// @ts-ignore
import css from '../../index.less'
import { useObservable } from '@mybricks/rxui'
import { useCallback } from 'react'

// @ts-ignore
import cssUserSetting from './index.less'
// @ts-ignore
// import cssPermission from './ApplyForPermission/index.less'
import { useEffect } from 'react'

const accessLevelNumToExp = {
  1: '可管理',
  2: '可编辑',
  3: '可查看'
}
const accessLevelOptions = [
  { title: '可查看', description: '查看', value: '3' },
  { title: '可编辑', description: '查看和编辑', value: '2' },
  { title: '可管理', description: '查看、编辑和管理协作成员', value: '1' },
]


/**
 * 内容标题
 * TODO
 */
export default function InfoCard ({ctx, modalCtx, homePageCtx}: ChildProps): JSX.Element {
  const currentPermission = ctx.groupCurrentUser.roleDesc
  const isEditRole = currentPermission === roleDescMap.EDITOR
  const isAdmin = currentPermission === roleDescMap.ADMIN
  const info = homePageCtx.breadTitleAry[homePageCtx.breadTitleAry.length - 1] || {}

  // '4' 不在协作组内
  let showApplyForPermission = currentPermission === '4'

  return (
    <div className={`${css.contentCard} ${(ctx.openCard && ctx.showCard) ? css.openCard : ''}`}>
      <div className={css.folderInfo}>
        <div className={css.folderTitleWrapper}>
          <div className={css.folderTitle}>
            {info?.name}
          </div>
          <span
            className={`${css.icon} ${css.vatoRight}`}
            onClick={() => {
              ctx.showCard = false
            }}
          />
        </div>
        {!info?.groupId ? (
          <>
            <Info label={'协作组ID'} value={info?.id}/>
            <Info label={'命名空间'} value={info?.namespace?.length ? info.namespace : '暂无命名空间'}/>
          </>
        ) : (
          <Info label={'文件夹ID'} value={info?.id}/>
        )}

        <Info
          label={'描述'}
          value={info?.description?.length ? info.description : '暂无描述'}
          LabelRender={(isEditRole || isAdmin) && <span
            className={css.icon}
            onClick={() => {
              updateNameAndDesc(homePageCtx, modalCtx)
            }}
          />}
        />
        <Info
          label={'成员'}
          // value={info?.description?.length ? info.description : '暂无描述'}
          LabelRender={(
            <Popover
              placement='leftTop'
              overlayClassName='createPopover'
              onVisibleChange={(v) => {
                ctx.userConfigVisible = v
              }}
              visible={ctx.userConfigVisible}
              content={() => {
                return (
                  <div className={css.filterGroup}>
                    <div
                      className={css.filterGroupItem}
                      onClick={() => {
                        ctx.userConfigVisible = false
                        userSetting(homePageCtx, modalCtx, ctx)
                      }}
                    >
                      <div className={css.leftIcon}>
                      </div>
                      <div className={css.itemLabel}>
                        成员配置
                      </div>
                    </div>
                    <div
                      className={css.filterGroupItem}
                      onClick={() => {
                        ctx.userConfigVisible = false
                        addUsersInBulk(homePageCtx, modalCtx, ctx)
                      }}
                    >
                      <div className={css.leftIcon}>
                      </div>
                      <div className={css.itemLabel}>
                        批量配置
                      </div>
                    </div>
                  </div>
                )
              }}
            >
              <span
                className={css.icon}
              />
            </Popover>
          )}
          DetailRender={(
            <UserList data={ctx.groupUsers} total={ctx.groupUsersCount} onClick={() => {
              userSetting(homePageCtx, modalCtx, ctx)
            }}/>
          )}
        />
      </div>
      <div className={css.folderOwner}>
        <div>协作组所有者</div>
        <div className={css.creator}>
          <div className={css.creatorName}>
            {ctx?.groupOwner?.name}
          </div>
        </div>
      </div>
      {/* <div className={css.folderOwner}>
        <div className={css.folderHeader}>
          <div>可管理</div>
          {isAdmin && <SettingOutlined
            className={css.icon}
            onClick={() => {
              const { id, groupId } = info
              const gId = typeof groupId === 'undefined' ? id : groupId
              get(`/getGroupUserList?groupId=${gId}`).then(r => {
                adminSetting(homePageCtx, modalCtx, r, ctx)
              })
            }}
          />}
        </div>
        <div className={css.descriptionDetail}>
          <UserList data={ctx.groupUsers.filter(user => user.roleDesc === roleDescMap.ADMIN)} />
        </div>
      </div>
      <div className={css.folderOwner}>
        <div className={css.folderHeader}>
          <div>可编辑</div>
          {isAdmin && <SettingOutlined
            className={css.icon}
            onClick={() => {
              const { id, groupId } = info
              const gId = typeof groupId === 'undefined' ? id : groupId
              get(`/getGroupUserList?groupId=${gId}`).then(r => {
                updaterSetting(homePageCtx, modalCtx, r, ctx)
              })
            }}
          />}
        </div>
        <div className={css.descriptionDetail}>
          <UserList data={ctx.groupUsers.filter(user => user.roleDesc === roleDescMap.EDITOR)} />
        </div>
      </div> */}
      {showApplyForPermission && (
        <Button
          type='primary'
          ghost
          style={{width: '100%'}}
          onClick={() => {
            // applyForPermissionModalCtx.visible = true
            // applyForPermissionModalCtx.init()

            applyForPermission({homePageCtx, modalCtx})
          }}
        >申请权限</Button>
      )}
      {((ctx?.groupOwner?.userId === homePageCtx.user.userId) || homePageCtx.HackSuperUser) && <div>
        <Button
          danger
          style={{width: '100%'}}
          onClick={() => {
            if (info?.groupId) {
              del(info, homePageCtx, modalCtx)
            } else {
              delUserGroup(info, homePageCtx, modalCtx)
            }
          }}
        >删除</Button>
      </div>}
    </div>
  )
}

/**
 * 成员设置
 */
function userSetting(homePageCtx: HomePageCtx, modalCtx: ModalCtx, ctx: Ctx): void {
  const { id, groupId } = homePageCtx.currentClick
  const gId = typeof groupId === 'undefined' ? id : groupId
  const pCtx = ctx
  const isAdmin = ctx.groupCurrentUser?.roleDesc === '1'

  modalCtx.openModal({
    cb: (form: any, onCancel: Function, config: any) => {
      const { userIds } = form.getFieldsValue()
      const { roleDesc = '3', cb } = config
      if (Array.isArray(userIds) && userIds.length) {
        const { user } = homePageCtx
        modalCtx.confirmLoading = true
        get(`/api/paas/home/addUsersToGroup?userIds=${userIds.join(';')}&groupId=${gId}&userId=${user.userId}&userName=${user.name}&roleDesc=${roleDesc}`).then((r) => {
          const { message: msg } = r
          if (r.code === 1) {
            message.success('成员配置成功')
            getUsers({ groupId: gId, homePageCtx, ctx })
            form.resetFields()
            cb()
            // onCancel()
          } else {
            message.error(`成员配置失败:${msg}`)
          }
        }).catch((e) => {
          message.error(`成员配置失败:${e?.message || e?. msg}`)
          console.error(e)
        }).finally(() => {
          modalCtx.confirmLoading = false
        })
      }

      // onCancel()
    },
    title: '成员配置',
    render: ({form, config, onCancel}) => {
      const ctx = useObservable({
        spinning: true,
        isOwner: false,
        groupOwner: {},
        groupUsers: [],
        groupUsersIdMap: {},
        inviteAccessLevel: '3',
        iconRotate: false,

        selectFetching: false,
        selectOptions: [],
        isAdmin
      })

      useMemo(() => {
        if (!ctx.isAdmin) {
          modalCtx.footer = null
        }
      }, [])

      const getGroupUsers = useCallback(() => {
        ctx.spinning = true
        Promise.all([
          new Promise((resolve, reject) => {
            get(`/api/paas/home/getGroupUsers?groupId=${gId}`).then(r => {
              resolve(r)
            }).catch(e => {
              reject(e)
            })
          }),
          new Promise((resolve, reject) => {
            getUsers({ groupId: gId, homePageCtx, ctx: pCtx }).then((r: any) => {
              resolve(r)
            }).catch(e => {
              reject(e)
            })
          })
        ]).then(([groupUsers, groupUserInfo]: any) => {
          ctx.isAdmin = groupUserInfo?.ruser?.roleDesc === '1'
          ctx.groupOwner = groupUserInfo?.owner || {}
          ctx.isOwner = ctx.isAdmin && (groupUserInfo?.owner?.userId === groupUserInfo?.ruser?.userId)
          if (!ctx.isAdmin) {
            modalCtx.footer = null
          }

          const groupUsersIdMap = {}
          groupUsers.forEach((user) => {
            groupUsersIdMap[user.userId] = user
          })
          const ownerIndex = groupUsers.findIndex(groupUser => groupUser.userId === ctx.groupOwner.userId)
          if (ownerIndex !== -1) {
            const firstUser = groupUsers[0]
            groupUsers[0] = groupUsers[ownerIndex]
            groupUsers[ownerIndex] = firstUser
          }
          ctx.groupUsers = groupUsers
          ctx.groupUsersIdMap = groupUsersIdMap
          ctx.spinning = false
        }).catch(e => {
          console.error(e)
        })
      }, [])

      useEffect(() => {
        getGroupUsers()
        
        config.cb = getGroupUsers
      }, [])

      const selectOnSearch = useCallback((value) => {
        if (!value) return
        ctx.selectFetching = true
        ctx.selectOptions = []
        // 模糊查询
        post(`/api/paas/openApi/user/search`, {
          username: homePageCtx.user.userId,
          // username: 'qiding',
          text: value,
          count: 5
        }, {
          'Content-Type': 'application/json'
        }).then(r => {
          const { data } = r
          const { groupUsersIdMap } = ctx

          if (Array.isArray(data)) {
            ctx.selectOptions = data.map((user, idx) => {
              const groupUser = groupUsersIdMap[user.username]
              if (groupUser) {
                // const isAdmin = groupUser.userId === groupUser.creatorId
                const isAdmin = ctx.groupOwner.userId === groupUser.userId
                user.orgDisplayName = isAdmin ? '所有者' : `已赋予${accessLevelNumToExp[groupUser.roleDesc]}权限`
                user.optionDisabled = isAdmin
              }
              return user
            })
          }
        }).catch(e => {
          console.log(e, 'e')
        }).finally(() => {
          ctx.selectFetching = false
        })
      }, [])

      const roleDescChange = useCallback(async ({value, user}) => {
        return new Promise((resolve, reject) => {
          if (value === 'owner') {
            Modal.confirm({
              title: `确认将${user.name}设为当前协作组的所有者吗？`,
              okText: '确认',
              cancelText: '取消',
              centered: true,
              onOk: () => {
                post('/resetOwnerFromGroup', {
                  groupId: gId,
                  ownerUserId: user.userId
                }).then(r => {
                  getGroupUsers()
                  resolve(1)
                }).catch(e => {
                  reject(1)
                  message.error(`转让协作组所有者失败:${e?.message || e?.msg}`)
                  console.error(e)
                })
              },
              onCancel: () => {
                reject(1)
              }
            })
          } else if (value === 'del') {
            // 删除
            Modal.confirm({
              title: `确认将${user.name}从当前协作组中移除吗？`,
              okText: '确认',
              cancelText: '取消',
              centered: true,
              onOk: () => {
                post('/api/paas/home/removeUserFromGroup', {
                  groupId: gId,
                  userId: user.userId
                }, {
                  'Content-Type': 'application/json'
                }).then(r => {
                  getGroupUsers()
                  resolve(1)
                }).catch(e => {
                  reject(1)
                  message.error(`移除成员失败:${e?.message || e?.msg}`)
                  console.error(e)
                })
              },
              onCancel: () => {
                reject(1)
              }
            })
          } else {
            post('/api/paas/home/updateUserRoleDescFromGroup', {
              groupId: gId,
              userId: user.userId,
              roleDesc: value
            }, {
              'Content-Type': 'application/json'
            }).then(r => {
              resolve(1)
              getGroupUsers()
            }).catch(e => {
              reject(1)
              message.error(`移除成员失败:${e?.message || e?.msg}`)
              console.error(e)
            })
          }
        })
      }, [])

      return (
        <div>
          <Spin spinning={ctx.spinning}>
            <div className={cssUserSetting.userSetting}>
              {ctx.isAdmin ? <>
                <Form form={form}>
                  <Form.Item
                    label='配置'
                    name='userIds'
                  >
                    <Select
                      allowClear
                      placeholder='搜索用户'
                      mode='multiple'
                      filterOption={false}
                      notFoundContent={ctx.selectFetching ? <Spin size='small' /> : '未查询到人员'}
                      // @ts-ignore
                      onSearch={debounce((e) => {
                        selectOnSearch(e)
                      }, 500)}
                    >
                      {ctx.selectOptions.map(option => {
                        return (
                          <Select.Option
                            key={option.id}
                            value={option.username}
                            className={cssUserSetting.item}
                            disabled={option.optionDisabled}
                          >
                            <div className={cssUserSetting.itemUser}>
                              <div className={cssUserSetting.itemAvatar} title='itemAvatar'>
                                <img src={option.thumbnailAvatarUrl || option.avatarUrl || '//f2.eckwai.com/kos/nlav12333/fangzhou/imgs/default_avatar.png'}/>
                              </div>
                              <div className={cssUserSetting.itemName} title='itemName'>
                                {option.name}
                              </div>
                            </div>
                            <div className={cssUserSetting.itemDep} title='itemDep'>{option.orgDisplayName.split('/')[1] || option.orgDisplayName}</div>
                          </Select.Option>
                        )
                      })}
                      
                    </Select>
                  </Form.Item>
                </Form>
                <MySelect
                  options={accessLevelOptions}
                  defaultValue={ctx.inviteAccessLevel}
                  valueToAbbreviationMap={accessLevelNumToExp}
                  useGou={true}
                  onChangeClose={false}
                  onChange={(value) => {
                    ctx.inviteAccessLevel = value
                    config.roleDesc = value
                  }}
                /></> : (
                  <div>
                    你没有管理权限，暂不能添加和管理协作成员。
                    <Button
                      type='link'
                      onClick={() => {
                        onCancel()
                        setTimeout(() => {
                          applyForPermission({homePageCtx, modalCtx})
                        })
                      }}
                    >申请权限</Button>
                  </div>
                )}
            </div>
            <div className={cssUserSetting.userPanel}>
              <div className={cssUserSetting.title}>协作成员</div>
              <div>
                {ctx.groupUsers.map((user, idx) => {
                  const otherOptions = [{title: '移除', description: '移出协作组成员', value: 'del'}]
                  if (ctx.isOwner) {
                    otherOptions.unshift({title: '设为所有者', description: '转让协作组所有者', value: 'owner'})
                  }
                  return (
                    <div className={cssUserSetting.userItem} key={idx}>
                      <div className={cssUserSetting.userAvatar}>
                        <img src={user.avatar || '//f2.eckwai.com/kos/nlav12333/fangzhou/imgs/default_avatar.png'}/>  
                      </div>
                      <div className={cssUserSetting.userProfile}>
                        <div className={cssUserSetting.userName}>{user.name}</div>
                        <div className={cssUserSetting.userDep}>{user.department.split('/')[1] || user.department}</div>
                      </div>
                      {!idx ? <div style={{marginRight: 8}}>所有者</div> : (
                        <div>
                          {/* {user.roleDesc} */}
                          {ctx.isAdmin ? <MySelect
                            options={accessLevelOptions.concat(otherOptions)}
                            // defaultValue={user.roleDesc}
                            value={user.roleDesc}
                            valueToAbbreviationMap={Object.assign(accessLevelNumToExp, {'del': '移除', 'owner': '设为所有者'})}
                            useGou={false}
                            onChangeClose={true}
                            onChange={async (value) => {
                              const lastRoleDesc = user.roleDesc
                              user.roleDesc = value
                              return new Promise(async (resolve, reject) => {
                                roleDescChange({value, user}).then(resolve).catch(() => {
                                  resolve(1)
                                  user.roleDesc = lastRoleDesc
                                })
                              })
                            }}
                          /> : <div style={{marginRight: 8}}>{accessLevelNumToExp[user.roleDesc]}</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
            </div>
          </Spin>
        </div>
      )
    },
    init: ({form}) => {
      form.resetFields()
    }
  })
}

/**
 * 更改名称和描述
 */
function updateNameAndDesc(homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
  modalCtx.openModal(updateNameAndDescModal({info: homePageCtx.breadTitleAry[homePageCtx.breadTitleAry.length  - 1], homePageCtx, modalCtx}))
}

/**
 * 批量配置用户（简易配置）
 */
function addUsersInBulk(homePageCtx: HomePageCtx, modalCtx: ModalCtx, ctx: Ctx) {
  const { id, groupId } = homePageCtx.currentClick
  const isAdmin = ctx.groupCurrentUser?.roleDesc === '1'
  modalCtx.openModal({
    cb: (form: any, onCancel: Function, config) => {
      form.validateFields().then(values => {
        modalCtx.confirmLoading = true
        const { userIds } = values
        const gId = typeof groupId === 'undefined' ? id : groupId
        const { user } = homePageCtx
        const { roleDesc } = config
  
        get(`/api/paas/home/addUsersToGroup?userIds=${userIds}&groupId=${gId}&userId=${user.userId}&userName=${user.name}&roleDesc=${roleDesc}`).then((r) => {
          const { message: msg } = r
          if (r.code === 1) {
            message.success('成员配置成功')
            getUsers({ groupId: gId, homePageCtx, ctx })
            onCancel()
          } else {
            message.error(`成员配置失败:${msg}`)
          }
        }).catch((e) => {
          message.error(`成员配置失败:${e?.message || e?. msg}`)
        }).finally(() => {
          modalCtx.confirmLoading = false
        })
      })
    },
    title: '批量配置成员',
    render: ({form, onOk, config, onCancel}) => {
      const ctx = useObservable({
        inviteAccessLevel: '3'
      })

      useMemo(() => {
        if (!isAdmin) {
          modalCtx.footer = null
        }
      }, [])

      return (
        <div className={cssUserSetting.userBatchSetting}>
          {
            isAdmin ? (
              <>
                <Form form={form}>
                  <Form.Item
                    label='成员id/邮箱'
                    name='userIds'
                    rules={formRulesMap['noEmpty']({errorMsg: `成员id/邮箱不能为空`})}
                  >
                  </Form.Item>
                </Form>
                <MySelect
                  options={accessLevelOptions}
                  defaultValue={ctx.inviteAccessLevel}
                  valueToAbbreviationMap={accessLevelNumToExp}
                  useGou={true}
                  onChangeClose={false}
                  onChange={(value) => {
                    ctx.inviteAccessLevel = value
                    config.roleDesc = value
                  }}
                />
              </>
            ) : (
              <div>
                你没有管理权限，暂不能添加和管理协作成员。
                <Button
                  type='link'
                  onClick={() => {
                    onCancel()
                    setTimeout(() => {
                      applyForPermission({homePageCtx, modalCtx})
                    })
                  }}
                >申请权限</Button>
              </div>
            )
          }
        </div>
      )
    },
    init: ({form}) => {
      form.setFieldsValue({
        userIds: ''
      })
    }
  })
}

/**
 * @description 设置可管理者
 */

function adminSetting (homePageCtx: HomePageCtx, modalCtx: ModalCtx, groupUsers: any = [], ctx: Ctx) {
  const { id, groupId } = homePageCtx.currentClick
  modalCtx.openModal({
    cb: (form: any, onCancel: Function) => {
      const { userIds } = form.getFieldsValue()
      const gId = typeof groupId === 'undefined' ? id : groupId
      modalCtx.confirmLoading = true
      post('/updateUserGroupRoleDescToAdmin', {
        userIds,
        groupId: gId
      }).then(() => {
        onCancel()

        message.info('可管理成员设置成功')
        getUsers({ groupId: gId, homePageCtx, ctx })

        getGroupUser({
          groupId: gId,
          userId: homePageCtx.user.userId,
        }).then(r => {
          homePageCtx.currentPermission = r.roleDesc
        })
      }).catch(e => {
        modalCtx.confirmLoading = false
        message.info(`成员设置失败${e?.message}`)
      })
    },
    title: '可管理成员设置',
    render: ({form}) => {
      return (
        <Form form={form}>
          <Form.Item label="协作组成员" name="userIds">
            <Select
              autoFocus
              // allowClear
              mode="multiple"
              defaultActiveFirstOption={false}
              placeholder="请选择可管理的成员"
              filterOption={(input, option) => {
                const name = option.label as string
                return name.toLowerCase().includes(input.toLowerCase())
              }}
              options={groupUsers.map(user => ({
                value: user.userId,
                label: `${user.name}(${user.userId})`,
                // disabled: user.userId === homePageCtx.user.userId
              }))}
            />
          </Form.Item>
        </Form>
      )
    },
    init: ({ form }) => {
      form.setFieldsValue({
        userIds: groupUsers.filter(item => item.roleDesc === roleDescMap.ADMIN).map(item => item.userId)
      })
    }
  })
}

function getGroupUser ({ groupId, userId }: { groupId: number, userId: string }) {
  return get(`/getGroupUser?groupId=${groupId}&userId=${userId}`)
}

/**
 * 设置可编辑者
 */
function updaterSetting (homePageCtx: HomePageCtx, modalCtx: ModalCtx, groupUsers: any = [], ctx: Ctx) {
  const { id, groupId } = homePageCtx.currentClick
  modalCtx.openModal({
    cb: (form: any, onCancel: Function) => {
      const { userIds } = form.getFieldsValue()
      const gId = typeof groupId === 'undefined' ? id : groupId
      modalCtx.confirmLoading = true
      post('/updateUserGroupRoleDescToEditor', {
        userIds,
        groupId: gId,
        admin: homePageCtx.user
      }).then(() => {
        onCancel()

        message.info('可编辑成员设置成功')

        getUsers({ groupId: gId, homePageCtx, ctx })
        
        getGroupUser({
          groupId: gId,
          userId: homePageCtx.user.userId,
        }).then(r => {
          homePageCtx.currentPermission = r.roleDesc
        })
      }).catch(e => {
        modalCtx.confirmLoading = false
        message.info(`成员设置失败${e?.message}`)
      })
    },
    title: '可编辑成员设置',
    render: ({form}) => {
      return (
        <Form form={form}>
          <Form.Item label="协作组成员" name="userIds">
            <Select
              autoFocus
              // allowClear
              mode="multiple"
              defaultActiveFirstOption={false}
              placeholder="请选择可编辑的成员"
              filterOption={(input, option) => {
                const name = option.label as string
                return name.toLowerCase().includes(input.toLowerCase())
              }}
              options={groupUsers.map(user => ({
                value: user.userId,
                label: `${user.name}(${user.userId})`,
                // disabled: user.userId === homePageCtx.user.userId
              }))}
            />
          </Form.Item>
        </Form>
      )
    },
    init: ({ form }) => {
      form.setFieldsValue({
        userIds: groupUsers.filter(item => item.roleDesc === roleDescMap.EDITOR).map(item => item.userId)
      })
    }
  })
}

/**
 * 删除协作组
 */
function delUserGroup(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) {
  modalCtx.openModal(userGroupDelete({info, homePageCtx, modalCtx}))
}

type InfoProps = {
  label?: any
  value?: any
  LabelRender?: JSX.Element
  DetailRender?: JSX.Element
}

function Info ({label, value, LabelRender, DetailRender}: InfoProps) {
  return (
    <div className={css.descriptionWrapper}>
      <div className={css.descriptionLabel}>
        <span>{label}</span>
        {LabelRender}
      </div>
      <div className={css.descriptionDetail}>
        {value}
        {DetailRender}
      </div>
    </div>
  )
}