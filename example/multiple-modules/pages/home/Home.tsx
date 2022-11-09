import React, { useCallback, useEffect, ReactNode } from 'react'

import {
  Spin,
  Form,
  Input,
  Modal,
  Layout,
  Button
} from 'antd'
import {
  User,
  VERSION_TIPS,
  SELECTED_BY_DEFAULT,
  SUPER_ADMINISTRATOR_KEY,
  SUPER_ADMINISTRATOR_VALUE,
  extNames
} from '../common/const'
import Space from './space'
// import crypto from 'crypto-js'
import NavPanel from './NavPanel'
import { RoleDesc } from '../common/const/type'
import getEmitItem, { Emit } from './NavList/emit'
import { useComputed, useObservable } from '@mybricks/rxui'
import axios from 'axios';
import {setLocalStorage, getLocalStorage, get, replaceState, getUrlParam} from './utils'
import { chooseTemplate, fileCreate, NoticeModal, choosePcEngine } from './components/Modal'
import { MyCtx, IJoinedCtx, OtherCtx } from './NavList'

const { Sider } = Layout
const { confirm } = Modal

//@ts-ignore
import css from './Home.less'

/**
 * 打开对话框
 */
export type OpenModalFn = (param: {
  title: string,
  type?: string,
  width?: number,
  closable?: boolean
  height?: string | number,
  content?: string | ReactNode,
  footer?: undefined | null | ReactNode

  cb?: (...args: any) => void,
  init?: (...args: any) => void,
  render?: (...args: any) => JSX.Element | JSX.Element[]
}) => void

/**
 * 对话框信息
 * @param title          标题
 * @param content        内容
 * @param visible        显示隐藏状态
 * @param bodyLoding     body加载
 * @param bodyLoading    body加载
 * @param confirmLoading 按钮加载
 * @param openModal      打开对话框fn
 * @param cb             回调函数
 * @param init       表单初始化
 * @param render         渲染body
 */
export class ModalCtx {
  form: any
  config: any
  title: string
  width: number
  content: string
  visible: boolean
  closable: boolean
  bodyLoding: boolean
  bodyLoading: boolean
  height: string | number
  confirmLoading: boolean
  footer: undefined | null | ReactNode

  openModal: OpenModalFn
  cb: (...args: any) => void
  init: (...args: any) => void
  render: (...args: any) => JSX.Element | JSX.Element[]
}

let modalCtx: ModalCtx

/**
 * 入参
 * @param user        方舟用户信息
 * @param userGroups  协作组
 * @param goRegist    是否跳转登录页
 * @param isSuperUser 是否超级管理员
 */
interface Props {
  groupId,
  folderId
  user: User
  userGroups: any
  currentNav: any
  goRegist: boolean
  isSuperUser: boolean

  unauthorizedGroup: boolean
}

/**
 * HomePageCtx
 * @param user 当前用户
 * @param fiels 文件列表
 * @param currentNav 当前选中的nav
 * @param userGroups 我加入的协作组
 * @param tbLoading 表格loading
 * @param currentPermission 用户当前协作组权限
 * 
 * @param getUserGroups 获取我加入的协作组
 * @param getFiles 获取文件列表
 */
export class HomePageCtx extends Emit {
  currentClick?: {[key: string]: any}
  user: User
  fiels: any[]
  myCtx: MyCtx
  iJoinedCtx: IJoinedCtx
  otherCtx: OtherCtx
  // shareCtx: ShareCtx
  selectCurrentNav: any
  userGroups: any[]
  otherUserGroups: any[]
  selectUserGroups: any[]
  tbLoading: boolean
  breadTitleAry: any[]
  isSuperUser: boolean
  HackSuperUser: boolean
  currentPermission: RoleDesc

  setLocalUserGroups: (...args: any) => void
  createFile: (...args: any) => void
  getUserGroups: (...args: any) => Promise<any>

  unauthorizedGroup: (...args: any) => void
}

/**
 * 首页
 * @param param0 Props
 * @returns      首页
 */
