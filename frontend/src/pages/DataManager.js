import React, { useState, useEffect } from 'react'

import CircularIndeterminate from "../components/mui/CircularIndeterminate.js"
import InputFileUpload from "../components/mui/InputFileUpload.js"
import axios from 'axios'

import LinearProgress from '@mui/material/LinearProgress';
import SelectAutoWidth from "../components/charts/MultiLineChart/SelectAutoWidth.js";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {UploadSelector} from '../components/DataManager/UploadSelector.js';

import {DataSection} from '../components/DataManager/DataSection.js';
import {TagsSection} from '../components/DataManager/TagsSection.js';
import { ColumnsSection } from '../components/DataManager/ColumnsSection.js';

// import {PostRequest} from "../utils/PostRequest.js"



export const DataManager = () => {

  const [dataUploadProgress, setDataUploadProgress] = useState(0);
  const [tagsUploadProgress, setTagsUploadProgress] = useState(0);
  const [onSubmit,setOnSubmit] = useState(false);
  const [displaySel,setDisplaySel] = useState(false);
  const [uploadFile,setUploadFile] = useState({fileName:"",booleanCols:[],timeCols:[], stringCols:[], numericCols:[], fileTextContent:""});
  
  const [uploadFile2,setUploadFile2] = useState({fileName:"",items:[], counters: {}});
  
  const [timeColumnSelected,setTimeColumnSelected] = useState({name: ""});
  const [timeColumnsAvailable,setTimeColumnsAvailable] = useState([{name: ""}]);
  
  const [flareColumnsAvailable,setFlareColumnsAvailable] = useState([{name: ""}]);
  const [flareColumnSelected,setFlareColumnSelected] = useState({name: ""});

  const [idColumnsAvailable, setIdColumnsAvailable] = useState([{name: ""}]);
  const [idColumnSelected,setIdColumnSelected] = useState({name: ""});


  const [dataTypeAvailable, setDataAvailable] = useState([{name: "Time Series"},{name: "Categorical"}]);
  const [dataTypeSelected, setDataTypeSelected] = useState({name: ""});


  const [expTitle, setExpTitle] = useState("");

  const [gist, setGist] = useState("");
  const [gist2, setGist2] = useState("");
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type',"data");
    axios.post('http://localhost:8000/upload/data/', formData,{
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);  
        setDataUploadProgress(percentCompleted);
      }
    },{
      headers: {
      "Content-Type": "multipart/form-data"
    }})
    .then(response => {
      console.log(response.data)
      setUploadFile(response.data);
      setDisplaySel(true)
      setTimeout(() =>setDataUploadProgress(0),1000)
    })
    .catch(error => {
      console.error("Status code: "+error.response.status)
      console.error("Detail: "+error.response.data.detail);
      if (error.response.status === 409) {
        alert("Status code: "+error.response.status+"\n"+error.response.data.detail)
      }
      setTimeout(() =>setDataUploadProgress(0),1000)
    });
    
    
  }
  const handleFileUpload2 = (event) =>{
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    axios.post('http://localhost:8000/upload/tags/', formData,{
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);  
        setTagsUploadProgress(percentCompleted);
      }
    },{
      headers: {
      "Content-Type": "multipart/form-data"
    }})
      .then(response => {
        // console.log(response.data)
        setUploadFile2(response.data);
        // setDisplaySel(true)
        setTimeout(() =>setTagsUploadProgress(0),1000)
      })
      .catch(error => {
        console.error("Status code: "+error.response.status)
        console.error("Detail: "+error.response.data.detail);
        if (error.response.status === 409) {
          alert("Status code: "+error.response.status+"\n"+error.response.data.detail)
        }
        setTimeout(() =>setTagsUploadProgress(0),1000)
      });
  }

  const handleGist = () => {
    if (gist) { 
      axios.get(`http://localhost:8000/upload/data/gist?link=${gist}`,{
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);  
          setDataUploadProgress(percentCompleted);
        }
      },{
        headers: {
          'Content-Type': 'application/json'
      }})
      .then(response => {
        setUploadFile(response.data);
        setDisplaySel(true)
        setTimeout(() =>setDataUploadProgress(0),1000)
      })
      .catch(error => {
        alert(error.response.data.detail)
        setTimeout(() =>setDataUploadProgress(0),1000)
      });
    }
  }

  const handleGist2 = () => {
    if (gist2) {
      axios.get(`http://localhost:8000/upload/tags/gist?link=${gist2}`,{
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);  
          setTagsUploadProgress(percentCompleted);
        }
      },{
        headers: {
          'Content-Type': 'application/json'
      }})
      .then(response => {
        setUploadFile2(response.data);
        setDisplaySel(true)
        setTimeout(() =>setTagsUploadProgress(0),1000)
      })
      .catch(error => {
        alert(error.response.data.detail)
        setTimeout(() =>setTagsUploadProgress(0),1000)
      });
    }
  }

  useEffect(() => {
    
    setTimeColumnsAvailable(uploadFile.timeCols.map((name) => ({name:name})))
    setFlareColumnsAvailable(uploadFile.booleanCols.map((name) => ({name:name})))
    setIdColumnsAvailable(uploadFile.stringCols.map((name) => ({name:name})))
  },[uploadFile])

  // useEffect(() => {

  // },[uploadFile2])

  const handleFileSave = () => {
    const requestBody = {
      title: expTitle,
      type: dataTypeSelected.name,
      dataFile: uploadFile,
      tagsFile: uploadFile2,
      timeColumn: timeColumnSelected.name,
      flareColumn: flareColumnSelected.name, 
    }
    setOnSubmit(true)
    axios.post('http://localhost:8000/save/json', requestBody,{
      headers: {
        'Content-Type': 'application/json'
    }})
      .then(response => {
        setOnSubmit(false)
        alert("File Saved")
      })
      .catch(error => {
        setOnSubmit(false)
        alert(error.response)
      });
  }



  const onChange = function(event){
    setTimeColumnSelected({name: event.target.value})
  }
  const onChange2 = function(event){
    setFlareColumnSelected({name: event.target.value})
  }
  const onChange3 = function(event){
    setDataTypeSelected({name: event.target.value})
  }

  const onChange4 = function(event) {
    setExpTitle(event.target.value)
  }

  const onChange5 = function(event) {
    setGist(event.target.value)
  }
  const onChange6 = function(event) {
    setGist2(event.target.value)
  }

  const checkForm = function() {
    
    if (dataTypeSelected === "Time Series") {
      if (expTitle && timeColumnSelected.name && dataTypeSelected.name) {
        handleFileSave()
      }
    }
    if (dataTypeSelected === "Categorical") {
      if (expTitle && idColumnSelected.name && dataTypeSelected.name) {
        handleFileSave()
      }
    }
  }

  return (
    <div className='home'>

      <div className="formContainer" >
        
        <div style={{display:"flex",alignSelf:"center",flexDirection: "column"}}>

          <DataSection 
            uploadedFile={uploadFile} 
            uploadHandler={handleFileUpload} 
            uploadProgress={dataUploadProgress}
            selectName={"Data Type"}
            dataSelected={dataTypeSelected}
            dataAvailable={dataTypeAvailable}
            onChangeTextHandler={onChange4}
            onChangeSelectHandler={onChange3}
            onChangeGist={onChange5}
            uploadGist={handleGist}
          />

          { 
            displaySel ?
            <ColumnsSection 
              selectNames={dataTypeSelected.name === "Time Series" ? ["Time","Markers"] : dataTypeSelected.name === "Categorical" ? ["ID"] : []}
              dataSelections={[timeColumnSelected,flareColumnSelected]}
              dataAvailables={dataTypeSelected.name === "Time Series" ? [timeColumnsAvailable,flareColumnsAvailable] : dataTypeSelected.name === "Categorical" ? [idColumnsAvailable] : []}
              onChangeHandlers={[onChange,onChange2]}
            />
            : null
          }

          { 
            displaySel ?
            <TagsSection
              uploadedFile={uploadFile2} 
              uploadHandler={handleFileUpload2} 
              uploadProgress={tagsUploadProgress}
              onChangeGist={onChange6}
              uploadGist={handleGist2}
            />
            : null
          }
           
            
            <div style={{display:"flex",flexDirection: "row",justifyContent:"center"}}>
              <Stack spacing={2} direction="row">
              {
                displaySel && !onSubmit ? 
                <Button variant="contained" onClick={() => checkForm()}>Submit</Button>
                : displaySel && onSubmit ?
                <CircularIndeterminate size={50}/> 
                : null
              }
              </Stack>
            
            
            </div> 
            
          
        </div>
    
      </div>

    </div>
  )
}

