import React from "react";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div>
      <h1 className={`${styles.prova}`}>Home Page</h1>
      <p>Questa è la home page</p>
        <button className={`${styles.play}`}>Play!</button>
    </div>
  );
};

export default HomePage;
