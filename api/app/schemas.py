from pydantic import BaseModel

class Payload(BaseModel):
  lag: int
  items: dict
  def __getitem__(self): 
    print (self.items)
  
  def getTimeData(self):
    from datetime import datetime
    import pandas as pd

    dates = []
    timeData = {}
    for key in self.items:    
      timeData[key] = {}
      dates = dates + list(self.items[key].keys())
      dateObjs = []
      for date in self.items[key]:
        dateObjs.append(datetime.strptime(date, '%Y-%m-%d'))
      
      timeData[key]["min"] = min(dateObjs)
      timeData[key]["max"] = max(dateObjs)


    dates = sorted(list(set(dates)))
    datesRange = pd.date_range(start=dates[0], end=dates[-1]).astype(str)

    
    return datesRange,timeData
  

  def getDF2(self,datesRange,timeData):
    import pandas as pd
    dfData = pd.DataFrame({
      "timestamps" : list(datesRange)
    })
    for marker in self.items:
      df = pd.DataFrame({
        "timestamps" : self.items[marker].keys(),
        marker : [self.items[marker][date] for date in self.items[marker]]
      })
      dfData = pd.merge(dfData, df[['timestamps', marker]], on='timestamps', how="outer")
      
    print(dfData)
    return(dfData)

  def getCombinations(self,timeData):
    from datetime import datetime
    pair1 =[]
    pair2 =[]

    players = list(self.items.keys())

    for name1 in players:
      for name2 in players: 
        if name1 == name2:
          continue
        else:
          tmp = list(set([timeData[name1]["min"],timeData[name2]["min"],timeData[name1]["max"],timeData[name2]["max"]]))
          timeData[name1+" vs. "+name2] = {}
          timeData[name1+" vs. "+name2]["min"] = datetime.strftime(min(tmp),'%Y-%m-%d')
          timeData[name1+" vs. "+name2]["max"] = datetime.strftime(max(tmp),'%Y-%m-%d')
          pair1.append(name1)
          pair2.append(name2)
      if len(players) > 1:
        players = players[1:]
      else:
        break
    return(pair1,pair2)

  
  def getDF(self,datesRange):
    import pandas as pd

    dfData = {
      "timestamps" : list(datesRange)
    }

    for key in self.items:
      dfData[key] = []
      for date in datesRange:
        if date in self.items[key].keys():
          dfData[key].append(self.items[key][date])
        else:
          dfData[key].append("NaN")

    df = pd.DataFrame.from_dict(dfData)
    columns = list(df.columns.values)

    for name in columns[1:]:
      df[name] = df[name].astype(float)
    
    return(df)

  def crossCorrelation(self,pair1,pair2,timeData,df):
    from datetime import datetime
    import pandas as pd
    from .statUtils import xcorr
    import math
    import scipy.stats as stats


    lagLim = int(self.lag)       #lag limit

    results = {}

    for i, name in enumerate(pair1):

      #subset df based on relevant days for each pair
      # row_num_max = df[df['timestamps'] == timeData[name+" vs. "+pair2[i]]["max"]].index[0]
      # row_num_min = df[df['timestamps'] == timeData[name+" vs. "+pair2[i]]["min"]].index[0] 
      # dfSlim = df.iloc[row_num_min:row_num_max+1]
      
      
      row_num_max_1 = df[df['timestamps'] == datetime.strftime(timeData[name]["max"],'%Y-%m-%d')].index[0]
      row_num_min_1 = df[df['timestamps'] == datetime.strftime(timeData[name]["min"],'%Y-%m-%d')].index[0]
      
      dfSlim1 = df[["timestamps",name]].iloc[row_num_min_1:row_num_max_1+1]
      row_num_max_2 = df[df['timestamps'] == datetime.strftime(timeData[pair2[i]]["max"],'%Y-%m-%d')].index[0]
      row_num_min_2 = df[df['timestamps'] == datetime.strftime(timeData[pair2[i]]["min"],'%Y-%m-%d')].index[0] 
      dfSlim2 = df[["timestamps",pair2[i]]].iloc[row_num_min_2:row_num_max_2+1]


      
      dfSlim = pd.merge(dfSlim1, dfSlim2, on='timestamps', how="outer")
      
      totalDays = len(dfSlim["timestamps"])
      #interpolation
      interData1 = dfSlim1[name].interpolate('pchip')
      interData2 = dfSlim2[pair2[i]].interpolate('pchip')

      z1 = stats.zscore(interData1,
        axis=0,
        ddof=0,
        nan_policy='omit'
      )
      z2 = stats.zscore(interData2,
        axis=0,
        ddof=0,
        nan_policy='omit'
      )

      # print(interData1)
      # print(interData2)
      #cross correlation
      lags,c = xcorr(z1,z2,lagLim,totalDays)
      #results assembly
      results[name+" vs. "+pair2[i]] = {}
      results[name+" vs. "+pair2[i]]["lags"] = lags.tolist()
      results[name+" vs. "+pair2[i]]["c"] = c
      results[name+" vs. "+pair2[i]]["cSignificant"] = []
      results[name+" vs. "+pair2[i]]["lagSignificant"] = []

      for d, coeff in enumerate(c):
        threshold = 2/(math.sqrt(len(df["timestamps"]) - abs(results[name+" vs. "+pair2[i]]["lags"][d])))
        #print("c ",coeff," ","thr ",threshold)
        if coeff > threshold:
          results[name+" vs. "+pair2[i]]["cSignificant"].append(coeff)
          results[name+" vs. "+pair2[i]]["lagSignificant"].append(lags.tolist()[d])
          results[name+" vs. "+pair2[i]]["cMax"] = max(results[name+" vs. "+pair2[i]]["cSignificant"])
          index = results[name+" vs. "+pair2[i]]["cSignificant"].index(results[name+" vs. "+pair2[i]]["cMax"])
          results[name+" vs. "+pair2[i]]["lagMax"] = results[name+" vs. "+pair2[i]]["lagSignificant"][index]

    return results




