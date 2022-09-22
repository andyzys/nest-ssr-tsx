import React, {useState, useLayoutEffect, useEffect, useRef} from 'react'
// @ts-ignore
import css from './index.less'
import Hello from './hello/test'

export default function(props: any) {
  const [count, setCount] = useState(3)
  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1)
    }, 3000)
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

