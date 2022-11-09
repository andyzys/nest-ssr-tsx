import { customAlphabet } from 'nanoid';
import { extNames } from '../common/const/index';
/**
 * post请求
 * @param url  地址
 * @param data 参数
 * @returns
 */
export function post(url: string, data: object, headers?: {}): Promise<any> {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: headers,
  }).then((res) => {
    const rst = res.json();
    return new Promise((resolve, reject) => {
      rst.then((json) => {
        if (json && typeof json === 'object' && [-1, 0].includes(json.code)) {
          reject(json);
        }
        resolve(json);
      });
    });
  });
}

/**
 * get请求
 * @param url
 * @returns
 */
export function get(url: string): Promise<any> {
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
  }).then((res) => {
    const rst = res.json();
    return new Promise((resolve, reject) => {
      rst.then((json) => {
        if (json && typeof json === 'object' && [-1, 0].includes(json.code)) {
          reject(json);
          throw new Error(`Request error:${json.msg}`);
        }
        resolve(json);
      });
    });
  });
}

export function getLocationSearch() {
  return location.search.replace(/\?/, '');
}

export function copyText(txt: string): boolean {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = txt;
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  return true;
}

export function isJSON(str: string): boolean {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

export function deepCopy(obj: any, cache: any = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const hit: any = cache.filter((c: any) => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }
  const copy: any = Array.isArray(obj) ? [] : {};

  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

function createScript(src, index) {
  var script = document.createElement('script');
  script.setAttribute('src', src);
  script.setAttribute('index', index);
  return script;
}

/**
 * 打开编辑页
 * @param file 文件信息
 */
export function edit(file: any, type: string): void {
  window.open(
    `/app/${file.extName.replace(/-/g, '/')}${type}?fileId=${file.id}`,
  );
  // window.location.href = `/app/${file.extName}/desn?fileId=${file.id}`
}

/**
 * 获取父节点
 * @param ary 从该数组中查找
 * @param id  匹配的id
 * @returns
 */
export function getFoldersParent(ary: Array<any>, id: number): any {
  if (!Array.isArray(ary)) return;

  let res: any;

  for (let i = 0; i < ary.length; i++) {
    const { groupId } = ary[i];
    if (groupId && ary[i].id === id) {
      res = ary[i];
    } else {
      res = getFoldersParent(ary[i].dataSource, id);
    }

    if (res) {
      break;
    }
  }

  return res;
}

/**
 * 存储localStorage
 */
export const setLocalStorage = (name: string, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getLocalStorage = (name: string) => {
  if (!name) return;
  return JSON.parse(window.localStorage.getItem(name));
};

/**
 * 删除localStorage
 */
export const removeLocalStorage = (name: string) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 获取url参数
 * @param key key
 * @returns   value/undefined
 */
export function getUrlParam(key: string): string | undefined {
  const searchAry: string[] = location.search.slice(1).split('&');

  for (let i = 0; i < searchAry.length; i++) {
    const kv = searchAry[i].split('=');
    if (kv[0] === key) {
      return kv[1];
    }
  }

  return;
}

/**
 * 地址栏地址替换
 * @param url url
 */
export function replaceState(url: string): void {
  window.history.replaceState(
    null,
    null,
    typeof url === 'string' && url.trim().length ? url : '/',
  );
}

// 命名空间只允许输入英文数字以及下划线
export const regexNamespace: RegExp = /^[0-9a-zA-Z_]{1,}$/;

// 生成固定长度的随机字符串
export const strUid = (len = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return customAlphabet(chars, len)();
};

// 获取页面的uri，[TODO]强依赖 breadTitleAry数据，应该查接口才对
export const getPageUriFromCtx = ({ breadTitleAry, user, extName }: any) => {
  const extNameUri = {
    eca: 'eshop-activity',
    pcspa: 'pcspa',
    kh5: 'kh5',
    poster: 'poster',
    krn: 'krn',
    promotion: 'promotion',
    kconf: 'kconf',
    // 'native': 'eshop-activity',
    dynamics: 'dynamics',
    [extNames.PROC_PCSPA]: 'proc-pcspa',
    rule: 'ruleSchedule',
    [extNames.LCE]: 'lce',
  };

  return `/${extNameUri[extName] || extName}/${
    breadTitleAry?.[0]?.namespace || strUid()
  }/${strUid()}`;

  // if (Array.isArray(breadTitleAry) && breadTitleAry.length > 0 && breadTitleAry[0]?.namespace) {
  //   return `/${extNameUri[extName]}/${breadTitleAry[0]?.namespace || strUid()}/${strUid()}`
  // } else {
  //   return `/${extNameUri[extName]}/${user?.userName || strUid()}/${strUid()}`
  // }
};

export function deepFindFolder(ary, id, groupId) {
  let res;

  ary.find((i) => {
    if (i.id === id && i.groupId === groupId) {
      res = i;

      return true;
    }

    if (Array.isArray(i.dataSource)) {
      if ((res = deepFindFolder(i.dataSource, id, groupId))) {
        return true;
      }
    }
  });

  return res;
}
