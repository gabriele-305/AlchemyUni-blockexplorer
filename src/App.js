import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import Home from "./component/home";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Address from "./component/address";
import Transaction from "./component/transaction";
import Block from "./component/block";
import Nft from "./component/nft";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/address" element={<Address />}></Route>
        <Route path="/transaction" element={<Transaction />}></Route>
        <Route path="/block" element={<Block />}></Route>
        <Route path="/nft" element={<Nft />}></Route>
      </Routes>
    </div>
  );
}

export default App;
