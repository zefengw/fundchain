import React, { useState, useEffect } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  Button,
  useTranslate,
  BlockStack,
  Divider,
  Link,
  useTotalAmount,
  useShippingAddress,
  useCartLines
} from '@shopify/checkout-ui-extensions-react';
import { Buffer } from 'buffer'
// import * as nearAPI from "near-api-js";
// const { keyStores, KeyPair } = nearAPI;
// const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

// const { connect } = nearAPI;

// const connectionConfig = {
//   networkId: "testnet",
//   keyStore: myKeyStore, // first create a key store 
//   nodeUrl: "https://rpc.testnet.near.org",
//   walletUrl: "https://wallet.testnet.near.org",
//   helperUrl: "https://helper.testnet.near.org",
//   explorerUrl: "https://explorer.testnet.near.org",
// };
// const nearConnection = await connect(connectionConfig);
// // create wallet connection
// const walletConnection = new WalletConnection(nearConnection);

// const test_session = await Shopify.Utils.loadCurrentSession(request, response);

// const script_tag = new ScriptTag({ session: test_session });
// script_tag.event = "onload";
// script_tag.src = "https://unpkg.com/axios/dist/axios.min.js";
// await script_tag.save({
//   update: true,
// });'

render("Checkout::Actions::RenderBefore", () => <App />);

function App() {

  const [total, setTotal] = useState(0)
  const [totalInNear, setTotalInNear] = useState(0)
  // const nearTestNet = new Near({
  //   keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  //   networkId: 'testnet',
  //   nodeUrl: 'https://rpc.testnet.near.org',
  //   walletUrl: 'https://wallet.testnet.near.org',
  //   explorerUrl: "https://explorer.testnet.near.org",
  // });

  // const walletConnect = new WalletConnection(nearTestNet, 'near-app')

  async function sendRequest() {
    console.log("Button Pressed!")
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita%')
    const data = await response.json();
    console.log(data);
    console.log(amount)
  }

  function createByteString(s) {
    buf = Buffer.from(s).toString('base64')
    console.log(buf)
    return buf
  }

  function createURL() {
    domain = "http://localhost:1234?"
    var cart = createByteString(JSON.stringify(cartLines))
    var shipping = createByteString(JSON.stringify(shippingAddress))
    url = `${domain}&total_amount=${amount}&currency=${currencyCode}&cart=${cart}&shipping=${shipping}`
    // const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita%')
    // const data = await response.json();
    // console.log(Buffer.from(JSON.).toString('base64'))
    // console.log(data);

    return url
  }

  const { extensionPoint } = useExtensionApi();
  const { amount, currencyCode } = useTotalAmount();
  const cartLines = useCartLines();
  const shippingAddress = useShippingAddress();

  const translate = useTranslate();
  return (

    <BlockStack spacing="loo">
      <Banner title="Fast Payments Powered by NEAR" >
        {
          <Link to={createURL()}>
            <Button>Click here to use NEAR Wallet</Button>
          </Link>
        }
      </Banner>
      <Divider />
      {/* {console.log(extensionPoint)} */}
      {console.log(amount)}
      {console.log(cartLines)}
      {console.log(shippingAddress)}
    </BlockStack>
  );
}