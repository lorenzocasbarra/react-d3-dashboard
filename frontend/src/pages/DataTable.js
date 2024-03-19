import React, { useState, useEffect } from 'react'
import axios from 'axios'

import {GridOne} from "../components/tables/GridOne.js";
import SelectAutoWidth from "../components/charts/MultiLineChart/SelectAutoWidth.js";
import CircularIndeterminate from "../components/mui/CircularIndeterminate.js"
import { useDataScanner } from "../hooks/useDataScanner.js";


export const DataTable = () => {

  const {dataAvailable,dataSelected,onChange} = useDataScanner();
  const [dataFetched, setDataFetched] = useState(null);
  const [timeFetched, setTimeFetched] = useState(null);
  const [loadingSpin, setLoadingSpin] = useState(false);
  
  useEffect(() => {
    if (dataSelected.name !== "None"){
      setLoadingSpin(true)
      axios.get(`http://localhost:8000/get_json_data/${dataSelected.name}/${dataSelected.dataFileName}/`)
      .then((response) => response.data)
      .then(data => setDataFetched(data))
      .catch(error => console.error('Error fetching JSON:', error));
    } else {
      setDataFetched(null)
      setLoadingSpin(false)
    }
  },[dataSelected])

  useEffect(() => {
    if (dataSelected.name !== "None"){
      setLoadingSpin(true)
      axios.get(`http://localhost:8000/get_json_data/${dataSelected.name}/${dataSelected.xValuesFileName}/`)
        .then(response => response.data)
        .then(data => setTimeFetched(data))
        .catch(error => console.error('Error fetching JSON:', error));
    } else {
      setTimeFetched(null)
      setLoadingSpin(false)
    }
  },[dataSelected])

  useEffect(() => {
    if (dataFetched && timeFetched) {
      setLoadingSpin(false)
    }
  },[dataFetched,timeFetched])
  
  const MenuProps = {
    PaperProps: {
      style: {
        width: 200
      },
    },
  };
  const customSelectStyle = {
    formControlStyle : {m: 1, width:100}
  }
  
  return (
    <>
      <div style={{display:"flex",padding:"25px"}}>
        <span>{`Select Data`}</span>
        <SelectAutoWidth dataSelected={dataSelected} dataAvailable={dataAvailable} onChange={onChange} menuProps={MenuProps} text={"Data Type"} customStyle={customSelectStyle}/>
      </div>
      <div className='container-table' style={{height:"500px"}}>
      {loadingSpin ? <CircularIndeterminate /> : null}
      { dataFetched && timeFetched ?
        <GridOne  data={dataFetched} timepoints={timeFetched}></GridOne>
        : null
      }
      </div>
    </>
  )
}