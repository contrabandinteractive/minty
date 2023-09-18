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




    // Create and upload text file to IPFS

    console.log('Creating IPFS file...');


   
    const data = JSON.stringify({
      "Address": res.selectHouseNFTPropertyValue,
      "Year Built": res.selectHouseNFTYear,
      "Owner": res.sellerAddress,
      "Sq Ft": res.selectHouseNFTSqFt,
      "URL": "https://minty-platform.vercel.app/?houseId="+res.houseId,
    })
    



    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
          'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
          "Content-Type": "application/json"
      },
    });

    const UrlHash = `${resFile.data.IpfsHash}`;
    console.log(UrlHash); 



    const standby_wallet = xrpl.Wallet.fromSeed(res.sellerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "URI": xrpl.convertStringToHex("https://lavender-fluffy-mackerel-496.mypinata.cloud/ipfs/"+UrlHash),
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
    console.log('Current NFTs: ');
    //console.log(nfts.result.account_nfts[0]);
    
    let lastElementIndex = nfts.result.account_nfts.length - 1;

    let sellOfferRealAmount = parseInt(res.nftSellPrice)*1000000;
    console.log("Amount = "+sellOfferRealAmount.toString());







    client.disconnect()

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
    
    // Add IPFS URL to our DB
    await dbClient.query(
      q.Update(
        q.Ref(q.Collection('houseRecords'), resultId),
        {
          data: {
            ipfsURL: "https://lavender-fluffy-mackerel-496.mypinata.cloud/ipfs/"+UrlHash,
            status: "For Sale",
            listed: "listed",
            askingPrice: res.nftSellPrice,
            //nftSellOfferID: theFinalSellOfferID,
            conditionalHouseNFTokenID: nfts.result.account_nfts[lastElementIndex].NFTokenID
          },
        },
      )
    );

    
    return Response.json({ nftId: nfts.result.account_nfts[lastElementIndex].NFTokenID })
}