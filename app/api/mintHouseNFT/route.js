const xrpl = require("xrpl")
import { Client as FaunaClient } from "faunadb"
var faunadb = require('faunadb');
var q = faunadb.query;
import { v4 as uuidv4 } from 'uuid'
const houseId = uuidv4();

export async function POST(request, { params }) {


    const res = await request.json();


    const standby_wallet = xrpl.Wallet.fromSeed(res.sellerSecret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "URI": xrpl.convertStringToHex("https://minty-platform.vercel.app/?houseId="+houseId),
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

      console.log("Token ID:"+nfts.result.account_nfts[nfts.result.account_nfts.length-1].NFTokenID);
    

    client.disconnect()

    // Insert into DB




    var dbClient = new faunadb.Client({
    secret: process.env["faunaKey"],
    domain: 'db.fauna.com', // Adjust if you are using Region Groups
    })

        

    await dbClient.query(
            q.Create(q.Collection("houseRecords"), {
              data: {
                houseId: houseId,
                owner: standby_wallet.classicAddress,
                address: res.selectHouseNFTPropertyValue,
                yearBuilt: res.selectHouseNFTYear,
                sqft: res.selectHouseNFTSqFt,
                imageURL: res.imageURL,
                houseNFTokenID: nfts.result.account_nfts[nfts.result.account_nfts.length-1].NFTokenID
              },
            })
      )




    
    return Response.json({ houseId: houseId })
}