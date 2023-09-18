const xrpl = require("xrpl")
import { Client as FaunaClient } from "faunadb"
var faunadb = require('faunadb');
var q = faunadb.query;
import { v4 as uuidv4 } from 'uuid'
const houseId = uuidv4();
var houseList = [];

export async function POST(request, { params }) {


  

        var dbClient = new faunadb.Client({
        secret: process.env["faunaKey"],
        domain: 'db.fauna.com', // Adjust if you are using Region Groups
        })
  
        houseList = [];
        let internalIds;
        await dbClient.query(
          q.Paginate(q.Match(q.Index('getListedHouses'),"listed"))
        )
        .then((ret) => internalIds=ret)
        .catch((err) => console.error(
          'Error: [%s] %s: %s',
          err.name,
          err.message,
          err.errors()[0].description,
        ))
        
        
        
        for (let step = 0; step < internalIds.data.length; step++) {
            let matchingId;
            await dbClient.query(
              q.Get(q.Ref(q.Collection('houseRecords'), internalIds.data[step].id))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
            ))
            
            var matchingObj = {
              "owner" : matchingId.data.owner,
              "address" : matchingId.data.address,
              "yearBuilt" : matchingId.data.yearBuilt,
              "sqft": matchingId.data.sqft,
              "ipfsURL": matchingId.data.ipfsURL,
              "houseId": matchingId.data.houseId,
              "imageURL": matchingId.data.imageURL,
              "askingPrice": matchingId.data.askingPrice,
              "status": matchingId.data.status,
              "lastSold": matchingId.data.lastSold
            };
            houseList.push(matchingObj);
  
        }     
  
  
  

  
  
  
  


    
    return Response.json({ houseList })
}