export default function Homepage({
  user,
  isSuperUser,
  groupId,
  folderId,
  unauthorizedGroup
}: Props): JSX.Element {
  const [form] = Form.useForm()

    /**
   * 对话框确认
   */
     const onOk: () => void = useCallback(() => {
      if (!modalCtx.confirmLoading) {
        modalCtx.cb?.(modalCtx.form, onCancel, modalCtx.config)
      }
    }, [])
  
    /**
     * 对话框取消
     */
    const onCancel: () => void = useCallback(() => {
      modalCtx.visible = false
      modalCtx.footer = void 0
      modalCtx.cb = void 0
      modalCtx.bodyLoading = false
      modalCtx.init = void 0
      modalCtx.render = () => (<></>)
      modalCtx.confirmLoading = false
      modalCtx.config = {}
    }, [])

  modalCtx = useObservable(ModalCtx, next => {
    next({
      form,
      cb: void 0,
      width: 520,
      height: '100%',
      title: '重命名',
      visible: false,
      footer: void 0,
      bodyLoading: false,
      confirmLoading: false,
      config: {},

      openModal,
      init: () => {},
      render: () => (<></>),
      onCancel,
      onOk
    })
  }, {to: 'children'})

  const homePageCtx: HomePageCtx = useObservable(HomePageCtx, next => {
    let currentClick
    if (!groupId && !folderId) {
      // 没有参数取本地
      currentClick = getLocalStorage(SELECTED_BY_DEFAULT)
      if (!currentClick || currentClick.navType === 'unauthorizedGroup' || !currentClick.navType) {
        // 本地没有，去首页
        currentClick = {groupId: 'home'}
        // const ciphertext = crypto.AES.encrypt('home', 'lianglihao').toString()
        // replaceState(`/paas/${ciphertext}`)
        window.history.pushState({current: JSON.stringify({groupId: 'home'})}, '', '?groupId=home')
      }
    } else {
      
      if (['home', 'recycleBin'].includes(groupId)) {
        // 去首页
        currentClick = {groupId}
        // const ciphertext = crypto.AES.encrypt(`${groupId}`, 'lianglihao').toString()
        // replaceState(`/paas/${ciphertext}`)
        window.history.pushState({current: JSON.stringify({groupId})}, '', `?groupId=${groupId}`)
      } else if (groupId === 'my') {
        // 去我的
        if (!folderId) {
          // 没有文件ID
          currentClick = null
        } else {
          // 有文件ID
          currentClick = {
            navType: 'my',
            id: folderId,
            extName: 'folder'
          }
        }
      } else {
        if (!folderId) {
          currentClick = {id: groupId}
        } else {
          currentClick = {id: folderId, groupId, extName: 'folder'}
        }
      }
    }

    setLocalStorage(SELECTED_BY_DEFAULT, currentClick)
1
    next({
      // myCtx,
      // iJoinedCtx,
      // otherCtx,
      // shareCtx,
      user,
      fiels: [],
      userGroups: [],
      otherUserGroups: [],
      tbLoading: false,
      breadTitleAry: [],
      isSuperUser,
      HackSuperUser: getLocalStorage(SUPER_ADMINISTRATOR_KEY) === SUPER_ADMINISTRATOR_VALUE,
      currentPermission: void 0,

      createFile: (ext) => {
        createFile(ext, modalCtx, homePageCtx)
      },
      unauthorizedGroup({init} = {}) {
        homePageCtx.tbLoading = true
        homePageCtx.currentClick.navType = 'unauthorizedGroup'
        const { id, groupId, folderId, extName } = homePageCtx.currentClick
        let url = ''

        const pushstateJSON: any = {
          navType: 'unauthorizedGroup'
        }

        if (groupId) {
          url = `?groupId=${groupId}`
          pushstateJSON.groupId = groupId
          if (folderId || id) {
            url = url + `&folderId=${folderId || id}`
            pushstateJSON.folderId = folderId || id
          }
        } else if (id) {
          url = `?groupId=${id}`
          pushstateJSON.groupId = id
          if (folderId) {
            url = url + `&folderId=${folderId}`
            pushstateJSON.folderId = folderId
          }
        }

        let message = `${pushstateJSON.groupId}`

        if (pushstateJSON.folderId) {
          message += `-${pushstateJSON.folderId}`
        }

        // const ciphertext = crypto.AES.encrypt(message, 'lianglihao').toString()

        if (!init) {
          // window.history.pushState({current: JSON.stringify(pushstateJSON)}, '', `/paas/${ciphertext}`)
          window.history.pushState({current: JSON.stringify(pushstateJSON)}, '', `${url}`)
        } else {
          // replaceState(`/paas/${ciphertext}`)
          replaceState(url)
        }

        get(`/getPaasTableFilesByQuery${url}`).then(r => {
          const {group, files, folderTreeAry} = r

          homePageCtx.fiels = files
          homePageCtx.breadTitleAry = [group, ...folderTreeAry]
        }).catch(e => {

        }).finally(() => {
          homePageCtx.tbLoading = false
        })
      },
      ...getEmitItem({modalCtx, user}),
      currentClick
    })
  }, {to: 'children'})

  useEffect(() => {
    
    window.addEventListener('popstate', async e => {
      if (e.state && e.state.current) {
        const item = JSON.parse(e.state.current)
        let currentClick = item
        const { groupId, folderId, navType } = item

        if (['home', 'recycleBin'].includes(groupId)) {
          currentClick = {groupId}
        } else if (groupId === 'my') {
          // 去我的
          if (!folderId) {
            // 没有文件ID
            currentClick = null
          } else {
            // 有文件ID
            currentClick = {
              navType,
              id: folderId,
              extName: 'folder'
            }
          }
        } else {
          if (!folderId) {
            currentClick = {id: groupId, navType}
          } else {
            currentClick = {id: folderId, groupId, extName: 'folder', navType}
          }
        }

        homePageCtx.currentClick = currentClick

        setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)

        if (homePageCtx.isMy(homePageCtx.currentClick)) {
          homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick, pushState: false})
        } else if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
          homePageCtx.iJoinedCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick, pushState: false})
        } else if (homePageCtx.isOther(homePageCtx.currentClick)) {
          homePageCtx.otherCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick, pushState: false})
        } 
        // else if (homePageCtx.isShare(homePageCtx.currentClick)) {
        //   homePageCtx.shareCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick, pushState: false})
        // } 
        else if (homePageCtx.currentClick.groupId === 'recycleBin') {
          homePageCtx.tbLoading = true
          homePageCtx.getRecycleBinFiles({params: {userId: homePageCtx.user.userId}, pushState: false}).then(files => {
            homePageCtx.fiels = files
            homePageCtx.tbLoading = false
            homePageCtx.breadTitleAry = [{name: '回收站', icon: 'recycleBin'}]
          })
        } else if (homePageCtx.currentClick.navType === 'unauthorizedGroup') {
          homePageCtx.unauthorizedGroup()
        }
      }
    })

    window.EF_FEEDBACK = {
      ...window.EF_FEEDBACK,
      getUserId: function() {
        return { userId: homePageCtx.user.userId };
      }
    }

    if (!unauthorizedGroup) {
      homePageCtx.unauthorizedGroup({init: true})
    }
  }, [])

  const RenderModal: JSX.Element = useComputed(() => {
    return modalCtx.visible && (
      <Modal
        okText='确认'
        cancelText='取消'
        className={'customModal'}
        maskClosable={false}
        width={modalCtx.width}
        closable={modalCtx.closable}
        centered={true}
        bodyStyle={{height: modalCtx.height, overflow: 'auto'}}
        destroyOnClose={true}
        title={modalCtx.title}
        visible={modalCtx.visible}
        confirmLoading={modalCtx.confirmLoading}

        footer={modalCtx.footer}

        onOk={onOk}
        onCancel={onCancel}
      >
        <Spin spinning={modalCtx.bodyLoading}>
          {/* @ts-ignore */}
          {modalCtx.visible && <modalCtx.render form={modalCtx.form} onOk={onOk} onCancel={onCancel} config={modalCtx.config}/>}
        </Spin>
      </Modal>
    )
  })

  useEffect(() => {
    if (modalCtx.visible) {
      if (typeof modalCtx.init === 'function') {
        modalCtx.init({form: modalCtx.form})
      }
    }
  }, [modalCtx.visible])

  return (
    <Layout className={`${css['home-app']} ${css['home-app__web']}`}>
      <Sider className={css['app-sider']}>
        <NavPanel />
      </Sider>
      <Layout>
        <Space />
      </Layout>
      {RenderModal}
      <NoticeModal />
    </Layout>
  )
}

