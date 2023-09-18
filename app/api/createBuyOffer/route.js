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

    

    // Get House NFToken ID
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
    let houseNFTID = matchingId.data.houseNFTokenID;
    let conditionalHouseNFTokenID = matchingId.data.conditionalHouseNFTokenID;
    let theOwnerID = matchingId.data.owner;
    console.log("houseNFTID: "+houseNFTID);


    
    const standby_wallet = xrpl.Wallet.fromSeed(res.buyerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    
    
    let conditionalHouseOnePercent = parseInt(res.bidAmount)*0.01;
    let conditionalHouseAmount = conditionalHouseOnePercent*1000000;
    //let houseNinetyNinePercent = parseInt(res.bidAmount)*0.99;
    let houseAmount = parseInt(res.bidAmount)-conditionalHouseOnePercent;
    houseAmount = houseAmount*1000000;

  



    // Create Buy Offer for Conditional House NFT
    const transactionBlob = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenID": conditionalHouseNFTokenID,
      "Amount": conditionalHouseAmount.toString(),
      "Owner": theOwnerID
    }
    
      // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet} )
    
    console.log('Getting buy offers');
    // Get Sell Offer ID
    let nftBuyOffers
    try {
      nftBuyOffers = await client.request({
        method: "nft_buy_offers",
        nft_id: conditionalHouseNFTokenID})
    } catch (err) {
      nftBuyOffers = "No sell offers."
    }
    //let sellOffersList = JSON.stringify(nftSellOffers,null,2)
    console.log(nftBuyOffers);
    //let lastElementIndexInSellOffers = nftSellOffers.result.offers.length - 1;
    let theFinalBuyOfferID = nftBuyOffers.result.offers[0].nft_offer_index;
    console.log("theFinalBuyOfferID: "+theFinalBuyOfferID);


     // Create Buy Offer for the House NFT
     const transactionBlob2 = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": standby_wallet.classicAddress,
      "NFTokenID": houseNFTID,
      "Amount": houseAmount.toString(),
      "Owner": theOwnerID
    }
    
      // ----------------------------------------------------- Submit signed blob 
    const tx2 = await client.submitAndWait(transactionBlob2, { wallet: standby_wallet} )
    
    console.log('Getting buy offers');
    // Get Sell Offer ID
    let nftBuyOffers2
    try {
      nftBuyOffers2 = await client.request({
        method: "nft_buy_offers",
        nft_id: houseNFTID})
    } catch (err) {
      nftBuyOffers = "No sell offers."
    }
    //let sellOffersList = JSON.stringify(nftSellOffers,null,2)
    console.log(nftBuyOffers2);
    //let lastElementIndexInSellOffers = nftSellOffers.result.offers.length - 1;
    let theFinalBuyOfferID2 = nftBuyOffers2.result.offers[0].nft_offer_index;
    console.log("theFinalBuyOfferID2: "+theFinalBuyOfferID2);






    // Add offer to DB
    await dbClient.query(
      q.Create(q.Collection("offers"), {
        data: {
          houseId: res.houseId,
          bidder: standby_wallet.classicAddress,
          conditionalOfferId: theFinalBuyOfferID,
          offerId: theFinalBuyOfferID2,
          status: "Pending",
          amount: res.bidAmount,
          address: res.property
        },
      })
    )
    
    

    client.disconnect()

    
    return Response.json({ success:"success" })
}