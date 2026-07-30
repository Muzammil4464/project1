import {useState , useContext} from 'react'
import { Link } from 'react-router-dom'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import './Navbar.css'

const Navbar = ({showLogin,setShowLogin}) => {
    const[menu, setMenu] = useState('home')
    const {getTotalCartAmount} = useContext(StoreContext)
    
  return (
    <div className='navbar'>
        <Link to='/' onClick={()=>setMenu("home")}><img className='logo' src={assets.logo} alt="" /></Link>
        <ul className='navbar-menu'>
            <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
            <a href="#explore-menu"><li onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</li></a>
            <a href="#footer"><li onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact Us</li></a>
        </ul>
        <div className="navbar-right">
            <div className="navbar-basket-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                
                <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            <button onClick={()=>setShowLogin(true)}>Sign in</button>
        </div>
    </div>
  )
}

export default Navbar