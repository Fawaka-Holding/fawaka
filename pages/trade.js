const xrpl = require("xrpl");
const express = require("express");
const router = express.Router();
const { FEE_WALLET, TRADE_FEE } = process.env; // Ensure fee wallet & trade fee are set
const { processTrade } = require("../services/tradeService");

// XRPL Connection
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // Change for Mainnet

client.connect().then(() => console.log("Connected to XRPL"));

/**
 * 📌 Fetch Market Data (Live Prices)
 */
router.get("/market/:pair", async (req, res) => {
  try {
    const pair = req.params.pair; // Example: XRP/USD
    const marketData = await getMarketData(pair);
    res.json(marketData);
  } catch (error) {
    console.error("Market Data Error:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

/**
 * 📌 Execute Trade (Buy/Sell Orders)
 */
router.post("/trade", async (req, res) => {
  try {
    const { traderWallet, orderType, amount, pair } = req.body;

    if (!traderWallet || !orderType || !amount || !pair) {
      return res.status(400).json({ error: "Missing required trade details" });
    }

    const tradeResult = await processTrade({
      traderWallet,
      orderType,
      amount,
      pair,
    });

    res.json(tradeResult);
  } catch (error) {
    console.error("Trade Execution Error:", error);
    res.status(500).json({ error: "Trade execution failed" });
  }
});

/**
 * 📌 Helper Function: Fetch Market Prices from XRPL
 */
async function getMarketData(pair) {
  // Simulate fetching market data (Replace with real API integration)
  return {
    pair,
    price: Math.random() * (1.2 - 0.8) + 0.8, // Mock price between 0.8 - 1.2
    volume: Math.floor(Math.random() * 10000), // Mock volume
  };
}

module.exports = router;
