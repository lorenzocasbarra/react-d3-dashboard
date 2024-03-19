import React, { useContext } from "react";

import { LBCAState } from "../../../pages/LBCAPage.js";
import { IconContext } from 'react-icons/lib';

import { MaterialUISwitch } from "./ModeToggler.js";

import { TbZoomScan, TbCircleLetterR, TbCircleLetterZ, TbMathFunction, TbMathFunctionOff } from "react-icons/tb";
import { PiSelectionPlusBold } from "react-icons/pi";
import { BsHeartPulseFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { LuMonitor, LuMonitorOff } from "react-icons/lu";


export const SwitchPanel = () => {

  const context = useContext(LBCAState);
  const {dataSwitch,mouseSwitch,flareSwitch,statSwitch,monitorSwitch} = context;

  return(
    
    <div id="switch-container">
      <IconContext.Provider
        value={{ color: 'black' }}
      >
        <MaterialUISwitch
          title={flareSwitch.set === true ? "Hide Flare Points" : "Display Flare Points"}
          style={{backgroundColor: "#aab4be"}}
          icon={<BsHeartPulseFill size={30}/>}
          checkedIcon={<MdCancel size={30}/>}
          onChange={flareSwitch.state === false ? () => flareSwitch.set(true) : () => flareSwitch.set(false)}
        />
        <MaterialUISwitch
          title={dataSwitch.set === "raw" ? "Switch to Z-Score" : "Switch to Raw Values"}
          style={{backgroundColor: "#aab4be"}}
          icon={<TbCircleLetterR size={30} />}
          checkedIcon={<TbCircleLetterZ size={30}/>}
          onChange={dataSwitch.state === "raw" ? () => dataSwitch.set("z_score") : () => dataSwitch.set("raw")}
        />
        <MaterialUISwitch
          title={mouseSwitch.state === "zoom" ? "Switch to Data Selection" : "Switch to Zoom"}
          style={{backgroundColor: "#aab4be"}}
          icon={<TbZoomScan  size={30} />}
          checkedIcon={<PiSelectionPlusBold size={30}/>}
          onChange={mouseSwitch.state === "zoom" ? () => mouseSwitch.set("select") : () => mouseSwitch.set("zoom")}
        />
        <MaterialUISwitch
          title={"Display/Hide Monitor"}
          style={{backgroundColor: "#aab4be"}}
          icon={<LuMonitorOff  size={30} />}
          checkedIcon={<LuMonitor size={30}/>}
          onChange={monitorSwitch.state === false ? () => monitorSwitch.set(true) : () => monitorSwitch.set(false)}
        />
        <MaterialUISwitch
          title={"Display/Hide Statistic"}
          style={{backgroundColor: "#aab4be"}}
          icon={<TbMathFunctionOff  size={30} />}
          checkedIcon={<TbMathFunction size={30}/>}
          onChange={statSwitch.state === false ? () => statSwitch.set(true) : () => statSwitch.set(false)}
        />
      </IconContext.Provider>
    </div>
  )
}