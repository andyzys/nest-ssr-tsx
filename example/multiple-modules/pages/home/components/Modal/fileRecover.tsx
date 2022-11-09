import { message } from 'antd'
import { post } from '../../utils'

export function fileRecover ({info, homePageCtx}) {
  console.log(12)
  return {
    cb: (bool: boolean) => {
      if (bool) {
        return new Promise((resolve, reject) => {
          post(`/recoverFile`, {
            fileId: info.id,
            updatorId: homePageCtx.user.userId,
            updatorName: homePageCtx.user.name
          }).then(async () => {
            message.info('恢复成功')
            resolve('恢复成功')

            homePageCtx.tbLoading = true
            homePageCtx.getRecycleBinFiles({params: {userId: homePageCtx.user.userId}, pushState: false}).then(files => {
              homePageCtx.fiels = files
              homePageCtx.tbLoading = false
              homePageCtx.breadTitleAry = [{name: '回收站', icon: 'recycleBin'}]
            })

          }).catch(e => {
            message.info(`恢复失败：${e?.message}`)
            reject()
          })
        })
        
      }
    },
    type: 'delete',
    content: '将恢复至删除前的位置',
    title: `确认要恢复“${info.name}”吗？`
  }
}
