import React, { useState, useRef, useEffect } from "react";
import { Paper, Box, Typography, IconButton, Stack } from "@mui/material";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare";

const MovePanel = ({ id, title, position, isActive, isMinimized, onDrag, onActivate, onMinimize }) => {
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    // Only allow dragging from the header
    if (e.target.closest(".panel-header")) {
      setIsDragging(true);
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left + window.scrollX,
        y: e.clientY - rect.top + window.scrollY,
      });
      onActivate(id);
      e.preventDefault(); // Prevent text selection during drag
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    console.log(window.scrollX, window.scrollY);
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x + window.scrollX,
        y: e.clientY - dragOffset.y + window.scrollY,
      };
      onDrag(id, newPosition);
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle panel click to activate
  const handlePanelClick = () => {
    onActivate(id);
  };

  // Handle minimize button click
  const handleMinimizeClick = (e) => {
    e.stopPropagation(); // Prevent panel activation
    onMinimize(id);
  };

  return (
    <Paper
      ref={panelRef}
      elevation={isActive ? 8 : 3}
      sx={{
        position: "absolute",
        width: isMinimized ? "250px" : "50%",
        height: isMinimized ? "48px" : "300px",
        left: position.x,
        top: position.y,
        overflow: "hidden",
        transition: "height 0.3s ease",
        zIndex: isActive ? 100 : 10,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
      }}
      onClick={handlePanelClick}
    >
      {/* Panel Header */}
      <Box
        className="panel-header"
        onMouseDown={handleMouseDown}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isActive ? "#FFC107" : "#4CAF50",
          color: "white",
          px: 2,
          py: 1,
          cursor: "move",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <IconButton size="small" onClick={handleMinimizeClick} sx={{ color: "white" }}>
          {isMinimized ? <CropSquareIcon /> : <MinimizeIcon />}
        </IconButton>
      </Box>

      {/* Panel Content */}
      {!isMinimized && (
        <Box sx={{ p: 2, height: "calc(100% - 48px)", overflow: "auto" }}>
          <Typography variant="body1">Panel content goes here</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MovePanel;
