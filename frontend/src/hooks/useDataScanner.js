import * as React from 'react';

export function useDataScanner() {
  const [dataAvailable,setDataAvailable] = React.useState([
    {
      name: "None",
      type: "Time Series",
      xValuesFileName: "marks",
      dataFileName: "data",
      folder: "folder/"
    }
  ]);
  const [dataSelected,setDataSelected] = React.useState(
    {
      name: "None",
      type: "Time Series",
      xValuesFileName: "marks",
      dataFileName: "data",
      folder: "folder/"
    }
  );
  const onChange = function(event){
    let tmp = dataAvailable.filter((d) => d.name === event.target.value)[0]
    console.log(tmp)
    setDataSelected(tmp ? tmp : {
      name: "None",
      type: "Time Series",
      xValuesFileName: "marks",
      dataFileName: "data",
      folder: "folder/"
    })
  }

  React.useEffect(() => {
    fetch('http://localhost:8000/scan-data/',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      .then(response => response.json())
      .then(data => setDataAvailable(data))
      .catch(error => console.error('Error fetching JSON:', error));
  }, []); 

  return({dataAvailable,dataSelected,onChange})
  
  
}