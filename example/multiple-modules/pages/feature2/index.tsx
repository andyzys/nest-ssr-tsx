import React, {useState, useLayoutEffect, useEffect} from 'react'
// @ts-ignore
import css from './index.less'
import Hello from './hello/test'

export default function(props: any) {
  const [count, setCount] = useState(3)
  useEffect(() => {
    console.log('111')
  }, [])
  return (
    <div>
      <h1 className={css.red}>{props.name}</h1>
      <p className={css.green}>这是模块2With prettified output</p>
      {count}
      <Hello />
      <Hello />
      <Hello />
    </div>
  )
}

