import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from 'axios';

const Home = () => {
  const [name, setName]  = useState("");
  const [order_id, setOrder_id] = useState("");
  const [total, setTotal] = useState(0);

  const [token, setToken] = useState("");

  const process = async () => {
    const data = {
      name: name,
      order_id: order_id,
      total: total,
    };
    
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }
    
    const response = await axios.post(
      "http://localhost:1000/api/payment/process-transaction",
       data, config)

    setToken(response.data.token);
  };

  useEffect(() => {
    if(token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem("Payment", JSON.stringify(result));
          setToken("");
        },
        onPending: (result) => {
          localStorage.setItem("Payment", JSON.stringify(result));
          console.log(result);
          setToken("");
        },
        onError: (error) => {
          console.log(error);
          setToken("");
        },
        onClose: () => {
          console.log("Customer closed the popup without finishing the payment");
          setToken("");
        },
      });

      setName("");
      setOrder_id("");
      setTotal("");
    }
  },[token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midransClientKey = "SB-Mid-client-8xa4YIVqos-1agTr";
    scriptTag.setAttribute("data-client-key", midransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  },[])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        p: 4,
      }}
    >
      <TextField
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          mb: 2,
        }}
      />

      <TextField
        type="text"
        label="Order ID"
        value={order_id}
        onChange={(e) => setOrder_id(e.target.value)}
        sx={{
          mb: 2,
        }}
      />

      <TextField
        type="number"
        label="Total"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        sx={{
          mb: 2,
        }}
      />

      <Box>
        <Button variant="outlined" onClick={process}>
          Process
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
