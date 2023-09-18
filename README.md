

# Minty


## Inspiration 
In the age of CBDCs, we envision a few key principles for user experience in all applications: automation, self-service, fast settlement, deep liquidity, wide availability of funding sources, and immutability. 

Minty’s goal is to simplify and accelerate the real estate transaction process, providing an alternative to the existing infrastructure by leveraging the XRPL.  

## What it does

Minty is a real estate transactions platform enabled by the XRPL. It incorporates three different functions in one single platform: 
A property record database that tracks and updates the title information of each property in real time. 
A transaction application that enables stakeholders to list, bid, offer and accept properties. 
A loan service function that allows buyers to apply for Loan Pre-approvals and secure loans from commercial banks. 

## Premise 

For Minty to function properly, we assume the following to be the operating environment: 
The CBDC is issued/minted by the commercial banks licensed by the central bank. 
Licenced banks issue their own digital dollars branded by the issuing banks. 
The Central Bank does not interact with retail users but only with banks. 
Commercial banks serve the following purposes: 
Issuing branded CBDCs. 
Passing on the interests earned for all branded CBDC holders. For example, all holders with the Citi branded CBDC will accrue interest in the form of Citi branded CBDCs. 
Providing loans 
Legal protection to use NFTs for real estate transactions
Our database is (or is synced with) the government title database
KYC enabled identity solution only permits the recorded owner(s
) to mint Property or Conditional Property NFTs


## Key concepts

The Property Record Database tracks all the information on a single property such as its current and past owners, any easements or encumbrances on the property and so on. It is on a separate ledger that could be a dedicated permissioned sidechain of the XRPL. 
A Property NFT is the equivalent of a deed. Holder of the Property NFT is the owner of the property. It points to the record in Minty’s Property Record Database which is the single source of truth on all the properties - their owners, past owners, any money owed on it, liens, probate, or judgments etc.
A Conditional Property NFT is used by the seller to facilitate the bidding process. It can only be issued by the Property NFT holder/owner. It can be customized by the seller to contain all the information of the property (sq ft, year built, etc.) + pictures + current appraisal etc.. We can loosely compare the Conditional Property NFT to information listed on Zillow or any MLS for a specific property. 
A Loan Pre-approval NFT is minted by commercial banks only. It specifies the maximum principal amount the buyer can secure from the bank, and other details such as interest rate and duration of the loan . 



## How it works

The platform has a database that tracks the ownership of all real estate properties. This database serves as a title database.  For each property, it includes all the land records information - a report summarizing the property’s past owners, plus any money owed on it, liens, probate, or judgments. After every successful transaction, the database is updated to reflect the most current information. 

Owners of the properties are able to mint Conditional Property NFTs, list them for sale (for 1% of the total listing price of the property), accept bids and choose the winning bids.  After choosing the winning bid, the owner offers Property NFT to the buyer for the remainder of the purchasing price (99%). 

If the purchaser fails to secure a loan and pay the remaining 99% of the purchase price within 30 days, the Conditional Property NFT loses its validity. The Property NFT offer can be canceled and the Property NFT owner is not obligated to return the 1% payment and can issue another Conditional Property NFT on the market. 

Bidders are able to submit customized bids for listed properties. They are also able to secure a Loan Pre-approval NFT from a commercial bank prior to bidding. If successful in bidding, the bidder/buyer can get a loan from the commercial bank to purchase the property. 

Commercial banks are able to review Loan Pre-approval applications and grant Loan Pre-approval NFTs. After the Loan Pre-approval NFT holder/buyer succeeds in bidding, the commercial bank can review the bidder’s loan application and grant or reject loans on the platform. 


## How we built it

The demo for Minty was built using Next.js, taking advantage of the xrpl.js library as well as Fauna for the internal database. It is currently hosted on Vercel, which is optimized for Next.js projects. The Fauna database serves as the title database. 

Our app demonstrates various NFToken operations including minting, creating buy/sell offers, and burning. For demo purposes, the app allows the user to quickly go through a condensed version of the process of listing a property for sale, as well as interacting as the buyer and the loan officer in each step. The demo allows the user to quickly switch back and forth to act as the buyer or the seller (and even the loan officers). The app uses Testnet accounts that can be generated by using the Testnet faucet provided by the XRPL.

The demo also uses the ledger’s native ability to generate a SignerList and creates a multi-signed transaction during the “Loan Officer” portion. 2 out of 3 Loan Officers must approve the loan to the buyer.

In order to provide an easy-to-access interface for demo purposes, no authentication is required. The app uses React state variables to store Testnet wallet information (so please avoid refreshing until you are finished). The main portion of the app lives within a single page/file which passes and receives data to multiple APIs. An individual API has been created for each main function such as minting, accepting offers, retrieving listings, etc.

## Challenges we ran into
The ability to bundle transactions (please see my reply -Mark)
I was unfamiliar with the process of creating a multi-signing transaction, so this piece where the loan is pre-approved by signing a transaction with the Loan Officer accounts took some additional research to understand the correct way to build and submit these transactions on the ledger.
It was a challenge to narrow down the functionality that we wanted to present in the demo. The final vision for Minty is robust and has many fine details, but given that we needed to develop an app under the provided time constraints, our goal was to show a very basic proof of concept that demonstrated various operations on the XRPL Testnet.
The demo app is essentially a one page application that uses several API routes. We wanted the user to be able to interact under the different roles (buyer, seller, etc), so constructing the app in this way allowed us to demonstrate this functionality without having to force the user to log in and out of accounts.
Accomplishments that we are proud of
Minty closely mirrors the way real estate transactions are carried out in the US. 
The separation between a property record database (title) and the Property NFT (digital deed)
The creation of the property record database that serves as the single source of truth regarding all property information
The creation of two-tiered NFTs - the Property NFT for the purpose of a digital deed; the Conditional Property NFT for the purpose of listing and choosing the winning bid
The creation of Loan Pre-approval NFT by commercial banks to issue loan pre-approvals. 
We have successfully implemented advanced ledger operations including multi-sig. We have created a buying / selling / bidding system using the ledger.
What we learned
Regulatory environment is key for blockchain technology adoption. To improve services provided, we not only need technology infrastructure but also legal certainty on how the process should be handled with legal protection. Decentralized IDs and tokenization standards are two examples. 
Technology infrastructure build-out requires wide stakeholders engagements. In reality, Minty most likely would be three separate applications that interoperate seamlessly. The property record database should be its own government database powered/secured by blockchain technology. The transaction platform is its own commercial application. The borrowing and lending platform is part of a larger banking application managed by the commercial banks. 
We learned a substantial amount about the xrpl.js library and how to most efficiently create and sign transactions on the ledger.

## What’s next for Minty
Three directions: 

We have a great relationship with Bloqable, a company that has designed and implemented a land record database powered by blockchain technology. We could partner with them to design a permissioned XRPL sidechain to track property records. 

We could continue to build out the transaction platform and fully accommodate all scenarios of real estate transactions. 

We are also keenly interested in designing a commercial banking app that incorporates functions such as providing interest income to CBDC holders, loan provisioning, refinancing, HELOC and creation of tokenized mortgage-backed security, etc.. 


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.