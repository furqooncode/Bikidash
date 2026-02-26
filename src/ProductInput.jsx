import { useControl } from './Context/control.jsx';
import colors from './color.jsx';

export default function ProductInput(){
  const { 
    name,
    description,
    previewurl,
    fileType,
    fileSize,
    handleSelect,
    loading,
    handleUpload,
    setName,
    setDescription,
  } = useControl();

  return(
    <div className="p-3 grid items-center place-items-center gap-3 w-[100%]">

      {/* Hidden file input */}
      <input
        id="file"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleSelect}
      />

      {/* File Upload Area */}
      <div
        className="w-[320px] h-[320px] rounded-[14px] overflow-hidden relative"
        style={{
          border: `2px dashed ${colors.border}`,
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        {!previewurl && (
          <label
            htmlFor="file"
            className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <i
              className="fa-regular fa-images text-5xl"
              style={{ color: colors.secondaryText }}
            ></i>
            <span
              className="text-sm font-semibold"
              style={{ color: colors.secondaryText }}
            >
              Click to upload
            </span>
            <span
              className="text-xs font-normal"
              style={{ color: colors.secondaryText }}
            >
              Image or Video supported
            </span>
          </label>
        )}

        {previewurl && fileType === 'image' && (
          <img
            src={previewurl}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}

        {previewurl && fileType === 'video' && (
          <video
            src={previewurl}
            controls
            className="w-full h-full object-cover"
          />
        )}

        {previewurl && (
          <label
            htmlFor="file"
            className="absolute bottom-2 right-2 px-3 py-2 rounded-[10px] text-xs font-bold cursor-pointer uppercase"
            style={{
              background: colors.accent,
              color: colors.text,
            }}
          >
            Change
          </label>
        )}
      </div>
      <div className="grid gap-1 w-full max-w-[350px]">
        
        <span className="text-sm font-semibold"
        style={{
          color: colors.secondaryText,
        }}>
    Date/Time: {new Date().toLocaleString()}
        </span>
        
        <span className="text-sm font-semibold"
        style={{
          color: colors.secondaryText,
        }}>
    fileSize: {fileSize}
        </span>
        
      </div>
      {/* Name Input */}
      <div className="grid gap-1 w-full max-w-[350px]">
        <label className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: colors.secondaryText }}>
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g Mahogany"
          className="w-full p-3 rounded-[10px] text-sm outline-none"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        />
      </div>

      {/* Description Input */}
      <div className="grid gap-1 w-full max-w-[350px]">
        <label className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: colors.secondaryText }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description..."
          rows={3}
          className="w-full p-3 rounded-[10px] text-sm outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full max-w-[350px] p-3 rounded-[12px] font-bold text-base uppercase tracking-wide transition-opacity"
        style={{
          background: colors.accent,
          color: colors.text,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Uploading...' : 'Upload Product'}
      </button>

    </div>
  );
}
