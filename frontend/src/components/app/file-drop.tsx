import React, { useRef, useState, useEffect } from 'react';

type FileDropProps = {
  onFiles: (files: File[]) => void;
  accept?: string; // e.g. "image/*,application/pdf"
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number; // per-file max size in bytes
  disabled?: boolean;
  label?: string;
};

type Preview = {
  file: File;
  url: string;
};

const FileDrop = ({
  onFiles,
  accept,
  multiple = true,
  maxFiles = Infinity,
  maxSizeBytes = Infinity,
  disabled = false,
  label = 'Drag & drop files here or click to upload',
}: FileDropProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // revoke object URLs
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const openFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const filesArray = Array.from(filesList);

    if (!multiple && filesArray.length > 1) {
      setErrors('Only one file allowed.');
      return;
    }
    if (filesArray.length > maxFiles) {
      setErrors(`Max ${maxFiles} files allowed.`);
      return;
    }

    const tooLarge = filesArray.find((f) => f.size > maxSizeBytes);
    if (tooLarge) {
      setErrors(`File "${tooLarge.name}" exceeds the size limit.`);
      return;
    }

    setErrors(null);
    // create previews for images (optional)
    const newPreviews = filesArray.map((f) => ({
      file: f,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
    }));
    // cleanup previous previews
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(newPreviews);
    onFiles(filesArray);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
    // reset so same file can be selected again
    e.currentTarget.value = '';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // only clear when leaving the element (not child)
    if ((e.relatedTarget as Node) === null) {
      setIsDragging(false);
    } else {
      setIsDragging(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      openFilePicker();
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={onKeyDown}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        className={`card border-2 border-dashed rounded-md p-6 text-center cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragging ? 'ring-2 ring-primary ring-offset-2 bg-base-200' : 'bg-base-100'}
        `}
        aria-disabled={disabled}
        aria-label="File upload dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onInputChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
            />
            <path
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 10l5-5 5 5M12 5v12"
            />
          </svg>
          <div className="text-lg font-medium">{label}</div>
          <div className="text-sm opacity-70">
            {accept ? `Accepted: ${accept}` : 'Any file type'} ·{' '}
            {multiple ? 'Multiple' : 'Single'} file
          </div>
          {errors && <div className="text-sm text-error mt-2">{errors}</div>}
        </div>
      </div>

      {/* previews */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {previews.map((p, idx) => (
            <div key={idx} className="card bg-base-200 p-2">
              {p.url ? (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="object-cover w-full h-28 rounded"
                />
              ) : (
                <div className="text-sm">{p.file.name}</div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {(p.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDrop;
