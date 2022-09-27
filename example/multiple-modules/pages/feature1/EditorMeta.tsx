// @ts-ignore
import { Select, List, Modal, Input, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
// @ts-ignore
import css from './EditorMeta.less'

const { Option, OptGroup } = Select;

interface IDefaultDeliveryItem {
  title: string;
  url: string;
  identification: string; 
  label: string;
  value: string;
}

interface IDefaultDeliveryList {
  title: string;
  desc: string;
  groupKey: string;
  children: IDefaultDeliveryItem[]
}

export default function EditorMeta(props) {
  const { defaultDeliveryList, fileContent } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IDefaultDeliveryItem[]>([]);
  const [currentEditItem, setCurrentEditItem] = useState<IDefaultDeliveryItem>({} as IDefaultDeliveryItem);
  const pageUri = fileContent?.uri;
  const selectedInfos = JSON.parse(fileContent?.deliveryChannel || '[]')
  const pageCode = pageUri?.split('/')[pageUri?.split('/')?.length - 1] || ''
  useEffect(() => {
    if (selectedInfos && selectedInfos.length > 0) {
      setSelectedItems([...selectedInfos])
    }
  }, [])

  const convertEachItemConfig = () => {
    let map = {}
    defaultDeliveryList?.forEach(item => {
      if (item?.children) {
        item.children.forEach(j => {
          map[j.identification] = j
        })
      }
    })
    return map;
  }

  let eachItemConfig = convertEachItemConfig()
  

  const formatSelectItemToUrls = (items) => {
    const list = [];
    items.forEach((item) => {
      // 通用参数
      const param = new URLSearchParams('');
      param.set('hyId', pageCode);
      param.set('entry_src', item.value);
      param.set('layoutType', '4');
      param.set('bizId', pageCode);
      param.set("noBackNavi", "true");
      let url = '';
      const itemConfig = eachItemConfig[item.value] || {}
      if(itemConfig.isSearch) {
        param.set("navBar", "0");
        param.set("safeArea", "0");
        param.set("videoPlay", "0");
        param.set("share", "0");
        url = `https://fangzhou.kwaixiaodian.com${pageUri}?${param.toString()}`;
      } else if(itemConfig.isHalf) {
        param.set("navBar", "0");
        param.set("safeArea", "0");
        param.set("videoPlay", "0");
        param.set("__launch_options__", '{"enableProgress":false}');
        url = `https://fangzhou.kwaixiaodian.com${pageUri}?${param.toString()}`;
      }
      if (itemConfig.isKwai) {
        url = `https://fangzhou.kwaixiaodian.com${pageUri}?${param.toString()}`;
        url = `kwailive://webview?url=${encodeURIComponent(url)}&transparent=1&heightRatio=0.8&webviewbgcolor=%23ffffff&actionbarbgcolor=%2300000000`;
      } else {
        url = `https://fangzhou.kwaixiaodian.com${pageUri}?${param.toString()}`;
      }
      
      list.push({
        // option选中
        ...item,
        // 已选数据
        title: item.label,
        identification: item.value,
        url: url
      })
    })
    return list
  }

  const copy = (val) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    try {
      input.value = typeof val === 'string' ? val : JSON.stringify(val, null, 2);
    } catch (e) {
      console.error('JSON.stringify Error', val);
      input.value = `${val}`;
    }
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.success('已复制到剪贴板');
  };

  const exportToCsv = (items) => {
    const ws = XLSX.utils.json_to_sheet(
      items.map((item) => ({
        资源位名称: item.title,
        线上链接: item.url,
        渠道标识: item.identification,
        page_code: `OP_ACTIVITY_FZ_${pageCode}`
      }))
    );
  
    /* 新建空workbook，然后加入worksheet */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    /* 生成xlsx文件 */
    XLSX.writeFile(wb, `${fileContent.name}投放渠道(${new Date().getTime()}).xlsx`);
  }

  const mergeItemIntoAll = () => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems.forEach(item => {
      if(item.identification === currentEditItem.identification) {
        item.url = currentEditItem.url
      }
    })
    setSelectedItems(newSelectedItems)
    props.onSelectionChange(newSelectedItems)
  }

  const renderSelect = () => {
    const nodes = [];
    defaultDeliveryList?.forEach((node: IDefaultDeliveryList) => {
      const groupNode = (
        <OptGroup key={node.groupKey} label={node.title}>
          {node.children.map((child) => {
            return <Option key={child.identification} value={child.identification}>{child.title}</Option>
          })}
        </OptGroup>
      )
      nodes.push(groupNode);
    })
    return (
      <Select
        labelInValue
        virtual={false}
        value={selectedItems}
        mode={"multiple"}
        style={{ minWidth: 250, width: '100%' }}
        onSelect={(item, option) => {
          const newItems = [...selectedItems];
          newItems.push(item);
          const handled = formatSelectItemToUrls(newItems);
          setSelectedItems(handled as []);
          props.onSelectionChange(handled)
        }}
        onDeselect={(item) => {
          const newItems = [];
          selectedItems.forEach((i) => {
            if (i.value !== item.value) {
              newItems.push(i)
            }
          })
          const handled = formatSelectItemToUrls(newItems);
          setSelectedItems(handled as []);
          props.onSelectionChange(handled)
        }}
      >
        {nodes.map(node => (node))}
      </Select>
    )
  }

  const renderSelection = () => {
    return (
      <div style={{ marginTop: 20}}>
        <h3 style={{marginBottom: 10}}>
          已选渠道：
          <a onClick={(e) => {
            e.stopPropagation();
            copy(selectedItems)
          }}>一键复制所有链接</a>
          <a style={{marginLeft: 10}} onClick={(e) => {
            e.stopPropagation();
            exportToCsv(selectedItems);
          }}>导出数据到CSV</a>
        </h3>
        <p style={{fontSize: 12, color: "#8c8c8c"}}>单击条目可单独复制一行</p>
        <List
          dataSource={selectedItems}
          renderItem={item => (
            <List.Item
              style={{cursor: "pointer"}}
              onClick={(e) => {
                copy(item.url);
              }}
              actions={
                [
                  <a data-id={item.identification} onClick={(e) => {
                    e.stopPropagation();
                    const identification = e.currentTarget.dataset.id
                    selectedItems.forEach(item => {
                      if (item.identification === identification){
                        setCurrentEditItem(item);
                      }
                    })
                    setIsModalVisible(true);
                  }}>修改</a>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={(
                  <div>
                    <p style={{fontSize: 12}}>{eachItemConfig?.[item.identification]?.desc}</p>
                    <p>{item.url}</p>
                  </div>
                )}
              />
            </List.Item>
          )}
          bordered
        >
        </List>
      </div>
    )
  }
  return (
    <div className={css.edt}>
      {renderSelect()}
      {renderSelection()}
      <Modal title="修改渠道链接" visible={isModalVisible} onOk={() => {
        mergeItemIntoAll();
        setIsModalVisible(false);
      }} onCancel={() => {
        setIsModalVisible(false);
      }}>
        <p>渠道名称：{currentEditItem.title}</p>
        <Input.TextArea
          rows={4}
          onChange={(e) => {
            const newItem = {
              ...currentEditItem,
              url: e.target.value
            };
            setCurrentEditItem(newItem);
          }}
          value={currentEditItem.url}
        />
      </Modal>
    </div>
  )
}