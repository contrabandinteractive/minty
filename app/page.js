"use client"; // This is a client component

import Image from 'next/image'

import { useState, useEffect } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  Select,
  Option
} from "@material-tailwind/react";

import clsx from 'clsx';

import { Questrial } from '@next/font/google';

export const text = Questrial({
  subsets: ['latin'],
  weight: ['400'],
});



export default function Home({searchParams}) {

  

  const [openNav, setOpenNav] = useState(false);
  const [sellerAddress,setSellerAddress] = useState("");
  const [sellerSecret,setSellerSecret] = useState("");
  const [buyerAddress,setBuyerAddress] = useState("");
  const [buyerSecret,setBuyerSecret] = useState("");
  const [loanOfficer1Address,setLoanOfficer1Address] = useState("rpQZYpNpxHdjtxwZ3vEetUYJ2TQeaPf6Av");
  const [loanOfficer1Secret,setLoanOfficer1Secret] = useState("sEdTRboni4AkPtquH8eCNdsU3TaBBvW");
  const [loanOfficer2Address,setLoanOfficer2Address] = useState("rNDUMVD4VtkG63XKCD5TZPFPtnZy82UrqH");
  const [loanOfficer2Secret,setLoanOfficer2Secret] = useState("sEdSCcs2UEZGX77fM2qRwBw6J8jZYSp");
  const [loanOfficer3Address,setLoanOfficer3Address] = useState("rM1nRYkmxT4eptAxYECTpCjUKDfTc1wc4c");
  const [loanOfficer3Secret,setLoanOfficer3Secret] = useState("sEdSKZg4FUjez6DJ2J1jW1yaW97WFfG");

  const [loanApprovalStatus, setLoanApprovalStatus] = useState(0);
  const [mintStatus,setMintStatus] = useState(0);
  const [mintStatus2,setMintStatus2] = useState(0);
  const [currentPage,setCurrentPage] = useState("home");
  const [houseNFTID,setHouseNFTID] = useState("");
  const [nftSellPrice,setNftSellPrice] = useState("");
  const [allHousesResult,setAllHousesResult] = useState("");
  const [allLoansResult,setAllLoansResult] = useState("");
  const [allOffersResult,setAllOffersResult] = useState("");
  const [currentHouseID,setCurrentHouseID] = useState("");
  const [currentHouseAddress,setCurrentHouseAddress] = useState("");
  const [submitBidAmount,setSubmitBidAmount] = useState("");
  const [currentAskingPrice,setCurrentAskingPrice] = useState("");
  const [takeOfferStatus,setTakeOfferStatus] = useState(0);
  const [conditionalPropertyNFTID,setConditionalPropertyNFTID] = useState("");

  const [sellerCredsVisible,setSellerCredsVisible] = useState(1);
  const [buyerCredsVisible,setBuyerCredsVisible] = useState(1);

  const [selectHouseNFTPropertyValue, setSelectHouseNFTPropertyValue] = useState("710 Steiner");
  const [selectHouseNFTSqFt, setSelectHouseNFTSqFt] = useState("1,976 sqft");
  const [selectHouseNFTYear, setSelectHouseNFTYear] = useState("1894");
  const [selectHouseNFTImg, setSelectHouseNFTImg] = useState("images/properties/1.png");


  const onHouseNFTPropertyValueChange = (event) => {
    const value = event;

    switch(value){
      case "710 Steiner":
        setSelectHouseNFTPropertyValue('710 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('1894');
        setSelectHouseNFTImg('images/properties/1.png');
      break;

      case "712 Steiner":
        setSelectHouseNFTPropertyValue('712 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('1898');
        setSelectHouseNFTImg('images/properties/2.png');
      break;

      case "714 Steiner":
        setSelectHouseNFTPropertyValue('714 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('1898');
        setSelectHouseNFTImg('images/properties/3.png');
      break;

      case "716 Steiner":
        setSelectHouseNFTPropertyValue('716 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('1898');
        setSelectHouseNFTImg('images/properties/4.png');
      break;

      case "718 Steiner":
        setSelectHouseNFTPropertyValue('718 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('1898');
        setSelectHouseNFTImg('images/properties/5.png');
      break;

      case "720 Steiner":
        setSelectHouseNFTPropertyValue('720 Steiner');
        setSelectHouseNFTSqFt('1,976 sqft');
        setSelectHouseNFTYear('18982');
        setSelectHouseNFTImg('images/properties/6.png');
      break;
    }

    setSelectHouseNFTPropertyValue(value);
    console.log('changed! '+event);
  };
 
  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  useEffect(() => {
    if(searchParams.houseId){
      switchPage('viewHouse');
    }
  }, []);


  const getAllHouses = async () => {
    console.log('Getting all houses...');
    var endpoint = '/api/getListings'

    const data = {
        ownerId: houseNFTID
    }
    const JSONdata = JSON.stringify(data)
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    const allHousesResultList = result;
    setAllHousesResult(allHousesResultList);
  }

  useEffect(() => {
    getAllHouses();
  }, [])

  const getLoans = async () => {

    var endpoint = '/api/getLoans'

    const data = {
        buyerAddress: buyerAddress
    }
    const JSONdata = JSON.stringify(data)
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    const allLoansResult = result;
    setAllLoansResult(allLoansResult);
    //console.log(allHousesResult);
  }

  useEffect(() => {
    getLoans();
  }, [])

  const getOffers = async () => {
    console.log('Getting offers...');
    var endpoint = '/api/getOffers'

    const data = {
        buyerAddress: buyerAddress
    }
    const JSONdata = JSON.stringify(data)
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    const allOffersResult = result;
    setAllOffersResult(allOffersResult);
  }

  useEffect(() => {
    getOffers();
  }, [])

  const switchPage = async (thePage) => {
    getAllHouses();
    getLoans();
    getOffers();
    setCurrentPage(thePage);
  }

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className={clsx("flex items-center", text.className)} onClick={() => switchPage("home")}>
          Home
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className={clsx("flex items-center", text.className)} onClick={() => switchPage("seller")}>
          Create Listing
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className={clsx("flex items-center", text.className)} onClick={() => switchPage("buyer")}>
          All Listings
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className={clsx("flex items-center", text.className)} onClick={() => switchPage("seeOffers")}>
          Seller Admin
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className={clsx("flex items-center", text.className)} onClick={() => switchPage("loanOfficer")}>
          Loan Officer Admin
        </a>
      </Typography>
    </ul>
  );

  const mintHouseNFT = async () => {

    setMintStatus(1);
    setSellerCredsVisible(0);

    const data = {
      sellerAddress: sellerAddress,
      sellerSecret: sellerSecret,
      selectHouseNFTPropertyValue: selectHouseNFTPropertyValue,
      selectHouseNFTYear: selectHouseNFTYear,
      selectHouseNFTSqFt: selectHouseNFTSqFt,
      imageURL: selectHouseNFTImg
    }
    console.log('Sending the following: ');
    console.log(data);
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/mintHouseNFT'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    setHouseNFTID(result.houseId);
    
   console.log(result);
   setMintStatus(2);
  }

  const mintConditionalHouseNFT = async () => {

    setMintStatus(1);

    const data = {
      sellerAddress: sellerAddress,
      sellerSecret: sellerSecret,
      selectHouseNFTPropertyValue: selectHouseNFTPropertyValue,
      selectHouseNFTYear: selectHouseNFTYear,
      selectHouseNFTSqFt: selectHouseNFTSqFt,
      nftSellPrice: nftSellPrice,
      houseId: houseNFTID
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/mintConditionalHouseNFT'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    setConditionalPropertyNFTID(result.nftId);
    
    console.log("Conditional Property NFT ID:"+result.nftId);
    setMintStatus(3);
  }

  const makeOffer = async (houseId,houseAddress) => {
    setCurrentHouseID(houseId);
    setCurrentHouseAddress(houseAddress);
    setCurrentPage("makeOffer");
  }

  const mintDocumentNFT = async () => {

    setMintStatus2(1);
    setBuyerCredsVisible(0);

    const data = {
      buyerAddress: buyerAddress,
      buyerSecret: buyerSecret
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/mintDocumentNFT'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    
   console.log(result);
   setMintStatus2(2);
  }

  const approveLoan = async (loanId) => {

    setLoanApprovalStatus(1);

    const data = {
      loanId: loanId,
      houseId: currentHouseID,
      loanOfficer1Address: loanOfficer1Address,
      loanOfficer2Address: loanOfficer2Address,
      loanOfficer3Address: loanOfficer3Address,
      loanOfficer1Secret: loanOfficer1Secret,
      loanOfficer2Secret: loanOfficer2Secret,
      loanOfficer3Secret: loanOfficer3Secret
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/multiSign'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    
   console.log(result);
   setCurrentAskingPrice(result.askingPrice);
   setLoanApprovalStatus(2);
   setMintStatus2(3);
  }

  const acceptCurrentOffer = async (thehouseId) => {

    setLoanApprovalStatus(1);

    const data = {
      houseId: thehouseId,
      buyerAddress: buyerAddress,
      buyerSecret: buyerSecret
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/acceptCurrentOffer'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    
    console.log(result);
    setLoanApprovalStatus(3);
  }

  const submitDifferentBid = async (thehouseId,bidAmount) => {
    
    setLoanApprovalStatus(1);

    const data = {
      houseId: thehouseId,
      bidAmount: bidAmount,
      buyerAddress: buyerAddress,
      buyerSecret: buyerSecret,
      property: currentHouseAddress
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/createBuyOffer'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    
   console.log(result);
   setLoanApprovalStatus(4);

  }

  const takeOffer = async (theOfferId) => {

    setTakeOfferStatus(1);

    const data = {
      offerId: theOfferId,
      buyerAddress: buyerAddress,
      buyerSecret: buyerSecret,
      sellerAddress: sellerAddress,
      sellerSecret: sellerSecret,
      loanOfficer1Address: loanOfficer1Address,
      loanOfficer1Secret: loanOfficer1Secret,
      conditionalPropertyNFTID: conditionalPropertyNFTID
    }
    const JSONdata = JSON.stringify(data)

    const endpoint = '/api/takeOffer'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //setHouseNFTID(result.houseId);
    
   console.log(result);
   setTakeOfferStatus(2);

  }

  

  

  return (
    <main className="flex flex-col items-center justify-between p-24 bg-green">
      <div className="text-center">
        <img className="text-center mx-auto my-0" src="images/mintylogo.png"/>
        <h2 className={clsx("pb-10 text-black", text.className)}>A Platform for Real Estate Transactions in the Age of CBDCs.</h2>

        <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 mb-10">
          <div className="container mx-auto flex items-center justify-between text-blue-gray-900">

            <div className="hidden lg:block">{navList}</div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
          <MobileNav open={openNav}>
            <div className="container mx-auto">
              {navList}
            </div>
          </MobileNav>
        </Navbar>
      </div>

      {currentPage=="home" &&                   
        <div className="text-center" id="homepage">
          <Card className="w-96 mb-5">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Welcome!
              </Typography>
              <p className={clsx("", text.className)}>Please choose an option from the top menu.</p>

              <p className={clsx("pt-2", text.className)}><em>If this is your first time using the app, please choose "Create Listing" from the top.</em></p>
            
            </CardBody>
          </Card>
        </div>
      }

      {currentPage=="seeOffers" && takeOfferStatus==0 &&
       
        <div className="text-center" id="homepage">

          { allOffersResult?.houseList?.map((item) => {
                return <Card className="w-96 mb-5">
            <CardBody>
              <p className="text-xs">Bidder: {item.bidder}</p>
              <p>Property: {item.address}</p>
              <p>Offer Amount: {item.amount}</p>
              <Button className={clsx("mt-5 bg-green-600", text.className)} onClick={() => takeOffer(item.offerId)}>Take Offer</Button>
            </CardBody>
          </Card> }) }



        </div>
       
      }

      {currentPage=="seeOffers" && takeOfferStatus==1 &&
       
       <div className="text-center" id="homepage">

        <p>Please wait...</p><Spinner color="green" className="text-center content-center self-center" />

       </div>
      
      }

      {currentPage=="seeOffers" && takeOfferStatus==2 &&
       
       <div className="text-center" id="homepage">

        <p className="text-black pb-5">You have accepted the offer! Your property has been sold.</p>

        <p className="text-black pb-5"><em>(Behind the scenes, the Conditional Property NFT has been burned.)</em></p>

       </div>
      
      } 

      {currentPage=="viewHouse" &&                   
        <div className="text-center" id="homepage">
          <Card className="w-96 mb-5">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                House Info
              </Typography>
              <p>This page will show info on the property - coming soon...</p>
            
            </CardBody>
          </Card>
        </div>
      }

     {currentPage=="makeOffer" &&                   
        <div className="text-center" id="makeofferpage">
          <h2 className="text-black pb-5 text-xl">Make Offer</h2>
          <p className="text-black pb-5">Make an offer to buy <strong>{currentHouseAddress}</strong>.</p>

          {buyerCredsVisible==1 &&
          <Card className="w-96 mb-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Buyer Credentials
                </Typography>
                <p className="pb-2"><a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html" className="underline">Generate a Testnet account</a> and add your credentials below.</p>
                
                <div className="mb-2">
                  <Input size="lg" label="Address" color="green" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Input size="lg" label="Secret" color="green" value={buyerSecret} onChange={(e) => setBuyerSecret(e.target.value)} />
                </div>
              </CardBody>
            </Card>
          }

            <Card className="w-96 mb-5">
              <CardBody>
                {mintStatus2==0 &&
                <>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    Mint Document NFT
                  </Typography>
                  <p className="p2-5 pb-2">Please mint a Document NFT in order to receive a loan.</p>
                  <p className="p2-5 pb-2"><em>(The purpose of the Document NFT is to share information on your debt to income ratio, credit history, financial assets, and employment history with the bank.)</em></p>

                  <Button className="mt-5 bg-green-600" onClick={mintDocumentNFT}>Mint Document NFT</Button>
                </>
                }
                {mintStatus2==1 &&
                <>
                <p>Please wait...</p><Spinner color="green" className="text-center content-center self-center" />
                </>
                }
                {mintStatus2==2 &&
                <>
                <p className="p2-5 pb-2">Your Document NFT has been minted! We now need to have approval from all Loan Officers.</p>
                <p className="p2-5 pb-2"><em>(For this demo, choose "Loan Officer Admin" from the top navigation to have the Loan Officers approve your loan.)</em></p>
                </>
                }
                {mintStatus2==3 &&
                <p className="p2-5 pb-2">Your loan has been pre-approved! You can now submit a bid or take the current offer.</p>
                }
              </CardBody>
            </Card>


        </div>
      }

      {currentPage=="loanOfficer" &&                   
        <div className="text-center" id="homepage">
          

          {loanApprovalStatus==0 &&
          <>
          
          <p className="text-black pb-5">Loan approval creates a Signer List and requires the Loan Officers to approve.</p>
          <p className="text-black pb-5">It leverages the Multi-Signing feature of the XRPL.</p>
          <p className="text-black pb-5">The credentials for each Loan Officer have already been generated for you using the Testnet faucet, but you may replace these as you wish.</p>
          <div className="flex flex-wrap">
          
          <Card className="w-96 mb-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Loan Officer 1 - Credentials
                </Typography>
                <p className="pb-2"><a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html" className="underline">Generate a Testnet account</a> and add your credentials below.</p>
                
                <div className="mb-2">
                  <Input size="lg" label="Address" color="green" value={loanOfficer1Address} onChange={(e) => setLoanOfficer1Address(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Input size="lg" label="Secret" color="green" value={loanOfficer1Secret} onChange={(e) => setLoanOfficer1Secret(e.target.value)} />
                </div>
              </CardBody>
          </Card>

          <Card className="w-96 mb-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Loan Officer 2 - Credentials
                </Typography>
                <p className="pb-2"><a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html" className="underline">Generate a Testnet account</a> and add your credentials below.</p>
                
                <div className="mb-2">
                  <Input size="lg" label="Address" color="green" value={loanOfficer2Address} onChange={(e) => setLoanOfficer2Address(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Input size="lg" label="Secret" color="green" value={loanOfficer2Secret} onChange={(e) => setLoanOfficer2Secret(e.target.value)} />
                </div>
              </CardBody>
          </Card>

          <Card className="w-96 mb-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Loan Officer 3 - Credentials
                </Typography>
                <p className="pb-2"><a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html" className="underline">Generate a Testnet account</a> and add your credentials below.</p>
                
                <div className="mb-2">
                  <Input size="lg" label="Address" color="green" value={loanOfficer3Address} onChange={(e) => setLoanOfficer3Address(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Input size="lg" label="Secret" color="green" value={loanOfficer3Secret} onChange={(e) => setLoanOfficer3Secret(e.target.value)} />
                </div>
              </CardBody>
          </Card>
          </div>
          <div className="w-full pt-2">
          <h2 className="text-black pb-5">Pending Loans: </h2>
          { allLoansResult?.loanList?.map((item) => {
                return <Card className="myHouseCard m-10 w-[300px]">
                

                
                <CardBody className="text-center">
                    <p className="pt-2 pb-2 text-center text-xs">
                    Buyer: {item.buyer}
                    </p>
                    <p className="pt-2 pb-2">
                    Status: {item.status}
                    </p>
                    <Button className="mt-5 bg-green-600" onClick={() => approveLoan(item.loanId)}>Approve</Button>
                </CardBody>
            </Card>
              }) }
        </div>
        </>
        }
        {loanApprovalStatus==1 &&
          <>
          <p className="text-black">Please wait...</p> <Spinner color="green" className="text-center content-center self-center" />
          </>
        }
        {loanApprovalStatus==2 &&
          <>
          <p className="text-black">Loan has been pre-approved!</p>
          <p className="pt-2 text-black"><a className="underline text-black" target="_blank" href={"https://testnet.xrpl.org/accounts/"+loanOfficer1Address}>See your transactions here</a>.</p>

          <Card className="w-96 mb-5 mt-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Submit a Bid
                </Typography>

                <div className="mb-2 mt-2">
                  <p className="p-2">Enter your bid amount to buy <strong>{currentHouseAddress}</strong>:</p>
                  <Input size="lg" label="Submit a bid (XRP)" color="green" value={submitBidAmount} onChange={(e) => setSubmitBidAmount(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Button className="mt-5 bg-green-600" onClick={() => submitDifferentBid(currentHouseID,submitBidAmount)}>Submit Bid</Button>
                </div>
              </CardBody>
          </Card>

          </>
        }
        {loanApprovalStatus==3 &&
          <>

          <Card className="w-96 mb-5">
              <CardBody>
              <p className="text-black">Congrats! You are now the owner of the house.</p>
              <p className="pt-2 text-black"><a className="underline text-black" target="_blank" href={"https://testnet.xrpl.org/accounts/"+buyerAddress}>See your transactions here</a>.</p>
              </CardBody>
          </Card>

          </>
        }
        {loanApprovalStatus==4 &&
          <>

          <Card className="w-96 mb-5">
              <CardBody>
              <p className="text-black">Your bid has been created!</p>
              <p className="text-black pt-3"><em>(See the "Seller Admin" page to view all offers.)</em></p>
              </CardBody>
          </Card>

          </>
        }

        </div>
      }

      {currentPage=="buyer" &&                   
        <div className="text-center" id="homepage">
          <h2 className="text-black pb-5">Listings</h2>

          <div className="flex flex-wrap">
          { allHousesResult?.houseList?.map((item) => {
                return <Card className="w-[300px] m-[20px] myHouseCard">
                

                
                <CardBody className="text-center">
                    <img
                    src={item.imageURL}
                    className="w-full"
                    />
                    <Typography variant="h5" className="mb-2">
                    {item.address}
                    </Typography>
                    <p className="pt-2 pb-2">
                    ID: {item.houseId}
                    </p>
                    <p className="pt-2 pb-2">
                    Owner: <span className="text-xs">{item.owner}</span>
                    </p>
                    <p className="pt-2 pb-2 font-bold">
                    {item.status} {item.lastSold}
                    </p>
                    {item.status=="For Sale" &&
                      <>
                      <p className="pt-2 pb-2 font-bold text-xl">
                      {item.askingPrice} XRP
                      </p>
                      <Button className="mt-5 bg-green-600" onClick={() => makeOffer(item.houseId,item.address)}>Buy</Button>
                      </>
                    }
                </CardBody>
            </Card>
              }) }
          </div>


        </div>
      }

      {currentPage=="seller" &&          
          <div className="text-center" id="sellerpage">

            {sellerCredsVisible==1 &&
            <Card className="w-96 mb-5">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Seller Credentials
                </Typography>
                <p className="pb-2"><a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html" className="underline">Generate a Testnet account</a> and add your credentials below.</p>
                
                <div className="mb-2">
                  <Input size="lg" label="Address" color="green" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} />
                </div>
                <div className="mb-2">
                  <Input size="lg" label="Secret" color="green" value={sellerSecret} onChange={(e) => setSellerSecret(e.target.value)} />
                </div>
              </CardBody>
            </Card>
            }
          
          
          <Card className="w-96">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Mint Property NFT
              </Typography>
              <Typography>
                Start here! Select a property and mint your Property NFT:
              </Typography>
              
            </CardBody>
            <CardFooter className="pt-0 text-center content-center">
              {mintStatus==0 &&
                <>
                <div className="w-full">
                <Select label="Select Property" className="mb-5 pb-5" onChange={onHouseNFTPropertyValueChange}>
                  <Option value="710 Steiner">710 Steiner</Option>
                  <Option value="712 Steiner">712 Steiner</Option>
                  <Option value="714 Steiner">714 Steiner</Option>
                  <Option value="716 Steiner">716 Steiner</Option>
                  <Option value="718 Steiner">718 Steiner</Option>
                  <Option value="720 Steiner">720 Steiner</Option>
                </Select>
                <figure className="relative h-full w-full pt-5">
                  <img
                    className="h-full w-full rounded-xl"
                    src={selectHouseNFTImg}
                    alt="nature image"
                  />
                  <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <div>
                      <Typography variant="h5" color="blue-gray">
                        {selectHouseNFTPropertyValue}
                      </Typography>
                      <Typography color="gray" className="mt-2 font-normal text-left">
                        {selectHouseNFTSqFt}<br></br>
                        Year Built: {selectHouseNFTYear}
                      </Typography>
                    </div>
                  </figcaption>
                </figure>

                </div>
                <Button className="mt-5 bg-green-600" onClick={mintHouseNFT}>Mint Property NFT</Button>
                </>
              }
              {mintStatus==1 &&
                <>
                <p>Please wait...</p><Spinner color="green" className="text-center content-center self-center" />
                </>
              }
              {mintStatus==2 &&
                <>
                <p>Your Property NFT has been minted!</p>
                <p className="pt-2"><a className="underline" target="_blank" href={"https://testnet.xrpl.org/accounts/"+sellerAddress}>See your transactions here</a>.</p>
                <p className="pt-2">Property ID: {houseNFTID}</p>
                <h3>Conditional Property NFT</h3>
                <p>It is now time to mint your Conditional Property NFT.</p>
                <p className="pt-2">Please enter your desired selling price:</p>
                <div className="mb-2">
                  <Input size="lg" label="XRP Price" color="green" value={nftSellPrice} onChange={(e) => setNftSellPrice(e.target.value)} />
                </div>
                <Button className="mt-5 bg-green-600" onClick={mintConditionalHouseNFT}>Mint Conditional Property NFT</Button>
                </>
              }
              {mintStatus==3 &&
              <>
              <p>The Conditional Property NFT has been minted!</p>
              <p className="pt-2"><a className="underline" target="_blank" href={"https://testnet.xrpl.org/accounts/"+sellerAddress}>See your transactions here</a>.</p>
              <p className="pt-2"></p>
              <p className="pt-2"><em>(To interact as the "Buyer", navigate to the "All Listings" page.)</em></p>
              </>
              }
            </CardFooter>
          </Card>

        </div>
      }
      
    </main>
  )
}
