import React from 'react'
import { Tooltip, Avatar } from 'antd'

// @ts-ignore
import css from './index.less'

interface User {
  avatar?: string
  creatorId: string
  creatorName: string
  id: number
  name: string
  roleDesc: string
  userGroupId: number
  userId: string
  color?: string
}

interface UserListProps {
  data: User[]
  total: number
  onClick?: () => void
}

export default function UserList ({ data = [], total = 0, onClick }: UserListProps) {
  return (
    <div className={css.userList}>
      {data.map(user => {
        return (
          <Tooltip key={user.userId} placement="top" title={user.name}>
            <div className={css.avatarWrapper}>
              <div className={css.avatar}>
                <Avatar
                  size={32}
                  style={{ backgroundColor: user.avatar ? void 0 : user.color }}
                  src={user.avatar?.length ? <img src={user.avatar} /> : ''}
                >
                  {!user.avatar && user.name}
                </Avatar>
              </div>
            </div>
          </Tooltip>
        )
      })}
      {total > 5 && (
        <div className={css.avatarWrapper} onClick={() => {
          onClick?.()
        }}>
          <div className={css.avatarHide}>
            <Avatar
              size={32}
              style={{backgroundColor: '#ebedf0', fontSize: 14}}
            >
              {total}
            </Avatar>
          </div>
        </div>
      )}
    </div>
  )
}