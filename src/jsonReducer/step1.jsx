import React, { useEffect, useState, useRef } from "react";
import { Controller } from "./controller";
import styles from "./step1.module.css";

export function Step1({ controller, textareaWidth }) {
  /** @type {Controller} */
  const ccc = controller;

  // Update the controller with the textarea value whenever it changes
  const handleChange = (event) => {
    ccc.setTextValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h2>Step 1: Enter Your Text</h2>
      <textarea
        className={styles.textarea}
        style={{ width: `${textareaWidth}px` }} // Apply dynamic width
        value={ccc._step1Text}
        onChange={handleChange}
        rows={25}
        placeholder="Type your text here..."
      />
    </div>
  );
}
