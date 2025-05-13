import React from "react";
import styles from "./ModalDialog.module.css";

export function ModalDialog({ isOpen, onClose, textareaWidth, setTextareaWidth }) {
  if (!isOpen) return null;

  const handleWidthChange = (event) => {
    const newWidth = Number(event.target.value);
    if (newWidth >= 200 && newWidth <= 1200) {
      // Restrict width range
      setTextareaWidth(newWidth);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <h3 className={styles.title}>Adjust Textarea Width</h3>
        <div className={styles.inputGroup}>
          <label htmlFor="widthInput" className={styles.label}>
            Width (px): {textareaWidth}
          </label>
          <input
            id="widthInput"
            type="range"
            min="200"
            max="1200"
            value={textareaWidth}
            onChange={handleWidthChange}
            className={styles.slider}
          />
          <input
            type="number"
            min="200"
            max="1200"
            value={textareaWidth}
            onChange={handleWidthChange}
            className={styles.numberInput}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
