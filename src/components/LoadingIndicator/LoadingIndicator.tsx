import React from "react";
import css from "./LoadingIndicator.module.css";

const LoadingIndicator: React.FC = () => {
  return (
    <div className={css.loaderContainer}>
      <div className={css.spinner}></div>
      <span>Loading...</span>
    </div>
  );
};

export default LoadingIndicator;