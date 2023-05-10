import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

import "./address.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const Address = () => {
  const location = useLocation();

  const [code, setCode] = useState();
  const [balance, setBalance] = useState();
  const [nonce, setNonce] = useState();
  const [latestTxSend, setLatestTxSend] = useState([]);
  const [latestTxReceive, setLatestTxReceive] = useState([]);
  const [deployer, setDeployer] = useState();
  const [nftContract, setNftContract] = useState(false);
  const [nftCount, setNftCount] = useState();
  const [tokenId, setTokenId] = useState(null);

  const [currentPageSend, setCurrentPageSend] = useState(1);
  const [itemPerPageSend, setItemPerPageSend] = useState(10);
  const [currentPageReceive, setCurrentPageReceive] = useState(1);
  const [itemPerPageReceive, setItemPerPageReceive] = useState(10);
  const [report, setReport] = useState([]);
  // console.log(report);

  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    async function getCode() {
      setCode(await alchemy.core.getCode(location.state.hash));

      if (code !== "0x") {
        const nfts = (
          await alchemy.nft.getNftsForContract(location.state.hash, {
            omitMetadata: true,
          })
        ).nfts;
        if (nfts.length > 0) {
          setNftContract(true);
          setNftCount(
            (await alchemy.nft.summarizeNftAttributes(location.state.hash))
              .totalSupply
          );
        }
      }
    }

    const tmp = report;
    tmp[location.state.hash] = report[location.state.hash]
      ? report[location.state.hash]
      : 0;
    setReport(tmp);
    getCode();
  }, []);

  useEffect(() => {
    async function getNonce() {
      setNonce(
        (await alchemy.core.getTransactionCount(location.state.hash)).toString()
      );
    }
    async function getBalance() {
      setBalance(
        Utils.formatEther(await alchemy.core.getBalance(location.state.hash))
      );
    }
    async function getLatestTxSend() {
      setLatestTxSend(
        (
          await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toBlock: location.state.block,
            fromAddress: location.state.hash,
            maxCount: 100,
            category: [
              "external",
              "internal",
              "erc20",
              "erc721",
              "erc1155",
              "specialnft",
            ],
          })
        ).transfers
      );
    }
    async function getLatestTxReceive() {
      setLatestTxReceive(
        (
          await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toBlock: location.state.block,
            toAddress: location.state.hash,
            maxCount: 100,
            category: [
              "external",
              "internal",
              "erc20",
              "erc721",
              "erc1155",
              "specialnft",
            ],
          })
        ).transfers
      );
    }
    async function getDeployer() {
      setDeployer(
        (
          await alchemy.core.findContractDeployer(location.state.hash)
        ).deployerAddress.toString()
      );
    }

    if (code === "0x") {
      getNonce();
    } else {
      getDeployer();
    }

    getBalance();
    getLatestTxSend();
    getLatestTxReceive();
  }, [code]);

  const update = (e) => {
    setTokenId(e.target.value);
  };

  const paginateSend = (pageNumber) => setCurrentPageSend(pageNumber);
  const paginateReceive = (pageNumber) => setCurrentPageReceive(pageNumber);

  const indexLastSend = currentPageSend * itemPerPageSend;
  const indexFirstSend = indexLastSend - itemPerPageSend;
  const currentSend = latestTxSend
    ? latestTxSend.reverse().slice(indexFirstSend, indexLastSend)
    : [];
  const indexLastReceive = currentPageReceive * itemPerPageReceive;
  const indexFirstReceive = indexLastReceive - itemPerPageReceive;
  const currentReceive = latestTxReceive
    ? latestTxReceive.reverse().slice(indexFirstReceive, indexLastReceive)
    : [];

  const pageNumberSend = [];
  const pageNumberReceive = [];
  for (let i = 1; i <= Math.ceil(latestTxSend.length / itemPerPageSend); i++) {
    pageNumberSend.push(i);
  }
  for (
    let i = 1;
    i <= Math.ceil(latestTxReceive.length / itemPerPageReceive);
    i++
  ) {
    pageNumberReceive.push(i);
  }

  const clickElement = (e) => {
    if (e.key === "Enter") document.getElementById("search").click();
  };

  return (
    <div className="mainAddress">
      <Link to="/" className="back">
        <FontAwesomeIcon
          icon={icon({ name: "house", style: "solid" })}
          size="lg"
          style={{ color: "#000000" }}
        />
      </Link>
      {report[location.state.hash] > 10 ? (
        <div className="alert">
          <strong>Warning!</strong> This address has been reported by multiple
          users, be careful before sign transaction!
        </div>
      ) : null}
      <div className="titleAddress">
        <h1>Address: {location.state.hash}</h1>
        <button
          className="report"
          onClick={() => {
            const tmp = report;
            tmp[location.state.hash] += 1;
            // console.log(report[location.state.hash]);
            setReport(tmp);
          }}
        >
          <FontAwesomeIcon
            icon={icon({ name: "triangle-exclamation", style: "solid" })}
            size="lg"
            style={{ color: "#b7db00" }}
          />
          Report address
        </button>
      </div>
      <div className="bodyAddress">
        <div>
          <h3>Balance: {balance !== null ? balance : "Loading..."}</h3>
        </div>
        {code === "0x" ? (
          <div>
            <h3>Nonce: {nonce ? nonce : "Loading..."}</h3>
          </div>
        ) : null}
        {code !== "0x" ? (
          <div className="deployer">
            <h3>
              Deployer:{" "}
              {deployer ? (
                <Link
                  className="address"
                  to="/address"
                  state={{ hash: deployer, block: location.state.block }}
                  onClick={refreshPage}
                >
                  {deployer}
                </Link>
              ) : (
                "Loading..."
              )}
            </h3>
          </div>
        ) : null}
        {nftContract ? (
          <div>
            <input
              id="myInput"
              className="tokenId"
              placeholder="insert nft's token ID"
              onChange={update}
              onKeyUp={(e) => clickElement(e)}
            ></input>
            {tokenId <= nftCount || tokenId === null ? (
              <Link
                id="search"
                to="/nft"
                className="button"
                state={{
                  hash: location.state.hash,
                  block: location.state.block,
                  tokenId: tokenId,
                }}
              >
                SEARCH
              </Link>
            ) : (
              <div className="red">invalid token ID</div>
            )}
          </div>
        ) : null}
        {code !== "0x" ? (
          <div className="code">
            <h3>Code:</h3>
            <div className="codeBody">{code}</div>
          </div>
        ) : null}
        <h3>Transaction</h3>
        <div className="txBox">
          <div className="txOut">
            <h3>Sent</h3>
            {latestTxSend ? (
              currentSend.map((item) => (
                <div className="tx">
                  <div className="txHash">
                    <Link
                      to="/transaction"
                      className="address"
                      state={{ hash: item.hash, block: location.state.block }}
                    >
                      {item.hash.slice(0, 6)}...
                      {item.hash.slice(item.hash.length - 6)}
                    </Link>
                  </div>
                  <div className="txBlock">
                    Block:{" "}
                    <Link
                      to="/block"
                      className="address"
                      state={{
                        hash: item.blockNum,
                        block: location.state.block,
                      }}
                    >
                      {item.blockNum}
                    </Link>
                  </div>
                  <div className="txTo">
                    To:&nbsp;
                    <Link
                      className="address"
                      to="/address"
                      state={{ hash: item.to, block: location.state.block }}
                      onClick={refreshPage}
                    >
                      {item.to}
                    </Link>
                  </div>
                  <div className="txFrom">
                    From:&nbsp;
                    <Link
                      className="address"
                      to="/address"
                      state={{ hash: item.from, block: location.state.block }}
                      onClick={refreshPage}
                    >
                      {item.from}
                    </Link>
                  </div>
                  <div className="txValue">
                    Value: {item.value ? item.value : "0"}
                  </div>
                </div>
              ))
            ) : (
              <div>There are no transactions.</div>
            )}
            <ul className="pagination">
              {pageNumberSend.map((number) => (
                <li
                  className={`pagItem ${number === 1 ? "pagItemFirst" : ""}`}
                  key={number}
                  onClick={() => paginateSend(number)}
                >
                  <a className="pagLink">{number}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="txIn">
            <h3>Received</h3>
            {latestTxReceive ? (
              currentReceive.map((item) => (
                <div className="tx">
                  <div className="txHash">
                    <Link
                      to="/transaction"
                      className="address"
                      state={{ hash: item.hash, block: location.state.block }}
                    >
                      {item.hash.slice(0, 6)}...
                      {item.hash.slice(item.hash.length - 6)}
                    </Link>
                  </div>
                  <div className="txBlock">
                    Block:{" "}
                    <Link
                      to="/block"
                      className="address"
                      state={{
                        hash: item.blockNum,
                        block: location.state.block,
                      }}
                    >
                      {item.blockNum}
                    </Link>
                  </div>
                  <div className="txTo">
                    To:&nbsp;
                    <Link
                      className="address"
                      to="/address"
                      state={{ hash: item.to, block: location.state.block }}
                      onClick={refreshPage}
                    >
                      {item.to}
                    </Link>
                  </div>
                  <div className="txFrom">
                    From:&nbsp;
                    <Link
                      className="address"
                      to="/address"
                      state={{ hash: item.from, block: location.state.block }}
                      onClick={refreshPage}
                    >
                      {item.from}
                    </Link>
                  </div>
                  <div className="txValue">
                    Value: {item.value ? item.value : "0"}
                  </div>
                </div>
              ))
            ) : (
              <div>There are no transactions.</div>
            )}
            <ul className="pagination">
              {pageNumberReceive.map((number) => (
                <li
                  className={`pagItem ${number === 1 ? "pagItemFirst" : ""}`}
                  key={number}
                  onClick={() => paginateReceive(number)}
                >
                  <a className="pagLink">{number}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
