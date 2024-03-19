import SelectAutoWidth from "../charts/MultiLineChart/SelectAutoWidth.js";

export const ColumnsSection = ({selectNames = [], dataSelections = [], dataAvailables = [] ,onChangeHandlers = []}) => {

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
    <div style={{display:"flex",flexDirection:"row",}}>
      {
        selectNames.map((name,i) => (
          <div key={name} style={{padding:"25px",display: "flex",flexDirection: "row",border:"1px solid rgb(47, 47, 42)"}}>
            <span>{`Select ${name}`}</span>
            <SelectAutoWidth menuProps={MenuProps} customStyle={customSelectStyle} text={"Time Columns"} dataSelected={dataSelections[i]} dataAvailable={dataAvailables[i]} onChange={onChangeHandlers[i]}/>
          </div>
        ))
      }
    </div>
  )
}