import React from "react";
import { useState, useEffect, useMemo } from "react";
import * as d3 from "d3";

const getChartDimensions = () => {
  let svgWidth = document.getElementById("chartSVG").width.baseVal.valueInSpecifiedUnits
  let svgHeight = document.getElementById("chartSVG").height.baseVal.valueInSpecifiedUnits
  //console.log(`Chart Dimension -> width:${svgWidth} height:${svgHeight}`)
  return{
    svgWidth,
    svgHeight
  }
}

const formatDate = (date) => {

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return(`${day}/${month + 1}/${year}`);
}

export const Tooltip = ({value,date,x,y,formatFunction = formatDate}) => {

  const [rectWidth, setRectWidth] = useState(0);
  const [rectHeight, setRectHeight] = useState(0);
  const [rectXShift, setRectXShift] = useState(0);
  const [rectYShift, setRectYShift] = useState(0);

  
  const dateForTooltip = useMemo(() => formatFunction(date),[date]);


  const setupRect = (date,value,x,y) => {

    let newText = document.createElement("text");
    newText.setAttribute("id", "mock");
    document.body.appendChild(newText);
    let textElement = document.getElementById("mock");
    textElement.innerHTML += date;

    textElement.style.fontFamily = "sans-serif";
    textElement.fontSize = "15";
    let width = textElement.getBoundingClientRect().width + 10;
    let height = textElement.getBoundingClientRect().height;
    document.body.removeChild(newText);


    let newText2 = document.createElement("text");
    newText2.setAttribute("id", "mock2");
    document.body.appendChild(newText2);
    let textElement2 = document.getElementById("mock2");
    textElement2.innerHTML = value;

    textElement2.style.fontFamily = "sans-serif";
    textElement2.fontSize = "15";

    let width2 = textElement2.getBoundingClientRect().width + 10;
    let height2 = textElement2.getBoundingClientRect().height;

    document.body.removeChild(newText2);
    
    let rectWidth = width > width2 ? width : width2;
    let rectHeight = height > height2 ? height : height2


    setRectWidth(rectWidth);
    setRectHeight(rectHeight);

    const { svgWidth, svgHeight } = getChartDimensions();
    
    let xShift = 0;
    let yShift = 0;
  
    xShift = 
      x < svgWidth/2 ? 10 
      : x > svgWidth/2 ? - (rectWidth + 10) 
      : null;
  
    yShift =
      y > svgHeight/2 ? - (5 + rectHeight * 3)
      : y < svgHeight/2 ? 0
      : null; 
      setRectXShift(xShift)
      setRectYShift(yShift)



  }

  useEffect(() => setupRect(dateForTooltip,value,x,y),[dateForTooltip,value,x,y]);
  

  return(
    
    <>
      <g transform={`translate(${rectXShift + x}, ${rectYShift + y})`}>
      
        <rect 
          rx="4" 
          ry="4" 
          opacity="0.8"
          width={String(rectWidth)} 
          height={String(rectHeight * 2.5)}

        >
        </rect>
      
        <g transform={`translate(10, 0)`}>
            <text fontFamily="sans-serif" fontSize="15" style={{fill: 'white'}}>
              <tspan x="0" dy="1.2em">{String(dateForTooltip)}</tspan>
              <tspan x="0" dy="1.2em">{String(value)}</tspan>
            </text>
        </g>
        
      </g>
      
    </>
  )

  


}

{/* <g class="tooltip">
	<line class="tooltipLine" x1="278.43243243243245" x2="278.43243243243245" y1="-30" y2="338.5">
	</line>
	<g class="tooltipContent" transform="translate(286.43243243243245, -30)">
		<rect class="contentBackground" rx="4" ry="4" opacity="0.2" width="199.13333129882812" height="44">
		</rect>
		<text class="contentTitle" transform="translate(4,14)">Oct 25, 2019</text>
		<g class="content" transform="translate(4,32)">
			<g transform="translate(6,0)">
				<circle r="6" fill="#ffffff">
				</circle>
				<text class="performanceItemName" transform="translate(10,4)">Portfolio</text>
				<text class="performanceItemValue" opacity="0.5" font-size="10" transform="translate(65.41665649414062,4)">+1.50%</text>
				<text class="performanceItemMarketValue" transform="translate(111.41665649414062,4)">$97,905.45</text>
			</g>
		</g>
	</g>
	<circle class="tooltipLinePoint" r="6" opacity="1" transform="translate(278.43243243243245, 121.20257162587981)">
	</circle>
</g> */}


// //get dimensions for rect
// function mkBox(g, text) {
//   var dim = text.node().getBBox();
//   g.insert("rect", "text")
//     .attr("x", dim.x)
//     .attr("y", dim.y)
//     .attr("width", dim.width)
//     .attr("height", dim.height);
// }



// needs an algorithm to find best position for tooltip