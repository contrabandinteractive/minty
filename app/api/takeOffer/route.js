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
         q.Paginate(q.Match(q.Index('getOfferByID'), res.offerId))
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
              q.Get(q.Ref(q.Collection('offers'), resultId))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
    ))

    let propertyAddress = matchingId.data.address;
    let houseId = matchingId.data.houseId;
    let conditionalOfferId = matchingId.data.conditionalOfferId;





    const standby_wallet = xrpl.Wallet.fromSeed(res.sellerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Transfer money from Loan Officer (Bank) to buyer
    const loWallet = xrpl.Wallet.fromSeed(res.loanOfficer1Secret);
    const buyerWallet = xrpl.Wallet.fromSeed(res.buyerSecret);
    const makePaymentBlob = {
      "TransactionType": "Payment",
      "Account": loWallet.classicAddress,
      "Destination": buyerWallet.classicAddress,
      "Amount": "1000000"
    }
    const paymentTrans = await client.submitAndWait(makePaymentBlob, { wallet: loWallet} )


     // Sell Conditional House NFT
     const transactionBlob2 = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenBuyOffer": conditionalOfferId
    }
      // ----------------------------------------------------- Submit signed blob 
    const tx2 = await client.submitAndWait(transactionBlob2, { wallet: standby_wallet} )
    const nfts2 = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })

    
    // Sell House NFT
    const transactionBlob = {
      "TransactionType": "NFTokenAcceptOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenBuyOffer": res.offerId
    }
      // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet} )
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })

    // Burn Conditional Property NFT
    const burnBlob = {
      "TransactionType": "NFTokenBurn",
      "Account": buyerWallet.classicAddress,
      "Fee": "10",
      "NFTokenID": res.conditionalPropertyNFTID
    }
    const burnTx = await client.submitAndWait(burnBlob, { wallet: buyerWallet} )
    

    client.disconnect()

    
    
    // Update DB
    let resultId2;
     await dbClient.query(
         q.Paginate(q.Match(q.Index('searchById'), houseId))
       )
       .then((ret) => resultId2=ret.data[0].id)
       .catch((err) => console.error(
         'Error: [%s] %s: %s',
         err.name,
         err.message,
         //err.errors()[0].description,
    ));



    // Update House Record
    let date = new Date().toLocaleDateString();

    await dbClient.query(
      q.Update(
        q.Ref(q.Collection('houseRecords'), resultId2),
        {
          data: {
            status: "Sold",
            owner: res.buyerAddress,
            lastSold: date,
            houseNFTokenID: "",
            conditionalHouseNFTokenID: "",
            askingPrice: ""
          },
        },
      )
    );

    // Update Offer Record
    await dbClient.query(
      q.Update(
        q.Ref(q.Collection('offers'), resultId),
        {
          data: {
            status: "Accepted"
          },
        },
      )
    );

    
    return Response.json({ success:"success" })
}