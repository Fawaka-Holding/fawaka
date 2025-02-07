import TangemWallet from "../utils/tangemWallet";

async function connectTangem() {
  const result = await TangemWallet.connect();
  if (result.success) {
    console.log("Connected Tangem Wallet:", result.publicKey);
  } else {
    console.error("Failed to connect:", result.error);
  }
}
