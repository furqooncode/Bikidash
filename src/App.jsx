import { useEffect } from 'react'
import ProductInput from './ProductInput.jsx'
export default function App(){
  
  useEffect(() => {
    import('vconsole').then(({ default: VConsole }) => {
      new VConsole();
    });
    console.log("page mounted!!")
  }, []);
  
  return(
    <div>
      <ProductInput />
    </div>
    )
}