import {useState,useEffect} from "react";
import axios from 'axios'


export function useFlareData({dataSelected}){
  const [flares,setFlares] = useState([]);
  const [timeFetched, setTimeFetched] = useState(null);

  useEffect(() => {
    if (dataSelected.name !== "None") {
      axios.get(`http://localhost:8000/get_json_data/${dataSelected.name}/${dataSelected.xValuesFileName}/`)
        .then(response => response.data)
        .then(data => setTimeFetched(data))
        .catch(error => console.error('Error fetching JSON:', error));
    } else {
      setTimeFetched(null)
    }
  }, [dataSelected]);

  useEffect(() => {
    if (timeFetched) {
      let tmp = Object.keys(timeFetched).filter((tp) => timeFetched[tp].isFlare).map((tp) => {
        let [month,day,year] = tp.split("/");
        return(new Date(`${year}-${month}-${day}`))
      })
      setFlares(tmp)
    } else {
      setFlares([])
    }
  },[timeFetched])

  return{flares}
}