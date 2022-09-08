import React from 'react'
// import css from './index.less'

const css = {
  color: "red",
  borderColor: "red",
}

const MyView = (props: any) => {
  return (
    <div style={css}>
      <h1>{props.name}</h1>
      <p>With prettified output</p>
    </div>
  )
}

export default MyView
