import React from 'react';
import {useState, useRef, useEffect} from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { IconContext } from 'react-icons/lib';


export const SearchBar = ({data,addFunction}) => {

  const [value, setValue] = useState('');
  const [onDisplay,setOnDisplay] = useState(null);

  const ref = useRef(null)

  const onChange = (event) => {
    setOnDisplay(true)
    setValue(event.target.value);
  }
  const onClick = (event) => {
    if (ref.current != null){
    if (ref.current.contains(event.target)) {
      setOnDisplay(true)
    } else {
      setOnDisplay(false)
    }}
  }

  useEffect(() =>{
    if (ref.current != null){ 
      window.addEventListener("click",(event) => onClick(event))
    }
  },[])
  
  return(
    <div  ref ={ref} className='search-container' >
      <div className='search-inner'>
        Search 
        <input  type="text" value={value} onChange={onChange} style={{marginLeft: "5px"}}></input>
        {/* <button onClick={() => onSearch(value)}>Search</button> */}
      </div>
      <div  className='search-dropdown'>
      {
        onDisplay == true ? data.filter((item) => {
          const searchTerm = value.toLowerCase();
          const fullName = item.name.toLowerCase();
          const keywords = fullName.split(" ");
          const ok = []
          keywords.map((word) => {
            ok.push(word.includes(searchTerm))
            return ok
          })
          return searchTerm && (fullName.startsWith(searchTerm) || ok.includes(true)) 
        })
        .map((item,i) => (
          <IconContext.Provider key={i} value={
            {color: 'rgb(51, 51, 51)'}
          }>

          <div key={i} className="dropdown-item">
            {item.name}
            <IoIosAddCircle className="addButton" onClick={() => addFunction(item.name,"add")}/>
          </div>
          </IconContext.Provider>

        )) : null
      }
      </div>
    </div>
  )
}