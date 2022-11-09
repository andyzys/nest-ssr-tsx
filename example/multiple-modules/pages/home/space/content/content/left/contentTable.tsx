import React, { useMemo } from 'react'

import dayjs from 'dayjs'
import { Table, Popover, Tooltip } from 'antd'
import remove from 'lodash/remove'
import { useComputed } from '@mybricks/rxui'
import { ChildProps, fileNameClick } from '../..'
import { setLocalStorage } from '../../../../utils'
import { titleActions } from '../../title/titleActions'
import { ModalCtx, HomePageCtx } from '../../../../Home'
import { getIconInfo } from '../../../../components/Icon'
import { FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG, roleDescMap, extNames } from '../../../../../common/const'
import XLSX from 'xlsx';
import { post } from '../../../../utils';

/**
 * 用户权限设置暂时不拿出去，要改版
 */
import {
  fileMove,
  fileShare,
  fileRename,
  fileDelete,
  fileCreate,
  fileRecover,
  fileCancelShare,
  modifyComlibType
} from '../../../../components/Modal'

// @ts-ignore
import css from '../../index.less'

/**
 * 表格内容
 */
export default function ContentTable ({ctx, modalCtx, homePageCtx}: ChildProps): JSX.Element {
  const dataSource = useComputed(() => {
    const { title, statusCode, userName, updateTime } = ctx.tableFilterSortConfig
    const { filter: titleFilter } = title
    const { filter: statusCodeFilter } = statusCode
    const { show: userNameShow } = userName
    const { show: updateTimeShow, sort: updateTimeSort } = updateTime

    setLocalStorage(FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG, ctx.tableFilterSortConfig)

    let files = homePageCtx.fiels.filter(file => {
      const {
        hidden,
        extName,
        pubCount,
        creatorId
      } = file

      if (hidden) return false

      if(file.extName === 'component') {
        return false
      }

      let show = true
      let statusCode = 0

      if (['eca', 'pcspa', 'kh5', 'h5act', 'poster', 'krn', 'ktaro', 'kconf', extNames.LCE].includes(extName)) {
        statusCode = pubCount ? 1 : -1
      }

      switch (true) {
        case (titleFilter !== 'all' && titleFilter !== extName):
          show = false
          break
        case (statusCodeFilter !== 'all' && statusCodeFilter !== statusCode):
          show = false
          break
        case (statusCodeFilter !== 'all' && statusCodeFilter !== statusCode):
          show = false
          break
        // case (creatorNameFilter !== 'all' && creatorId !== homePageCtx.user.userId):
        //   show = false
        //   break
        default:
          break
      }

      if (show) {
        file.time = file[updateTimeShow]
        file.statusCode = statusCode
        file.userName = file[userNameShow] || file['creatorName']
      }

      return show
    })

    let folders = remove(files, (file) => file.extName === 'folder')

    folders = filesSort(folders, `_${updateTimeShow}`, updateTimeSort)
    files = filesSort(files, `_${updateTimeShow}`, updateTimeSort)

    return folders.concat(files)
  })

  const RenderTitle: JSX.Element = useMemo(() => {
    return (
      <Table
        rowKey={'id'}
        size='middle'
        pagination={false}
        className={`${css.table}`}
        style={{width: (ctx.openCard && ctx.showCard) ? 'calc(100% - 280px)' : '100%'}}
        columns={tableColumns({ctx, homePageCtx, modalCtx})}
        components={{
          body: {
            wrapper() {
              return <></>
            }
          }
        }}
      />
    )
  }, [
    ctx.openCard,
    ctx.showCard,
    ctx.refleshTableTitle,
    ctx.tableTitleActionName
  ])

  const Render: JSX.Element = useMemo(() => {
    return (
      <Table
        rowKey={'id'}
        size='middle'
        pagination={false}
        showHeader={false}
        className={`${css.table} ${css.tablebody}`}
        dataSource={dataSource}
        loading={homePageCtx.tbLoading}
        columns={tableColumns({ctx, homePageCtx, modalCtx})}
      />
    )
  }, [
    dataSource,
    ctx.openCard,
    ctx.showCard,
    ctx.tableActionFile,
    homePageCtx.tbLoading
  ])

  return (
    <>
      {RenderTitle}
      <div className={css.tbodyContainer} style={{width: (ctx.openCard && ctx.showCard) ? 'calc(100% - 280px)' : '100%'}}>
        {Render}
      </div>
    </>
  )
}

