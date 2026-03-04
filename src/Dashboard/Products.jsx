import colors from '../color.jsx';
import { useQuery } from '@tanstack/react-query';
import db from '../lib/util.jsx'; 
import { useNavigate } from 'react-router-dom';
import { useControl } from '../Context/control.jsx';
import { useState } from 'react';

export function List(){
  const navigate = useNavigate();
  const { Updator, setIsupdate, handleDelete } = useControl();
  const [menuOpen, setMenuOpen] = useState(null);

  const {data, isError, isPending, error} = useQuery({
    queryKey:['Product'],
    queryFn: async()=>{
      const res = await db.listDocuments("products");
      return res;
    }
  });

  
  if(isPending){
    return(
      <div className="h-[200px] w-full flex justify-center items-center">
        <p className="text-center text-sm font-base text-white">Loading...</p>
      </div>
    )
  }

  if(isError){
    return(
      <div className="text-center h-[200px] w-full flex justify-center items-center">
        <p className="text-center text-sm font-base text-white">{error.message}</p>
      </div>
    )
  }

  return(
    <>
      {!data || data.length === 0 ? (
        <div className="h-[250px] w-full flex justify-center items-center">
   <p className="items-center text-sm font-base text-white">
      No products here, click the Add button to upload a new product
          </p>
        </div>
      ) : (
        data.map(product =>(
          <div
            className="flex p-3 gap-3 rounded-[15px] mb-[8px] relative"
            style={{
              background: colors.container,
              border: `1px solid ${colors.border}`,
            }}
            key={product.id}
            onClick={()=>{
              if(menuOpen) return;
              setIsupdate(true);
              Updator({
                name: product.data.name,
                fileType: product.data.fileType,
                description: product.data.description,
                fileId: product.id,
                mainImage: product.data.mainImage,
              });
              navigate("/ProductInput");
            }}
          >

            {/* product image */}
            <div className="w-[70px] h-[70px] flex-shrink-0 rounded-[12px] bg-black/50 overflow-hidden">
              {product.data.fileType === 'image' ? (
                <img 
                  src={product.data.mainImage}
                  alt={product.data.name}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              ) : (
                <video
                  src={product.data.mainImage}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              )}
            </div>

            {/* product name and description */}
            <div className="flex-1 grid gap-[2px] items-center min-w-0">
              <h3
                className="text-base font-semibold truncate"
                style={{ color: colors.primaryText }}
              >
                {product.data.name}
              </h3>

              <span
                className="text-xs font-normal"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  color: colors.secondaryText,
                }}
              >
                {product.data.description}
              </span>

              {/* time moved here under description for mobile */}
              <div className="flex items-center gap-2 mt-[2px]">
                <span
                  className="text-xs font-semibold"
                  style={{ color: colors.secondaryText }}
                >
                  {product.data.time}
                </span>
                <span className="text-xs font-normal text-green-400">• active</span>
              </div>
            </div>

            {/* vertical ellipsis menu */}
            <div className="flex-shrink-0 relative">
              <button
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full"
                style={{ color: colors.secondaryText }}
                onClick={(e)=>{
                  e.stopPropagation();
                  setMenuOpen(menuOpen === product.id ? null : product.id);
                }}
              >
                <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
              </button>

              {/* dropdown menu */}
     {menuOpen === product.id && (
    <div className="absolute right-0 top-[35px] z-50 rounded-[12px] overflow-hidden shadow-xl"
        style={{
       background: colors.container,
      border: `1px solid ${colors.border}`,
       minWidth: '130px',
             }}>
     <button className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-2"
     style={{ 
     color: colors.primaryText
     }}
      onClick={(e)=>{
      e.stopPropagation();
        setMenuOpen(null);
        setIsupdate(true);
       Updator({
        name: product.data.name,
         fileType: product.data.fileType,
    description: product.data.description,
        fileId: product.id,
     mainImage: product.data.mainImage,
                });
   navigate("/ProductInput");
                    }} >
        <i className="fa-solid fa-pen-to-square"></i>
                    Edit
                  </button>

    <div style={{ height: '1px', background: colors.border }}></div>

       <button className="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-2"
       style={{ color: colors.error }}
      onClick={(e) => {
      e.stopPropagation();
      handleDelete(e, product.id)
      setMenuOpen(null);
      }}>
     <i className="fa-solid fa-trash"></i>
                    Delete
                  </button>
                </div>
              )}
            </div>

          </div>
        ))
      )}
    </>
  )
}

export default function Products(){
  const navigate = useNavigate();
  const { setIsupdate, clear } = useControl();

  return(
    <div className="w-full p-3">
      <div className="flex justify-between items-center mb-[10px]">
        <h3
          className="text-xl font-bold uppercase"
          style={{ color: colors.primaryText }}
        >
          Products
        </h3>

        <button
          className="px-4 py-2 rounded-[10px] outline-none border-none text-sm font-bold uppercase"
          style={{
            background: colors.accent,
            color: colors.text,
          }}
          onClick={()=>{
            setIsupdate(false);
            clear();
            navigate("/ProductInput");
          }}
        >
          + Add
        </button>
      </div>

      <div>
        <List />
      </div>
    </div>
  )
}