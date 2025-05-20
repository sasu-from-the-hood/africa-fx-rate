import { useEffect, useState } from "react";
import axios from "axios";

export default function FxRatesTable() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/fx-rates")
  //     .then((res) => {
  //       if (res.data.success) {
  //         setRates(res.data.rates);
  //       } else {
  //         setError("Failed to load rates");
  //       }
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setError("Failed to load rates");
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fx-rates");

        if (res.data.success) {
          setRates(res.data.rates);
        } else {
          setError("Failed to load rates");
        }
      } catch (err) {
        setError("Failed to load rates " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const calculateBuySell = (rate) => {
    const numericRate = parseFloat(rate);
    const buy = (numericRate * 0.99).toFixed(4); // Bank buys for 1% less
    const sell = (numericRate * 1.01).toFixed(4); // Bank sells for 1% more
    return { buy, sell };
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Daily FX Rates (ETB Based)
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border border-gray-300 text-left">Currency</th>
            <th className="p-3 border border-gray-300 text-right">Buy Rate</th>
            <th className="p-3 border border-gray-300 text-right">Sell Rate</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {Object.entries(rates).map(([currency, rate]) => {
            const { buy, sell } = calculateBuySell(rate);
            return (
              <tr key={currency} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">
                  {currency === "NGN"
                    ? "Ghanaian Cedi (NGN)"
                    : currency === "CFA"
                    ? "Central African CFA"
                    : currency === "BIF"
                    ? "Burundi Franc (BIF)"
                    : currency}
                </td>
                <td className="p-3 border border-gray-300 text-right">{buy}</td>
                <td className="p-3 border border-gray-300 text-right">
                  {sell}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
