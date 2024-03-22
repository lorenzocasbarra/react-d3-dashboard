
import { useState,useEffect } from "react";
import axios from"axios";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SelectAutoWidth from "../components/charts/MultiLineChart/SelectAutoWidth.js";

import { IconContext } from 'react-icons/lib';
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export const GitHubIssue = () => {

  const [accessToken,setAccessToken] = useState();
  const [ghUserData,setGhUserData] = useState(null);
  const [issue,setIssue] = useState(null)


  const [title,setTitle] = useState(null);
  const [label,setLabel] = useState({name: ""});
  const [os,setOS] = useState({name: ""});
  const [browser,setBrowser] = useState({name: ""});
  const [description,setDescription] = useState(null);
  const [steps,setSteps] = useState(null);

  const [titleCheck,setTitleCheck] = useState(false);
  const [tagsCheck,setTagsCheck] = useState(false);
  const [descriptionCheck,setDescriptionCheck] = useState(false);
  const [stepsCheck,setStepsCheck] = useState(false);

  const checkTags = () => {
    
    setTagsCheck(label.name && os.name && browser.name ? true : false)
  }

  const checkForm = () => {
    // let errorText = ""
    // [{name:"Title",value:titleCheck},{value:tagsCheck},{value:descriptionCheck},{value:stepsCheck}].forEach(element => {
    //   if (!element) {
    //     errorText = errorText + 
    //   }
    // });
    if (!(titleCheck && tagsCheck && descriptionCheck && stepsCheck) && label.name ==="bug") {
      alert("Please fill missing fields")
    } else if (!(titleCheck && tagsCheck && descriptionCheck) && label.name !=="bug"){
      alert("Please fill missing fields")
    } else {
      sendGhIssue({owner:"lorenzocasbarra",repo:"react-d3-dashboard",accessToken,title,label:label.name,issue})
    }
  }

  useEffect(() => {
    checkTags()
  },[label.name,os.name,browser.name])

  useEffect(() =>{
    const text = `OS: ${os.name}\nBrowser: ${browser.name}\nDescription:\n ${description}\n${label.name === "bug" ? `Steps to reproduce:\n ${steps}\n` : ``}`;
     
    setIssue(text)
  },[label.name,os.name,browser.name,steps,description])

  const onChangeTitle = (event) => {
    setTitle(event.target.value)
    setTitleCheck(event.target.value ? true : false)
  }
  const onChangeLabel = (event) => {
    setLabel({name: event.target.value})
  }
  const onChangeOS = (event) => {
    setOS({name: event.target.value})
    
  }
  const onChangeBrowser = (event) => {
    setBrowser({name: event.target.value})
  }
  const onChangeDescription = (event) => {
    setDescription(event.target.value)
    setDescriptionCheck(event.target.value ? true : false)
  }
  const onChangeSteps = (event) => {
    setSteps(event.target.value)
    setStepsCheck(event.target.value ? true : false)
  }


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

  const browsers = [
    {name:"Mozilla Firefox"},
    {name:"Google Chrome"},
    {name:"Safari"},
    {name:"Microsoft Edge"},
    {name:"Opera"},
    {name:"Internet Explorer"}
  ]
  const labels = [
    {name:"bug",title:"Something isn't working"},
    {name:"documentation",title:"Improvements or additions to documentation"},
    {name:"enhancement",title:"New feature or request"},
    {name:"invalid",title:"This doesn't seem right"},
    {name:"question",title:"Further information is requested"}
  ]

  const oss = [
    {name:"Windows"},
    {name:"Android"},
    {name:"iOS"},
    {name:"macOS"},
    {name:"Ubuntu"},
    {name:"Linux Mint"},
    {name:"Debian"},
    {name:"Fedora"},
    {name:"CentOS"},
    {name:"Arch Linux"},
    {name:"openSUSE"},
    {name:"Manjaro"},
    {name:"Chrome OS"},
    {name:"Pop!_OS"}
  ]

  useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    const scope = urlParams.get("scope");
    console.log(scope)
    
    if(codeParam && (localStorage.getItem("accessToken") === null)) {
      // console.log("Getting access token from gh")
      getAccessToken(codeParam)
    } else {
      setAccessToken(localStorage.getItem("accessToken"))
    }


  },[])

  useEffect(()=>{
    if (accessToken) {
      // console.log("Getting user data from gh")
      // console.log("Token: "+ accessToken)
       getGhUserData(accessToken)    
    } else {
      setGhUserData(null)
    }
  },[accessToken])

  async function  getAccessToken (codeParam)  {
    if (codeParam && localStorage.getItem("accessToken") === null) { 
      await axios.get(`http://localhost:8000/get-access-token?code=${codeParam}`,{
      },{
        headers: {
          'Content-Type': 'application/json'
      }})
      .then(response => {
        setAccessToken(response.data)
        localStorage.setItem("accessToken",response.data)
      })
      .catch(error => {
        console.log(error)
      });
    }
  }

  async function getGhUserData (accessToken)  {
    if (accessToken) {
      await axios.get(`http://localhost:8000/get-gh-user-data?token=${accessToken}`,{
      },{
        headers: {
          'Content-Type': 'application/json'
      }})
      .then(response => {
        // console.log(response.data)
        setGhUserData(response.data)
      })
      .catch(error => {
        console.log(error)
      });
    }
  }

  async function sendGhIssue ({owner,repo,accessToken,title,issue,label}) {
    
    await axios.post(`https://api.github.com/repos/${owner}/${repo}/issues`,{
      title: title,
      body: issue,
      labels: [label]
    },
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization : `Bearer ${accessToken}`
      }
    })
    .then(response => {
      alert("Issue Created! Thanks for your feedback!")
    })
    .catch(error => {
      console.log(error.response)
    });
  }

  function loginWithGithub() {
    // console.log("Login")
    const CLIENT_ID="a15c35402808a5e46c2d";
    window.location.assign("https://github.com/login/oauth/authorize?scope=repo&client_id="+CLIENT_ID);
  }


  return(
    <div className="App" style={{marginBottom:"100px",marginTop:"100px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div className="formContainer" >
        <div style={{display:"flex",alignItems:"center",flexDirection: "column"}}>
          {
            ghUserData ?
            <>
              <div style={{display:"flex",alignSelf:"flex-start",alignItems:"center",flexDirection: "row"}}>
                <img height="100px" width="100px" src={ghUserData.avatar_url}></img>
                
                <Button variant="contained" onClick={() => {localStorage.removeItem("accessToken");setAccessToken(null)}}>Logout</Button>
              </div>

              <div style={{marginTop:"25px",marginBottom:"25px",display:"flex",alignSelf:"flex-start",alignItems:"center",flexDirection: "row"}}>
                <header>
                  User: {ghUserData.login}
                </header>
              </div>


              <div style={{display:"flex",alignSelf:"flex-start",flexDirection: "row",width:"100%",justifyContent: "space-between"}}>
                <div>
                  Title<input style={{marginLeft:"10px", height:"25px"}} type="text" onChange={onChangeTitle}></input>
                </div>
                <div style={{marginLeft:"100px"}}>
                  <IconContext.Provider value={{size:"50px",color: titleCheck ? ' #a4ff00' : " #ff0000"}}>
                    {titleCheck ? <FaCheckCircle/> : <MdCancel/>}
                  </IconContext.Provider>
                </div>
              </div>

              <div style={{marginTop:"20px",width:"100%",justifyContent: "space-between",display:"flex",flexDirection:"row"}}>
                <Stack spacing={2} direction="row">
                <>
                  Issue Label
                  <SelectAutoWidth onChange={onChangeLabel} menuProps={MenuProps} customStyle={customSelectStyle} text={"Label"} dataSelected={label ? label : "None"} dataAvailable={labels}/>
                </>
                <>
                  Operating System
                  <SelectAutoWidth onChange={onChangeOS} menuProps={MenuProps} customStyle={customSelectStyle} text={"OS"} dataSelected={os ? os : "None"} dataAvailable={oss}/>
                </>
                <>
                  Browser
                  <SelectAutoWidth onChange={onChangeBrowser} menuProps={MenuProps} customStyle={customSelectStyle} text={"Browser"} dataSelected={browser ? browser : "None"} dataAvailable={browsers}/>
                </>
                </Stack>
                <IconContext.Provider value={{ size:"50px",color: tagsCheck ? ' #a4ff00' : " #ff0000"}}>
                  {tagsCheck ? <FaCheckCircle/> : <MdCancel/>}
                </IconContext.Provider>
              </div>

              <div style={{display:"flex",alignSelf:"flex-start",flexDirection: "row",width:"100%",justifyContent: "space-between"}}>
                <div style={{display:"flex",alignSelf:"flex-start",flexDirection: "column",width:"80%"}}>
                  Description:<textarea onChange={onChangeDescription} rows="4" cols="50" style={{height:"200px",resize: "none"}} ></textarea>
                </div>
                <div style={{marginTop:"50px"}}>
                  <IconContext.Provider value={{size:"50px",color: descriptionCheck ? ' #a4ff00' : " #ff0000"}}>
                    {descriptionCheck ? <FaCheckCircle/> : <MdCancel/>}
                  </IconContext.Provider>
                </div>
              </div>

              <div style={{display:"flex",alignSelf:"flex-start",flexDirection: "row",width:"100%",justifyContent: "space-between",marginTop:"50px"}}>
                { label.name === "bug" ?
                  <>
                    <div style={{display:"flex",alignSelf:"flex-start",flexDirection: "column",width:"80%"}}>
                      Steps to Reproduce:<textarea onChange={onChangeSteps} rows="4" cols="50" style={{height:"200px",resize: "none"}} ></textarea>
                    </div>
                    <div style={{marginTop:"50px"}}>
                      <IconContext.Provider value={{size:"50px",color: stepsCheck ? ' #a4ff00' : " #ff0000"}}>
                        
                          {stepsCheck ? <FaCheckCircle/> : <MdCancel/>}
                        
                      </IconContext.Provider>
                    </div>
                  </>
                  : null
                }
              </div>
              {
                
                <Button variant="contained" style={{marginTop:"50px"}} onClick={checkForm}>Submit</Button>
              }

            </>
            :
            <>
              <Button variant="contained" onClick={loginWithGithub}>Login on Github</Button>
            </>
          }
        </div>
      </div>
    </div>
  )
}