import React, { useRef, useState, useCallback } from "react";
import useController from "./CorrelationChart.controller.js";

import GridLine from "./GridLine.js";
import Line from "./Line.js";
// import Area from "./Area.js";
import Axis from "./Axis.js";
import { DataPoint } from "./DataPoint.js";
import { Tooltip } from "./Tooltip";
import { LineMark } from "./LineMark";
import { AxisLabel } from "./AxisLabel.js";


import * as d3 from 'd3';


export const CorrelationChart = ({
  data =[],
  dimensions,
  onHighlight
}) => {

  const ref = React.useRef(null);

  const { width, height, margin = {}, xMargin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  const controller = useController({ data, width, height });
  const { yTickFormat, xScale, yScale, yScaleForAxis } = controller;

  const [isHovered, setIsHovered] = useState(null); // for data points highlight

  const getC = (d) => (d.c)
  const getLag = (d) => (d.lag)

  const formatTooltip = (value) => {
    return(value)
  }

  return(
    <>
      <div className="chartContainer" style={{display:"flex",flexDirection:"start"}}>
        <svg ref={ref} id="chartSVG" width={svgWidth} height={svgHeight}
          
        // onClick={(event) => onMouseReleased(event)}
        >
          <defs>
            <clipPath id="clip">
              <rect id="clip-rect" x="0" y="0" width={svgWidth - 90} height={svgHeight - 50}>
              </rect>
            </clipPath>
          </defs>
          
          <g transform={`translate(${margin.left},${margin.top})`} >
            
          <AxisLabel text={"Lag"}  type={"x"} width={width} height={height+margin.bottom}/>

            <Axis
              type="bottom"
              className="axisX"
              scale={xScale}
              transform={`translate(0, ${height})`}
              ticks={5}
            />

          <AxisLabel text={"Coefficient"}  type={"y"} width={width} height={height}/>
            <GridLine
              type="horizontal"
              ticks={5}
              tickFormat={yTickFormat}
              scale={yScale}
              size={width}
            />
            <GridLine
              type="vertical"
              scale={xScale}
              ticks={5}
              size={height}
              transform={`translate(0, ${height - xMargin})`}
            />
            <Axis
              type="left"
              className="axisY"
              scale={yScale}
              // transform="translate(0, 0)"
              ticks={5}
              tickFormat={yTickFormat}
            />
            <g clipPath="url(#clip)">


              
            
              {/* lines here */}
            
              {
                data.map(({ name, items = [], color}) => (
                  <g key={"line-group-"+name}>
                    <Line
                      name={"line-background-"+name}
                      key={"line-background-"+name}
                      data={items}
                      xScale={xScale}
                      yScale={yScale}
                      xValues={getLag}
                      yValues={getC}
                      color={"grey"}
                      strokeWidth={name == onHighlight ? 7 : 5}
                    />
                    <Line
                      name={"line-main-"+name}
                      key={"line-main-"+name}
                      data={items}
                      xScale={xScale}
                      yScale={yScale}
                      xValues={getLag}
                      yValues={getC}
                      color={color}
                      strokeWidth={name == onHighlight ? 6 : 3}
                    />
                  </g>
                  
                ))
                
              }
              {/* datapoints here */}
              {
                data.map(({ name, items = [], color }) => (
                  items.map((item, i) => (
                    item.lag != null && item.c != null ?
                      <DataPoint
                        number={i}
                        key={`${name}_${i}`}
                        className={"circle"}
                        // highLight= {Object.keys(selectedPoints).includes(name) && Object.keys(selectedPoints[name]).includes(String(item.date)) ? true : false}
                        color={ color  } //"#42A5B3"
                        cx={xScale(item.lag)}
                        cy={yScale(item.c)}
                        r={isHovered == `${name}_${i}` ? 8 : 5}
                        onMouseEnter={() => setIsHovered(`${name}_${i}`)}
                        onMouseLeave={() => setIsHovered(null)}
                      />
                      : null
                  ))
                ))
              }


              {/* tooltips here */}

              {
                data.map(({ name, items = [] }) => (
                  items.map((item, i) => (
                    item.lag != null && isHovered == `${name}_${i}`
                      ? <Tooltip
                        key={"tooltip-"+i}
                        number={i}
                        x={xScale(item.lag)}
                        y={yScale(item.c)}
                        value={item.c}
                        date={item.lag}
                        formatFunction={formatTooltip}
                      />
                      : null
                  ))
                ))
              }
              
            </g>
            


          </g>
          

        </svg>
        
        </div>
    </>
  )
}