const getKConfBuriedConfig = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/pass/track/getKconfConfig', {
      method: 'POST',
      body: JSON.stringify({
        keys: [
          'platecoDev.kwaishopPower.channelDeliveryMap',
          'platecoDev.kwaishopPower.buriedPointAppNameMap'
        ]
      })
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
    fetch('/api/pass/file/modifyFileDeliveryChannel', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        deliveryChannel
      })
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
    fetch('/api/pass/track/registerTrackByEntrySrc', {
      method: 'POST',
      body: JSON.stringify({
        entrySrcList,
        config
      })
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