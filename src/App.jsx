import { useEffect } from 'react'
import ProductInput from './ProductInput.jsx'
import Login from './Login.jsx';
import Home from './Dashboard/Home.jsx';
import Counts from './Dashboard/Counts.jsx';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function App(){
  {/*useEffect(() => {
    import('vconsole').then(({ default: VConsole }) => {
      new VConsole();
    });
    console.log("page mounted!!")
  }, []);*/}
  
  return(
    <div>
  
  <Routes>
     <Route path="/" element={<Login />}/>
    <Route path="/Home" element={<Home />}/>
    <Route path="/ProductInput" element={<ProductInput />}/>
    
  </Routes>
    </div>
    )
}