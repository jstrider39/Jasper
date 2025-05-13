import React, { useEffect, useState } from "react";
import { Controller } from "./Controller";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { ModalDialog } from "./ModalDialog";
import resetStyles from "./Reset.module.css";
import buttonStyles from "./Button.module.css";
import appStyles from "./App.module.css";

const ccc = new Controller();

export function Main() {
  const [step, setStep] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textareaWidth, setTextareaWidth] = useState(500); // Default width

  useEffect(() => {
    ccc.setTrigger(setTrigger);
    ccc.setSteps(
      () => setStep(0),
      () => setStep(1)
    );
    ccc.init(0);
  }, []);

  return (
    <div className={`${resetStyles.reset} ${appStyles.app}`}>
      {step === 0 && <Step1 controller={ccc} textareaWidth={textareaWidth} />}
      {step === 1 && <Step2 controller={ccc} />}
      <div className={appStyles.buttonContainer}>
        <button className={buttonStyles.button} onClick={() => ccc.continue(step)} type="button">
          Next
        </button>
        {step === 0 && (
          <button className={buttonStyles.button} onClick={() => setIsModalOpen(true)} type="button">
            Adjust Width
          </button>
        )}
      </div>
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        textareaWidth={textareaWidth}
        setTextareaWidth={setTextareaWidth}
      />
    </div>
  );
}
