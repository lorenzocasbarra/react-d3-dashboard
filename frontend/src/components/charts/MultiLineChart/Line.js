import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import {useLineAnimations} from "../../../hooks/useLineAnimations.js";

const Line = ({
  xScale,
  yScale,
  xValues,
  yValues,
  color,
  data,
  isSmooth,
  animation,
  strokeWidth,
  name,
  ...props
}) => {
  var filteredData = data.filter((d) => yValues(d) != null);

  const pathRef = React.useRef(null);
  // Define different types of animation that we can use
  useLineAnimations({pathRef,animation,xScale, yScale})

  const line = d3
    .line()
    .x((d) => (xScale(xValues(d))))
    .y((d) => (yScale(yValues(d))));
    

  const d = line(filteredData);



  return (
    <path
      key={name}
      ref={pathRef}
      d={d?.match(/NaN|undefined|null/) ? "" : d}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={0}
      className={"line"}
      {...props}
    />
  );
};

Line.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.object,
      value: PropTypes.number,
      lab: PropTypes.string
    })
  ),
  color: PropTypes.string,
  isSmooth: PropTypes.bool,
  animation: PropTypes.oneOf(["left", "fadeIn", "none"])
};

Line.defaultProps = {
  data: [],
  color: "white",
  isSmooth: false,
  animation: "left"
};

export default Line;
