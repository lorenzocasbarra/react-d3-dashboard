import React from "react";


export const DataPoint = ({number,r,className,cx,cy,onMouseEnter,onMouseLeave,highLight, color}) => {
  
  // console.log(cx)
  color = !highLight ? color : "#ff0000"
  // if (highLight){
  //   console.log(highLight)
  //   console.log(color)
  // }
  return(
    <circle
      key={number}
      className={className}
      cx={cx}
      cy={cy}
      r={r}
      stroke={'grey'}
      strokeWidth={'2'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{fill: `${color}`}}
    >
    </circle>
  )

}