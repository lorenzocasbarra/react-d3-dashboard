/** GridLine.js */
import React, {useRef, useEffect} from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft, select, easeLinear } from 'd3';
 
const GridLine = ({
  type, scale, ticks,tickFormat, size, transform, disableAnimation, ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "vertical" ? axisBottom : axisLeft;
    const axis = axisGenerator(scale)
      .ticks(ticks)
      .tickFormat(tickFormat)
      .tickSize(-size);
    const gridGroup = select(ref.current);
    if (disableAnimation) {
      gridGroup.call(axis);
    } else {
      gridGroup.transition().duration(1000).ease(easeLinear).call(axis);
    }
    gridGroup.select(".domain").remove();
    gridGroup.selectAll("text").remove();
    gridGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.1)");
  }, [scale, ticks, size, disableAnimation]);
 
  return <g ref={ref} transform={transform} {...props}></g>;
};

GridLine.propTypes = {
  type: PropTypes.oneOf(["vertical", "horizontal"]).isRequired
};
 
export default GridLine;