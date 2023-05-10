import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useEffect, useState } from "react";

import "./transaction.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const Transaction = () => {
  const location = useLocation();

  const [toAddress, setToAddress] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [contract, setContract] = useState();
  const [gasLimit, setGasLimit] = useState();
  const [gasPrice, setGasPrice] = useState();
  const [status, setStatus] = useState();
  const [block, setBlock] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    async function getTx() {
      let tx = await alchemy.core.getTransaction(location.state.hash);
      setToAddress(tx.to.toString());
      setFromAddress(tx.from.toString());
      setContract(tx.creates ? tx.creates.toString() : null);
      setGasLimit(tx.gasLimit.toString());
      setGasPrice(tx.gasPrice.toString());
      setStatus(tx.v);
      setBlock(tx.blockNumber);
      setValue(Utils.formatEther(tx.value).toString());
    }

    getTx();
  }, []);

  return (
    <div className="mainTx">
      <Link to="/" className="back">
        <FontAwesomeIcon
          icon={icon({ name: "house", style: "solid" })}
          size="lg"
          style={{ color: "#000000" }}
        />
      </Link>
      <div className="titleTx">
        <h1>Transaction: {location.state.hash} </h1>
        {status === 1 ? (
          <div className="success">
            <FontAwesomeIcon
              icon={icon({ name: "circle-check", style: "solid" })}
              size="xl"
              style={{ color: "#44ff00" }}
            />
            &nbsp;Success
          </div>
        ) : (
          <div className="error">
            <FontAwesomeIcon
              icon={icon({ name: "circle-xmark", style: "solid" })}
              size="xl"
              style={{ color: "#ff0000" }}
            />
            &nbsp;Error
          </div>
        )}
      </div>
      <div className="bodyTx">
        <div>
          <h3>
            To:{" "}
            {toAddress ? (
              <Link
                className="address"
                to="/address"
                state={{ hash: toAddress, block: location.state.block }}
              >
                {toAddress}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
          <h3>
            From:{" "}
            {fromAddress ? (
              <Link
                className="address"
                to="/address"
                state={{ hash: fromAddress, block: location.state.block }}
              >
                {fromAddress}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
        </div>
        <div>
          <h3>Value: {value ? value : "Loading..."}</h3>
          <h3>
            Block:{" "}
            {block ? (
              <Link
                to="/block"
                className="address"
                state={{ hash: block, block: location.state.block }}
              >
                {block}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
          {contract ? (
            <h3>
              Contract deployed:{" "}
              <Link
                className="address"
                to="/address"
                state={{ hash: contract, block: location.state.block }}
              >
                {contract}
              </Link>
            </h3>
          ) : null}
        </div>
        <div className="gas">
          <h3>Gas limit: {gasLimit ? gasLimit : "Loading..."}</h3>
          <h3>Gas price: {gasPrice ? gasPrice : "Loading..."}</h3>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
