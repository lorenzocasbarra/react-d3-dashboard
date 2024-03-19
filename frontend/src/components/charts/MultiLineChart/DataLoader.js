import  SelectAutoWidth  from "./SelectAutoWidth.js"

export const DataLoader = ({dataAvailable = []}) => {

  return (
    <SelectAutoWidth dataAvailable={dataAvailable}/>
  )
}