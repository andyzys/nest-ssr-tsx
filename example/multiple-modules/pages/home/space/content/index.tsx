import React, { useEffect } from 'react'

import Title from './title'
import { message } from 'antd'
import ContentChild from './content'
// @ts-ignore
import remove from 'lodash/remove'
import { useComputed, useObservable } from '@mybricks/rxui'
import { ModalCtx, HomePageCtx } from '../../Home'
import { SELECTED_BY_DEFAULT, extNames } from '../../../common/const'
import { FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG } from '../../../common/const'
import { get, post, setLocalStorage, getLocalStorage } from '../../utils'
// import crypto from 'crypto-js'

//@ts-ignore
import css from './index.less'

export const shareMap = {
  'kh5': ['fangzhou_share_h5_page'],
  'pcspa': ['fangzhou_share_pc_page']
}

/**
 * 状态
 * @param showCard        信息卡片弹出
 * @param openCard        信息卡片允许弹出
 * @param groupUsers      协作组成员
 * @param lastGroupId     上一个组ID
 * @param tableActionFile 表格操作被点中的列
 * @param createVisible   新建操作按钮气泡卡片显示状态
 */
export class Ctx {
  showCard: boolean
  openCard: boolean
  groupUsers: any
  groupUsersCount: number
  groupCurrentUser: any
  groupOwner: any
  refleshTableTitle: number
  lastGroupId: number
  tableActionFile: any
  createVisible: boolean
  userConfigVisible: boolean

  tableFilterSortConfig: {[key: string]: any}
  tableTitleActionName: string | undefined
}

const defaultTableFilterSortConfig = {
  title: {
    filter: 'all', // all, ...各种extName
    sort: null
  },
  statusCode: {
    filter: 'all', // all, void 0 1 -1
    sort: null
  },
  userName: {
    show: 'updatorName' // updatorName creatorName
  },
  updateTime: {
    show: 'updateTime',  // updateTime createTime
    filter: null, 
    sort: 'asc' // asc desc
  }
}

type Props = {
  modalCtx: ModalCtx
  homePageCtx: HomePageCtx
}

export type ChildProps = {
  ctx?: Ctx
  modalCtx: ModalCtx
  homePageCtx: HomePageCtx
}

/**
 * Content
 * @param Props Props 
 * @returns     内容
 */
