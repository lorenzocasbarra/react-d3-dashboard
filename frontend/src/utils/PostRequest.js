import { formatDateForBody } from "./dateUtils.js";
export const PostRequest = () => {


  return(
    {
      request: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: ""
      },
      loadCalculationBody : function({items,correlationLag}) {
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
        this.request.body = JSON.stringify(requestBody)
      },
      loadSaveBody : function({requestBody}) {
        console.log(requestBody)
        this.request.body = JSON.stringify(requestBody.dataFile)
      },
      send: async function({url}) {
        return fetch(url, this.request)
        .then(response => response.json())
        .then(data => {
          // handle response from backend
          Object.entries(data).map(([name, values]) => {
            data[name].c = values.c.map((value) => (
              value === "" ? null : value
            ))
            return null
          })
          return(data)
        })
        .catch(error => {
          // Handle errors
          console.error('Error:', error);
          return({})
        });
      }
    }
  )
}