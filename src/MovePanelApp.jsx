import { Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import React, { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import MovePanelManager from "./MovePanelManager";
import { master } from "./masterSlice";

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <master.utilsJsx.ThemeProvider>
      <CssBaseline /> {/* This normalizes styles and applies the theme's background */}
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "green",
          padding: 0, // Remove default padding
          //maxWidth: "100vw", // Override maxWidth to use full viewport width
          //width: "100%", // Ensure full width
        }}
      >
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Move Panel
          </Typography>

          {/* <Box sx={{ mb: 2, bg: "green", p: 1 }}> */}
          <Box sx={{ width: "100%", height: "calc(100vh - 80px)", bg: "pink" }}>
            <MovePanelManager />
          </Box>
        </Box>
      </Container>
    </master.utilsJsx.ThemeProvider>
  );
}

export default App;
