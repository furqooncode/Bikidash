import colors from './color.jsx';
import { useControl } from './Context/control.jsx';
import { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[loading, setLoading] = useState(false)
  const { Auth } = useControl();
  
async function handleSubmit(){
  if(!email || !password){
    alert("field cannot be empty")
    return;
  }
    setLoading(true)
   try{
     const login = await Auth(email, password)
     setLoading(false)
     console.log(login)
     alert('Admin Login In')
     navigate("/Home")
   }catch(error){
     try{
       console.error(error)
       alert("failed")
       setLoading(false)
     }catch(err){
       console.error("internet connectiom failed!!")
       alert('please check internet connection')
       setLoading(false)
     }
   }
  }
  
  
  return (
    <div className="w-full p-4 grid gap-4 h-[100vh] place-items-center items-center">


      <div
        className="w-[90%] rounded-[16px] p-5 grid gap-4"
        style={{
          background: colors.container,
          border: `1px solid ${colors.border}`,
        }}
      >

        {/* Name */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: colors.secondaryText }}>
            Full Name <span style={{ color: colors.error }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            placeholder="e.g example@gmail.com"
            className="w-full p-3 rounded-[10px] text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          />
        </div>

        {/* Password */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: colors.secondaryText }}>
            Password <span style={{ color: colors.error }}>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            placeholder="e.g +234 800 000 0000"
            className="w-full p-3 rounded-[10px] text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          />
        </div>


        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 rounded-[12px] font-bold text-base uppercase tracking-wide transition-opacity"
          style={{
            background: colors.accent,
            color: colors.text,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Logging in Admin...' : 'Login'}
        </button>

      </div>
    </div>
  );
}