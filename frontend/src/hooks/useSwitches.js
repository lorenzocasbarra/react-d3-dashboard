import { useState } from 'react';


export function useSwitches (){
  const [selectedModeData, setSelectedModeData ] = useState("raw");
  const [selectedModeMouse, setSelectedModeMouse] = useState("zoom");
  const [selectedModeFlare, setSelectedModeFlare] = useState(false);
  const [statOnDisplay, setStatOnDisplay] = useState(false);
  const [monitorOnDisplay, setMonitorOnDisplay] = useState(false);
  const [statChartOnDisplay, setStatChartOnDisplay] = useState(false);

  
  return{
    dataSwitch      : { state: selectedModeData,    set: setSelectedModeData },
    mouseSwitch     : { state: selectedModeMouse,   set: setSelectedModeMouse },
    flareSwitch     : { state: selectedModeFlare,   set: setSelectedModeFlare },
    statSwitch      : { state: statOnDisplay,       set: setStatOnDisplay },
    monitorSwitch   : { state: monitorOnDisplay,    set: setMonitorOnDisplay },
    statChartSwitch : { state: statChartOnDisplay,  set: setStatChartOnDisplay }
  } 
  
}