import { useMemo } from "react";
import * as d3 from "d3";

const useController = ({ data, width, height }) => {
  const xMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ lag }) => lag)),
    [data]
  );
  const xMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ lag }) => lag)),
    [data]
  );
  const xScale = useMemo(
    () => d3.scaleLinear().domain([xMin-5, xMax+5]).range([0, width]),
    [xMin, xMax, width]
  );
  
  const yMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ c }) => c)),
    [data]
  );
  const yMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ c }) => c)),
    [data]
  );
  
  const yScale = useMemo(() => {
    const indention = 0.1;
    return d3.scaleLinear()
        .domain([yMin - indention,yMax + indention]) 
        .range([height,0]) // margin convention applied to height
        .nice()
  }, [height, yMin, yMax]);

  const yScaleForAxis = useMemo(
    () => d3.scaleBand().domain([yMin, yMax]).range([height, 0]),
    [height, yMin, yMax]
  );

 
  const yTickFormat = (d) => (d3.format(".1f")(d));

  return {
    yTickFormat,
    xScale,
    yScale,
    yScaleForAxis
  };
}

export default useController;