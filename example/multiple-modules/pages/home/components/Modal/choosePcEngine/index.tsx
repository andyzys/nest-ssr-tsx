import React from 'react';
import { Card } from 'antd';
// import { GlobalLoading } from '@fangzhou/sdk';
import { chooseTemplate } from '../chooseTemplate';
import { fileCreate } from '../fileCreate';
import { extNames } from '../../../../common/const';
import css from './style.less';

export async function choosePcEngine({ homePageCtx, modalCtx }) {
  const onSelect = (extName) => {
    setTimeout(() => {
      if (extName === extNames.PCSPA) {
        modalCtx.openModal(
          chooseTemplate({ info: { extName }, modalCtx, homePageCtx })
        );
      } else {
        modalCtx.openModal(
          fileCreate({
            info: { extName },
            modalCtx,
            homePageCtx,
            defaultValues: {}
          })
        );
      }
    });
  };

  modalCtx.openModal({
    title: `请选择`,
    footer: null,
    width: 400,
    render: ({ onCancel }) => {
      return (
        <div
          className={css.wrap}
          onClick={() => {
            onCancel();
            onSelect(extNames.PCSPA);
          }}
        >
          <Card className={css.itemWrap} hoverable bordered = {false}>
            <img
              className={css.img}
              src="https://ali-ec.static.yximgs.com/udata/pkg/eshop/fangzhou/icons/icon.0889ba7117aa1fac.png"
            />
            <div className={css.label}>方舟引擎</div>
          </Card>
          <Card
            className={css.itemWrap}
            onClick={() => {
              onCancel();
              onSelect(extNames.LCE);
            }}
            hoverable
            bordered = {false}
          >
            <img
              className={css.img}
              src="https://ali-ec.static.yximgs.com/udata/pkg/eshop/fangzhou/icons/icon.5ce9118e1c181b6d.svg"
            />
            <div className={css.label}>低代码引擎</div>
          </Card>
        </div>
      );
    }
  });
}
