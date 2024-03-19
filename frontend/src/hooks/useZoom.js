import * as d3 from 'd3';
import React,{useState} from "react";


export function useZoom({chartRef,data,selectedModeMouse,xScale,yScale,svgWidth, svgHeight}) {

  const [currentScale, setCurrentScale] = useState({ x: xScale, y: yScale }); // for zoom logic
  const [zoomState, setZoomState] = useState(null);  // for zoom logic


  React.useEffect(() => {
    const zoom = d3.zoom()

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
      d3.select(chartRef.current)
        .call(zoom);
    } else {
      // setZoomState(null)
      d3.select(chartRef.current).on('.zoom', null);
    }
    
  }, [data, selectedModeMouse, zoomState,chartRef,svgHeight,svgWidth,xScale,yScale])
  return{currentScale,zoomState}
}