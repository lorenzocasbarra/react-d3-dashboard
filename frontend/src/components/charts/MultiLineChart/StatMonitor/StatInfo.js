export const StatInfo = ({name,c,lag}) => {


  return(
    <>
      <span key={name+"-text-on-monitor-header"} style={{color:"white",fontWeight:"bold", fontSize: "20px"}}>{name}</span>      
      <span key={name+"-text-on-monitor-values"} style={{color:"white"}}>C:{c} Lag:{lag}</span>
    </>
  )

}