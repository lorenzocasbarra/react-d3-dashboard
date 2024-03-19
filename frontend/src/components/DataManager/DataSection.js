import SelectAutoWidth from "../charts/MultiLineChart/SelectAutoWidth.js";
import {UploadSelector} from './UploadSelector.js';


export const DataSection = ({onChangeGist,uploadGist,uploadedFile, uploadHandler, uploadProgress, selectName,dataSelected,dataAvailable,onChangeSelectHandler,onChangeTextHandler}) => {

  const customSelectStyle = {
    formControlStyle : {m: 1, width:250, border:"1px rgb(47, 47, 42)"}, 
    inputLabelStyle : {color:"white"}, 
    selectStyle : {color:"white"}, 
    menuItemStyle : {color:"white"}
  }
  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        backgroundColor: "rgb(47, 47, 42)",
      },
    },
  };

  return(
    <div style={{display:"flex",flexDirection: "row",justifyContent:"space-between"}}>
      <div style={{display:"flex",flexDirection: "column"}}>
        <span>File: {uploadedFile.fileName}</span>
        <span>Data Name:<input onChange={onChangeTextHandler} type="text" placeholder={"Name for your dataset goes here (Mandatory)"} style={{marginLeft:"10px",color:"white",backgroundColor:"rgb(26, 32, 42)"}}></input></span>
      </div>

      <div style={{display:"flex",padding:"25px"}}>
        <span>{`Select ${selectName}`}</span>
        <SelectAutoWidth menuProps={MenuProps} text={"Data Type"} dataSelected={dataSelected} dataAvailable={dataAvailable} onChange={onChangeSelectHandler} customStyle={customSelectStyle}/>
      </div>

      <UploadSelector onChangeGist={onChangeGist} uploadGist={uploadGist} uploadHandler={uploadHandler} uploadProgress={uploadProgress}/>
    </div>
  )
}