const tableTitleCellFilterAry = [
  {key: 'all', title: '全部类型'},
  ...titleActions
]

const tableTitleCellMap = {
  all: '文档名称',
  folder: '文件夹',
  kh5: 'H5页面',
  promotion: 'C端大促',
  
  pcspa: '中后台页面',
  cdm: '云组件',
  kconf: 'Kconf配置',
  service: '服务接口（内测）',
  'service-tpl': '接口模板（内测）',
  comlib: '组件库',
  kh5com: 'H5组件',
  krn: 'ReactNative页面（内测）',
  poster: '海报图片',
  rule: '规则编排'
}

const tableStatusCodeCell = [
  {key: 'all', title: '全部状态'},
  {key: 0, title: '无状态'},
  {key: 1, title: '已上线'},
  {key: -1, title: '待上线'}
]

const tableStatusCodeMap = {
  all: '状态',
  0: '无状态',
  1: '已上线',
  [-1]: '待上线'
}

// const tableCreateNameCell = [
//   {key: 'all', title: '全部'},
//   {key: 'my', title: '我创建的'}
// ]

// const tableCreateNameMap = {
//   all: '创建人',
//   my: '我创建的'
// }

const tableUserNameCellShow = [
  {key: 'updatorName', title: '更新人'},
  {key: 'creatorName', title: '创建人'}
]

const tableUserNameMap = {
  updatorName: '更新人',
  creatorName: '创建人'
}

const tableupdateTimeCellShow = [
  {key: 'divider', title: '展示'},
  {key: 'updateTime', title: '更新时间'},
  {key: 'createTime', title: '创建时间'}
]

const tableupdateTimeMap = {
  updateTime: '更新时间',
  createTime: '创建时间'
}

const tableupdateTimeCellSort = [
  {key: 'divider', title: '排序'},
  {key: 'asc', title: '新文件在前'},
  {key: 'desc', title: '新文件在后'}
]

const tableActions = [
  {id: 'rename', title: '修改名称和描述', icon: <span className='icon'/>, fn: rename},
  {id: 'move', title: '移动到', icon: <span className='icon'/>, fn: move, permissionValidationMap: {creator: true}},
  // {id: 'copy', title: '创建副本', icon: <CopyOutlined className='icon'/>, fn: copy, grayscale: ['poster']},
  {
    id: 'copy', title: '创建副本', icon: <span className='icon' />, fn: copy,
    visible: (info, homePageCtx: HomePageCtx) => {
      if (info?.extName === extNames.POSTER) {
        return true;
      }
      if (info?.extName === extNames.PCSPA && info?.createTime > window?.kconfConfig?.refactorPcSpaTime) {
        return true;
      }
      return false;
    }
  },
  {id: 'effectData', title: '数据效果', icon: <span className='icon'/>, fn: (info) => {
    const url = info.uri || ''
    const tail = url.substr(url.lastIndexOf('/') + 1)

  }, grayscale: ['kh5', 'promotion', 'h5act'], visible: (info, homePageCtx: HomePageCtx) => {

    return info.statusCode === 1
  }},
  {id: 'delivery', title: '去投放', icon: <span className='icon'/>, fn: (info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) => {
    location.href = `/deliveryManage?fileId=${info.id}`;
  }, grayscale: ['kh5', 'promotion', 'h5act'], visible: (info, homePageCtx: HomePageCtx) => {

    return info.statusCode === 1
  }},
  {id: 'downloadBuriedDesign', title: '下载埋点设计', icon: <span className='icon'/>, fn: downloadBuriedDesign, grayscale: ['folder'], grayUser: ['zouyongsheng', 'zhaoxing03', 'lianglihao', 'renjing07', 'xudanyang', 'feidingding', 'admin']},
  {id: 'markGreatMotion', title: '标记为大促', icon: <span className='icon'/>, fn: (info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) => {
    post('/api/pass/file/updateFileProperty', {
      fileId: info.id,
      fileProperty: 'GreatPromotion' ,
      updatorId: homePageCtx?.user?.userName,
      updatorName: homePageCtx?.user?.name,
    }).then(() => {
      alert('标记成功')
    })
  }, grayscale: ['folder'], grayUser: ['zouyongsheng', 'zhaoxing03', 'lianglihao', 'admin']},
  // {id: 'share', title: '分享到', icon: <ShareAltOutlined className='icon'/>, fn: share, grayscale: ['kh5', 'pcspa'], hack: true},
  {id: 'del', title: '删除', icon: <span className='icon del'/>, useDivider: true, fn: del, permissionValidationMap: {creator: true}}
]

