import { useState, useEffect } from 'react'

import { User, SSO_User, whiteList  } from '../const'

/**
 * post请求
 * @param url  地址
 * @param data 参数
 * @returns 
 */
export function post(url: string, data: object): Promise<any> {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => {
    const rst = res.json()
    return new Promise((resolve, reject) => {
      rst.then(json => {
        if (json && typeof (json) === 'object' && json.code === -1) {
          reject(json)
        }
        resolve(json)
      })
    })
  })
}

/**
 * get请求
 * @param url 
 * @returns 
 */
export function get(url: string): Promise<any> {
  return fetch(url, {
    method: 'GET',
    credentials: 'include'
  }).then(res => {
    const rst = res.json()
    return new Promise(resolve => {
      rst.then(json => {
        if (json && typeof (json) === 'object' && json.code === -1) {
          throw new Error(`Request error:${json.msg}`)
        }
        resolve(json)
      })
    })
  })
}

/**
 * 权限校验
 * @param param0 用户信息/sso用户信息/是否直接跳转
 * @returns 
 */
export function useUserCheck({user, sso_User, jump = false}: {user: User, sso_User: SSO_User, jump?: boolean}) {
  const [usableSSO] = useState<boolean>(whiteList.includes(sso_User.userId))
  const [usableFZ] = useState<boolean>(!!user)

  useEffect(() => {
    if ((!usableSSO || !usableFZ) && jump) {
      window.location.href = `/app/regist?url=${encodeURIComponent(window.location.href)}`
    }
  }, [])

  return {
    usableFZ,
    usableSSO
  }
}

/**
 * 获取url参数
 * @param key key
 * @returns   value/undefined
 */
export function getUrlParam(key: string): string | undefined {
  const searchAry: string[] = location.search.slice(1).split('&')

  for(let i = 0; i < searchAry.length; i++) {
    const kv = searchAry[i].split('=')
    if (kv[0] === key) {
      return kv[1]
    }
  }

  return
}

/**
 * 地址栏地址替换
 * @param url url
 */
export function replaceState(url: string): void {
  window.history.replaceState(null, null, (typeof url === 'string' && url.trim().length) ? url : '/')
}

/**
 * 复制到剪贴板
 * @param txt 需要复制的字符内容
 * @returns 
 */
export function copyText(txt: string): boolean {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = txt
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  return true
}

function decode (str: string) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(false, `Error decoding "${str}". Leaving it intact.`)
    }
  }
  return str
}

export function parseQuery (query: string): Record<string, unknown> {
  const res = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift())
    const val = parts.length > 0 ? decode(parts.join('=')) : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

export const parseCookie = (cookie: string) => {
  if (!cookie) return {}
  return cookie.split(';').reduce((obj: any, cur: string) => {
    const [key, value] = cur.split('=');
    obj[key] = value;
    return obj;
  }, {})
}

export function download({filename, url}) {
  const dlLink = document.createElement('a');
  dlLink.download = filename;
  dlLink.href = url;
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}