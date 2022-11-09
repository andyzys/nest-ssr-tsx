import React, { useCallback, useEffect, ReactNode, useRef, useState } from 'react'
import { Spin } from 'antd'
//@ts-ignore
import css from './DeliveryManage.less'
import EditorMeta from './EditorMeta'
import { updateDeliveryChannelOfFile, updatePageEntrySrcRegistOfBuried } from './util'

export default function DeliveryManage(props) {
  const [loading, setLoading] = useState(false);
  const { defaultChannelDeliveryList, fileContent, defaultAppNameMap } = props;
  console.log('0项目数据是', fileContent)
  const onSelectionChange = (list) => {
    console.log('1最新的数据是', list)
    updateDeliveryChannelOfFile(fileContent.id, JSON.stringify(list))
      .then((res) => {
        // console.log('修改成功', res)
        const uri = fileContent.uri?.split('/')[fileContent.uri?.split('/')?.length - 1] || ''
      const appName = defaultAppNameMap[uri] ? ('ACTIVITY_' + defaultAppNameMap[uri]) : ('ACTIVITY_' + 'FZACTIVITY2021')
        // const appName = 'ACTIVITY_FZSTAGINGACTIVITY';
        const entrySrcList = list.map((entrySrc) => {
          return {
            key: entrySrc.key,
            value: entrySrc.label
          }
        })
        return updatePageEntrySrcRegistOfBuried(entrySrcList, {
          appName: appName,
          page: `OP_ACTIVITY_FZ_${uri}`,
          pageCn: fileContent.name
        });
      })
      .then((res) => {
        console.log('@@@@', res)
      })
  }

  return (
    <Spin spinning={loading}>
      <EditorMeta
        fileContent={fileContent}
        defaultDeliveryList={defaultChannelDeliveryList}
        onSelectionChange={onSelectionChange}
      />
    </Spin>
  )

}

