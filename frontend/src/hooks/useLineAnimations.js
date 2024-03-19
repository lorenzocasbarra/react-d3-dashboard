import * as d3 from "d3";
import React from "react";

export function useLineAnimations({pathRef,animation,xScale, yScale}){

  const animateLeft = React.useCallback(() => {
    const totalLength = pathRef.current.getTotalLength();
    d3.select(pathRef.current)
      .attr("opacity", 1)
      .attr("stroke-dasharray", `${totalLength},${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }, [pathRef]);
  const animateFadeIn = React.useCallback(() => {
    d3.select(pathRef.current)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr("opacity", 1);
  }, [pathRef]);
  const noneAnimation = React.useCallback(() => {
    d3.select(pathRef.current).attr("opacity", 1);
  }, [pathRef]);

 

  React.useEffect(() => {
    switch (animation) {
      case "left":
        animateLeft();
        break;
      case "fadeIn":
        animateFadeIn();
        break;
      case "none":
      default:
        noneAnimation();
        break;
    }
  }, [animateLeft, animateFadeIn, noneAnimation, animation]);

  // Recalculate line length if scale has changed
  React.useEffect(() => {
    if (animation === "left") {
      const totalLength = pathRef.current.getTotalLength();
      d3.select(pathRef.current).attr(
        "stroke-dasharray",
        `${totalLength},${totalLength}`
      );
    }
  }, [xScale, yScale, animation,pathRef]);
  return null
} 