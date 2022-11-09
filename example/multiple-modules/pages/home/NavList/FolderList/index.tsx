import React, { useMemo } from 'react'

// @ts-ignore
import { evt } from '@mybricks/rxui'
import { getIconInfo } from '../../components/Icon'
// @ts-ignore
import css from './index.less'

interface Props {
  active: any
  dataSource: Array<any>
  clickWrapper
  clickSwitcher?
  bodyStyle?
}

export default function (props: Props) {

  const Render: JSX.Element = useMemo(() => {
    return (
      <div className={css.container}>
        <div className={css.content} style={props.bodyStyle}>
          <Tree
            count={0}
            {...props}
          />
        </div>
      </div>
    )
  }, [props.active, props.dataSource])

  return Render
}

function Tree({dataSource, active, clickWrapper, clickSwitcher, count}: any): JSX.Element {
  if (!Array.isArray(dataSource)) return

  return (
    <>
      {dataSource.map(item => {
        const { id } = item

        return <Leaf
          key={id}
          active={active}
          item={item}
          clickWrapper={clickWrapper}
          clickSwitcher={clickSwitcher}
          count={count}
        />
      })}
    </>
  )
}

function Leaf({item, clickWrapper, clickSwitcher, count, active}) {
  const { id, hidden, loading, open, name, extName, active: itemActive, dataSource, icon } = item

  if (hidden) return

  const isActive = active?.id === id || itemActive

  const RenderWrapper = useMemo(() => {
    const isGroup = !extName
    let iconKey = 'folderNav'

    if (isGroup) {
      iconKey = icon || 'fangzhou_icon_huojian'
    }

    return (
      <div className={`${css.tree} ${isActive ? css.active : ''}`} style={{padding: `0 0 0 ${25 * count}px`}}>
        <li onClick={evt(() => clickWrapper(item)).stop}>
          {clickSwitcher && <span className={css.switcher}>
          </span>}
          <span className={css.wrapper}>
            <span className={css.title}>
              <i className={`${css.anticon}`}>
                {getIconInfo({key: iconKey, width: '16px'}).icon}
              </i>
              <div className={css.unselect}>
                <span className={css.name}>
                  <span>{name}</span>
                </span>
              </div>
            </span>
          </span>
        </li>
      </div>
    )
  }, [loading, open, isActive, icon])

  const RenderTree = useMemo(() => {
    return (
      <div style={{display: open ? 'block' : 'none'}}>
        <Tree
          count={count + 1}
          dataSource={dataSource}
          active={active}
          clickWrapper={clickWrapper}
          clickSwitcher={clickSwitcher}
        />
      </div>
    )
  }, [open, dataSource, active])

  return (
    <div>
      {RenderWrapper}
      {RenderTree}
    </div>
  )
}