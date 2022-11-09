import React from 'react'

import { Popover } from 'antd'

// @ts-ignore
import css from './index.less'
import { useObservable } from '@mybricks/rxui'
import { useUpdateEffect } from '../../../../common/hooks'

type Props = {
  options: Array<{title, value , description}>
  valueToAbbreviationMap: {[key: string | number]: any}

  useGou?: boolean
  value?: any
  defaultValue?: any
  onChangeClose?: boolean

  onChange: (...args) => any
}

export function MySelect ({options, onChange, defaultValue, valueToAbbreviationMap, onChangeClose, useGou, value}: Props) {
  const ctx = useObservable({
    value: value || defaultValue,

    visible: false,
    awaysClose: false
  })

  useUpdateEffect(() => {
    if (typeof value !== 'undefined') {
      ctx.value = value
    }
  }, [value])

  return (
    <Popover
      placement='bottomLeft'
      overlayStyle={{width: 250}}
      visible={ctx.visible}
      onVisibleChange={(bool) => {
        if (ctx.awaysClose) return

        ctx.visible = bool
      }}
      content={() => {
        return (
          <div className={`${css.accessLevelGroup} ${css.accessLevelGroup2}`}>
            {options.map((option) => {
              const { title, value , description } = option
              const selected = value === ctx.value

              return (
                <div key={title} className={`${css.accessLevelGroupItem} ${selected ? css.accessLevelSelected : ''}`} onClick={async () => {
                  ctx.value = value

                  if (typeof onChange === 'function') {
                    if (onChangeClose) {
                      ctx.visible = false
                      ctx.awaysClose = true
                    }
                    
                    await onChange(value)

                    ctx.awaysClose = false
                  }
                }}>
                  <div className={css.optionLeft}>
                    <div className={css.accessLevelTitle}>
                      {title}
                    </div>
                    <div className={css.accessLevelDescription}>
                      {description}
                    </div>
                  </div>
                  {useGou && <div className={css.optionRight}>
                    {selected && iconGou}
                  </div>}
                </div>
              )
            })}
          </div>
        )
      }}
    >
      <div className={css.permissionApplyTitleSpecial}>
        <span className={css.currentManagerUserName}>
          {valueToAbbreviationMap[ctx.value]}
        </span>
      </div>
    </Popover>
  )
}

const iconGou = (
  <svg width='20px' height='20px' fill="#0c63fa" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26978">
    <path d="M891.861333 255.637333l21.12 21.12a27.733333 27.733333 0 0 1 0 39.210667L464.96 763.989333a42.666667 42.666667 0 0 1-57.642667 2.496l-2.709333-2.496L149.589333 508.970667a27.733333 27.733333 0 0 1 0-39.210667l21.12-21.12a27.733333 27.733333 0 0 1 39.210667 0l224.853333 224.853333 417.856-417.856a27.733333 27.733333 0 0 1 39.232 0z"/>
  </svg>
)