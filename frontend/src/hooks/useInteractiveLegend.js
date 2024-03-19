import {useState,useEffect,useCallback} from "react";
import * as d3 from "d3";


export function useInteractiveLegend (){
  
  const [selectedItems, setSelectedItems] = useState([]); // legend
  const [onLegend, setOnLegend] = useState([]);
  const [onHighlight, setOnHighlight] = useState([]);
  const [colorScale, setColorScale] = useState(() => (name) => d3.scaleOrdinal().domain([]).range(d3.schemeSet3)(name));

  

  useEffect(() =>{
    const scale = d3.scaleOrdinal().domain(onLegend).range(d3.schemeSet3)
    setColorScale(
      () => (name) => scale(name)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  
  const onChangeSelection = useCallback((name) => {
    const newSelectedItems = 
      selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    
    setSelectedItems(newSelectedItems);
  },[selectedItems]);


  const hoverOnLegend = useCallback((name) => {
    setOnHighlight(name)
  },[])
  const hoverOutLegend = useCallback(() => {
    setOnHighlight(null)
  },[])

  const updateLegend = useCallback((name) => {
    const newOnLegend = 
      onLegend.includes(name)
      ? [...onLegend.filter((d) => d !== name)]
      : [...onLegend, name]
    
    if (selectedItems.includes(name)) {
      onChangeSelection(name)
    }
    setOnLegend(newOnLegend)
  }, [onChangeSelection,selectedItems,onLegend])
  // const legendData = [...readyData.filter((d) => onLegend.includes(d.name))]


  return{selectedItems,colorScale,onLegend,updateLegend,onChangeSelection,onHighlight,hoverOnLegend,hoverOutLegend}
}