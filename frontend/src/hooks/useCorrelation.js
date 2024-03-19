import {useState,useEffect,useCallback} from "react"

import { CorrelationData } from "../utils/CorrelationData.js";
import {PostRequest} from "../utils/PostRequest.js"


export function useCorrelation({selectedPoints,selectedItems,colorScale = {}}) {
  const [correlationData, setCorrelationData] = useState({});
  const [correlationLag, setCorrelationLag] = useState(10);
  const [readyCorrelationData, setReadyCorrelationData] = useState([]);
  const [onStatLegend,setOnStatLegend] = useState([]);

  const handleLagChange = (value) => {
    setCorrelationLag(value)
  }
  const executeCorrelationScript = useCallback(({items ={}}) => {
    let test = PostRequest()
    test.loadCalculationBody({items,correlationLag})
    test.send({url:`http://localhost:8000/cross-correlation/`}).then(data => {
      setCorrelationData(data)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  },[correlationLag]);

  useEffect(() => {
    const readyData2 = [];
    Object.entries(correlationData).map(([name,values],i) => {

      readyData2[i] = CorrelationData({
        name: name,
        points: values,
        color: colorScale(name)
      })
      return null
    })

    setOnStatLegend(readyData2)
    
    // setReadyCorrelationData(readyData2.filter((d) => selectedItems.includes(d.name)))
    
  },[colorScale,correlationData,selectedPoints]) //problem here with colorscale as dependency


  useEffect(() => {
    setReadyCorrelationData(onStatLegend.filter((d) => selectedItems.includes(d.name)))
  },[correlationData,selectedItems,correlationLag,onStatLegend])


  return {readyCorrelationData,correlationLag,correlationData,onStatLegend,executeCorrelationScript,handleLagChange}
}