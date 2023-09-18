//import { create as ipfsHttpClient } from 'ipfs-http-client';
const xrpl = require("xrpl");
import { Client as FaunaClient } from "faunadb";
var faunadb = require('faunadb');
var q = faunadb.query;
//import { v4 as uuidv4 } from 'uuid'
//const houseId = uuidv4();
import axios from 'axios';

export async function POST(request, { params }) {

    const res = await request.json();

    // Look up House record in DB and update
    var dbClient = new faunadb.Client({
      secret: process.env["faunaKey"],
      domain: 'db.fauna.com', // Adjust if you are using Region Groups
     })

     let resultId;
     await dbClient.query(
         q.Paginate(q.Match(q.Index('searchById'), res.houseId))
       )
       .then((ret) => resultId=ret.data[0].id)
       .catch((err) => console.error(
         'Error: [%s] %s: %s',
         err.name,
         err.message,
         //err.errors()[0].description,
    ));

    let matchingId;
            await dbClient.query(
              q.Get(q.Ref(q.Collection('houseRecords'), resultId))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
    ))

    let nftSellOfferID = matchingId.data.nftSellOfferID;
    console.log("nftSellOfferID: "+nftSellOfferID);
    





    const standby_wallet = xrpl.Wallet.fromSeed(res.buyerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const transactionBlob = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenSellOffer": nftSellOfferID
    }
    
      // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet} )
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })

    
    

    client.disconnect()

    
    
    // Update DB
    await dbClient.query(
      q.Update(
        q.Ref(q.Collection('houseRecords'), resultId),
        {
          data: {
            status: "Sold",
            owner: res.buyerAddress,
            lastSold: '(today\'s date)',
            nftSellOfferID: "n/a"
          },
        },
      )
    );

    
    return Response.json({ success:"success" })
}