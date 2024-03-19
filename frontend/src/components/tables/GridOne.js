import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';


export const GridOne = ({data,timepoints}) => {

  function isNumber(value) {
    return typeof value === 'number';
  }

  var sorted_dates = Object.keys(timepoints).sort((a,b) => {
    return new Date(a).getTime() - 
        new Date(b).getTime()
  });


  const columns = [
    { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', width: 400 },
    { field: 'type', headerName: 'Type', headerClassName: 'super-app-theme--header', width: 130 },
    ...sorted_dates.map((d,i) =>{
      return({field: timepoints[d].timestamp, headerName: timepoints[d].timestamp, headerClassName: 'super-app-theme--header', width: 130})
    })
  ];
  const rows = Object.keys(data).map((d) =>{
    let obj = {id:data[d].name,type:data[d].type}

    sorted_dates.map((i) =>{
      obj[i] = isNumber(data[d].items[i].value) ? data[d].items[i].value : null
    })
    return(obj)
  }
  );
  

  return (
    <div className='datatable' style={{height:"500px"}} >
      <Box
        sx={{
          '& .super-app-theme--header': {
            backgroundColor: 'rgba( 229, 232, 232,0.55)',
          },
        }}
        className="mui-table-box"
      >
        <DataGrid
          rows={rows}
          // getRowHeight={() => 'auto'} 
          // autoHeight={true}
          // getRowWidth={() => 'auto'}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10,20,50, 100]}
          checkboxSelection
        />
      </Box>
    </div>
  );

}


