import axios from 'axios';
import { useEffect, useState } from 'react';
// import { comlibAdder } from '@fangzhou/sdk';

const ajax = axios.create();
async function getConfig(key: string) {
  const { data } = await ajax({
    url: '/api/config/get',
    params: { key }
  });
  return data.data;
}

export default (props) => {
  const { info, onOk, onStopLoading, onCancel, onBack } = props;
  const [def, setDef] = useState();
  useEffect(() => {
  }, []);
  return (
    <div
      def={def}
      info={info}
      onOk={(ds) => {
        onOk(ds);
      }}
      onStopLoading={onStopLoading}
      onCancel={onCancel}
      onBack={onBack}
      // onPreview={(ds) => {
      //   const previewProjectData = ds.templateProjectData;
      //   const fileId = ds.id;
      //   if (previewProjectData) {
      //     localStorage.setItem(
      //       'previewProjectData',
      //       JSON.stringify(previewProjectData)
      //     );
      //   }
      //   comlibAdder({
      //     appCtx: {
      //       file: {
      //         id: fileId,
      //         extName
      //       }
      //     },
      //     config: {
      //       useLocalProjectData: previewProjectData ? true : false,
      //       onlyPreview: true,
      //       step: 'customcom'
      //     },
      //     onComplete: () => {}
      //   });
      // }}
    />
  );
};
