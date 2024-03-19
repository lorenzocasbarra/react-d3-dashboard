import React, { useRef, useState, useContext } from "react";
import { LBCAState } from "../../../pages/LBCAPage.js";
import GridLine from "./GridLine.js";
import Line from "./Line.js";
import Axis from "./Axis.js";
import { AxisLabel } from "./AxisLabel.js";
import { DataPoint } from "./DataPoint.js";
import { Tooltip } from "./Tooltip";
import { LineMark } from "./LineMark";
import {SelectionArea} from "./SelectionArea.js"
import {useLassoSelection} from "../../../hooks/useLassoSelection.js";
import {useZoom} from "../../../hooks/useZoom.js";


export const LBCA = ({ 
  data = [], 
  dimensions = {}, 
  flares = []
}) => {
  const ref = useRef();
  const context = useContext(LBCAState);
  const { selectedModeData,correlationLag,executeCorrelationScript,onHighlight, selectedModeMouse, setSelectedPoints,yTickFormat, xScale, yScale, yScaleForAxis } = context;

  const { width, height, margin = {}, xMargin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const boundries = {
    left: ref.current ? ref.current.getBoundingClientRect().left : null,
    top: ref.current ? ref.current.getBoundingClientRect().top : null
  }
  const getDates = (d) => (d.date)
  const getValues = (d) => (d.value)

  const [isHovered, setIsHovered] = useState(null); // for data points highlight
  
  //zoom logic
  const {currentScale,zoomState} = useZoom({
    chartRef:ref,
    data,
    selectedModeMouse,
    xScale,
    yScale,
    svgWidth, 
    svgHeight
  })
  
  // selection logic
  const {highlightedPoints,mouseDown,cursorPosition,onMousePressed,onMouseMove,onMouseReleased} = useLassoSelection({
    setSelectedPoints,
    boundries,
    margin,
    xScale,
    yScale,
    currentScale,
    zoomState,
    data,executeCorrelationScript,correlationLag
  })

  return (
    <>
      <div id="chartContainer" style={{display:"flex",flexDirection:"start"}}>
        <svg ref={ref} id="chartSVG" width={svgWidth} height={svgHeight}
          onMouseMove={(event) => onMouseMove(event)}
          onMouseDown={(event) => onMousePressed(event)}
          onMouseUp={(event) => onMouseReleased(event)}
        // onClick={(event) => onMouseReleased(event)}
        >
          <defs>
            <clipPath id="clip">
            {/* width={svgWidth - 90} height={svgHeight - (50 + 0)} */}
              <rect id="clip-rect" x="0" y="0" width={width} height={height}> 
              </rect>
            </clipPath>
          </defs>
          {/* <circle id="cursor"cx={cursorPosition.x}
            cy={cursorPosition.y}
            r={5}>
          </circle> */}
        
          <g transform={`translate(${margin.left},${margin.top})`} >
            
            <AxisLabel text={"Time"} boundries={boundries} type={"x"} width={width} height={height+margin.bottom}/>
            <Axis
              type="bottom"
              className="axisX"
              scale={zoomState != null ? currentScale.x : xScale}
              transform={`translate(0, ${height})`}
              ticks={5}
            />

            <AxisLabel text={selectedModeData === "raw" ? "Raw Values" : "Z Score"} boundries={boundries} type={"y"} width={width} height={height}/>
            <Axis
              type="left"
              className="axisY"
              scale={zoomState != null ? currentScale.y : yScale}
              ticks={5}
              tickFormat={yTickFormat}
            />
            <GridLine
              type="horizontal"
              ticks={5}
              tickFormat={yTickFormat}
              scale={zoomState != null ? currentScale.y : yScale}
              size={width}
            />
            <GridLine
              type="vertical"
              scale={zoomState != null ? currentScale.x : xScale}
              ticks={5}
              size={height}
              transform={`translate(0, ${height - xMargin})`}
            />
            <g clipPath="url(#clip)">

            
              {/* flare points here */}
              {
                flares ? flares.map((tp,i) =>(
                  <LineMark 
                    key={"flare-"+i}
                    x={tp} 
                    yScaleForAxis={yScaleForAxis} 
                    xScale={zoomState != null ? currentScale.x : xScale} 
                  />
                )) : null
              }
              
            
              {/* lines here */}
            
              {
                data.map(({ name, items = [], color}) => (
                  <g key={"line-group-"+name}>
                    <Line
                      name={"line-background-"+name}
                      key={"line-background-"+name}
                      data={items}
                      xScale={zoomState != null ? currentScale.x : xScale}
                      yScale={zoomState != null ? currentScale.y : yScale}
                      xValues={getDates}
                      yValues={getValues}
                      color={"grey"}
                      strokeWidth={name === onHighlight ? 7 : 5}
                    />
                    <Line
                      name={"line-main-"+name}
                      key={"line-main-"+name}
                      data={items}
                      xScale={zoomState != null ? currentScale.x : xScale}
                      yScale={zoomState != null ? currentScale.y : yScale}
                      xValues={getDates}
                      yValues={getValues}
                      color={color}
                      strokeWidth={name === onHighlight ? 6 : 3}
                    />
                  </g>
                  
                ))
                
              }
              {/* datapoints here */}
              {
                data.map(({ name, items = [], color }) => (
                  items.map((item, i) => (
                    item.date != null && item.value != null ?
                      <DataPoint
                        number={i}
                        key={`${name}_${i}`}
                        className={"circle"}
                        highLight= {Object.keys(highlightedPoints).includes(name) && Object.keys(highlightedPoints[name]).includes(String(item.date)) ? true : false}
                        color={ color  } //"#42A5B3"
                        cx={zoomState != null ? currentScale.x(item.date) : xScale(item.date)}
                        cy={zoomState != null ? currentScale.y(item.value) : yScale(item.value)}
                        r={isHovered === `${name}_${i}` ? 8 : 5}
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
                    item.date != null && isHovered === `${name}_${i}`
                      ? <Tooltip
                        key={"tooltip-"+i}
                        number={i}
                        x={zoomState != null ? currentScale.x(item.date) : xScale(item.date)}
                        y={zoomState != null ? currentScale.y(item.value) : yScale(item.value)}
                        value={item.value}
                        date={item.date}
                      />
                      : null
                  ))
                ))
              }
              
            </g>
            


          </g>
          {
            mouseDown.status === true
            ? <SelectionArea cursorPosition={cursorPosition} mouseDown={mouseDown}/>
            : null
          }

      </svg>
      </div>
    </>
  );

}

//<svg ref={svgRef} width={svgWidth} height={svgHeight} />