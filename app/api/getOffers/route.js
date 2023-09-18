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
          q.Paginate(q.Match(q.Index('getAllOffers'),"Pending"))
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
              q.Get(q.Ref(q.Collection('offers'), internalIds.data[step].id))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
            ))
            
            var matchingObj = {
              "houseId" : matchingId.data.houseId,
              "bidder" : matchingId.data.bidder,
              "offerId" : matchingId.data.offerId,
              "status": matchingId.data.status,
              "amount": matchingId.data.amount,
              "address": matchingId.data.address
            };
            houseList.push(matchingObj);
  
        }     
  
  
  

  
  
  
  


    
    return Response.json({ houseList })
}