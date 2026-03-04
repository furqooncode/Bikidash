
import { useState, useEffect, useContext, createContext, useRef } from 'react';
import db from '../lib/util.jsx';
import { useQueryClient } from '@tanstack/react-query';


const ControlContext = createContext();

export function ControlProvider({ children }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [previewurl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isupdate, setIsupdate] = useState(false);

  // ref to always hold the latest file without stale state
  const fileRef = useRef(null);

  // login to cocobase on mount
  async function Auth(email, password) {
    const login = await db.auth.login({
      email,
      password,
    });
    console.log(login);
  }

  // clear all states after successful upload
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

  // convert bytes to readable format
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // handle file selection from input
  function handleSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // only allow image and video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert('image and video only');
      return;
    }

    // limit file size to 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Too much');
      return;
    }

    // reset fields when new file is selected
    setName('');
    setDescription('');
    setFileId(null);

    // store file in ref to avoid stale state during upload
    fileRef.current = file;

    setSelectedFile(file);
    setFileType(file.type.startsWith("video/") ? "video" : "image");

    // format and store file size
    const formattedSize = formatFileSize(file.size);
    setFileSize(formattedSize);

    // create local preview url
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }

  async function handleUpload() {
    // skip file check if updating since user may not pick a new file
    if (!isupdate && !fileRef.current) {
      alert("no product selected");
      return;
    }

    // name and description are always required
    if (!name || !description) {
      alert("product must have a name and description");
      return;
    }

    setLoading(true);

    try {
      if (fileId) {
        if (fileRef.current) {
          // user picked a new file so update with new image
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
        } else {
          // no new file selected so just update name and description
          await db.updateDocument(
            'products',
            fileId,
            {
              name,
              description,
            }
          );
        }
        setLoading(false);
        alert('Product updated');
      } else {
        // no fileId means this is a new product
        const product = await db.createDocumentWithFiles(
          'products',
          {
            name,
            description,
            fileType,
            fileSize,
            time: new Date().toLocaleString('en-US', {
                 day: 'numeric',
                 month: 'short',
                 year: 'numeric',
                 hour: '2-digit',
                 minute: '2-digit',
                          }),
          },
          {
            mainImage: fileRef.current,
          }
        );
        setFileId(product.id);
        setLoading(false);
        alert('Product uploaded');
        // clear all states after successful upload
        clear();
      }
    } catch (error) {
      setLoading(false);
      alert('Something went wrong. Try again!');
      console.error(error);
    }
  }

  // populate fields when editing an existing product
  function Updator(data) {
    setName(data.name);
    setDescription(data.description);
    setFileId(data.fileId);
    setFileType(data.fileType);
    // use existing image url as preview
    setPreviewUrl(data.mainImage);
    // fileRef stays null until user picks a new file
  }
  
 async function handleDelete(e, productId){
    // stop click from triggering the parent onClick
    const confirm = window.confirm(
      "Are you sure you want to delete this product?\n\nThis action cannot be undone and the product cannot be restored."
    );
    if(confirm){
      try{
        await db.deleteDocument("products", productId);
queryClient.invalidateQueries(['products']);
        alert("Product deleted successfully!");
      }catch(error){
        alert("Something went wrong. Try again!");
        console.error(error);
      }
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
      Auth,
      setIsupdate,
      isupdate,
      Updator,
      handleDelete,
      clear,
    }}>
      {children}
    </ControlContext.Provider>
  );
}

export function useControl() {
  return useContext(ControlContext);
}