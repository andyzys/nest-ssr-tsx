import {
  COMPONENT_ENTRY_PATH,
  INJECT_DATA_SCRIPT_ID,
} from "../../common/constant";

export function getClientEntry() {
  return `
    import React from 'react'
    import {render} from '@mybricks/rxui'
    import Page from "${COMPONENT_ENTRY_PATH}";
    
    const parent = document.createElement('div')
    parent.style.height = '100%'
    document.body.appendChild(parent)
    
    const script = document.getElementById('${INJECT_DATA_SCRIPT_ID}')
    
    render(<Page {...JSON.parse(decodeURIComponent(script.dataset.obj))}/>, parent, () => {
        script.replaceWith(...[...script.childNodes])
    })  
  `;
}

export function getReactDomClientEntry() {
  return `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Page from "${COMPONENT_ENTRY_PATH}";
    
    const parent = document.createElement('div')
    parent.style.height = '100%'
    document.body.appendChild(parent)
    
    const script = document.getElementById('${INJECT_DATA_SCRIPT_ID}')
    
    ReactDOM.render(<Page {...JSON.parse(decodeURIComponent(script.dataset.obj))}/>, parent, () => {
        script.replaceWith(...[...script.childNodes])
    })  
  `;
}