class SavePayload(BaseModel):
  title: str
  type: str
  dataFile: dict
  tagsFile: dict
  timeColumn: str
  flareColumn: str

  def __getitem__(self): 
    print(self.title)
    print(self.dataFile)
    print(self.tagsFile)
    print(self.timeColumn)
    print(self.flareColumn)

  def getDicts(self):
    import pandas as pd
    import numpy as np
    from io import StringIO

    def getItems(df,time_col,num_cols,tags):
      import numpy as np
      items = {
        marker: {
          "name": marker,
          "id": "",
          "type": "",
          "items" : {time: {
            "date": time,
            "value": ""
          } for time in df[time_col]}
        } for marker in num_cols
      }
      for index,row in df.iterrows():
        for marker in num_cols:
          if (not np.isnan(row[marker])):
            items[marker]["items"][row[time_col]]["value"] = row[marker]
          else:
            items[marker]["items"][row[time_col]]["value"] = None

      for tagObj in tags:
        if tagObj["value"] in tags:
          tags[tagObj["value"]]["type"] = tagObj["tag"]
      
      return items

    info = {
      "name":self.title,
      "type":self.type,
      "xColumn":self.timeColumn,
      "boolColumn":self.flareColumn,
      "xValuesFileName": "marks",
      "dataFileName": "data"
    }
    df = pd.read_csv(StringIO(self.dataFile["fileTextContent"]))
    data = getItems(df,self.timeColumn,self.dataFile["numericCols"],self.tagsFile["items"])
    
    time = {}
    if (self.flareColumn):
      time = {
        row[self.timeColumn] : {
          "timestamp" : row[self.timeColumn],
          "isFlare" : row[self.flareColumn] if not np.isnan(row[self.flareColumn]) else None

        } for index,row in df.iterrows()
      }
    print("Done")
    return(info,data,time)

  
