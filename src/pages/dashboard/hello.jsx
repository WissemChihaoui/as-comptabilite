import axios from "axios";
import React, { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/hello")
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }, []);

  return <h1>{message}</h1>;
};

export default App;
