import React, { useState } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadProps } from 'antd';
import { uploadImage } from '@/api/upload';
import { UploadListType } from 'antd/es/upload/interface';
import { messageApi } from '@/lib/utils';

interface ImageUploaderProps {
  fileList: string[];
  onImageSuccess: (fileList: string[]) => void;
  maxCount?: number;
  listType?: UploadListType;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  fileList,
  onImageSuccess,
  maxCount = 8,
  listType = 'picture-card',
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // 过滤掉空值
  fileList = fileList.filter(i => !!i);

  const uploadProps: UploadProps = {
    customRequest: ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // 开始上传时设置loading
      setLoading(true);

      uploadImage(formData)
        .then(res => {
          // 上传成功
          onSuccess && onSuccess({ url: res }, file);
          onImageSuccess && onImageSuccess([...fileList, res]);
        })
        .catch(error => {
          // 上传失败
          if (onError) {
            onError(error);
            messageApi.error('上传失败');
          }
        })
        .finally(() => {
          // 无论成功或失败都关闭loading
          setLoading(false);
        });
    },
    onRemove: (data) => {
      if (data.url) {
        const list = [...fileList].filter(item => item !== data.uid);
        onImageSuccess && onImageSuccess(list);
        return true;
      }
      return false;
    },
    listType,
    fileList: fileList.map(item => ({
      uid: item,
      url: item,
      name: 'image',
      status: 'done'
    })),
    maxCount
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? '上传中' : '上传'}</div>
    </div>
  );

  return (
    <Upload {...uploadProps}>
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );
};

export default ImageUploader;