/** Axis.js */
import React, {useRef, useEffect} from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft, select, easeLinear } from 'd3';
 
const Axis = ({
  type, scale, ticks, transform, tickFormat, disableAnimation, ...props
}) => {
  
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "left" ? axisLeft : axisBottom;
    const axis = axisGenerator(scale)
      .ticks(5)
      .tickFormat(tickFormat);
    const axisGroup = select(ref.current);
    if (disableAnimation) {
      axisGroup.call(axis);
    } else {
      axisGroup.transition().duration(1000).ease(easeLinear).call(axis);
    }
    
    axisGroup.selectAll("text")
      .attr("opacity", 1)
      .attr("color", "#42A5B3")
      .attr("font-size", "0.75rem");
    axisGroup.selectAll(".tick")
      .attr("color", "#42A5B3")
      
  }, [scale, ticks, tickFormat, disableAnimation,type]);
 
  return <g ref={ref} transform={transform} {...props} />;
};
 
Axis.propTypes = {
  type: PropTypes.oneOf(["left", "bottom"]).isRequired
};
 
export default Axis;