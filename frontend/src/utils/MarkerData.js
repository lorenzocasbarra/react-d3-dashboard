
export const MarkerData = ({name, color="black", type,timestamps, dataType}) => {
  
  function isNumber(value) {
    return typeof value === 'number';
  }

  if (dataType === "Time Series"){
    Object.keys(timestamps).map((i) => {
      let [month,day,year] = i.split("/");
      timestamps[i].date = new Date(`${year}-${month}-${day}`)
      return null
    })
  }
  
  return(
    {
      name : name,
      color : color,
      type: type,
      items : Object.keys(timestamps).map((d) =>({
        date : dataType === "Time Series" ? new Date(timestamps[d].date) : timestamps[d].date,
        // raw : timestamps[d].value != "" ? timestamps[d].value : null,
        raw : isNumber(timestamps[d].value) ? timestamps[d].value : null,
        z : timestamps[d].z !== "" ? timestamps[d].z : null 
      }))
    }
  )
}
  
