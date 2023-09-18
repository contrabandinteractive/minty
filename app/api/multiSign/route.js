const xrpl = require("xrpl")
import {multisign} from 'xrpl';
import { Client as FaunaClient } from "faunadb"
var faunadb = require('faunadb');
var q = faunadb.query;
var askingPrice;

export async function POST(request, { params }) {

    askingPrice = "";
    const res = await request.json();


    const standby_wallet1 = xrpl.Wallet.fromSeed(res.loanOfficer1Secret)
    const standby_wallet2 = xrpl.Wallet.fromSeed(res.loanOfficer2Secret)
    const standby_wallet3 = xrpl.Wallet.fromSeed(res.loanOfficer3Secret)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const signerListSet = {
      TransactionType: 'SignerListSet',
      Account: standby_wallet1.classicAddress,
      SignerEntries: [
        {
          SignerEntry: {
            Account: standby_wallet2.classicAddress,
            SignerWeight: 1,
          },
        },
        {
          SignerEntry: {
            Account: standby_wallet3.classicAddress,
            SignerWeight: 1,
          },
        },
      ],
      SignerQuorum: 2,
    }
  
    const signerListResponse = await client.submit(signerListSet, {
      wallet: standby_wallet1,
    })
    console.log('SignerListSet constructed successfully:')
    console.log(signerListResponse)

    const transactionJson2 = {
      "TransactionType": "NFTokenMint",
      "Account": standby_wallet1.classicAddress,
      "URI": xrpl.convertStringToHex("Loan Pre-Approval NFT"),
      "Flags": parseInt(8),
      "TransferFee": parseInt(0),
      "NFTokenTaxon": 0,
      "Sequence": signerListResponse.result.tx_json.Sequence + 1,
      "SigningPubKey": "",
      "Fee": "100"
    }

    const { tx_blob: tx_blob1 } = standby_wallet2.sign(transactionJson2, true);
    const { tx_blob: tx_blob2 } = standby_wallet3.sign(transactionJson2, true);
    const multisignedTx = multisign([tx_blob1, tx_blob2]);
    const submitResponse = await client.submit(multisignedTx);

    if (submitResponse.result.engine_result === 'tesSUCCESS') {
      console.log('The multisigned transaction was accepted by the ledger:')
      console.log(submitResponse)
      if (submitResponse.result.tx_json.Signers) {
        console.log(
          `The transaction had ${submitResponse.result.tx_json.Signers.length} signatures`,
        )
      }
    } else {
      console.log(
        "The multisigned transaction was rejected by rippled. Here's the response from rippled:",
      )
      console.log(submitResponse)
    }


      
    client.disconnect()

    // Insert into DB




    // Update with approved status
    // Look up House record in DB and update
    var dbClient = new faunadb.Client({
      secret: process.env["faunaKey"],
      domain: 'db.fauna.com', // Adjust if you are using Region Groups
     })

     let resultId;
     await dbClient.query(
         q.Paginate(q.Match(q.Index('getLoanByID'), res.loanId))
       )
       .then((ret) => resultId=ret.data[0].id)
       .catch((err) => console.error(
         'Error: [%s] %s: %s',
         err.name,
         err.message,
         //err.errors()[0].description,
     ));
    
    await dbClient.query(
      q.Update(
        q.Ref(q.Collection('loans'), resultId),
        {
          data: {
            status: 'Approved'
          },
        },
      )
    );


    // Get current offer price
    var dbClient2 = new faunadb.Client({
      secret: process.env["faunaKey"],
      domain: 'db.fauna.com', // Adjust if you are using Region Groups
     })

     let resultId2;
     await dbClient2.query(
         q.Paginate(q.Match(q.Index('searchById'), res.houseId))
       )
       .then((ret) => resultId2=ret.data[0].id)
       .catch((err) => console.error(
         'Error: [%s] %s: %s',
         err.name,
         err.message,
         //err.errors()[0].description,
     ));

     let matchingId;
            await dbClient2.query(
              q.Get(q.Ref(q.Collection('houseRecords'), resultId2))
            )
            .then((ret) => matchingId=ret)
            .catch((err) => console.error(
              'Error: [%s] %s: %s',
              err.name,
              err.message,
              err.errors()[0].description,
     ))

     askingPrice = matchingId.data.askingPrice;




    
    return Response.json({ askingPrice: askingPrice })
}