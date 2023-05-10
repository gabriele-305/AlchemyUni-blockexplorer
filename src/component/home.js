import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "../App.css";
import { Link } from "react-router-dom";
import Address from "./address";

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

const Home = () => {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [hash, setHash] = useState("");
  const [latest, setLatest] = useState([]);
  const [listLatest, setListLatest] = useState([]);
  // console.log(latest);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

  useEffect(() => {
    async function getBlock(number) {
      setBlock(await alchemy.core.getBlock(number));

      let tmp = [];
      for (let i = 1; i <= 20; i++) {
        let bl = await alchemy.core.getBlock(blockNumber - i);
        tmp.push(bl);
      }
      setLatest(tmp);
    }

    getBlock(blockNumber);
  }, [blockNumber]);

  useEffect(() => {
    let input = document.getElementById("myInput");
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("search").click();
      }
    });
  }, []);

  useEffect(() => {
    if (latest !== undefined) {
      let tmp = latest.map((blocktmp) => (
        <div className="latest-box">
          <div className="latest-num">
            Block number:{" "}
            {blocktmp ? (
              <Link
                to="/block"
                className="address"
                state={{ hash: blocktmp.number, block: block }}
              >
                {blocktmp.number}
              </Link>
            ) : (
              "0"
            )}
          </div>
          <div className="latest-hash">
            Block hash:{" "}
            {blocktmp ? (
              <Link
                to="/block"
                className="address"
                state={{ hash: blocktmp.number, block: block }}
              >
                {blocktmp.hash}
              </Link>
            ) : (
              "0"
            )}
          </div>
        </div>
      ));
      setListLatest(tmp);
    }
  }, [latest]);

  const setValue = (e) => {
    setHash(e.target.value);
  };

  return (
    <>
      <div className="main">
        <img src="/was.png" className="logo"></img>
        <div className="block">
          <div>
            <p>
              Block Number:{" "}
              <Link
                to="/block"
                className="address"
                state={{ hash: blockNumber, block: block }}
              >
                {blockNumber}
              </Link>
            </p>
          </div>
          <div>
            <p>
              Block hash:{" "}
              {block ? (
                <Link
                  to="/block"
                  className="address"
                  state={{ hash: block.hash, block: block }}
                >
                  {block.hash}
                </Link>
              ) : (
                "Loading..."
              )}
            </p>
          </div>
          <div>
            <div>
              <p>Block timestamp: {block ? block.timestamp : "Loading..."}</p>
            </div>
            <div>
              <p>Block difficulty: {block ? block.difficulty : "Loading..."}</p>
            </div>
          </div>
          <div>
            <div>
              <p>
                Gas limit: {block ? block.gasLimit.toString() : "Loading..."}
              </p>
            </div>
            <div>
              <p>Gas used: {block ? block.gasUsed.toString() : "Loading..."}</p>
            </div>
          </div>
        </div>
        <div className="in">
          <input
            id="myInput"
            type="text"
            placeholder="insert address/block num/tx hash"
            onChange={setValue}
          ></input>
          <Link
            className="button"
            id="search"
            to={`/${
              hash.length == 66 &&
              hash.substring(0, 2) == "0x" &&
              hash[2] != "0"
                ? "transaction"
                : ""
            }${
              hash.length == 42 && hash.substring(0, 2) == "0x" ? "address" : ""
            }${
              (hash.length == 8 && hash.substring(0, 2) == "0x") ||
              hash.length == 8
                ? "block"
                : ""
            }`}
            state={{ hash: hash, block: blockNumber }}
          >
            SEARCH
          </Link>
        </div>
        <div className="latest">
          <h3>Latest 20 blocks</h3>
          {listLatest ? (
            listLatest.map((item) => {
              let bn = item.props.children[0].props.children[1];
              if (bn === 0) return <div className="latest-box">Loading...</div>;
              else return item;
            })
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
