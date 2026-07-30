import { createContext , useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext();

const StoreContextProvide = (props)=>{

    const[cartItems,setCartItems] = useState({})

    const addToCart = (itemId)=>{
        if(!cartItems[itemId])
            setCartItems({...cartItems,[itemId]:1})
        else
            setCartItems({...cartItems,[itemId]:cartItems[itemId]+1})
    }

    const removeFromCart = (itemId)=>{
        setCartItems({...cartItems,[itemId]:cartItems[itemId]-1})
    }

    const getTotalCartAmount=()=>{
        let total=0;
        for(let item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = food_list.find(food=>food._id===item)
                total += itemInfo.price*cartItems[item];
            }
        }
        return total;
    }
    const contextValues={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount
    }
    return(
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvide