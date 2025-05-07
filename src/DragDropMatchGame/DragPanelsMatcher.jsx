import React, { useState, useEffect, useRef } from "react";
import styles from "./Drag.module.css";

// Controller class that acts as both controller and model
class GameController {
  constructor() {
    this.data = {
      leftPanels: [
        { id: "left-1", value: 1, active: true },
        { id: "left-2", value: 2, active: true },
      ],
      rightPanels: [
        { id: "right-1", value: 1, balls: 1, matched: false },
        { id: "right-2", value: 2, balls: 2, matched: false },
      ],
    };
    this.retriggerRender = null;
  }

  setRetrigger(retriggerfn) {
    this.retriggerRender = retriggerfn;
  }

  updateUI() {
    if (this.retriggerRender) {
      this.retriggerRender((prev) => !prev);
    }
  }

  handleDrop(leftPanelId, rightPanelId) {
    const leftPanel = this.data.leftPanels.find((panel) => panel.id === leftPanelId);
    const rightPanel = this.data.rightPanels.find((panel) => panel.id === rightPanelId);

    if (!leftPanel || !rightPanel || !leftPanel.active || rightPanel.matched) {
      return false; // Invalid drop
    }

    // Check if the match is correct
    if (leftPanel.value === rightPanel.value) {
      // Mark the right panel as matched
      rightPanel.matched = true;
      // Mark the left panel as inactive
      leftPanel.active = false;

      this.updateUI();
      return true; // Successful match
    }

    return false; // Incorrect match
  }

  resetGame() {
    this.data.leftPanels.forEach((panel) => (panel.active = true));
    this.data.rightPanels.forEach((panel) => (panel.matched = false));
    this.updateUI();
  }

  isGameComplete() {
    return this.data.rightPanels.every((panel) => panel.matched);
  }
}

const MatchingGame = () => {
  const [retrigger, setRetrigger] = useState(false);
  const gameController = useRef(new GameController());
  const controller = gameController.current;

  useEffect(() => {
    // Set the retrigger function in the controller
    controller.setRetrigger(setRetrigger);
  }, []);

  const handleDragStart = (e, panelId) => {
    e.dataTransfer.setData("panelId", panelId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, rightPanelId) => {
    e.preventDefault();
    const leftPanelId = e.dataTransfer.getData("panelId");
    const success = controller.handleDrop(leftPanelId, rightPanelId);

    if (!success) {
      // Reset the drag if not successful
      console.log("Incorrect match");
    } else if (controller.isGameComplete()) {
      setTimeout(() => {
        alert("Game complete! All panels matched!");
        controller.resetGame();
      }, 500);
    }
  };

  const renderBalls = (count) => {
    const balls = [];
    for (let i = 0; i < count; i++) {
      balls.push(<div key={i} className={styles.ball}></div>);
    }
    return balls;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.sideContainer}>
        {controller.data.leftPanels.map(
          (panel) =>
            panel.active && (
              <div
                key={panel.id}
                className={styles.leftPanel}
                draggable
                onDragStart={(e) => handleDragStart(e, panel.id)}
              >
                <span className={styles.numberDisplay}>{panel.value}</span>
              </div>
            )
        )}
      </div>

      {/* Middle empty space (1/3 of screen) */}
      <div className={styles.middleSpace}></div>

      <div className={styles.sideContainer}>
        {controller.data.rightPanels.map((panel) => (
          <div
            key={panel.id}
            className={`${styles.rightPanel} ${panel.matched ? styles.matched : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, panel.id)}
          >
            {panel.matched ? (
              <div className={styles.matchedContent}>
                <span className={styles.numberDisplay}>{panel.value}</span>
                <div className={styles.ballsContainer}>{renderBalls(panel.balls)}</div>
              </div>
            ) : (
              <div className={styles.ballsContainer}>{renderBalls(panel.balls)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingGame;
