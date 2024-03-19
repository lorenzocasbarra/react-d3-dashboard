import {UploadSelector} from './UploadSelector.js';


export const TagsSection = ({onChangeGist,uploadGist,uploadedFile, uploadHandler,uploadProgress}) => {

  return(
    <div style={{display:"flex",flexDirection: "row",justifyContent:"space-between",padding:"10px"}}>
      <div style={{display:"flex",alignSelf:"center",flexDirection: "column",padding:"10px"}}>
        <span>File: {uploadedFile.fileName}</span>
        <span>Items: {Object.entries(uploadedFile.items).length}</span>
        <span>Unique Tags: {Object.entries(uploadedFile.counters).length}</span>
        {
          Object.entries(uploadedFile.counters).map((array) =>
            <span key={array[0]}>{`${array[0]} : ${array[1]}`}</span>
          )
        }
      </div>
      <UploadSelector 
        onChangeGist={onChangeGist} 
        uploadGist={uploadGist} 
        uploadHandler={uploadHandler} 
        uploadProgress={uploadProgress}
      />
    </div>
  )
}