import React from 'react'
import { formRulesMap } from './utils'
import { getIconInfo } from '../../components/Icon'
import { fileNameClick } from '../../space/content'
import { post, getPageUriFromCtx } from '../../utils'
import { message, Form, Input, Select, Modal } from 'antd'
import { CardLayoutOptions, CardTypeOptions, CdmTypeOptions, ComlibTypeOptions, extNames } from '../../../common/const'

const { TextArea } = Input
const { confirm } = Modal

const createTypeSelect = ({ options, placeholder = '请选择组件类型，供对应的组件库进行选择' }) => ({ title, info }) => {
  const { isCopy } = info
  return <Form.Item
      style={{ display: isCopy ? 'none' : 'flex' }}
      label='类型'
      name='type'
      rules={formRulesMap['noEmpty']({ errorMsg: `${title}类型不能为空` })}
    >
      <Select placeholder={placeholder} options={options} />
    </Form.Item>
}

const formOptionRendererTable: {
  [key:string]: (props: {
  title: string,
  info: any,
  form?: any
}) => React.ReactElement
}
= {
  'krn': ({ title, info }) => {
    return (
      <>
        <Form.Item label="页面标识" name="bundleId" rules={formRulesMap['onlyLetters']()}>
          <Input placeholder={`请输入页面标识(bundleId)`} autoFocus maxLength={50} />
        </Form.Item>
        <Form.Item label="页面名称" name="componentName" rules={[
          {
            required: true,
            pattern: /^[a-zA-Z][a-zA-Z][a-zA-Z]*$/gm,
            message: '仅允许英文字符，长度至少3位，不可包含特殊字符'
          },
          ({ getFieldValue }) => ({

            validator(_, value) {
              const bundleId = getFieldValue(['bundleId']);
              console.log('bundleId', bundleId);
              if (!value || !value.trim().length) {
                return Promise.reject(new Error(''))
              }

              return Promise.resolve()
            }
          })
        ]}>
          <Input placeholder={`请输入页面名称(componentName)`} autoFocus maxLength={50} />
        </Form.Item>
      </>
    )
  },
  'comlib': createTypeSelect({ options: ComlibTypeOptions, placeholder: '请选择组件库类型，供对应的搭建系统进行选择' }),
  'tplg': createTypeSelect({ options: CdmTypeOptions  }),
  'cdm': createTypeSelect({ options: CdmTypeOptions  }),
  'card': (props) => {
    return <>
        <Form.Item label="卡片类别" name="cardType">
          <Select options={CardTypeOptions} />
        </Form.Item>
        <Form.Item label="卡片布局" name="cardLayout">
          <Select options={CardLayoutOptions} />
        </Form.Item>
    </>
  }
}

export function fileCreate({ info, homePageCtx, modalCtx, defaultValues }) {
  const { extName, templateId, templateProjectData } = info
  const title = getIconInfo({ key: extName }).title
  return {
    cb: (form: any, onCancel: Function) => {
      form.validateFields().then(values => {
        let { fileName, description = '', type, fileUri, componentName, bundleId } = values
        modalCtx.confirmLoading = true

        const isFolder: boolean = homePageCtx.currentClick?.extName === 'folder'
        const isPage: boolean = ['eca', 'pcspa', 'kh5', 'h5act', 'poster', 'krn', 'ktaro', 'kconf', 'promotion', 'dynamics', extNames.PROC_PCSPA, extNames.LCE].includes(extName)
        const groupId = homePageCtx.currentClick?.[isFolder ? 'groupId' : 'id']
        const parentFolderId = isFolder ? homePageCtx.currentClick.id : null

        // 储存不同应用所需的额外数据
        let extraData = {}
        if (extName === 'card') {
          type = 'KH5'
          extraData = {
            cardLayout: values.cardLayout,
            cardType: values.cardType
          }
        }

        const query = {
          type,
          extName,
          description,
          fileName: fileName,
          username: homePageCtx.user.userId,
          displayname: homePageCtx.user.name,
          uri: isPage ? (fileUri ? fileUri : getPageUriFromCtx({ ...homePageCtx, extName })) : null,
          groupId: groupId,
          parentFolderId: parentFolderId,
          templateId,
          templateProjectData: templateProjectData ? JSON.stringify(templateProjectData) : undefined,
          componentName,
          bundleId,
          extraData
        }

        post(`/api/paas/home/createFile`, {
          ...query
        }, {
          'Content-Type': 'application/json'
        }).then(async ({ id }) => {
          onCancel()

          if (homePageCtx.isMy(homePageCtx.currentClick)) {
            await homePageCtx.myCtx.fetch({ linkageWithHome: true, item: homePageCtx.currentClick })
          } else if (homePageCtx.isIJoined(homePageCtx.currentClick)) {
            await homePageCtx.iJoinedCtx.fetch({ linkageWithHome: true, item: homePageCtx.currentClick })
          }
          // else if (homePageCtx.isShare(homePageCtx.currentClick)) {
          //   homePageCtx.shareCtx.fetch({linkageWithHome: true, item: homePageCtx.currentClick})
          // }

          if (extName !== 'folder') {
            // confirm({
            //   title: '是否跳转至新建应用',
            //   centered: true,
            //   okText: '跳转',
            //   cancelText: '取消',
            //   onOk() {
            //     fileNameClick(null, {id, extName}, homePageCtx)
            //   }
            // })
            setTimeout(() => {
              fileNameClick({ ctrlKey: true }, { id, extName, _createTime: Date.now() }, homePageCtx)
            }, 100)
          } else {
            message.info('新建成功')
          }
        }).catch(e => {
          modalCtx.confirmLoading = false
          message.info(`新建失败：${e?.message}`)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    title: `新建${title}`,
    render: ({ form, onOk }) => {
      return (
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item label="名称" name="fileName" rules={formRulesMap['noEmpty']({ errorMsg: `${title}名称不能为空` })}>
            <Input placeholder={`请输入${title}名称，最多50字`} autoFocus onPressEnter={onOk} maxLength={50} />
          </Form.Item>
          {['admin', 'zouyongsheng'].includes(homePageCtx.user.userId) ? (
            <Form.Item label="页面路径" name="fileUri">
              <Input placeholder={`请输入页面URI`} autoFocus maxLength={50} />
            </Form.Item>
          ) : null}
          { formOptionRendererTable[extName] && formOptionRendererTable[extName]({ form, title, info }) }
          <Form.Item label="描述" name="description">
            <TextArea
              autoSize={{
                minRows: 4,
                maxRows: 4,
              }}
              placeholder={`请输入${title}描述，比如介绍用途、涵盖的内容等，最多256字（选填）`}
              maxLength={256}
            />
          </Form.Item>
        </Form>
      );
    },
    init: ({ form }) => {
      const { fileName, type } = defaultValues || {}

      form.setFieldsValue({ fileName, description: void 0, type })
    }
  }
}
