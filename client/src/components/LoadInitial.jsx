import React from "react";
import { css } from "@emotion/react";
import { HashLoader } from "react-spinners";
export default function LoadInitial() {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
        
    }}>
      <HashLoader color="#9013FE" />
    </div>
  );
}
