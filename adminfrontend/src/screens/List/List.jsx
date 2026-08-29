import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from 'react-toastify'

const List = ({url}) => {

  const [list,setList] = useState([])

  const fetchList = async()=>{
  try {
    const response = await axios.get(`${url}/api/food/list`)
    setList(response.data.data)

  } catch (error) {
    console.log(error.message)
  }
}

  useEffect(()=>{
    fetchList()
  },[list])

  const removeFood = async(id)=>{
    try {
      const response = await axios.delete(`${url}/api/food/remove?id=${id}`)
      toast(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='list screen flex-col'>
        <p>All Foods List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <p><b>Image</b></p>
            <p><b>Name</b></p>
            <p><b>Category</b></p>
            <p><b>Price</b></p>
            <p><b>Action</b></p>
          </div>
          {
            list.map((item,index)=>{
              return(
                <div key={index} className="list-table-format">
                  <img src={`${url}/image/${item.image}`} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>{item.price}</p>
                  <p className='cursor' onClick={()=>removeFood(item._id)}>X</p>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default List