// 组件库操作
const comlibActions = [
  {id: 'rename', title: '修改名称和描述', icon: <span className='icon' />, fn: rename},
  // {id: 'modifyType', title: '类型修改', icon: <EditOutlined className='icon'/>, fn: modifyType},
  {id: 'move', title: '移动到', icon: <span className='icon'/>, fn: move, permissionValidationMap: {creator: true}},
  {id: 'del', title: '删除', icon: <span className='icon del'/>, useDivider: true, fn: del, permissionValidationMap: {creator: true}}
]

// 分享文件操作（暂时提供KH5和PCSPA）
// const shareActions = [
//   {id: 'cancelShare', title: '取消分享', icon: <DeleteOutlined className='icon del'/>, fn: cancelShare, hack: true},
// ]

// 垃圾桶
const recycleBinActions = [
  {id: 'recover', title: '恢复', icon: (
    <svg width={16} height={16} viewBox="0 0 1024 1024" fill="#5c6066" className='icon'>
      <path d="M512 21.333333c270.997333 0 490.666667 219.669333 490.666667 490.666667S782.997333 1002.666667 512 1002.666667 21.333333 782.997333 21.333333 512 241.002667 21.333333 512 21.333333z m0 85.333334C288.149333 106.666667 106.666667 288.149333 106.666667 512s181.482667 405.333333 405.333333 405.333333 405.333333-181.482667 405.333333-405.333333S735.850667 106.666667 512 106.666667z m-31.616 142.890666a42.666667 42.666667 0 0 1-2.048 57.792l-2.56 2.368L413.952 362.666667H597.333333a192 192 0 0 1 5.653334 383.914666L597.333333 746.666667h-64a42.666667 42.666667 0 0 1-3.2-85.226667L533.333333 661.333333h64a106.666667 106.666667 0 0 0 4.629334-213.226666L597.333333 448h-195.648l76.48 76.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709333-2.496-149.333334-149.333333a42.666667 42.666667 0 0 1-0.170666-60.16l2.56-2.389334 149.333333-128a42.666667 42.666667 0 0 1 60.16 4.608z"></path>
    </svg>
  ), fn: recover}
]

/**
 * 表格列配置
 * @param ctx 气泡卡片状态
 * @param openModal  打开对话框
 * @returns          表格列配置数组
 */
