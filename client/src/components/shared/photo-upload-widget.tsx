import { FileUp, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CropperRef,
  Cropper,
  CropperPreview,
  CropperPreviewRef,
  CircleStencil,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { Button } from '../ui/button';

interface Props {
  uploadPhoto: (file: Blob) => void;
  isPending: boolean;
}
export const PhotoUploadWidget = ({ uploadPhoto, isPending }: Props) => {
  const [files, setFiles] = useState<object & { preview: string }[]>([]);
  const previewRef = useRef<CropperPreviewRef>(null);
  const cropperRef = useRef<CropperRef>(null);
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file as Blob),
        })
      )
    );
  }, []);
  const onUpdate = (cropper: CropperRef) => {
    previewRef.current?.update(cropper);
  };

  const onCrop = useCallback(() => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.getCanvas()?.toBlob((blob) => {
        if (blob) {
          uploadPhoto(blob);
        }
      });
    }
  }, [uploadPhoto]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <section className='w-full flex gap-4 items-start'>
      <div className='w-full'>
        <span>Step 1 - Add Photo</span>
        <div
          {...getRootProps()}
          className={`
        flex flex-col items-center justify-center 
        w-full p-8 rounded-lg border-2 border-dashed 
        transition-all duration-200 cursor-pointer mt-2
        ${
          isDragActive
            ? 'border-primary bg-primary/10 text-primary scale-[1.02] shadow-sm'
            : 'border-border bg-background text-muted-foreground hover:bg-accent/40 hover:border-primary/50'
        }
      `}
        >
          <input {...getInputProps()} className='sr-only' />

          <div
            className={`
        mb-4 rounded-full p-3
        ${isDragActive ? 'bg-primary/20' : 'bg-muted'}
        transition-colors duration-200
      `}
          >
            {isDragActive ? (
              <FileUp className='h-8 w-8 text-primary animate-pulse' />
            ) : (
              <Upload className='h-8 w-8 text-muted-foreground' />
            )}
          </div>

          {isDragActive ? (
            <p className='text-center font-medium text-lg'>
              Drop files to upload
            </p>
          ) : (
            <div className='text-center space-y-2'>
              <p className='text-lg font-medium'>Upload your files</p>
              <p className='text-sm text-muted-foreground'>
                Drag and drop files here, or click to browse
              </p>
            </div>
          )}
        </div>
      </div>
      <div className='w-full'>
        <span>Step 2 - Resize Image</span>
        {files[0]?.preview && (
          <Cropper
            src={files[0]?.preview}
            onUpdate={onUpdate}
            className={'cropper w-[300px] mx-auto mt-2'}
            stencilProps={{ aspectRatio: 1 / 1 }}
            stencilComponent={CircleStencil}
            ref={cropperRef}
          />
        )}
      </div>
      <div className='w-full'>
        <span>Step 3 - Preview & Upload</span>
        <CropperPreview
          ref={previewRef}
          className='preview w-[300px] h-[300px] mx-auto mt-2'
        />
        {files[0]?.preview && (
          <Button className='mt-2 w-full' onClick={onCrop} disabled={isPending}>
            Upload
          </Button>
        )}
      </div>
    </section>
  );
};
