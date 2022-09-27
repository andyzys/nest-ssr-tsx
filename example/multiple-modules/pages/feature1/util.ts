const getKConfBuriedConfig = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/paas/kconf/getConfByKeys', {
      method: 'POST',
      body: JSON.stringify({
        keys: [
          'platecoDev.kwaishopPower.channelDeliveryMap',
          'platecoDev.kwaishopPower.buriedPointAppNameMap'
        ]
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((thenable) => {
      const resData = thenable.json()
      return resData.then(json => {
        if (json.res) {
          resolve(json.res)
        }
      })
    }).catch(err => {
      reject('获取默认渠道数据失败，请刷新重试')
    })
  })
}

const updateDeliveryChannelOfFile = (fileId, deliveryChannel) => {
  return new Promise((resolve, reject) => {
    fetch('/api/paas/file/modifyFileDeliveryChannel', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        deliveryChannel
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((thenable) => {
      const resData = thenable.json()
      return resData.then(json => {
        if (json) {
          resolve(json)
        }
      })
    }).catch(err => {
      reject('获取默认渠道数据失败，请刷新重试')
    })
  })
}

const updatePageEntrySrcRegistOfBuried = (entrySrcList, config) => {
  return new Promise((resolve, reject) => {
    fetch('/api/paas/track/registerTrackByEntrySrc', {
      method: 'POST',
      body: JSON.stringify({
        entrySrcList,
        config
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((thenable) => {
      const resData = thenable.json()
      return resData.then(json => {
        if (json) {
          resolve(json)
        }
      })
    }).catch(err => {
      reject('更新渠道埋点失败，请刷新重试')
    })
  })
}

export {
  getKConfBuriedConfig,
  updatePageEntrySrcRegistOfBuried,
  updateDeliveryChannelOfFile
}