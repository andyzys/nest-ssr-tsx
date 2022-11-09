// import { Type } from './index'
import { ModalCtx } from '../Home'
import { get, post, regexNamespace, replaceState } from '../utils'

import { Form, message, Input } from 'antd'
import { userGroupCreate } from '../components/Modal'

import crypto from 'crypto-js'

const TextArea = Input.TextArea

interface Props {
  // type: Type
  modalCtx?: ModalCtx
  // homePageCtx?: HomePageCtx
  user: any
}

export default function (props: Props): Emit {

  const { user, modalCtx } = props
  // const isDisplay: boolean = type === 'useForDisplay'

  return {
    // 获取文件
    /**
     * 
     * @param triggerPoint 哪里点击的，
     */
    getFiles: ({params, pushState = true}) => {
      return new Promise(async (resolve) => {
        const { id, groupId, extName, navType } = params || {}
        const query: any = {}
        if (!params) {
          // 没有params，在“我的”，只需要给入创建者id
          // TODO 目前只能通过创建人id来区分，所以当前文件不允许移动到“我的”
          query.creatorId = user.userId
          query.owner = 'my'
        } else {
          // 有params
          if (navType === 'my') {
            query.creatorId = user.userId
            query.owner = 'my'
          }
          // 没有extName（扩展名），是协作组å
          const isGroup = !extName
          if (isGroup) {
            // 当前是协作组
            query.groupId = id
          } else {
            // 不是协作组
            if (groupId) {
              // 有groupId，不在“我的”，设置协作组id和文件夹id
              query.groupId = groupId
              query.folderId = id
            } else {
              // 没有groupId，在“我的”，设置文件夹id就行
              query.folderId = id
            }
          }
        }
        let url = ''

        Object.entries(query).forEach(ary => {
          const [key, value] = ary

          if (!url) {
            url = `?${key}=${value}`
          } else {
            url = url + `&${key}=${value}`
          }
        })

        if (pushState) {
          if (params) {
            const { id, groupId, navType, extName } = params
            if (!extName) {
              const message = `${id}`
              // const ciphertext = crypto.AES.encrypt(message, 'lianglihao').toString()
              // window.history.pushState({current: JSON.stringify({groupId: id, navType})}, '', `/paas/${ciphertext}`)
              window.history.pushState({current: JSON.stringify({groupId: id, navType})}, '', `?groupId=${id}`)
              // replaceState(`/paas/${ciphertext}`)
            } else {
              const message = `${groupId || 'my'}-${id}`
              // const ciphertext = crypto.AES.encrypt(message, 'lianglihao').toString()
              // window.history.pushState({current: JSON.stringify({groupId: groupId || 'my', folderId: id, navType: groupId ? navType : 'my'})}, '', `/paas/${ciphertext}`)
              window.history.pushState({current: JSON.stringify({groupId: groupId || 'my', folderId: id, navType: groupId ? navType : 'my'})}, '', `?groupId=${groupId || 'my'}&folderId=${id}`)
              // replaceState(`/paas/${ciphertext}`)
            }
          } else {
            const message = 'my'
            // const ciphertext = crypto.AES.encrypt(message, 'lianglihao').toString()
            // window.history.pushState({current: JSON.stringify({groupId: 'my', navType: 'my'})}, '', `/paas/${ciphertext}`)
            window.history.pushState({current: JSON.stringify({groupId: 'my', navType: 'my'})}, '', '?groupId=my')
            // replaceState(`/paas/${ciphertext}`)
          }
        }

        await get(`/api/paas/home/getFiles${url}`)
          .then((res) => {
            resolve(res)
          })
      })
    },

    getRecycleBinFiles: ({params, pushState = false}) => {
      if (pushState) {
        // const ciphertext = crypto.AES.encrypt('recycleBin', 'lianglihao').toString()
        // window.history.pushState({current: JSON.stringify({groupId: 'recycleBin', navType: 'recycleBin'})}, '', `/paas/${ciphertext}`)
        window.history.pushState({current: JSON.stringify({groupId: 'recycleBin', navType: 'recycleBin'})}, '', '?groupId=recycleBin')
      }

      let url

      Object.entries(params).forEach(ary => {
        const [key, value] = ary

        if (!url) {
          url = `?${key}=${value}`
        } else {
          url = url + `&${key}=${value}`
        }
      })

      
      return new Promise(async (resolve) => {
        await get(`/getRecycleBinFiles${url}`)
          .then((res) => {
            resolve(res)
          })
      })
    },


    getUserGroups: ({params}) => {
      let url = ''

      Object.entries(params).forEach(ary => {
        const [key, value] = ary

        if (!url) {
          url = `?${key}=${value}`
        } else {
          url = url + `&${key}=${value}`
        }
      })

      return new Promise(async (resolve) => {
        get(`/api/paas/home/getUserGroups${url}`).then((res) => {
          resolve(res)
        })
      })
    },

    getOtherUserGroups: ({params}) => {
      let url = ''

      Object.entries(params).forEach(ary => {
        const [key, value] = ary

        if (!url) {
          url = `?${key}=${value}`
        } else {
          url = url + `&${key}=${value}`
        }
      })

      return new Promise(async (resolve) => {
        get(`/api/paas/home/getOtherUserGroups${url}`).then((res) => {
          resolve(res)
        })
      })
    },

    getShareUserGroups: () => {
      return new Promise(async (resolve) => {
        get(`/getShareUserGroups`).then((res) => {
          resolve(res)
        })
      })
    },






    // 创建协作组
    createGroup: ({user}) => {
      return new Promise(async (resolve) => {
        modalCtx.openModal(userGroupCreate({user, modalCtx, resolve}))
      })
    },



    isMy: (params) => {
      if (!params) return true

      if (params.navType === 'my') return true

      return false
    },

    isIJoined: (params) => {
      if (params?.navType === 'iJoined') return true

      return false
    },

    isGroup: (params) => {
      const { id, groupId, extName } = params

      if (extName) return false

      return true
    },

    isOther: (params) => {
      if (params?.navType === 'other') return true

      return false
    },

    isShare: (params) => {
      if (params?.navType === 'share') return true

      return false
    },

  }
}

export class Emit {
  getFiles: ({ params, pushState }: {
    params: {[key: string]: any}
    pushState?: boolean
  }) => Promise<{files, folderTreeAry, folderTree}>

  getRecycleBinFiles: ({params, pushState}) => Promise<any>

  createGroup: ({ user }) => Promise<void>

  getUserGroups: ({ params }: {
    params: {[key: string]: any}
  }) => Promise<any>

  getOtherUserGroups: ({ params }: {
    params: {[key: string]: any}
  }) => Promise<any>

  getShareUserGroups: () => Promise<any>

  isMy: (params: {[key: string]: any}) => boolean

  isIJoined: (params: {[key: string]: any}) => boolean

  isOther: (params: {[key: string]: any}) => boolean

  isShare: (params: {[key: string]: any}) => boolean

  isGroup: (params: {[key: string]: any}) => boolean
  
}

