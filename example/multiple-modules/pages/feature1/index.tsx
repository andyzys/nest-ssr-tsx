import DeliveryManage from "./DeliveryManage";
import { message } from 'antd'
import React, { useEffect, useState } from "react";
// import { getKConfBuriedConfig } from './util';

// const searchParams = new URL(location.href).searchParams

export default function DeliveryManageHome(props: any) {
  // console.log('拿到的参数是', props)
  const { file, defaultChannelDeliveryList, defaultAppNameMap } = props;

  return (
    <div style={{margin: 20}}>
      {/* {
        searchParams.get('mode') !== 'iframe' && <h1 style={{marginBottom: 12}}>投放管理：{file.name}</h1>
      } */}
      <p style={{color: 'red', fontSize: 14, marginBottom: 10}}>注意：本页面配置会同步埋点管理平台，请至少在投放前一天进行配置，投放后尽量避免删除操作，新增资源位T+1后才有归因数据！</p>
      <DeliveryManage
        fileId={file.id}
        fileContent={file}
        defaultChannelDeliveryList={defaultChannelDeliveryList}
        defaultAppNameMap={defaultAppNameMap}
      ></DeliveryManage>
    </div>
  )
}