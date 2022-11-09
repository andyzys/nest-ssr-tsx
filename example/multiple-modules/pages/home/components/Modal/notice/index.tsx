import React, { useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useObservable, useComputed } from 'rxui-lite'

import { VERSION_TIPS } from '../../../../common/const'
import { get, setLocalStorage, getLocalStorage } from '../../../utils'

// @ts-ignore
import css from './index.less'

class NoticeModalCtx {
  show: boolean = false
  showMobileTip: boolean = false
  config: {
    title: string
    logId: string
    logs: Array<string>
  } = {
    title: '',
    logId: '',
    logs: []
  }

  that = this
  
  setConfig(config) {
    this.config = config
  }

  open() {
    this.show = true
  }

  close({type}) {
    this.show = false

    if (type === 'confirm') {
      setLocalStorage(VERSION_TIPS, JSON.stringify(this.config.logId))
    }
  }
}

const dialogCss = `${css['notice-dialog']} ${css['ps-animated']} ${'ps-fadeIn'}`

export function NoticeModal () {
  const ref = useRef()
  const noticeModalCtx = useObservable(NoticeModalCtx)

  useMemo(() => {
    const ua = navigator.userAgent
    if (ua) {
      const isMobile = /(iPhone|iPod|iPad|Android|ios)/i.test(ua) || /AppleWebKit.*Mobile.*/i.test(ua)
      
      if (isMobile) {
        noticeModalCtx.showMobileTip = true
        return
      }
    }
    
    get('/api/paas/changelog/getPushedChangeLogs').then(res => {
      const { code, data } = res

      if (code === 1) {
        const tip = data[0]

        if (!tip) return

        const { title, logId, content } = tip
        const localTip = getLocalStorage(VERSION_TIPS)

        if (logId !== localTip) {
          let logs = []

          try {
            logs = JSON.parse(decodeURIComponent(content))
          } catch (err) {
            console.log(err)
          }

          if (!Array.isArray(logs) || !logs.length) return

          noticeModalCtx.setConfig({title, logs, logId})
          noticeModalCtx.open()
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }, [])

  const Render: React.ReactPortal | false = useComputed(() => {
    const { config, show, showMobileTip } = noticeModalCtx

    return (show || showMobileTip) && createPortal(
      <div ref={ref} className={`${css['notice__wrapper-model']} ${showMobileTip ? css.mobileContainer : ''}`} onClick={() => {
        if (showMobileTip) {
          document.body.removeChild(ref.current)
        }
      }}>
        <div className={`${dialogCss} ${showMobileTip ? css.mobileDialog : ''}`}>
          {show && <div className={css['notice-header']}>
            <img className={css['header-logo']} src='https://h1.static.yximgs.com/kos/nlav11154/notice-modal-header.png'/>
            <div
              className={css['header-close']}
              onClick={() => noticeModalCtx.close({type: 'close'})}
            >
              <svg fill='#fff' viewBox="0 0 16 16" width="18" height="18">
                <path d="M4.24433 3.18593C3.94974 2.92725 3.50085 2.93849 3.21967 3.21967C2.92678 3.51256 2.92678 3.98744 3.21967 4.28033L6.93934 8L3.21967 11.7197C2.92678 12.0126 2.92678 12.4874 3.21967 12.7803C3.50085 13.0615 3.94974 13.0728 4.24433 12.8141L4.28033 12.7803L8 9.06066L11.7197 12.7803L11.7557 12.8141C12.0503 13.0728 12.4992 13.0615 12.7803 12.7803C13.0732 12.4874 13.0732 12.0126 12.7803 11.7197L9.06066 8L12.7803 4.28033C13.0732 3.98744 13.0732 3.51256 12.7803 3.21967C12.4992 2.93849 12.0503 2.92725 11.7557 3.18593L11.7197 3.21967L8 6.93934L4.28033 3.21967L4.24433 3.18593Z"/>
              </svg>
            </div>
          </div>}
          <div className={`${css['notice-content']} ${showMobileTip ? css.mobileContent : ''}`}>
            {show ? (<><div className={css.title}>{config.title}</div>
            <div className={css.logs}>
              <ol>
                {config.logs.map((log, idx) => {
                  return <li key={idx}>{log}</li>
                })}
              </ol>
            </div></>) : '请使用PC端打开方舟低代码平台以获得更好的体验'}
          </div>
          {show && <div className={css['notice-footer']}>
            <button className={css['footer-btn']} onClick={() => noticeModalCtx.close({type: 'confirm'})}>
              我知道啦
            </button>
          </div>}
        </div>
      </div>, document.body
    )
  })

  return Render
}