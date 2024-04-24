import {useState,useEffect} from "react";
// import data from '../files/dataBiomarkerAndRA.json';
import { MarkerData } from "../utils/MarkerData.js";
import axios from 'axios'




export function useChartData ({dataSelected,colorScale,onLegend,selectedModeData,selectedItems}){
  const [chartData,setChartData] = useState([]);
  const [legendData,setLegendData] = useState([]);
  const [availableData,setAvailableData] = useState([]);  // search bar
  const [dataFetched, setDataFetched] = useState(null);
  

  useEffect(() => {
    console.log(dataSelected)
    console.log(dataSelected.name)
    console.log(dataSelected.dataFileName)
    if (dataSelected.name !== "None") {
      // console.log(`http://localhost:8000/get_json_data/${dataSelected.name}/${dataSelected.dataFileName}/`)
      axios.get(`http://localhost:8000/get_json_data/${dataSelected.name}/${dataSelected.dataFileName}/`)
      .then((response) => response.data)
      .then(data => setDataFetched(data))
      .catch(error => console.error('Error fetching JSON:', error));
    } else {
      setDataFetched(null)
    }
  }, [dataSelected]);
  

  useEffect(()=>{
    const readyData = [];
    if (dataFetched) {
      Object.keys(dataFetched).filter((d) => dataFetched[d].type !== "bacteria").map((marker,i) => (
        readyData[i] = MarkerData({
          name:dataFetched[marker].name, 
          color:colorScale(marker), 
          type:dataFetched[marker].type,
          timestamps:dataFetched[marker].items,
          dataType:dataSelected.type
        })
      ))
      readyData.map((d) =>(
        d.items.map((i) =>(
          i.value = selectedModeData === "raw" ? i.raw : i.z
        ))
      ))
      setChartData(readyData.filter((d) => selectedItems.includes(d.name)))
      setLegendData([...readyData.filter((d) => onLegend.includes(d.name))])
      setAvailableData(readyData.filter((d) => !onLegend.includes(d.name)))
    } else {
      setChartData([])
      setLegendData([])
      setAvailableData([]) // search bar
    }
  },[dataSelected,dataFetched,colorScale,selectedModeData,selectedItems,onLegend])
  



  return{legendData,availableData,chartData}
}