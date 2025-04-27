import React, { useState } from "react";
//import { v4 as uuidv4 } from "uuid";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { master } from "./masterSlice";
import MovePanel from "./MovePanel";

const MovePanelManager = () => {
  const [panels, setPanels] = useState([]);
  const [activePanelId, setActivePanelId] = useState(null);

  // Create a new panel
  const handleCreatePanel = () => {
    const newPanel = {
      id: master.nextPositive,
      title: `Panel ${panels.length + 1}`,
      position: { x: 50 + panels.length * 20, y: 50 + panels.length * 20 },
      isMinimized: false,
    };

    setPanels([...panels, newPanel]);
    setActivePanelId(newPanel.id);
  };

  // Delete the active panel
  const handleDeletePanel = () => {
    if (activePanelId) {
      setPanels(panels.filter((panel) => panel.id !== activePanelId));

      // Set the next active panel if available
      if (panels.length > 1) {
        const remainingPanels = panels.filter((panel) => panel.id !== activePanelId);
        setActivePanelId(remainingPanels[0].id);
      } else {
        setActivePanelId(null);
      }
    }
  };

  // Function for onDrag prop
  const onDrag = (id, position) => {
    setPanels(panels.map((panel) => (panel.id === id ? { ...panel, position } : panel)));
  };

  // Function for onActivate prop
  const onActivate = (id) => {
    setActivePanelId(id);

    // Reorder panels to bring active one to front
    const activePanel = panels.find((panel) => panel.id === id);
    const otherPanels = panels.filter((panel) => panel.id !== id);
    setPanels([...otherPanels, activePanel]);
  };

  // Function for onMinimize prop
  const onMinimize = (id) => {
    setPanels(panels.map((panel) => (panel.id === id ? { ...panel, isMinimized: !panel.isMinimized } : panel)));
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
      <Stack direction="row" spacing={2} sx={{ position: "fixed", top: 20, left: 20, zIndex: 9999 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreatePanel}>
          New Panel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeletePanel}
          disabled={!activePanelId}
        >
          Delete Panel
        </Button>
      </Stack>

      <Box sx={{ width: "100%", height: "100%" }}>
        {panels.map((panel) => (
          <MovePanel
            key={panel.id}
            id={panel.id}
            title={panel.title}
            position={panel.position}
            isActive={panel.id === activePanelId}
            isMinimized={panel.isMinimized}
            onDrag={onDrag}
            onActivate={onActivate}
            onMinimize={onMinimize}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MovePanelManager;
