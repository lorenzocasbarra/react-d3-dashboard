import React from "react";
import { useRef, useEffect } from 'react';
import * as d3 from "d3";

// const x = 400;
const margin = 10;
const height = 300;

export const LineMark = ({yScaleForAxis,xScale,x}) => {
  const ref = useRef(null);
  // console.log(x)
  useEffect(() => {
    // const markerGroup = d3.select(ref.current);
    
    d3.select(ref.current)
      .select(".tooltipLine")
      .attr("x1", xScale(x))
      .attr("x2", xScale(x))
      .attr("y1", -margin) // -margin.top
      .attr("y2", height);

  });

  return(
    <g ref={ref} >
      <line className="tooltipLine" style={{stroke: '#ff007a', strokeWidth: '1px'}}/>
    </g>
  )
}