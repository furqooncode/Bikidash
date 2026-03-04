import Head from '../Head.jsx'
import Counts from './Counts.jsx';
import Products from './Products.jsx'
export default function Home(){
  return(
    <>
      <Head 
      icon={<i class="fas fa-circle-user"></i>}
      title="Dashboard"
      />
      <Counts />
      <Products />
    </>
    )
}