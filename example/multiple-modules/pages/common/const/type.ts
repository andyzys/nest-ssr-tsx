/**
 * 用户信息
 * @param name   中文名
 * @param userId id
 * @param avatar 头像地址
 * @param status 状态
 */
export interface User {
  name: string
  userId: string
  avatar: string
  status: -1 | 0 | 1
  createTime: string
  updateTime: string
}

export interface Changlog {
  version: string
  updatetime: string
  updatelog: string | string[]
}

export type RoleDesc = '1' | '2' | '3'

export type CooperationStatus = 'write' | 'read' | 'offline'
