import colors from './color.jsx'
export default function Head({icon, handleClick, title}){
  return(
    <div className="fixed flex items-center justify-start px-2 h-[50px] w-full
    top-0 left-0 z-1000"
    style={{
      background: colors.background,
    }}>
      <div className="flex gap-[3px] items-center">
        <button className="h-[50px] w-[50px]  flex items-center
        justify-center rounded-[50%] text-4xl font-bold"
        style={{
          color: colors.text,
        }}
        onClick={handleClick}>{icon}</button>
        
        <span className="text-lg font-normal "
        style={{
          color: colors.text,
        }}>{title}</span>
      </div>
    </div>
    )
}