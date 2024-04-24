from .schemas import Payload, SavePayload
from fastapi import FastAPI,HTTPException, Body,UploadFile, Query, Form
from fastapi.middleware.cors import CORSMiddleware
#from fastapi.staticfiles import StaticFiles
#from typing import Annotated
#from typing_extensions import Annotated
# from fastapi import Query, Request
from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse
# import json

app = FastAPI()

origins = [
  "https://localhost:3000",
  "http://localhost:3000",
  "http://0.0.0.0:8000/"
]


app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  #allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

#app.mount("/", StaticFiles(directory="static/"), name="static")


@app.get("/", tags=["root"])
async def read_root() -> dict:
  return {"message": "Welcome to your dashboard!"}

@app.get("/get-access-token")
async def get_gh_token(code: str):
  import requests
  import json

  CLIENT_ID="a15c35402808a5e46c2d"
  CLIENT_SECRET="1e5c09f018ac685ff7e91a46e19e1cbff5cf9173"
  headers={"Accept":"application/json"}
  params = f"?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&code={code}"
  response = requests.post(f"https://github.com/login/oauth/access_token{params}", headers=headers)

  print(json.loads(response.text))
  
  return(json.loads(response.text)["access_token"])

@app.get("/get-gh-user-data")
async def get_gh_user_data(token: str):
  import requests
  import json
  # print(f"TOKEN: {token}")
  headers={"Authorization":f"Bearer {token}"}
  response=requests.get("https://api.github.com/user",headers=headers)
  # print(json.loads(response.text))
  return(json.loads(response.text))





@app.get("/scan-data/")
async def scan_data():
  import os

  def print_subfolders(folder):
    import json
    toReturn = []
    for item in os.listdir(folder):
      item_path = os.path.join(folder, item)
      if os.path.isdir(item_path):
        toMerge = print_subfolders(item_path)
        toReturn = toReturn + toMerge
      else:
        if (item == "info.json"):  
          # print(f"File: {item}")
          with open(folder+"/"+item,"r") as file:
            data = file.read()
            # print(data)
            toReturn.append(json.loads(data))
    return(toReturn)

  folder = "../files/"
  results = print_subfolders(folder)
  print("Sending")
  print(results)

  return results

@app.get("/get_json_data/{item_id}/{file_name}")
async def get_json_data(item_id: str,file_name: str):
  import json
  print("Requesting",item_id,file_name)
  with open(f"../files/{item_id}/{file_name}.json", "r") as file:
    data = file.read()

  return json.loads(data)


@app.post("/cross-correlation/")
async def calculate_cross_correlation(payload: Payload = Body(None)) -> dict:
  if len(payload.items.keys()) == 0:
    raise HTTPException(status_code=500, detail="Invalid Input for Cross Correlation")
  
  #get dates range
  datesRange,timeData = payload.getTimeData()
  
  
  #combo pairs for cross correlation and get date thresholds for each pair interpolation
  pair1,pair2 = payload.getCombinations(timeData)

  #prepare dataframe
  df = payload.getDF(datesRange)
  #interpolation -> z score -> cross correlation
  results = payload.crossCorrelation(pair1,pair2,timeData,df)

  return results

@app.post("/upload/data/")
# async def upload_csv(file: UploadFile,type:Annotated[str, Form()]):
async def upload_data_csv(file: UploadFile):
  import pandas as pd
  from io import StringIO
  import os
  import csv
  
  def getBooleanColumns(df):
    bool_cols = []
    for column in df.columns:
      if df[column].dtypes == object and True|False in df[column].values:
        bool_cols.append(column)

    return bool_cols
  
  def getTimeColumns(df):
    time_cols = []
    for column in df.columns:
      try:
        pd.to_datetime(df[column], format='%m/%d/%Y')
        time_cols.append(column)
      except ValueError:
        continue
    return(time_cols)

  def getNumColumns(df):
    num_cols = []
    for column in df.columns:
      if df[column].dtypes == float:
        num_cols.append(column)
    return num_cols

  
  contents = await file.read()
  decoded_content = contents.decode('utf-8')
  # windows assigns this MIME type automagically to every text csv, it's shit, but what can you do about it?
  if file.content_type == "application/vnd.ms-excel":
    # Read the first few lines to check if they are comma-separated
    try:
      first_lines = decoded_content.split('\n')[:5]
      is_csv = all(csv.Sniffer().sniff(line).delimiter == ',' for line in first_lines)
      if not is_csv:
        raise HTTPException(status_code=409, detail="File content is not comma-separated!")
    except Exception as e:
      raise HTTPException(status_code=409, detail="Error reading file content: {}".format(str(e)))
  elif file.content_type != "text/csv":
    raise HTTPException(status_code=409, detail="Invalid file type: not .csv!")

  df = pd.read_csv(StringIO(decoded_content))

  #scan for datetime columns
  time_cols = getTimeColumns(df)

  #scan for boolean columns
  bool_cols = getBooleanColumns(df)
  
  #scan for numeric columns
  num_cols = getNumColumns(df)

  return jsonable_encoder({"fileName": file.filename, "booleanCols":bool_cols, "timeCols":time_cols, "numericCols": num_cols, "fileTextContent":contents.decode('utf-8')})