export default function Content({homePageCtx, modalCtx}: Props): JSX.Element {

  const ctx: Ctx = useObservable(Ctx, next => {
    next({
      groupUsers: [],
      groupCurrentUser: {},
      groupUsersCount: 0,
      showCard: true,
      openCard: false,
      refleshTableTitle: 0,
      createVisible: false,
      tableActionFile: void 0,
      tableTitleActionName: void 0,
      tableFilterSortConfig: Object.assign(defaultTableFilterSortConfig, getLocalStorage(FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG))
    })
  })

  useEffect(() => {
    fetch('/api/paas/kconf/getConfig', {
      method: 'POST',
      body: JSON.stringify({
        keys: [
          'platecoDev.kwaishopPower.fangzhouPaasTemplateConfig',
        ]
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((thenable) => {
      const resData = thenable.json()
      return resData.then(json => {
        if (json?.data?.[0]) {
          let adminUser = json.data[0].adminUser;
          let refactorPcSpaTime = json.data[0].refactorPcSpaTime;
          // @ts-ignore
          window.kconfConfig = {
            adminUser,
            refactorPcSpaTime
          }
        }
      })
    }).catch(err => {

    });
  }, [])

  useEffect(() => {
    if (homePageCtx.isMy(homePageCtx.currentClick)) {
      ctx.lastGroupId = void 0
      homePageCtx.currentPermission = '1'
    } else {
      if (homePageCtx.isShare(homePageCtx.currentClick) || ['home', 'recycleBin'].includes(homePageCtx.currentClick?.groupId)) {
        homePageCtx.currentPermission = void 0
      } else {
        let groupId

        if (homePageCtx.isGroup(homePageCtx.currentClick)) {
          if (ctx.lastGroupId !== homePageCtx.currentClick.id) {
            groupId = homePageCtx.currentClick.id
          }
        } else {
          if (ctx.lastGroupId !== homePageCtx.currentClick.groupId) {
            groupId = homePageCtx.currentClick.groupId
          }
        }
  
        if (groupId) {
          ctx.lastGroupId = groupId
  
          getUsers({ groupId, homePageCtx, ctx })
        }
      }
    }
  }, [homePageCtx.currentClick])

  useComputed(() => {
    // 大促应用
    if (homePageCtx?.breadTitleAry?.[homePageCtx?.breadTitleAry?.length - 1]?.fileProperty === "GreatPromotion") {
      ctx.openCard = false
    } else {
      if (['iJoined', 'other', 'unauthorizedGroup'].includes(homePageCtx.currentClick?.navType)) {
        ctx.openCard = true
      } else {
        ctx.openCard = false
      }
    }
  })

  return (
    <div className={css.main}>
      <Title ctx={ctx} modalCtx={modalCtx} homePageCtx={homePageCtx}/>
      <ContentChild ctx={ctx} modalCtx={modalCtx} homePageCtx={homePageCtx}/>
    </div>
  ) 
}

/**
 * 跳转编辑页
 * @param file 文件信息
 */
function edit(e: React.MouseEvent<HTMLDivElement, MouseEvent>, file: any, type): void {
  // TODO判断是不是文件，文件不跳转
  const url = `/app/${file.extName.replace(/-/g, '/')}${type}?fileId=${file.id}`

  routerPush(url, e)
}

function addViewRecord(param) {
  const { userId, fileId, groupId, viewTime, operationType } = param;
  if (!userId || !fileId || !groupId || !viewTime || !operationType) {
    return
  }
  post('/api/pass/user/accessRecord', {
    userId,
    fileId,
    groupId,
    viewTime,
    operationType
  }).then((res) => {
  }).catch(e => {
  })
}

export const fileNameClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any, homePageCtx: HomePageCtx) => void = async (e, item, homePageCtx) => {
  const { id, extName, ref } = item
  const viewRecordParam = {
    userId: homePageCtx.user.userId,
    fileId: id,
    groupId: item.groupId,
    viewTime: new Date().getTime(),
    operationType: 1
  }
  switch (extName) {
    case 'my': {
      homePageCtx.currentClick = null
      homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.myCtx})
      break
    }
    case 'group': {
      homePageCtx.currentClick = {id: item.id, navType: 'unauthorizedGroup'}
      homePageCtx.unauthorizedGroup();
      break
    }
    case 'folder': {
      if (homePageCtx.currentClick?.navType === 'unauthorizedGroup') {
        homePageCtx.currentClick = {
          ...homePageCtx.currentClick,
          folderId: item.id
        }
        homePageCtx.unauthorizedGroup()
        break
      }

      let { id, groupId, creatorId, navType } = item

      if (typeof navType === 'undefined') {
        navType = homePageCtx.currentClick?.navType || 'my'
      }
      // const navType = homePageCtx.currentClick?.navType || 'my'
      
      homePageCtx.tbLoading = true

      let group

      switch (navType) {
        case 'my':
          group = null
          break
        // case 'share':
        //   group = homePageCtx.shareCtx.dataSource.find(data => data.id === groupId)
        //   break
        case 'other':
          group = homePageCtx.otherCtx.dataSource.find(data => data.id === groupId)
          break
        case 'iJoined':
          group = homePageCtx.iJoinedCtx.dataSource.find(data => data.id === groupId)
          break
        default:
          const { find, index } = arraysFind(data => data.id === groupId, [
            // homePageCtx.shareCtx.dataSource,
            homePageCtx.otherCtx?.dataSource,
            homePageCtx.iJoinedCtx.dataSource
          ])

          if (find) {
            group = find
            navType = ['other', 'iJoined'][index]
          }
          break
      }

      if (typeof group === 'undefined') {
        homePageCtx.currentClick = {...item, navType: 'unauthorizedGroup'}
        homePageCtx.unauthorizedGroup();
      } else {
        const {files, folderTreeAry} = await homePageCtx.getFiles({params: {...item, navType}, pushState: true})
        const folders = remove(files, (file) => file.extName === 'folder')
  
        homePageCtx.breadTitleAry = [group, ...folderTreeAry]
        homePageCtx.fiels = folders.concat(files)
        homePageCtx.currentClick = {...item, navType}
        homePageCtx.tbLoading = false
      }

      setLocalStorage(SELECTED_BY_DEFAULT, homePageCtx.currentClick)

      break
    }
    case 'component': {
      message.info(`加急开发中，敬请期待...fileId为${id}`)
      break
    }
    case 'comlib': {
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // let url = `/appDesign?fileId=${ref || id}`;
      // if (e.metaKey || e.ctrlKey) {
      //   window.open(url)
      // } else {
      //   window.location.href = url
      // }
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      // message.info(`加急开发中，敬请期待...fileId为${id}`)
      break
    }
    case 'tplg':
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    case 'cdm': {
      // const url = `/app/cdm?fileId=${id}`
      // addViewRecord(viewRecordParam);
      // routerPush(url, e)
      // break
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // // const url = `/appDesign?fileId=${ref || id}`
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'card': {
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'kconf': {
      // const url = `/app/kconf?fileId=${id}`
      // addViewRecord(viewRecordParam);
      // routerPush(url, e)
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'tk': {
      message.info(`加急开发中，敬请期待...fileId为${id}`)
      break
    }
    case 'kh5': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'h5act': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      addViewRecord(viewRecordParam);
      routerPush(`/appDesign/h5?fileId=${id}`, e)
      break
    }
    case 'promotion': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'kh5com': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'pcspa': {
      // let url = `/app/pcspa/desn?fileId=${ref || id}`
      // if (e?.metaKey || e?.ctrlKey) {
      //   url = `/appDesign?fileId=${ref || id}`
      // }
      // const url = `/appDesign?fileId=${ref || id}`
      // if(item?._createTime > window?.kconfConfig?.refactorPcSpaTime) {
      //   routerPush(`/page/application/pcspa?fileId=${item.id}`, e)
      // } else {
      //   const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      //   addViewRecord(viewRecordParam);
      //   routerPush(`/appDesign/JM${ciphertext}`, e)
      // }
      break
    }
    case 'poster': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      addViewRecord(viewRecordParam);
      // todo
      routerPush(`/page/application/c/poster?fileId=${ref || id}`, e)
      break
    }
    case 'krn': {
      // const url = `/appDesign?fileId=${ref || id}`
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case 'ktaro': {
      addViewRecord(viewRecordParam);
      routerPush(`/page/application/c/ktaro?fileId=${ref || id}`, e)
      break
    }
    case 'dynamics': {
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case `${extNames.PROC_PCSPA}`: {
      // const ciphertext = crypto.AES.encrypt(`${ref || id}`, 'lianglihao').toString()
      // addViewRecord(viewRecordParam);
      // routerPush(`/appDesign/JM${ciphertext}`, e)
      break
    }
    case extNames.LCE: {
      addViewRecord(viewRecordParam);
      // todo
      routerPush(`/page/application/lce/?fileId=${id}`, e)
      break
    }
    case 'rule': {
      routerPush(`/app/logic?id=${id}`)
      break
    }
    default:
      edit(e, item, extName.startsWith('service') ? '' : '/desn')
      addViewRecord(viewRecordParam);
      break
  }
}

export function getUsers ({ groupId, homePageCtx, ctx }: {groupId: number, homePageCtx: HomePageCtx, ctx: Ctx}) {
  return new Promise((resolve, reject) => {
    get(`/api/paas/home/getUsersByGroupId?groupId=${groupId}&userId=${homePageCtx.user.userId}&limit=5`).then(r => {

      const { ruser, total, users, owner } = r

      ctx.groupUsers = users
      ctx.groupUsersCount = total
      ctx.groupCurrentUser = {roleDesc: '4', ...ruser}
      ctx.groupOwner = owner;

      homePageCtx.currentPermission = ctx.groupCurrentUser.roleDesc


  //     groupUsers: any
  // groupUsersCount: number
  // groupCurrentUser: any

      // let count

      // const users = r.map(user => {
      //   const color = getAvatarColor(getRandom(0, 4))

      //   user.color = color

      //   if (user.userId === homePageCtx.user.userId) {
      //     homePageCtx.currentPermission = user.roleDesc
      //     count = 1
      //   }

      //   return user
      // })

      // if (!count) {
      //   homePageCtx.currentPermission = void 0
      // }

      // ctx.groupUsers = users

      resolve(r)
    }).catch(e => {
      message.info(`获取协作组用户失败：${e?.message}`)
      reject()
    })
  })
}

function getRandom (n, m) {
  var num = Math.floor(Math.random() * (m - n + 1) + n)
  return num
}

function getAvatarColor (index) {
  const ColorList = ['#f56a00', '#7265e6', '#00a2ae', '#1890ff', '#722ed1']

  return ColorList[index]
}

function routerPush (url: string, e?: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  if (e?.metaKey || e?.ctrlKey) {
    window.open(url)
  } else {
    window.location.href = url
  }
}

export function arraysFind(fn, args) {
  let find
  let index

  args.find((ary, idx) => {
    if (Array.isArray(ary)) {
      index = idx
      return find = ary.find(sth => fn(sth))
    }
  })

  return {
    find,
    index
  }
}
