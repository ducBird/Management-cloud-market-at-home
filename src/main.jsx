import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "numeral/locales/vi";
import numeral from "numeral";
numeral.locale("vi");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <App />
  </React.Fragment>
);
