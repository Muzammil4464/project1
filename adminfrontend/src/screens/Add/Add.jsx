import {useState,useEffect} from 'react'
import {assets} from '../../assets/assets'
import './Add.css'

const Add = () => {

    const [image,setImage] = useState(false)

    const[data,setData] = useState({
      name:"",
      description:"",
      price:"",
      category:"Salad"
    })

    const onChangeHandler = (e)=>{
      const{name,value} = e.target;  
      setData(data=>({...data,[name]:value}))
    }

    const onSubmitHandler=(e)=>{
      e.preventDefault();
      const formData = new FormData();
      formData.append('name',data.name)
      formData.append('description',data.description)
      formData.append('price',Number(data.price))
      formData.append('category',data.category)
      formData.append('image',image)
    }
    
  return (
    <div className='screen'>
        <div className="container">
          <form onSubmit={onSubmitHandler} className='flex-col'>
          <div className="add-img-upload flex-col">
               <p>Upload Image</p>
               <label htmlFor="image">
                <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
               </label>
               <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
          </div>
          <div className="add-product-name flex-col">
                <p>Product name</p>
                <input value={data.name} onChange={onChangeHandler} type="text" name='place' placeholder='Type here' />
          </div>
          <div className="add-product-description" flex-col>
            <p>Product Description</p>
            <textarea value={data.description} onChange={onChangeHandler} name="description" rows='6' placeholder='write content here' required></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Category</p>
              <select value={data.category} onChange={onChangeHandler} name="category" id="">
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Price</p>
              <input value={data.price} onChange={onChangeHandler} type="Number" name='price' placeholder='₹150' required/>
            </div>
          </div>
          <button type='submit' className='add-btn'>ADD</button>
        </form>
        </div>
    </div>
  )
}

export default Add