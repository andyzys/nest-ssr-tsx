import { message } from 'antd'
import { post } from '../../utils'

export function fileCancelShare ({info, homePageCtx}) {
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
            message.info('取消分享成功')
            resolve('取消分享成功')

            homePageCtx.shareCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
          }).catch(e => {
            message.info(`取消分享失败：${e?.message}`)
            reject()
          })
        })
        
      }
    },
    content: '',
    type: 'delete',
    title: `确认取消分享 ${info.name}`
  }
}
