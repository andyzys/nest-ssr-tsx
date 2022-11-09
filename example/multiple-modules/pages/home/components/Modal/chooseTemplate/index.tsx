import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
// @ts-ignore
import Component from './cdmRender';
import { fileCreate } from '../';
// @ts-ignore
import css from './index.less';

export function chooseTemplate({ info, homePageCtx, modalCtx }) {
  let templateId;
  let templateName;
  let templateProjectData;

  return {
    footer: [
      <Button onClick={modalCtx.onCancel}>取消</Button>,
      <Button
        type="primary"
        onClick={() => {
          templateId = void 0;
          templateName = void 0;
          templateProjectData = void 0;
          modalCtx.onOk();
        }}
      >
        使用空模版
      </Button>
    ],
    width: 942,
    height: 716,
    cb: (form: any, onCancel: Function) => {
      onCancel();

      setTimeout(() => {
        modalCtx.openModal(
          fileCreate({
            info: { ...info, templateId, templateProjectData },
            homePageCtx,
            modalCtx,
            defaultValues: {
              fileName: templateName ? templateName + '(来自分享)' : void 0
            }
          })
        );
      });
    },
    title: `模版选择`,
    render: ({ onOk }) => {
      return (
        <div className={css.container}>
          <div className={css.categoryMain}>
            <Component
              info={info}
              onOk={(ds) => {
                templateId = ds.templateId;
                templateName = ds.templateName;
                templateProjectData = ds.templateProjectData;
                onOk();
              }}
              onStopLoading={() => {
                modalCtx.bodyLoading = false;
              }}
              onCancel={() => {
                modalCtx.visible = false;
              }}
              onBack={() => {
                modalCtx.visible = true;
              }}
            />
          </div>
        </div>
      );
    },
    init: ({ form }) => {
      modalCtx.bodyLoading = true;
    },
  };
}

function getSceneId(extName) {
  switch (extName) {
    case 'pcspa':
      return 7;
    case 'kh5':
      return 8;
    case 'poster':
      return 9;
    case 'picture':
      return 10;
  }
}

function MaterialTemplate({ sceneId, onOk, onStopLoading }) {
  const iframeRef = useRef<HTMLIFrameElement>();

  const iframeUrl = useMemo(() => {
  }, []);

  const addMaterial = useCallback((event) => {
    if (!event?.data?.materialType) {
      return;
    }

    const { materialId, comlib, materialType, content, title, namespace, version } = event.data;

    if (selectedMaterials.length !== 0) {
      message.warn('只能选取一张图片素材，此次操作将覆盖上次选取的图片素材');
    }

    if (materialType === 'picture') {
      const materials = [{ materialId, materialType, content, title, namespace, version }];
      selectedMaterialsRef.current = materials;
      setSelectedMaterials(materials);
      sendSelectedMaterials();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', addMaterial);

    return () => {
      window.removeEventListener('message', addMaterial);
    };
  }, []);

  return <iframe className={css.iframe} ref={iframeRef} src={iframeUrl} onLoad={onStopLoading}></iframe>;
}

export function chooseNewTemplate({ info, homePageCtx, modalCtx }) {
  let templateId;
  let templateName;
  let templateProjectData;

  return {
    footer: [
      <Button onClick={modalCtx.onCancel}>取消</Button>,
      <Button
        type="primary"
        onClick={() => {
          templateId = void 0;
          templateName = void 0;
          templateProjectData = void 0;
          modalCtx.onOk();
        }}
      >
        使用空模版
      </Button>,
    ],
    width: 942,
    height: 716,
    cb: (form: any, onCancel: Function) => {
      onCancel();

      setTimeout(() => {
        modalCtx.openModal(
          fileCreate({
            info: { ...info, templateId, templateProjectData },
            homePageCtx,
            modalCtx,
            defaultValues: {
              fileName: templateName ? templateName + '(来自分享)' : void 0,
            },
          })
        );
      });
    },
    title: `模版选择`,
    render: ({ onOk }) => {
      return (
        <div className={css.container}>
          <div className={css.categoryMain}>
            <MaterialTemplate
              sceneId={getSceneId(info.extName)}
              onOk={(ds) => {
                templateId = ds.templateId;
                templateName = ds.templateName;
                templateProjectData = ds.templateProjectData;
                onOk();
              }}
              onStopLoading={() => {
                modalCtx.bodyLoading = false;
              }}
              // onCancel={() => {
              //   modalCtx.visible = false;
              // }}
              // onBack={() => {
              //   modalCtx.visible = true;
              // }}
            />
          </div>
        </div>
      );
    },
    init: ({ form }) => {
      modalCtx.bodyLoading = true;
    },
  };
}
