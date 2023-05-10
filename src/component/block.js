import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useEffect, useState } from "react";

import "./block.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const Block = () => {
  const location = useLocation();

  const [hash, setHash] = useState();
  const [parentHash, setParentHash] = useState();
  const [number, setNumber] = useState();
  const [timestamp, setTimestamp] = useState();
  const [nonce, setNonce] = useState();
  const [difficulty, setDifficulty] = useState();
  const [gasLimit, setGasLimit] = useState();
  const [gasUsed, setGasUsed] = useState();
  const [miner, setMiner] = useState();
  const [transaction, setTransaction] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  useEffect(() => {
    async function getBlock() {
      let bl = await alchemy.core.getBlock(location.state.hash);
      setHash(bl.hash);
      setParentHash(bl.parentHash);
      setNumber(bl.number);
      setTimestamp(bl.timestamp);
      setNonce(bl.nonce);
      setDifficulty(bl.difficulty);
      setGasLimit(bl.gasLimit.toString());
      setGasUsed(bl.gasUsed.toString());
      setMiner(bl.miner);
      setTransaction(bl.transactions);
    }

    getBlock();
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexLast = currentPage * itemPerPage;
  const indexFirst = indexLast - itemPerPage;
  const current = transaction ? transaction.slice(indexFirst, indexLast) : [];

  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(transaction.length / itemPerPage); i++) {
    pageNumber.push(i);
  }

  return (
    <div className="mainBlock">
      <Link to="/" className="back">
        <FontAwesomeIcon
          icon={icon({ name: "house", style: "solid" })}
          size="lg"
          style={{ color: "#000000" }}
        />
      </Link>
      <div className="titleBlock">
        <h1>Hash: {hash ? hash : "Loading..."}</h1>
      </div>
      <div className="bodyBlock">
        <div>
          <h3>
            Previous block:{" "}
            {parentHash ? (
              <Link
                to="/block"
                className="address"
                state={{ hash: parentHash, block: location.state.block }}
                onClick={refreshPage}
              >
                {parentHash}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
          <h3>Block number: {number ? number : "Loading..."}</h3>
          <h3>Timestamp: {timestamp ? timestamp : "Loading..."}</h3>
        </div>
        <div>
          <h3>Nonce: {nonce ? nonce : "Loading..."}</h3>
          <h3>Difficulty: {difficulty !== null ? difficulty : "Loading..."}</h3>
          <h3>
            Miner:{" "}
            {miner ? (
              <Link
                to="/address"
                className="address"
                state={{ hash: miner, block: location.state.block }}
              >
                {miner}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
        </div>
        <div className="gas">
          <h3>Gas limit: {gasLimit ? gasLimit : "Loading..."}</h3>
          <h3>Gas price: {gasUsed ? gasUsed : "Loading..."}</h3>
        </div>
        <div className="txBox">
          <h3>Transactions</h3>
          {current
            ? current.map((item) => {
                return (
                  <div className="tx">
                    <div>
                      Hash:{" "}
                      <Link
                        to="/transaction"
                        className="address"
                        state={{ hash: item, block: location.state.block }}
                      >
                        {item}
                      </Link>
                    </div>
                  </div>
                );
              })
            : null}
          <ul className="pagination">
            {pageNumber.map((number) => (
              <li
                className={`pagItem ${number === 1 ? "pagItemFirst" : ""}`}
                key={number}
                onClick={() => paginate(number)}
              >
                <a className="pagLink">{number}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Block;
