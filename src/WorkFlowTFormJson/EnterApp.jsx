import { useState, useEffect, useRef } from "react";
import styles from "./Enter.module.css";
import { Steps } from "./StepsTug";
import { create } from "zustand";
const steps = new Steps();
const useStore = create((set, get) => {
  steps.init(set, get);
  return { steps };
});

export function EnterApp() {
  const [visibleBox, setVisibleBox] = useState(0); // 0 = red, 1 = green, 2 = blue
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    //steps.setTrigger(() => setTrigger((t) => !t));
    steps.setTrigger(setTrigger);
  }, []);

  //const copunter = useStore((state) => state.steps.clickCounter);

  steps.setSteps(
    () => setVisibleBox(0),
    () => setVisibleBox(1),
    () => setVisibleBox(2)
  );

  return (
    <div onClick={() => steps.continue()}>
      {visibleBox === 0 && <div className={styles.redBox}>Red Box</div>}
      {visibleBox === 1 && <div className={styles.greenBox}>Green Box</div>}
      {visibleBox === 2 && <div className={styles.blueBox}>Blue Box</div>}
      {steps.clickCounter}
    </div>
  );
}
