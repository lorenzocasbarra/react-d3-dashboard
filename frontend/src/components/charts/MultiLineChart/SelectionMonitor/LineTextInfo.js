import {useState} from "react";
import {statMannWhitneyU} from "../../../../utils/statMannWhitneyU.js";
import {formatDateForBody} from "../../../../utils/dateUtils.js";
import { MdOutlineExpandMore,MdOutlineExpandLess } from "react-icons/md";

export const LineTextInfo = ({lineName, linePoints,display,setDisplay}) => {
  return (
    <>
      <span style={{color:"white",fontWeight:"bold" , fontSize: "16px"}}>
        {lineName} {!display ?<MdOutlineExpandMore onClick={() => setDisplay(lineName)}/> : <MdOutlineExpandLess onClick={() => setDisplay(null)}/>}
      </span>
      {
        display ? linePoints.map((i,c) => (
          <span key={lineName+"-"+c} style={{color:"white",fontSize: "12px"}}>
            Date: {formatDateForBody(i.date)} Value: {i.value}
          </span>
        )) : null
      }
    </>
  )
}