import React, { useRef, useState, useCallback, useContext } from "react";
import { LBCAState } from "../../../pages/D3Charts.js";

import * as d3 from 'd3';

import useController from "./LBCA.controller.js";

export const Overlay = ({
  dimensions = {},
  data
}) => {


  const context = useContext(LBCAState);
  const { onHighlight, selectedModeMouse,selectedPoints, setSelectedPoints,xScale, yScale, zoomStatus, setZoomStatus } = context;


  const { width, height, margin = {}, xMargin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  const ref = React.useRef();

  const [zoomState, setZoomState] = useState(null);  // for zoom logic
  const [currentScale, setCurrentScale] = useState({ x: xScale, y: yScale }); // for zoom logic

  React.useEffect(() => {
    const zoom = d3.zoom()
    // console.log(zoom)
    setZoomStatus(zoom)
    if (selectedModeMouse === "zoom" && data.length > 0) {
      zoom.scaleExtent([.5, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .translateExtent([[-100, -100], [svgWidth, svgHeight]])
        .on("zoom", (event) => {
          // // recover the new scale
          let newX = event.transform.rescaleX(xScale);
          let newY = event.transform.rescaleY(yScale);
          setCurrentScale({ x: newX, y: newY })
          setZoomState(event.transform)
        });
      d3.select("#chartSVG")
        .call(zoom);
    } else {
      setZoomState(null)
      d3.select("#chartSVG").on('.zoom', null);
    }
  },[data])





  return(
    <div id="overlayContainer" style={{position:"absolute",zIndex:"10"}}>
      <svg id="overlay" width={svgWidth} height={svgHeight}
        ></svg>
    </div>  
  )
}