@app.get("/upload/data/gist/")
async def upload_data_gist_link(link: str) -> dict:
  import requests
  import pandas as pd
  from io import StringIO
  import urllib.parse


  def getBooleanColumns(df):
    bool_cols = []
    for column in df.columns:
      if df[column].dtypes == object and True|False in df[column].values:
        bool_cols.append(column)

    return bool_cols
  
  def getTimeColumns(df):
    time_cols = []
    for column in df.columns:
      try:
        pd.to_datetime(df[column], format='%m/%d/%Y')
        time_cols.append(column)
      except ValueError:
        continue
    return(time_cols)

  def getNumColumns(df):
    num_cols = []
    for column in df.columns:
      if df[column].dtypes == float:
        num_cols.append(column)
    return num_cols


  def is_valid_url(url):
    try:
      result = urllib.parse.urlparse(url)
      return all([result.scheme, result.netloc])
    except ValueError:
      return False

  if not is_valid_url(link):
    raise HTTPException(status_code=404, detail="Invalid URL")



  response = requests.get(link)
  
  if response.status_code == 200:

    df = pd.read_csv(StringIO(response.text))

    #scan for datetime columns
    time_cols = getTimeColumns(df)

    #scan for boolean columns
    bool_cols = getBooleanColumns(df)
    
    #scan for numeric columns
    num_cols = getNumColumns(df)

    return jsonable_encoder({"fileName": "github gist", "booleanCols":bool_cols, "timeCols":time_cols, "numericCols": num_cols, "fileTextContent":response.text})

  else:
    raise HTTPException(status_code=response.status_code, detail="Failed to fetch CSV data from the URL")


@app.get("/upload/tags/gist/")
async def upload_tags_gist_link(link: str) -> dict:
  import requests
  import pandas as pd
  from io import StringIO
  import urllib.parse


  def is_valid_url(url):
    try:
      result = urllib.parse.urlparse(url)
      return all([result.scheme, result.netloc])
    except ValueError:
      return False

  if not is_valid_url(link):
    print("Check not passed")
    raise HTTPException(status_code=404, detail="Invalid URL")

  print("Check passed")
  response = requests.get(link)
  if response.status_code == 200:

    df = pd.read_csv(StringIO(response.text))
    print(df)
    # obtain dictionary with occurences of unique tags uploaded
    counters = {key: int(df.iloc[:,1].value_counts()[key]) for key in df.iloc[:,1].unique()}
    #print(counters["various"])
    # obtain array containing each row as a value - tag object pair
    print(df)
    items = [{"value":row[1], "tag":row[2]} for row in df.itertuples()]

    return{"fileName": "github gist", "items":items, "counters": counters}
    
  else:
    raise HTTPException(status_code=response.status_code, detail="Failed to fetch CSV data from the URL")




  


@app.post("/upload/tags/")
async def upload_tags_csv(file: UploadFile):
  import pandas as pd
  from io import StringIO

  # validation on file type
  if file.content_type != "text/csv":
    raise HTTPException(status_code=409, detail="Invalid file type: not .csv!")

  # validation of columns content -> two columns that contain string
  ### tba

  # awaiting for file and loading it to df
  contents = await file.read()
  df = pd.read_csv(StringIO(contents.decode('utf-8')))
  
  # obtain dictionary with occurences of unique tags uploaded
  counters = {key: int(df.iloc[:,1].value_counts()[key]) for key in df.iloc[:,1].unique()}
  #print(counters["various"])
  # obtain array containing each row as a value - tag object pair
  items = [{"value":row[1], "tag":row[2]} for row in df.itertuples()]




  return{"fileName": file.filename, "items":items, "counters": counters}

@app.post("/save/json")
async def upload_csv(payload: SavePayload) -> str:
  import os
  import json
  from .encoders import DictEncoder
  import pandas as pd
  import numpy as np
  import scipy.stats as stats

  def zScoreCalc(data):
    
    for marker in data:
      tmp = []
      dates = data[marker]["items"].keys()
      for date in dates:
        tmp.append(data[marker]["items"][date]["value"] if data[marker]["items"][date]["value"] != None else np.nan)
      values = stats.zscore(np.array(tmp),
        axis=0,
        ddof=0,
        nan_policy='omit'             
      )
      for index,date in enumerate(dates):

        data[marker]["items"][date]["z"] = float(values[index]) if not np.isnan(values[index]) else None
    return(data)


  info,data,time = payload.getDicts()

  data = zScoreCalc(data)

  fileNames = ["info","data","marks"]


  if not os.path.exists(f'../files/{info["name"]}/'):
    os.makedirs(f'../files/{info["name"]}/')
  else:
    print("Folder already exists")
    # throw error here for now it overwrites automatically

  for i,dict in enumerate([info,data,time]):
    with open(f'../files/{info["name"]}/{fileNames[i]}.json','w', newline='') as f:
      tpJSONData=json.dumps(dict, indent=2, cls=DictEncoder)
      f.write(tpJSONData)

  return("Done")