const tableColumns: (props: ChildProps) => any[] = ({ctx, homePageCtx, modalCtx}: ChildProps) => {
  const isEditRole = homePageCtx?.currentPermission === roleDescMap.EDITOR
  const isAdmin = homePageCtx?.currentPermission === roleDescMap.ADMIN
  const isRecycleBin = homePageCtx.currentClick?.groupId === 'recycleBin'
  const { title, statusCode, userName, updateTime } = ctx.tableFilterSortConfig
  const { filter: titleFilter } = title
  const { filter: statusCodeFilter } = statusCode
  const { show: userNameShow } = userName
  const { show: updateTimeShow, sort: updateTimeSort } = updateTime

  return [
    {
      title: () => {
        const showPopover = ctx.tableTitleActionName === 'title'
        return (
          <div className={css.customCell}>
            <Popover
              placement='bottomLeft'
              overlayStyle={{
                width: 250
              }}
              visible={showPopover}
              onVisibleChange={(v: boolean) => {
                if (!v) {
                  ctx.tableTitleActionName = void 0
                } else {
                  ctx.tableTitleActionName = 'title'
                }
              }}
              content={() => {
                return (
                  <div className={css.filterGroup}>
                    {tableTitleCellFilterAry.map(({key, title}) => {

                      return (
                        <div key={key} className={css.filterGroupItem} onClick={() => {
                          ctx.tableFilterSortConfig.title.filter = key
                          ctx.refleshTableTitle = ctx.refleshTableTitle + 1
                        }}>
                          <div className={css.leftIcon}>
                            {getIconInfo({key, width: key === 'all' ? '18px' : '20px'}).icon}
                          </div>
                          <div className={css.itemLabel}>{title}</div>
                          <div className={css.rightIcon}>
                            {titleFilter === key && getIconInfo({key: 'fangzhou_icon_gou', width: '20px'}).icon}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              }}
            >
              <div className={`${css.cellTitle} ${showPopover ? css.cellTitleActive : ''}`}>
                <div className={css.cellName}>{tableTitleCellMap[titleFilter]}</div>
                <div className={css.cellIcon}>
                </div>
              </div>
            </Popover>
          </div>
        )
      },
      dataIndex: 'name',
      key: 'name',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: any) => {
        return (
          <Tooltip placement='topLeft' title={text}>
            <div className={`${css.btn} ${isRecycleBin ? css.recycle : ''}`} onClick={(e) => {
              if (!isRecycleBin) {
                fileNameClick(e, record, homePageCtx)
              }
            }}>
              <div style={{display: 'flex', marginRight: 8}}>{getIconInfo({key: record.extName, width: '32px'}).icon}</div>
              <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{text}</div>
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: () => {
        return (
          <div className={css.customCell}>
            <div className={css.cellTitle}>
              <div className={css.cellName}>描述</div>
            </div>
          </div>
        )
      },
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: description => (
        <Tooltip placement='topLeft' title={description}>
          {description}
        </Tooltip>
      )
    },
    {
      title: () => {
        const showPopover = ctx.tableTitleActionName === 'statusCode'
        return (
          <div className={css.customCell}>
            <Popover
              placement='bottomLeft'
              overlayStyle={{
                width: 250
              }}
              visible={showPopover}
              onVisibleChange={(v: boolean) => {
                if (!v) {
                  ctx.tableTitleActionName = void 0
                } else {
                  ctx.tableTitleActionName = 'statusCode'
                }
              }}
              content={() => {
                return (
                  <div className={css.filterGroup}>
                    {tableStatusCodeCell.map(({key, title}) => {
                      return (
                        <div key={key} className={css.filterGroupItem} onClick={() => {
                          ctx.tableFilterSortConfig.statusCode.filter = key
                          ctx.refleshTableTitle = ctx.refleshTableTitle + 1
                        }}>
                          <div className={css.itemLabel}>{title}</div>
                          <div className={css.rightIcon}>
                            {statusCodeFilter === key && getIconInfo({key: 'fangzhou_icon_gou', width: '20px'}).icon}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              }}
            >
              <div className={`${css.cellTitle} ${showPopover ? css.cellTitleActive : ''}`}>
                <div className={css.cellName}>{tableStatusCodeMap[statusCodeFilter]}</div>
                <div className={css.cellIcon}>
                </div>
              </div>
            </Popover>
          </div>
        )
      },
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 100,
      render: (statusCode: number) => {
        let Render = <div className={css.noStatus}>/</div>

        if (statusCode === 1) {
          Render = <div className={css.online}>已上线</div>
        } else if (statusCode === -1) {
          Render = <div className={css.wait}>待上线</div>
        }

        return <div className={css.status}>{Render}</div>
      }
    },
    {
      title: () => {
        const showPopover = ctx.tableTitleActionName === 'userName'
        return (
          <div className={css.customCell}>
            <Popover
              placement='bottomLeft'
              overlayStyle={{
                width: 250
              }}
              visible={showPopover}
              onVisibleChange={(v: boolean) => {
                if (!v) {
                  ctx.tableTitleActionName = void 0
                } else {
                  ctx.tableTitleActionName = 'userName'
                }
              }}
              content={() => {
                return (
                  <div className={css.filterGroup}>
                    {tableUserNameCellShow.map(({key, title}) => {
                      return (
                        <div key={key} className={css.filterGroupItem} onClick={() => {
                          ctx.tableFilterSortConfig.userName.show = key
                          ctx.refleshTableTitle = ctx.refleshTableTitle + 1
                        }}>
                          <div className={css.itemLabel}>{title}</div>
                          <div className={css.rightIcon}>
                            {userNameShow === key && getIconInfo({key: 'fangzhou_icon_gou', width: '20px'}).icon}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              }}
            >
              <div className={`${css.cellTitle} ${showPopover ? css.cellTitleActive : ''}`}>
                <div className={css.cellName}>{tableUserNameMap[userNameShow]}</div>
                <div className={css.cellIcon}>
                </div>
              </div>
            </Popover>
          </div>
        )
      },
      dataIndex: 'userName',
      key: 'userName',
      width: 100
    },
    {
      title: isRecycleBin ? '剩余时间' : () => {
        const showPopover = ctx.tableTitleActionName === 'updateTime'
        return (
          <div className={css.customCell}>
            <Popover
              placement='bottomLeft'
              overlayStyle={{
                width: 250
              }}
              visible={showPopover}
              onVisibleChange={(v: boolean) => {
                if (!v) {
                  ctx.tableTitleActionName = void 0
                } else {
                  ctx.tableTitleActionName = 'updateTime'
                }
              }}
              content={() => {
                return (
                  <>
                    <div className={css.filterGroup}>
                      {tableupdateTimeCellShow.map(({key, title}, idx) => {
                        if (key === 'divider') {
                          return <div key={idx} className={css.filterGroupItemDivider}>{title}</div>
                        }

                        return (
                          <div key={key} className={css.filterGroupItem} onClick={() => {
                            ctx.tableFilterSortConfig.updateTime.show = key
                            ctx.refleshTableTitle = ctx.refleshTableTitle + 1
                          }}>
                            <div className={css.itemLabel}>{title}</div>
                            <div className={css.rightIcon}>
                              {updateTimeShow === key && getIconInfo({key: 'fangzhou_icon_gou', width: '20px'}).icon}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className={css.filterGroup}>
                      {tableupdateTimeCellSort.map(({key, title}, idx) => {
                        if (key === 'divider') {
                          return <div key={idx} className={css.filterGroupItemDivider}>{title}</div>
                        }

                        return (
                          <div key={key} className={css.filterGroupItem} onClick={() => {
                            ctx.tableFilterSortConfig.updateTime.sort = key
                            ctx.refleshTableTitle = ctx.refleshTableTitle + 1
                          }}>
                            <div className={css.itemLabel}>{title}</div>
                            <div className={css.rightIcon}>
                              {updateTimeSort === key && getIconInfo({key: 'fangzhou_icon_gou', width: '20px'}).icon}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              }}
            >
              <div className={`${css.cellTitle} ${showPopover ? css.cellTitleActive : ''}`}>
                <div className={css.cellName}>{tableupdateTimeMap[updateTimeShow]}</div>
                <div className={css.cellIcon}>
                </div>
              </div>
            </Popover>
          </div>
        )
      },
      dataIndex: 'time',
      key: 'time',
      width: 120,
      render: isRecycleBin ? TimeLeft : UpdateTime
    },
    {
      key: 'action',
      width: 36,
      render: (file: any) => {
        const popVisible: boolean = file.id === ctx.tableActionFile?.id

        const { navType, groupId } = homePageCtx?.currentClick || {}

        let actions: any = tableActions

        // if (navType === 'share') {
        //   if (homePageCtx.HackSuperUser) {
        //     actions = shareActions
        //   } else {
        //     return null
        //   }
        // } else
        if (groupId === 'recycleBin') {
          actions = recycleBinActions
        } else {
          if (!isAdmin && !isEditRole) {
            return null
          }
          if (file.extName === 'comlib') {
            actions = comlibActions
          }
        }

        return (
          <Popover
            trigger='click'
            placement="leftTop"
            overlayClassName='createPopover'
            overlayStyle={{
              width: 180
            }}
            visible={popVisible}
            onVisibleChange={(v: boolean) => {
              ctx.tableActionFile = v ? file : void 0
            }}
            content={() => {
              return (
                <div className='content'>
                  {actions.map(({
                    fn,
                    id,
                    icon,
                    title,
                    useDivider,
                    grayscale,
                    grayUser,
                    permissionValidationMap = {},
                    hack,
                    visible
                  }) => {
                    if (typeof visible === 'function') {
                      const vis = visible(file, homePageCtx)

                      if (!vis) return
                    }
                    // 灰度开放功能
                    if (Array.isArray(grayscale) && !grayscale.includes(file.extName)) return
                    if (!hack) {
                      if (!isAdmin) {
                        // 需判断是否创建者
                        if (permissionValidationMap.creator && homePageCtx.user.userId !== file.creatorId) return
                      }
                    } else {
                      if (!homePageCtx.HackSuperUser) return
                    }
                    // 只针对部分用户开放
                    if (Array.isArray(grayUser) && !grayUser?.includes(homePageCtx.user.userName)) return
                    return (
                      <div key={id}>
                        {useDivider && <div className='divider'></div>}
                        <div className='btn' onClick={() => {
                          ctx.tableActionFile = void 0
                          fn(file, homePageCtx, modalCtx)
                        }}>
                          {icon}
                          {title}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }}
          >
            <div className={`${css.actions} ${popVisible ? css.active : ''}`}><span /></div>
          </Popover>
        )
      }
    }
  ]
}

function filesSort (arr, key, rule) {
  return arr.sort((pre, cur) => {
    if (rule === 'asc') {
      return cur[key] - pre[key]
    } else if (rule === 'desc') {
      return pre[key] - cur[key]
    }
  })
}

/**
 * 删除展示的剩余时间
 */
 function TimeLeft(time) {
  const current = dayjs()
  const diffTime = dayjs(time)
  const day = current.diff(diffTime, 'day')

  return `${15 - day}天`
}

/**
 * 获取所需展示的时间
 * @param time 时间
 * @returns    最终展示的时间格式
 */
function UpdateTime(time) {
  if (isToday(time)) {
    return dayjs(time).format('HH:mm')
  } else if (isThisYear(time)) {
    return dayjs(time).format('M月D日 HH:mm')
  }

  return dayjs(time).format('YYYY年M月D日')
}

/**
 * 判断时间是否今天
 * @param time 时间
 * @returns    是否今天
 */
function isToday(time) {
  const t = dayjs(time).format('YYYY-MM-DD')
  const n = dayjs().format('YYYY-MM-DD')

  return t === n
}

/**
 * 判断时间是否今年
 * @param time 时间
 * @returns    是否今年
 */
function isThisYear(time) {
  const t = dayjs(time).format('YYYY')
  const n = dayjs().format('YYYY')

  return t === n
}

/**
 * 修改名称和描述
 */
function rename(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
  modalCtx.openModal(fileRename({info, homePageCtx, modalCtx}))
}

/**
 * 移动到文件夹
 */
function move(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) {
  modalCtx.openModal(fileMove({info, homePageCtx, modalCtx}))
}

/**
 * 创建副本
 */
function copy(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) {
  modalCtx.openModal(fileCreate({info: {
    extName: info.extName,
    templateId: info.id,
    isCopy: true
  }, homePageCtx, modalCtx, defaultValues: {
    fileName: `${info.name} 副本`,
    type: info.type
  }}))
}

/**
 * 下载埋点设计文档
 */
function downloadBuriedDesign(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) {
  post('/api/sandTable/getAllFileInFolder', {
    folderId: info.id
  }).then((res) => {
    const fileIds = []
    if(res.result === 1) {
      res?.data?.forEach(file => {
        fileIds.push(file.id)
      })
      return post('/api/pass/track/allBuriedDesignOfActivity', {
        fileIds: fileIds
      })
    }
  }).then((res) => {
    console.log('项目的所有埋点数据是:', res)
    const list = res.data || [];
    
    const directDataList = []; // 直接归因标识    
    const indirectDataList = []; // 间接归因标识
    list.forEach((item) => {
      item?.indirectAttributionIdentification?.forEach(indirectData => {
        let indirectItem = {
          'entry_src': indirectData.indirectAttributionIdentification,
          'entry_src-中文名称': indirectData.indirectAttributionIdentificationCn,
          'page_code': item.pageCode,
          '页面中文名': item.pageCn,
        }
        indirectDataList.push(indirectItem);
      })
      item?.moduleList?.forEach(module => {
        let directItem = {
          '直接标识': module.directAttributionIdentification,
          'module_name': module.moduleCn,
          'page_code': item.pageCode,
          '页面中文名': item.pageCn,
        }
        directDataList.push(directItem);
      })
    })
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(directDataList), '直接标识'); // 楼层标识 module
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(indirectDataList), 'entry_src'); // entry_src
  
    /* 生成xlsx文件 */
    XLSX.writeFile(wb, `${info.name + '-'}归因标识(${new Date().getTime()}).xlsx`);
  }).catch(e => {
  })
}

/**
 * 分享到文件夹
 */
// function share(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx) {
//   modalCtx.openModal(fileShare({info, homePageCtx, modalCtx}))
// }

/**
 * 删除文件
 */
export function del(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
  modalCtx.openModal(fileDelete({info, homePageCtx, modalCtx}))
}

/**
 * 取消分享
 */
// function cancelShare(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
//   modalCtx.openModal(fileCancelShare({info, homePageCtx}))
// }

/**
 * 恢复文件
 */
function recover(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
  modalCtx.openModal(fileRecover({info, homePageCtx}))
}

/**
 * 修改组件库类型
 */
// function modifyType(info: any, homePageCtx: HomePageCtx, modalCtx: ModalCtx): void {
//   modalCtx.openModal(modifyComlibType({info, homePageCtx, modalCtx}))
// }