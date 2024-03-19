
export const CorrelationData = ({name, color="black", type = "correlation",points}) => {
  
  function isNumber(value) {
    return typeof value === 'number';
  }

  return(
    {
      name : name,
      color : color,
      type: type,
      items : points.c.map((value,i) =>({
        lag : isNumber(points.lags[i]) ? points.lags[i] : null,
        c : isNumber(value) ? value : null,
      }))
    }
  )
}
  
