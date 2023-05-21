import { WalletConnection, Near, keyStores } from 'near-api-js';
import 'regenerator-runtime/runtime';
import { Wallet } from './near-wallet';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const CONTRACT_ADDRESS = process.env.CONTRACT_NAME
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })

const nearTestNet = new Near({
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  explorerUrl: "https://explorer.testnet.near.org",
});

const walletConnect = new WalletConnection(nearTestNet, 'near-app')

// Setup on page load
window.onload = async () => {

  // Find Query Parameters and log them
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const total_amount = urlParams.get('total_amount')
  console.log(total_amount);


  res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=aurora-near&vs_currencies=USD');
  res_json = await res.json();
  total_amount_in_near = total_amount * res_json['aurora-near']['usd']
  total_amount_in_near_rounded = Math.round(total_amount_in_near * 100) / 100
  console.log(total_amount_in_near)

  document.querySelectorAll('#total_amount_num').forEach(el => {
    el.innerText = `${total_amount_in_near_rounded} NEAR `
  })

  document.querySelectorAll('#usd-value').forEach(el => {
    el.innerText = `$${total_amount}`
  })

  const currency = urlParams.get('currency')
  console.log(currency);

  const cart = JSON.parse(window.atob(urlParams.get('cart')))
  console.log(cart);

  const shipping = JSON.parse(window.atob(urlParams.get('shipping')))
  console.log(shipping)

  document.querySelectorAll('#cus_address').forEach(el => {
    el.value = `${shipping.address1}`;
  });

  document.querySelectorAll('#cus_name').forEach(el => {
    el.value = `${shipping.firstName} ${shipping.lastName}`;
  });

  document.querySelectorAll('#cus_city').forEach(el => {
    el.value = `${shipping.city}`;
  });

  document.querySelectorAll('#cus_state').forEach(el => {
    el.value = `${shipping.provinceCode}`;
  });

  document.querySelectorAll('#cus_country').forEach(el => {
    el.value = `${shipping.countryCode}`;
  });

  document.querySelectorAll('#cus_zip').forEach(el => {
    el.value = `${shipping.zip}`;
  });

  let isSignedIn = await wallet.startUp();

  if (isSignedIn) {
    signedInFlow();
  } else {
    signedOutFlow();
  }
};

// Button clicks
$ = (e) => document.querySelector(e)
$('#sign-in-button').onclick = () => {
  console.log("YOOOOsdfsd")
  wallet.signIn();
  document.querySelectorAll('#cus_account').forEach(el => {
    // walletValue = wallet.accountId ? wallet.accountId : ""
    walletValue = (typeof (wallet.accountId) !== "undefined") ? wallet.accountId : '';
    console.log('WalletValue is ', walletValue)

    el.value = `${walletValue}`;
  });

};
$('#hello-button').onclick = () => {
  console.log("YOOOOsdfsd")
  wallet.signIn();
  document.querySelectorAll('#cus_account').forEach(el => {
    el.value = `${wallet.accountId}`;
  });

};
$('#sign-out-button').onclick = () => { wallet.signOut(); };
$('#choose-heads').onclick = () => { player_choose('heads'); };
$('#choose-tails').onclick = () => { player_choose('tails'); };
// $('#hello-button').onclick = () => {
//   // TODO: Change this]
//   console.log("Hello")
//   create_payment_event()
// };

async function create_payment_event() {
  let paid = await walletConnect.account().sendMoney('shopify.testnet', "10000000000000000000000000")
  console.log("Payment processed: ", paid)
}

// Executed when the player chooses a side
async function player_choose(side) {
  reset_buttons()
  start_flip_animation()
  set_status("Asking the contract to flip a coin")

  // Call the smart contract asking to flip a coin
  let outcome = await wallet.callMethod({ contractId: CONTRACT_ADDRESS, method: 'flip_coin', args: { player_guess: side } });

  // UI
  set_status(`The outcome was ${outcome}`)
  stop_flip_animation_in(outcome)

  if (outcome == side) {
    set_status("You were right, you win a point!")
    $(`#choose-${side}`).style.backgroundColor = "green"
  } else {
    set_status("You were wrong, you lost a point")
    $(`#choose-${side}`).style.backgroundColor = "red"
  }

  // Fetch the new score
  fetchScore();
}

async function fetchScore() {
  console.log(wallet.accountId)
  const score = await wallet.viewMethod({ contractId: CONTRACT_ADDRESS, method: 'points_of', args: { player: wallet.accountId } });

  document.querySelectorAll('[data-behavior=points]').forEach(el => {
    el.innerText = score;
  });
}

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'none';
  });

  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'block';
  });

  // animate the coin
  // $('#coin').style.animation = "flip 3.5s ease 0.5s";
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'block';
  });
  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });
  document.querySelectorAll('[data-behavior=cus_account]').forEach(el => {
    el.innerText = wallet.accountId;
  });
  document.querySelectorAll('#cus_account').forEach(el => {
    el.value = wallet.accountId
  })

  fetchScore()
}

// Aux methods to simplify handling the interface
function set_status(message) {
  document.querySelectorAll('[data-behavior=status]').forEach(el => {
    el.innerText = message;
  });
}

function reset_buttons() {
  $(`#choose-heads`).style.backgroundColor = "var(--secondary)"
  $(`#choose-tails`).style.backgroundColor = "var(--secondary)"
}

function start_flip_animation() {
  $('#coin').style.animation = 'flip 2s linear 0s infinite';
}

function stop_flip_animation_in(side) {
  $('#coin').style.animation = `flip-${side} 1s linear 0s 1 forwards`;
}
