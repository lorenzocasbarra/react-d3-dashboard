
import { SearchBar } from './SearchBar.js';
import { Legend } from "./Legend.js";



export const FillableLegend = ({ 
  availableData, 
  legendData, 
  selectedItems, 
  onChangeSelection,
  updateLegend
}) => {

  return(
    <>
      
      <SearchBar data={availableData} addFunction={updateLegend}/>
    
      <Legend
        data={ legendData }
        selectedItems={ selectedItems }
        onChange={ onChangeSelection }
        onClick = { updateLegend }
      />
    </>
  )
}