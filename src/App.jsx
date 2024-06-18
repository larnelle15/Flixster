import React from "react";
import "./App.css";
import List from "./Components/List/List";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Modal from "./Components/Modal/Modal";

const App = () => {
  return (
    <>
      <Header />
      <List />
      <Modal /> 
      <Footer />
    </>
  );
};

export default App;