import { useState, useEffect, useContext, createContext, useRef } from 'react';
import db from '../lib/util.jsx';

const ControlContext = createContext();

export function ControlProvider({ children }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [previewurl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    Auth();
  }, []);

  function clear() {
    setName('');
    setDescription('');
    setFileId(null);
    setFileSize(null);
    setFileType(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    fileRef.current = null;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function handleSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert('image and video only');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Too much');
      return;
    }

    // clear on new selection
    setName('');
    setDescription('');
    setFileId(null);

    // store in ref immediately
    fileRef.current = file;

    setSelectedFile(file);
    setFileType(file.type.startsWith("video/") ? "video" : "image");

    const formattedSize = formatFileSize(file.size);
    setFileSize(formattedSize);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }

  async function Auth() {
    try {
      const login = await db.auth.login({
        email: "erinolahamzat001@gmail.com",
        password: "Hamzat01",
      });
      console.log(login);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleUpload() {
    if (!fileRef.current) {
      alert("no product selected");
      return;
    }

    if (!name || !description) {
      alert("product must have a name and description");
      return;
    }

    setLoading(true);

    try {
      await Auth();

      if (fileId) {
        await db.updateDocumentWithFiles(
          'products',
          fileId,
          {
            name,
            description,
            fileType,
            fileSize,
          },
          {
            mainImage: fileRef.current,
          }
        );
        setLoading(false);
        alert('Product updated');
      } else {
        const product = await db.createDocumentWithFiles(
          'products',
          {
            name,
            description,
            fileType,
            fileSize,
          },
          {
            mainImage: fileRef.current,
          }
        );
        setFileId(product.id);
        setLoading(false);
        alert('Product uploaded');
        clear();
      }
    } catch (error) {
      setLoading(false);
      alert('Something went wrong. Try again!');
      console.error(error);
    }
  }

  return (
    <ControlContext.Provider value={{
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
    }}>
      {children}
    </ControlContext.Provider>
  );
}

export function useControl() {
  return useContext(ControlContext);
}

