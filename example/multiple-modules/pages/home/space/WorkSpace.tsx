// import { loadMicroApp } from 'qiankun';
import React, { useCallback, useEffect, ReactNode, useRef } from 'react'
// import { loadMicroApp } from '@fangzhou/micro-sdk';
import { Spin } from 'antd'
//@ts-ignore
import css from './index.less'


// export default function WorkSpace(): JSX.Element {
//     let mountNodeRef = useRef();
//     let microApp;

//     useEffect(() => {
//         microApp = loadMicroApp({
//             name: 'workspace',
//             entry: 'https://static.yximgs.com/udata/pkg/ks-ad-fe/chrome-plugin-upload/2021-11-17/1637152443461.a7897cdbf4b9ece1.html',
//             container: mountNodeRef.current,
//             props: { brand: 'qiankun' },
//         });
//         return () => {
//             microApp.unmount();
//         }
//     }, [])

//     return <div ref={mountNodeRef}></div>;
// }

export default class WorkSpace extends React.Component {
  containerRef = React.createRef();
  microApp = null;

  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.microApp.unmount();
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
         <div id="workspaceDom" className={css.workSpace} ref={this.containerRef}></div>
      </Spin>
    )
  }
}

