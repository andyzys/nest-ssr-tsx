import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import { ChildProps } from '../..'
import ContentTitle from './contentTitle'
import ContentTable from './contentTable'

// @ts-ignore
import css from '../../index.less'

export default function Left (props: ChildProps): JSX.Element {

  return (
    <div className={`${css.contentLeft}`}>
      <ContentTitle {...props}/>
      <ContentTable {...props}/>
    </div>
  )
}