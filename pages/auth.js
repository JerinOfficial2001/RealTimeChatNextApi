import { getAlltokens, getTokenID } from "@/api/controller/token";
import { WhatsApp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

export default function Auth() {
  const [tokens, settokens] = useState([]);
  useEffect(() => {
    const timer = setInterval(() => {
      getTokenID();
    }, 10000);
    getAlltokens().then((data) => {
      settokens(data);
    });
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Box
        sx={{
          height: "400px",
          width: "400px",
          padding: 10,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>Scan to Get Authenticated</Typography>
        <WhatsApp style={{ height: "100%", width: "100%" }} />
      </Box>
      <Box
        sx={{
          height: "400px",
          width: "400px",
          padding: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <QRCode
          style={{ height: "100%", width: "100%" }}
          value={JSON.stringify(tokens)}
        />
      </Box>
    </div>
  );
}
