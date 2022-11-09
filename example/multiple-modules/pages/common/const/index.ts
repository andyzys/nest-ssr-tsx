import versionChangelogs from './changlog';
import { User, RoleDesc, CooperationStatus } from './type';

// 默认选中nav
export const SELECTED_BY_DEFAULT = 'SELECTED_BY_DEFAULT';

// 我的
export const FANGZHOU_PASS_NAV_MY = 'FANGZHOU_PASS_NAV_MY';

// 我加入的协作组
export const FANGZHOU_PASS_NAV_I_JOINED = 'FANGZHOU_PASS_NAV_I_JOINED';

// 其他协作组
export const FANGZHOU_PASS_NAV_OTHER = 'FANGZHOU_PASS_NAV_OTHER';

// 模版分享
export const FANGZHOU_PASS_NAV_TEMPLATE = 'FANGZHOU_PASS_NAV_TEMPLATE';

// 表格过滤/排序配置项
export const FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG =
  'FANGZHOU_PASS_TABLE_FILTERSORT_CONFIG';

// TODO 暂时写死的可分享协作组，后续应该靠fangzhou后台管理系统来配置
export const templateNamespaces = [
  'fangzhou_share_h5_page',
  'fangzhou_share_pc_page',
];

// 超级管理员key/value
export const SUPER_ADMINISTRATOR_KEY = 'FEt63aeJTiUt1Tn2';
export const SUPER_ADMINISTRATOR_VALUE = '5CiKrPyshFmfuOFQ';

// 我加入的协作组
export const THE_GROUP_I_JOINED = 'THE_GROUP_I_JOINED';

// 其他协作组
export const THE_GROUP_OTHER = 'THE_GROUP_OTHER';

// 版本是否提示标示
export const VERSION_TIPS = '_HOME_PAGE_VERSION_TIPS_';

const roleDescMap: Record<string, RoleDesc> = {
  ADMIN: '1',
  EDITOR: '2',
  READER: '3',
};

const cooperationStatus = {
  READ: 'read',
  WRITE: 'write',
};

// 组件库类型
export const ComlibTypes = ['PC', 'KH5', 'KRN', 'KTARO', 'POSTER'];
export const ComlibTypeOptions = [
  { label: 'PC', value: 'PC' },
  { label: 'KH5', value: 'KH5' },
  { label: 'POSTER', value: 'POSTER' },
  { label: 'KRN', value: 'KRN' },
  { label: 'KTARO', value: 'KTARO' },
];

export const CdmTypeOptions = [
  { label: 'PC', value: 'PC' },
  { label: 'KH5', value: 'KH5' },
  { label: '海报图片', value: 'POSTER' },
];
export const CardTypeOptions = [{ label: '商品卡片', value: 'commodity' }];
export const CardLayoutOptions = [
  {
    label: '单列',
    value: 'single',
  },
  {
    label: '双列',
    value: 'double',
  },
  {
    label: '三列',
    value: 'triple',
  },
  {
    label: '四列',
    value: 'quadruple',
  },
];

export const CardSchemmaTable = {
  commodity: 'fangzhou/eshop/entity/commodity-card',
};

/** 搭建文件类型 */
const extNames = {
  /** 组件 */
  COM: 'component',
  /** 中后台页面 */
  PCSPA: 'pcspa',
  /** H5页面 */
  KH5: 'kh5',
  /** 组件库 */
  COMLIB: 'comlib',
  /** 云组件 */
  CDM: 'cdm',
  /** 卡片 */
  CARD: 'card',
  /** Kconf 图形化 */
  KCONF: 'kconf',
  TK: 'tk',
  /** 文件夹 */
  FOLDER: 'folder',
  /** 服务接口 */
  SERVICE: 'service',
  /** 接口模版 */
  SERVICE_TPL: 'service-tpl',
  /** 营销活动 */
  ECA: 'eca',
  /** C 端大促 */
  PROMOTION: 'promotion',
  /** 模板向导 */
  TPLG: 'tplg',
  /** 海报 */
  POSTER: 'poster',
  /** RN 页面 */
  KRN: 'krn',
  /** KTaro 页面 */
  KTARO: 'ktaro',
  /** 纪元页面 */
  DYNAMICS: 'dynamics',
  PROC_PCSPA: 'proc.pcspa',
  PROC_CDM: 'proc.cdm',
  RULE: 'rule',
  /** 营销活动 **/
  H5ACT: 'h5act',
  /** lowcode-engine 页面 **/
  LCE: 'lce',
};

export {
  User,
  RoleDesc,
  CooperationStatus,
  versionChangelogs,
  roleDescMap,
  cooperationStatus,
  extNames,
};

export const imageUrlRegExp =
  /(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(jpeg)|(gif)|(bmp)|(tiff)|(tga)|(svg)|(webp)))/;

// 国际化平台语言 与 mui语言 映射
export const LanToMUILocale = {
  'zh-TW': 'zh_TW',
  en: 'en_US',
  es: 'es_ES',
  tr: 'tr_TR',
  it: 'it_IT',
  fr: 'fr_FR',
  ar: 'ar_EG',
  th: 'th_TH',
  ru: 'ru_RU',
  ja: 'ja_JP',
  ko: 'ko_KR',
  id: 'id_ID',
  hi: 'hi_IN',
  ms: 'ms_MY',
  'pt-BR': 'pt_BR',
  vi: 'vi_VN',
  bn: 'bn_BD',
  te: '泰卢固语',
  mr: '马拉地语',
  ta: 'ta_IN',
  ur: 'ur_PK',
  kn: 'kn_IN',
  gu: '古吉拉特语',
  'en-PH': '菲律宾语',
  zh: 'zh_CN',
  pa: '旁遮普语',
  ml: 'ml_IN',
  bh: '比哈尔语',
  raj: '拉贾斯坦语',
};
