import colors from '../color.jsx';
import { useQuery } from '@tanstack/react-query';
import db from '../lib/util.jsx'

export function Box({value, text, icon}){
  return(
    <div className="relative w-[150px] h-[120px] px-3 rounded-[15px] grid gap-1
    items-center place-items-center"
    style={{
      background: colors.container
    }}>
      <div className="absolute top-2 left-2  bg-black/50 p-2 w-[50px] h-[50px]
      rounded-[15px] flex justify-center items-center" 
      style={{
        border: `1px solid ${colors.border}`
      }}>
        <p className="text-lg font-semibold"
        style={{
        color: colors.text,  
        }}>{icon}</p>
      </div>
      
      <div className="grid place-items-center mt-[50px]">
      <h3 className="text-center text-4xl font-bold" 
      style={{
        color: colors.primaryText,
      }}>{value}</h3>
      
      <span className="text-center text-sm font-normal"
      style={{
        color: colors.secondaryText,
      }}>{text}</span>
      </div>
    </div>
    )
}


export default function Counts(){
  const { data, isError, isPending } = useQuery({
  queryKey: ['dashboard'],
  queryFn: async () => {
    const products = await db.listDocuments("products");
    const stats = await db.listDocuments("stats");
    console.log("stats:", stats) 
    return { products, stats };
  },
});
console.log(data)
  return(
    <div className="mt-[60px] flex flex-wrap p-3 items-center justify-center gap-3">
      <Box 
        icon={<i className="fas fa-box"></i>} 
      value={(data?.products?.length ?? 0).toString().padStart(2, "0")}
        
        text="Total Products"/>
      
      <Box 
     icon={<i className="fab fa-whatsapp"></i>} 
      value={(data?.stats?.[0]?.data.whatsapp ?? 0).toString().padStart(2, "0")} 
        text="WhatsApp DMs"/>
      
      <Box 
        icon={<i className="fas fa-envelope"></i>} 
        value={(data?.stats?.[0]?.data.mail ?? 0).toString().padStart(2, "0")} 
        text="Mails Sent"/>
      
      <Box 
        icon={<i className="fas fa-phone"></i>} 
       value={(data?.stats?.[0]?.data.call ?? 0).toString().padStart(2, "0")}  
        text="Calls Made"/>
    </div>
    )
}