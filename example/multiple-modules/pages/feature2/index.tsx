import React, {useState, useLayoutEffect, useEffect, useRef} from 'react'
// @ts-ignore
import css from './index.less'
import Hello from './hello/test'
// @ts-ignore
import scss from './index.scss'
import axios from 'axios'

export default function(props: any) {
  const [count, setCount] = useState(3)
  const [msg, setMsg] = useState('')
  useEffect(() => {
      axios.get('/prefix/test').then((res) => {
        setMsg(res.data.msg)
      })
  }, [])
  return (
    <div>
      <h1>{msg}</h1>
      {/* <h2 className={scss.big}>scss大号字体</h2>
      <h1 className={css.red}>{props.name}</h1>
      <p className={css.green}>这是模块2With prettified 22222</p>
      {count}
      <Hello />
      <Hello />
      <Hello /> */}
    </div>
  )
}

/**
 var oldxhr=window.XMLHttpRequest
function newobj(){}
window.XMLHttpRequest=function(){
  // console.log('劫持成功了')
    let tagetobk=new newobj();
    tagetobk.oldxhr=new oldxhr();
    let handle={
        get: function(target, prop, receiver) {
            if(prop==='oldxhr'){
                return Reflect.get(target,prop);
            }
            if(typeof Reflect.get(target.oldxhr,prop)==='function')
            {
                if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
                {
                  console.log('!!!', prop)
                    target.oldxhr[prop+'proxy']=(...funcargs)=> {
                        let newArgs = [...funcargs]
                        newArgs[1] = '/feature2' + newArgs[1]
                        let result=target.oldxhr[prop].call(target.oldxhr,...newArgs)
                        console.log('函数劫持获取结果',result)
                        return result;
                    }
                }
                return Reflect.get(target.oldxhr,prop+'proxy')
            }
            if(prop.indexOf('response')!==-1)
            {
                console.log('属性劫持结果',Reflect.get(target.oldxhr,prop))
                return Reflect.get(target.oldxhr,prop)
            }
            return Reflect.get(target.oldxhr,prop);
        },
        set(target, prop, value) {
            return Reflect.set(target.oldxhr, prop, value);
        },
        has(target, key) {
            // debugger;
            return Reflect.has(target.oldxhr,key);
        }
    }
    let ret = new Proxy(tagetobk, handle);
    return ret;
};
 */
