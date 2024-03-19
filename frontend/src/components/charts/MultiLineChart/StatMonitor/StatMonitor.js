import "./StatMonitor.css";
import {StatInfo} from "./StatInfo";

export const StatMonitor = ({selectedPoints ={},correlationData = {}}) => {

  return(
    
    <div  className="statContainer">
      <span  style={{fontWeight:"bold",color: "white", fontSize: "20px"}}>Test Result</span>

      {/* { 
        U != undefined && p !=undefined  
        ? <><span style={{fontWeight:"bold",color: "red", fontSize: "20px"}}>Test Result</span><span>U:{U}</span><span>p:{p}</span></> 
        : null
      } */}
      <div  style={{display: "flex",flexDirection: "column"}}>
        {
          Object.entries(correlationData).map(([name,values]) =>(
            
              <StatInfo key={name+"-stat-info"} name={name} c={values.cMax} lag={values.lagMax}/>
            
          )) 
        }
      </div>
    </div>
    
  )
}