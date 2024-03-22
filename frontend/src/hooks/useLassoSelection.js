import {useState,useEffect} from "react"
import *  as d3 from "d3"

export function useLassoSelection({
  data,setSelectedPoints,boundries,margin,xScale,yScale,currentScale, zoomState,executeCorrelationScript,correlationLag
}) {
  const [mouseDown, setMouseDown] = useState({ status: false, x: null, y: null }); // for selection logic
  const [cursorPosition, setCursorPosition] = useState({ x: null, y: null }); // for selection logic
  const [mouseUp, setMouseUp] = useState({ status: true, x: null, y: null }); // for selection logic
  const [highlightedPoints,setHighlightedPoints] = useState({});
  const [selectionCounter,setSelectionCounter] = useState(0);

  const onMousePressed = (event) => {
    setMouseDown({
      status: true,
      x: event.clientX - boundries.left,
      y: event.clientY - boundries.top
    })
    let previousUp = mouseUp;
    setMouseUp({ x: previousUp.x, y: previousUp.y, status: false })
    setSelectedPoints({})
    setHighlightedPoints({})
  }
  const onMouseMove = (event) => {
    setCursorPosition({
      x: event.clientX - boundries.left,
      y: event.clientY - boundries.top
    })

    
    if (mouseDown.status === true) {
      let xThrs = [event.clientX - boundries.left - margin.left, mouseDown.x  - margin.left]
      let yThrs = [event.clientY - boundries.top  - margin.top, mouseDown.y - margin.top]
      
      var scaleTmp = {
        x: zoomState !== null ? currentScale.x : xScale,
        y: zoomState !== null ? currentScale.y : yScale
      }
      
      var filteredItems={}
      var filteredItemsDef = {}
      var c = 0;
      data.map((line) =>{ 
        filteredItems[line.name] = line.items.filter(
          (item) => 
          scaleTmp.x(item.date) < d3.max(xThrs) && 
          scaleTmp.x(item.date) > d3.min(xThrs) &&
          scaleTmp.y(item.value) < d3.max(yThrs) &&
          scaleTmp.y(item.value) > d3.min(yThrs) &&
          item.value !== null
        )
        filteredItems[line.name].map((name) => 
        {
          filteredItemsDef[line.name] = {};
          filteredItems[line.name].map((item) =>{
            filteredItemsDef[line.name][item.date] = item.raw //SHOULD BE VALUE
            c++
            return null
          })
          return null
        }
      )
      return null
      })
      c !== selectionCounter ? setSelectionCounter(c) : setSelectionCounter(selectionCounter);
      
      
      // setSelectedPoints(filteredItemsDef)
      setHighlightedPoints(filteredItemsDef)
    }
    

  }
  const onMouseReleased = (event) => {
    setMouseUp({
      status: true,
      x: event.clientX - boundries.left,
      y: event.clientY - boundries.top
    })
    let previousDown = mouseDown;
    setMouseDown({ x: previousDown.x, y: previousDown.y, satus: false })
    
    
    setSelectedPoints(highlightedPoints)
  }

  useEffect(() => {
    setSelectedPoints(highlightedPoints)
  },[setSelectedPoints,selectionCounter,highlightedPoints])

  useEffect(() => {
    if (selectionCounter !== 0 && Object.keys(highlightedPoints).length > 1) {executeCorrelationScript({items:highlightedPoints})}
  },[executeCorrelationScript,highlightedPoints,selectionCounter,correlationLag]) // problem with executeCorrelationScript as dependency

  return{highlightedPoints,mouseDown,cursorPosition,mouseUp,onMousePressed,onMouseMove,onMouseReleased}
}