/**
 * 打开对话框
 */
const openModal: OpenModalFn = ({cb, title, content, type, width, height, init, render, footer, closable}) => {
  if (modalCtx.visible) return
  if (type === 'delete') {
    confirm({
      title,
      content,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk() {return cb(true)}
    });
  } else {
    modalCtx.cb = cb
    modalCtx.title = title
    modalCtx.render = render
    modalCtx.init = init
    modalCtx.width = width || 520
    modalCtx.height = height || '100%'
    modalCtx.footer = footer
    modalCtx.closable = closable

    modalCtx.visible = true
  }
}

function createFile(extName: string, modalCtx: ModalCtx, homePageCtx: HomePageCtx): void {
  const showTemplate = [extNames.KH5, extNames.PCSPA, extNames.POSTER].includes(
    extName
  );
  if (extName === extNames.PCSPA) {
    choosePcEngine({ modalCtx, homePageCtx })
  } else if (showTemplate) {
    modalCtx.openModal(
      chooseTemplate({ info: { extName }, modalCtx, homePageCtx })
    );
  } else {
    modalCtx.openModal(
      fileCreate({
        info: { extName },
        modalCtx,
        homePageCtx,
        defaultValues: {}
      })
    );
  }
}


export function transformFoldersTree (list, localList) {
  const tree = []
  const localTreeMap = treeToObj(localList)

  for (let i = 0, len = list.length; i < len; i++) {
    if (!list[i].parentId) {
      const item = queryFolders(list[i], list, localTreeMap)
      const { id } = item

      if (localTreeMap[id]) {
        item.open = true
      }

      tree.push(item)
    }
  }

  return tree
}

function queryFolders (parent, list, localTreeMap) {
  const dataSource = []
  
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].parentId === parent.id) {
      const item = queryFolders(list[i], list, localTreeMap)
      const { id } = item

      if (localTreeMap[id]) {
        item.open = true
      }

      dataSource.push(item)
    }
  }
  
  if (dataSource.length) {
    parent.dataSource = dataSource
  }
  
  return parent
}

function treeToObj(tree, res = {}) {
  if (!Array.isArray(tree)) return res

  tree.forEach(t => {
    const { id, open, dataSource } = t
    res[id] = !!open

    treeToObj(dataSource, res)
  })
  

  return res
}

export function deepFindFolder(ary, id, groupId) {
  let res

  ary.find(i => {
    if (i.id === id && i.groupId === groupId) {
      res = i

      return true
    }

    if (Array.isArray(i.dataSource)) {
      if (res = deepFindFolder(i.dataSource, id, groupId)) {
        return true
      }
    }
  })

  return res
}