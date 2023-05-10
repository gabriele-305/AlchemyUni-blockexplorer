import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

import "./nft.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const Nft = () => {
  const location = useLocation();

  const [totalSupply, setTotalSupply] = useState();
  const [owner, setOwner] = useState();
  const [metadata, setMetadata] = useState();
  const [price, setPrice] = useState();
  // console.log(Object.keys(price).length);

  useEffect(() => {
    async function getTotalSupply() {
      setTotalSupply(
        (await alchemy.nft.summarizeNftAttributes(location.state.hash))
          .totalSupply
      );
    }
    async function getOwner() {
      setOwner(
        (
          await alchemy.nft.getOwnersForNft(
            location.state.hash,
            location.state.tokenId
          )
        ).owners
      );
    }
    async function getMetadata() {
      setMetadata(
        await alchemy.nft.getNftMetadata(
          location.state.hash,
          location.state.tokenId
        )
      );
    }
    // async function getSales() {
    //   setSales(
    //     await alchemy.nft.getNftSales({
    //       fromBlock: location.state.block,
    //       toBlock: location.state.block - 50,
    //       order: "desc",
    //       limit: 100,
    //     })
    //   );
    // }
    async function getPrice() {
      setPrice(await alchemy.nft.getFloorPrice(location.state.hash));
    }

    getTotalSupply();
    getOwner();
    getMetadata();
    // getSales();
    getPrice();
  }, []);

  return (
    <div className="mainNft">
      <Link to="/" className="back">
        <FontAwesomeIcon
          icon={icon({ name: "house", style: "solid" })}
          size="lg"
          style={{ color: "#000000" }}
        />
      </Link>
      <div className="titleNft">
        <h1>
          Address: {location.state.hash}{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Token ID: &nbsp;{location.state.tokenId}/{totalSupply}
        </h1>
      </div>
      <div className="bodyNft">
        <div>
          <h3>
            Owner:{" "}
            {owner ? (
              <Link
                to="/address"
                className="address"
                state={{ hash: owner[0], block: location.state.block }}
              >
                {owner}
              </Link>
            ) : (
              "Loading..."
            )}
          </h3>
          <h3>
            {price && price.openSea ? (
              <a href={price ? price.openSea.collectionUrl : "/"}>
                Floor price on Opensea:{" "}
                {price ? price.openSea.floorPrice : "Loading..."}
              </a>
            ) : null}
            <br />
            {price && price.looksRare ? (
              <a href={price ? price.looksRare.collectionUrl : "/"}>
                Floor price on Looksrare:{" "}
                {price ? price.looksRare.floorPrice : "Loading..."}
              </a>
            ) : null}
          </h3>
        </div>
        <div>
          <h3 className="nftTitle">
            Metadata of {metadata ? metadata.title : "Loading..."}
          </h3>
          <p>
            <h3>Description:</h3>{" "}
            {metadata ? metadata.description : "Loading..."}
          </p>
          <h3>
            Attributes (click{" "}
            <a
              className="here"
              href={metadata ? metadata.tokenUri.gateway : "/"}
            >
              here
            </a>{" "}
            to open from your browser):<br></br>
            {metadata
              ? metadata.rawMetadata.attributes.map((item) => (
                  <div>
                    <h4>
                      {item.trait_type}: {item.value}
                    </h4>
                  </div>
                ))
              : "Loading..."}
            <div>
              <h3>
                Image:{" "}
                {metadata ? (
                  <a href={metadata.rawMetadata.image}>
                    {metadata.rawMetadata.image}
                  </a>
                ) : (
                  "Loading..."
                )}
              </h3>
            </div>
          </h3>
        </div>
        {/* <div className="sales">
          <h3>Sales: </h3>
        </div> */}
      </div>
    </div>
  );
};

export default Nft;
