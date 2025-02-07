import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function DEXDashboard() {
  const [marketData, setMarketData] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    fetch("https://backend.dex.fawaka.xyz/api/market-data")
      .then((res) => res.json())
      .then((data) => setMarketData(data));
  }, []);

  const connectWallet = () => {
    setWalletConnected(true);
    setWalletAddress("rExampleWalletAddress");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">DEX Dashboard</h1>

      {!walletConnected ? (
        <Button onClick={connectWallet} className="mb-4">Connect Wallet</Button>
      ) : (
        <p className="mb-4">Connected Wallet: {walletAddress}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketData.map((token, index) => (
          <Card key={index} className="bg-gray-800 p-4">
            <CardContent>
              <h2 className="text-xl font-semibold">{token.name} ({token.symbol})</h2>
              <p>Price: {token.price} XRP</p>
              <p>24h Change: {token.change}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">Market Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <Link href="/trade">
          <Button className="bg-blue-500">Go to Trading</Button>
        </Link>
      </div>
    </div>
  );
}
