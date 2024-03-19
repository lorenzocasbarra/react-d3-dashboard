import {statMannWhitneyU} from "../../../../utils/statMannWhitneyU.js";
import {LineTextInfo} from "./LineTextInfo.js";
import {useState} from "react";

import './SelectionMonitor.css';


export const SelectionMonitor = ({selectedPoints = {}, correlationData = {}}) => {
  // console.log(correlationData)
  const [display, setDisplay] = useState(null);

  var obj = {};
  Object.keys(selectedPoints).map((name) =>{
    obj[name] = Object.keys(selectedPoints[name]).sort((a,b) => {
      return new Date(a).getTime() - 
        new Date(b).getTime()
    }).map((date) =>{
      return ({date:date,value:selectedPoints[name][date]})
    })
  })

  var keys = Object.keys(obj)
  let {U,p} = statMannWhitneyU({
    x:keys[0] ? obj[keys[0]].map((item) =>(
      item.value
    )) :[],
    y:keys[1] ? obj[keys[1]].map((item) =>(
      item.value
    )) :[], 
    alt:"less"}
  )
  return(
    <>
      {
        <div className="selectionContainer">
              <span style={{fontWeight:"bold",color: "white", fontSize: "20px"}}>Selected Points</span>
              <div className="selectionTextContainer">
                {
                  Object.keys(obj).map((name) => (
                    <LineTextInfo key={"text-info-"+name} display={name == display ? true : false} setDisplay={setDisplay} lineName={name} linePoints={obj[name]}/>
                  ))
                }
              </div>

              
                {/* <button onClick={() => onClick({items:selectedPoints})} style={{height: "50px", width:"150px"}}>Run</button>   */}
        </div>
      }
    </>
  )
}
