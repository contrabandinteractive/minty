const xrpl = require("xrpl")
import { Client as FaunaClient } from "faunadb"
var faunadb = require('faunadb');
var q = faunadb.query;
import { v4 as uuidv4 } from 'uuid'
const loanId = uuidv4();

export async function POST(request, { params }) {
    /*
    const res = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=', {
        headers: {
        'Content-Type': 'application/json'
        },
    })
    */
    //const data = await res.json()

    const res = await request.json();


    const standby_wallet = xrpl.Wallet.fromSeed(res.buyerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "URI": xrpl.convertStringToHex("Document NFT for Loans"),
        "Flags": parseInt(8),
        "TransferFee": parseInt(0),
        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
      }
    
      // ----------------------------------------------------- Submit signed blob 
      const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet} )
      const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
      })
    
      // ------------------------------------------------------- Report results
      //results += '\n\nTransaction result: '+ tx.result.meta.TransactionResult
      //results += '\n\nnfts: ' + JSON.stringify(nfts, null, 2)
      //standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
      //standbyResultField.value = results  

    // Disconnect when done (If you omit this, Node.js won't end the process)
    client.disconnect()

    // Insert into DB




    var dbClient = new faunadb.Client({
    secret: process.env["faunaKey"],
    domain: 'db.fauna.com', // Adjust if you are using Region Groups
    })

        

    await dbClient.query(
            q.Create(q.Collection("loans"), {
              data: {
                loanId: loanId,
                buyer: res.buyerAddress,
                status: 'Pending Approval'
              },
            })
      )




    
    return Response.json({ loanId: loanId })
}