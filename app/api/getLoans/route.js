const xrpl = require("xrpl")
import { Client as FaunaClient } from "faunadb"
var faunadb = require('faunadb');
var q = faunadb.query;
var loanList = [];

export async function POST(request, { params }) {


        var dbClient = new faunadb.Client({
        secret: process.env["faunaKey"],
        domain: 'db.fauna.com', // Adjust if you are using Region Groups
        })
  
        loanList = [];
        let internalIds;
        await dbClient.query(
          q.Paginate(q.Match(q.Index('getLoans'),"Pending Approval"))
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
              q.Get(q.Ref(q.Collection('loans'), internalIds.data[step].id))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
            ))
            
            var matchingObj = {
              "buyer" : matchingId.data.buyer,
              "loanId" : matchingId.data.loanId,
              "status" : matchingId.data.status
            };
            loanList.push(matchingObj);
  
        }     
  
  
    
    return Response.json({ loanList })
}