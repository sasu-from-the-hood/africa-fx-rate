const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/fx-rates", async (req, res) => {
  try {
    // Fetch rates based on USD
    const response = await axios.get("https://open.er-api.com/v6/latest/USD");
    const rates = response.data.rates;

    // this changes usd to ethiopian birr
    const usdToEtb = rates.ETB;

    // USD to NGN, XAF, BIF rates

    const usdToNgn = rates.NGN;
    const usdToXaf = rates.XAF;
    const usdToBif = rates.BIF;

    // this calculates ETB to others currency needed (NGN, XAF, BIF)
    const etbToNgn = usdToNgn / usdToEtb;
    const etbToXaf = usdToXaf / usdToEtb;
    const etbToBif = usdToBif / usdToEtb;

    // send the data to the front end
    res.json({
      success: true,
      base: "ETB",
      rates: {
        NGN: etbToNgn.toFixed(4),
        CFA: etbToXaf.toFixed(4),
        BIF: etbToBif.toFixed(4),
      },
    });
  } catch (error) {
    console.error("Error fetching FX rates:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch FX rates" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
