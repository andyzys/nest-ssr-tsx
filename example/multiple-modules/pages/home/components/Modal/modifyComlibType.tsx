import React from 'react'
import { post } from '../../utils'
import { Form, Select, message } from 'antd'
import { ComlibTypes, ComlibTypeOptions } from '../../../common/const'

export function modifyComlibType ({info, homePageCtx, modalCtx}) {
  return {
    cb: (form: any, onCancel: Function) => {
      const { type } = form.getFieldsValue()
      if (type) {
        if (type !== info.type) {
          modalCtx.confirmLoading = true
          post(`/modifyFileType`, {
            fileId: info.id,
            type
          })
            .then(async () => {
              onCancel()
              message.info('类型修改成功')
              info.type = type
            })
            .catch((e) => {
              modalCtx.confirmLoading = false
              message.info(`类型修改失败：${e?.message}`)
            })
        } else {
          onCancel()
        }
      } else {
        message.info('类型不能为空')
      }
    },
    title: '类型修改',
    render: ({ form }) => {
      return (
        <Form form={form}>
          <Form.Item label="类型" name="type">
            <Select placeholder="请选择类型" options={ComlibTypeOptions} />
          </Form.Item>
        </Form>
      )
    },
    init: ({ form }) => {
      const defaultType = ComlibTypes.includes(info?.type) ? info?.type : undefined
      form.setFieldsValue({ type: defaultType })
    }
  }
}
