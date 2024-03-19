export function useZScore() {
  // work in progress
  const executeCorrelationScript = useCallback(({items ={}}) => {
    
    let requestBody = {
      "items" : {},
      "lag" : correlationLag ? correlationLag : 30
    }
  
    Object.entries(items).map(([name,dates]) => {
      requestBody["items"][name] = {}
      Object.entries(dates).map((date) => {
        requestBody["items"][name][formatDateForBody(date[0])] = date[1]
        return null
      })
      return null
    })
  
    fetch(`http://localhost:8000/z-score/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 
        JSON.stringify(requestBody)
      ,
    })
    .then(response => response.json())
    .then(data => {
      // handle response from backend
      Object.entries(data).map(([name, values]) => {
        data[name].c = values.c.map((value) => (
          value === "" ? null : value
        ))
        return null
      })
      setCorrelationData(data)
      
    })
    .catch(error => {
      console.error('Error:', error);
      setCorrelationData({})
      // Handle errors
    });
  },[correlationLag]);
}