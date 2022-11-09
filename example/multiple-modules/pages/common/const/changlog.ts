import { Changlog } from './type'

const versionChangelogs: Changlog[] = [
  {
    version: '1.0.0',
    updatelog: [
      '添加版本更新内容提示功能',
      '页面搭建时支持对组件选择面板进行展开和收起',
      '代码编辑器支持注释和代码分离'
    ],
    updatetime: '2021-07-09'
  },
  {
    version: '1.1.0',
    updatelog: [
      '中后台场景PC通用组件库整体从antd迁移到mui；注：已搭建的老页面需要升级组件库，若有问题可以联系方舟团队',
      '中后台场景页面发布，url规则更新：/pcspa/${协作组命名空间 或 用户名}/${可自定义(默认为页面ID)}'
    ],
    updatetime: '2021-07-14'
  },
  {
    version: '1.2.0',
    updatelog: [
      '权限控制：新增角色 可编辑者（可新建/可编辑），普通成员不在拥有新建与编辑权限，只可查看'
    ],
    updatetime: '2021-07-26'
  },
  {
    version: '1.2.1',
    updatelog: [
      '权限控制：新增角色 可管理者',
      '中后台场景：增加历史保存记录，执行保存/发布操作时记录保存时间和操作人，可回滚到指定保存版本'
    ],
    updatetime: '2021-07-28'
  },
  {
    version: '1.2.2',
    updatelog: [
      '方舟：ctrl/command + 点击可打开新窗口',
      '中后台场景：支持多环境发布，Staging/Prt/Prod 根据路径区分',
    ],
    updatetime: '2021-08-01'
  },
  {
    version: '1.2.3',
    updatelog: [
      '修复了多层槽嵌套时无法聚焦组件区域的问题',
      '修复了在Schema插槽中的组件显示的问题',
      '优化了布局视图的部分性能'
    ],
    updatetime: '2021-11-26'
  },
  {
    version: '1.2.4',
    updatelog: [
      '自由布局组件增加拖动时显示位置',
      '优化插槽性能',
      '增加逻辑连线时的搜索功能',
      '拖动时选插槽的样式变更'
    ],
    updatetime: '2021-11-29'
  }
]

// 五条最新消息通知,待开发
export default versionChangelogs.slice(versionChangelogs.length - 5)
