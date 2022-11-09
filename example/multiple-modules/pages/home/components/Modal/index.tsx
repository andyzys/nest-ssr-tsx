/**
 * 文件移动
 */
export { fileMove } from './fileMove'

/**
 * 文件删除（文件/文件夹）
 */
export { fileDelete } from './fileDelete'



/**
 * 文件分享
 * TODO 2021-11-18 目前只支持kh5和pcspa
 */
export { fileShare } from './fileShare'

/**
 * 文件重命名（文件/文件夹）
 * TODO 应考虑和 updateNameAndDesc 做合并
 */
export { fileRename } from './fileRename'

/**
 * 创建文件
 */
 export { fileCreate } from './fileCreate'

 /**
 * 模版选择
 * TODO 2021-11-18 目前本地写死配置，后续应该由后台管理系统来配置
 */
export { chooseTemplate } from './chooseTemplate'

/**
 * 删除协作组
 */
export { userGroupDelete } from './userGroupDelete'

/**
 * 取消分享（删除）
 */
export { fileCancelShare } from './fileCancelShare'

/**
 * 修改组件库类型
 */
export { modifyComlibType } from './modifyComlibType'

/**
 * 修改名称和描述（文件/文件夹/协作组）
 * TODO 应考虑和 fileRename 做合并
 */
export { updateNameAndDesc } from './updateNameAndDesc'


/**
 * 创建协作组
 */
export { userGroupCreate } from './userGroupCreate'

/**
 * 恢复文件
 */
export { fileRecover } from './fileRecover'

/**
 * 功能迭代通知弹窗
 */
export { NoticeModal } from './notice'

/**
 * 申请权限
 */
export { applyForPermission } from './applyForPermission'

/**
 * 选择中后台页面搭建引擎
 */
 export { choosePcEngine } from './choosePcEngine'