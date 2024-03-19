import {useState,useEffect} from "react"

import LinearProgress from '@mui/material/LinearProgress';
import InputFileUpload from "../mui/InputFileUpload.js";

import Button from '@mui/material/Button';

import "./style.css";

export const UploadSelector = ({onChangeGist,uploadGist,uploadHandler,uploadProgress}) => {

  const [uploadMode,setUploadMode] = useState("file")
  const [styles,setStyles] = useState([
    {width:"400px",padding:"25px",borderBottom:"0px",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"},
    {width:"400px",padding:"25px",borderBottom:"1px solid white",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"}
  ])

  useEffect(() => {
    if (uploadMode === "file") {
      setStyles([
        {width:"400px",padding:"25px",borderBottom:"0px",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"},
        {width:"400px",padding:"25px",borderBottom:"1px solid white",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"}
      ])
    } else {
      setStyles([
        {width:"400px",padding:"25px",borderBottom:"1px solid white",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"},
        {width:"400px",padding:"25px",borderBottom:"0px",borderLeft:"1px solid white",borderRight:"1px solid white",borderTop:"1px solid white"}
      ])
    }
  },[uploadMode])

  const onClick = (clicked) => {
    if (clicked !== uploadMode) {
      setUploadMode(uploadMode === "file" ? "gist" : "file")
    }
  }

  return (
    <div style={{alignSelf:"center",width: "600px"}}>
      <div style={{display:"flex",flexDirection:"column",borderBottom:"1px solid white"}}>

        <div style={{display:"flex",flexDirection:"row"}}>
          <div style={{width:"100%",borderBottom:"1px solid white"}}></div>
          <div className={"tab-select"} onClick={() => onClick("file")} style={styles[0]}><span >Upload File</span></div>
          <div className={"tab-select"} onClick={() => onClick("gist")} style={styles[1]}><span >Get GitHub Gist</span></div>
        </div>

        <div style={{display:"flex",flexDirection:"column",borderRight:"1px solid white",borderLeft:"1px solid white"}}>
          <div id="upload-section" style={{display:"flex",padding:"10px",alignSelf:"flex-end",width:"fit-content"}}>
            <form style={{textAlign:"center"}}>
              {
                uploadMode ==="file" ? 
                <InputFileUpload onChange={uploadHandler}/> 
                : <>Link<input title={"Paste GitHub Gist link here"} onChange={onChangeGist} placeholder="https://gist.githubusercontent.com/user/raw.csv" type="text" style={{width:"400px",margin:"20px"}}>
                </input><Button onClick={uploadGist} variant="contained">GET</Button></>
              }
              <LinearProgress style={{height:"10px",width:"500px"}} variant="determinate" value={uploadProgress} />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}