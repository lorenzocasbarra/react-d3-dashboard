import React, { useState } from 'react';


//component dependencies
// import { Overlay } from '../components/charts/MultiLineChart/Overlay.js';
import { LBCA } from "../components/charts/MultiLineChart/LBCA.js";
import { Legend } from "../components/charts/MultiLineChart/FillableLegend/Legend.js";
import { SearchBar } from '../components/charts/MultiLineChart/FillableLegend/SearchBar.js';
import { CorrelationChart } from '../components/charts/MultiLineChart/CorrelationChart.js';
import { SelectionMonitor } from '../components/charts/MultiLineChart/SelectionMonitor/SelectionMonitor.js';
import { StatMonitor } from "../components/charts/MultiLineChart/StatMonitor/StatMonitor.js";
import { SwitchPanel } from "../components/charts/MultiLineChart/SwitchPanel.js"
// import { DataLoader } from "../components/charts/MultiLineChart/DataLoader.js";
import SelectAutoWidth  from "../components/charts/MultiLineChart/SelectAutoWidth.js"
import useController from "../components/charts/MultiLineChart/LBCA.controller.js";

//custom hooks
import { useDataScanner } from "../hooks/useDataScanner.js"
import { useChartData } from "../hooks/useChartData.js";
import { useInteractiveLegend } from '../hooks/useInteractiveLegend.js';
import { useCorrelation } from "../hooks/useCorrelation.js";
import { useFlareData } from "../hooks/useFlareData.js";
import { useSwitches } from "../hooks/useSwitches.js";

//tmp
import { TbGraph,TbGraphOff } from "react-icons/tb";
import { MaterialUISwitch } from "../components/charts/MultiLineChart/ModeToggler.js";
import { IconContext } from 'react-icons/lib';


export const LBCAState = React.createContext();

export const LBCAPage = () => {

  const dimensions = {
    width: 600,
    height: 300,
    margin: {
      
      right: 30,
      labelX: 10,
      labelY: 10,
      get bottom(){
        return 30 + this.labelX
      },
      top:30,
      get left(){ 
        return 60 + this.labelY
      }
    },
    xMargin: -10,
    ymargin: -10
  };

  const {dataAvailable,dataSelected,onChange} = useDataScanner();
  const [selectedPoints,setSelectedPoints] = useState({}) // for selection logic
  const switches = useSwitches();
  const {dataSwitch,mouseSwitch,flareSwitch,statSwitch,monitorSwitch,statChartSwitch} = switches;
  const {selectedItems,colorScale,onLegend,updateLegend,onChangeSelection,onHighlight,hoverOnLegend,hoverOutLegend} = useInteractiveLegend();
  const {legendData,availableData,chartData} = useChartData({dataSelected,colorScale,onLegend,selectedModeData:dataSwitch.state,selectedItems});
  const {readyCorrelationData,onStatLegend,correlationLag,correlationData,executeCorrelationScript,handleLagChange} = useCorrelation({selectedPoints,selectedItems,colorScale,onLegend});
  const {flares} = useFlareData({dataSelected});

  const controller = useController({ data:chartData, width:dimensions.width, height:dimensions.height });
  const { yTickFormat, xScale, yScale, yScaleForAxis } = controller;

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

  return(
    <div style={{height:"fit-content", overflow:"scroll"}}>
      <div className="container1">
      {
        dataAvailable ? 
        <SelectAutoWidth text={"data"} menuProps={MenuProps} customStyle={customSelectStyle} dataSelected={dataSelected} dataAvailable={dataAvailable} onChange={onChange}/> 
        : null
      }
        <SearchBar data={availableData} addFunction={updateLegend} />
        <Legend
          data={ legendData }
          selectedItems={ selectedItems }
          onChange={ onChangeSelection }
          onClick = { updateLegend }
          onMouseOver = { hoverOnLegend }
          onMouseOut = { hoverOutLegend }
        />

        <LBCAState.Provider value={{
          onHighlight,
          selectedModeData: dataSwitch.state,
          selectedModeMouse : mouseSwitch.state, 
          selectedPoints,
          setSelectedPoints,
          yTickFormat, xScale, yScale, yScaleForAxis,executeCorrelationScript,correlationLag
        }}>
          <div style={{display: "flex", flexDirection: "start"}}>
            <LBCA
              data={ chartData } 
              dimensions={ dimensions } 
              onHighlight={ onHighlight }
              flares = {flareSwitch.state === true ? flares : []}
              displayStat={statSwitch.state}
            />

          </div>
        </LBCAState.Provider>

        <LBCAState.Provider value={{dataSwitch,mouseSwitch,flareSwitch,statSwitch,monitorSwitch}}>
        <SwitchPanel/>
        </LBCAState.Provider>
      </div>
        {
          
          <div className="container2">
            <div className="monitorContainer" style={{display:"flex",flexDirection:"column"}}>
              {
                monitorSwitch.state ? 
                <SelectionMonitor 
                  selectedPoints={selectedPoints} 
                  correlationData={correlationData}
                /> 
                : null
              }
              {
                statSwitch.state ?
                <StatMonitor 
                  selectedPoints={selectedPoints} 
                  correlationData={correlationData}
                /> : null
              }
            </div>


            {            
              statSwitch.state ? 
              <>
                <div style={{marginLeft:"50px",display:"flex",flexDirection:"column"}}>
                  <span style={{color:"black",fontWeight:"bold", fontSize: "20px"}}> Set Lag 
                    <input 
                      type="number"
                      value = {correlationLag ? correlationLag : 30}
                      style={{height:"25px",width:"60px",marginLeft:"20px"}}
                      min="1" 
                      max="100" 
                      onChange={(e) => handleLagChange(e.target.value)}
                    ></input>

                  </span>
                  <IconContext.Provider value={{ color: 'black' }}>
                    <MaterialUISwitch
                      checked={statChartSwitch.state === true ? true : false}
                      title={"Display/Hide Monitor"}
                      style={{backgroundColor: "#aab4be"}}
                      icon={<TbGraphOff  size={30} />}
                      checkedIcon={<TbGraph size={30}/>}
                      onChange={statChartSwitch.state === true ? () => statChartSwitch.set(false) : () => statChartSwitch.set(true)}
                    />
                  </IconContext.Provider>
                  {
                    statChartSwitch.state ? 
                    <Legend
                      data={ onStatLegend }
                      selectedItems={ selectedItems }
                      onChange={ onChangeSelection }
                      onClick = { updateLegend }
                      onMouseOver = { hoverOnLegend }
                      onMouseOut = { hoverOutLegend }
                    /> : null
                  }
                </div>
                
                { 
                  statChartSwitch.state ? 
                    <>
                      <CorrelationChart
                        data={ readyCorrelationData } 
                        dimensions={ dimensions } 
                        onHighlight={ onHighlight }
                      />
                    </> : null
                  
                }
              </> : null
            }
          </div>
        }
      
    </div>
  )


}