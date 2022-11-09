import { message } from 'antd'
import { SELECTED_BY_DEFAULT } from '../../../common/const'
import { post, removeLocalStorage } from '../../utils'

export function fileDelete ({info, homePageCtx, modalCtx}) {
  return {
    cb: (bool: boolean) => {
      if (bool) {
        return new Promise((resolve, reject) => {
          post(`/api/paas/file/deleteFile`, {
            fileId: info.id,
            updatorId: homePageCtx.user.userId,
            updatorName: homePageCtx.user.name
          }, {
            'Content-Type': 'application/json'
          }).then(async () => {
            message.info('删除成功')
            resolve('删除成功')

            if (homePageCtx.isMy(homePageCtx.currentClick)) {
              homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
            } else {
              let deleteItself = false
              const { id, navType } = homePageCtx.currentClick || {}
              if (homePageCtx.currentClick?.id === info.id) {
                deleteItself = true
                homePageCtx.currentClick = void 0
                homePageCtx.myCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
                removeLocalStorage(SELECTED_BY_DEFAULT)
              }

              if (deleteItself) {
                function findParent(obj, childId) {
                  const { dataSource } = obj

                  return dataSource.find(data => {
                    const { id, dataSource } = data
                    if (id === childId) return true

                    if (Array.isArray(dataSource)) {
                      return findParent(data, childId)
                    }
                  })
                }
                if (homePageCtx.isIJoined({navType})) {
                  const parent = findParent(homePageCtx.iJoinedCtx, id)
                  homePageCtx.iJoinedCtx.fetch({linkageWithHome: false, item: parent})
                } 
                // else if (homePageCtx.isShare({navType})) {
                //   const parent = findParent(homePageCtx.shareCtx, id)
                //   homePageCtx.shareCtx.fetch({linkageWithHome: false, item: parent})
                // }
              } else {
                if (homePageCtx.isIJoined({navType})) {
                  homePageCtx.iJoinedCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
                } 
                // else if (homePageCtx.isShare({navType})) {
                //   homePageCtx.shareCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
                // }
              }
            }
          }).catch(e => {
            message.info(`删除失败：${e?.message}`)
            reject()
          })
        })
        
      }
    },
    content: '',
    type: 'delete',
    title: `确认删除“${info.name}”吗？`
  }
}
