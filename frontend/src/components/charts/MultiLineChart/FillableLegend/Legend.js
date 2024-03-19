import React from "react";
import { useState } from "react";
import { IconContext } from 'react-icons/lib';
import { CgCloseO } from "react-icons/cg";

export const Legend = ({ data, selectedItems, onChange, onClick, onMouseOver, onMouseOut}) => {

  const [closeVisible,setCloseVisible] = useState(null)

  const displayCloseButton = (name) => {
    setCloseVisible(name)
  }
  const hideCloseButton = () => {
    setCloseVisible(null)
  }
  // console.log(data)
  return(
    <>
    {/* <IconContext.Provider value={{ color: '#fff'}}> */}
    <div className="legendContainer">
      {
        data.map((d) => (
          
          
          <div style={{ backgroundColor: d.color, marginTop:"5px", padding:"5px" }} key={d.name}>
          {
            (
              <>
              <input
                type="checkbox"
                checked={selectedItems.includes(d.name)}
                onChange={() => onChange(d.name)}
                style={{ marginRight: "5px"}}
              />
              </>
            )
          }
            <label 
              onMouseOver={() =>{onMouseOver(d.name); displayCloseButton(d.name)}} 
              onMouseOut={() => {onMouseOut(); hideCloseButton()}}
            >
              {d.name}

              <CgCloseO className="removeButton" style={{visibility: closeVisible == d.name ? "visible" : "hidden"}} onClick={() => onClick(d.name,"purge")}/>
            </label>
          </div>
          
        ))
      }
    </div>
    {/* </IconContext.Provider> */}
    </>
  );
}