import express from "express";
import midtransClient from "midtrans-client";
// import bodyParser from 'body-parser';
// import cors from "cors"

const router = express.Router();
router.post("/process-transaction", (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      // Set to true if you want Production Environment
      isProduction: false,
      serverKey: "SB-Mid-server-VbA8dAxTAdepZDMxfoOrHcLh",
      clientKey: "SB-Mid-client-8xa4YIVqos-1agTr",
    });

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: req.body.name,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;
      res.status(200).json({ message: "success", dataPayment, token: token });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
