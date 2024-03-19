import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth({text,dataAvailable = [],onChange,dataSelected,menuProps ={}, customStyle = {formControlStyle : {}, inputLabelStyle : {}, selectStyle : {}, menuItemStyle : {}}}) {


  
  return (
    <div className="data-selector">
      <FormControl sx={customStyle.formControlStyle}>
        <InputLabel sx={customStyle.inputLabelStyle} id="demo-simple-select-autowidth-label">{text}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={dataSelected.name}
          onChange={onChange}
          // autoWidth
          label="Data"
          title={`Select ${text} to load`}
          MenuProps={menuProps}
          sx={customStyle.selectStyle}
        >
          <MenuItem sx={customStyle.menuItemStyle} value="">
            <em>None</em>
          </MenuItem>
          {
            dataAvailable.map((info) => (
              <MenuItem  sx={customStyle.menuItemStyle} key={info.name} value={info.name}>
                <em>{info.name}</em>
              </MenuItem>
            ))
          }
          
        </Select>
      </FormControl>
    </div>
  );
}