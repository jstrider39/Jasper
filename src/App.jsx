import React from "react";
import { Button, Container, Typography, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { master } from "./masterSlice";
import ChatApp from "./ChatApp";
import ChatComponent from "./ChatAppV2";
import useStore from "./useStore";
import { masterSlice } from "./masterSlice";
import ErrorBoundary from "./ErrorBoundary";
import MovePanelManager from "./MovePanelManager";

//sdebugger;
//masterSlice();

// Create a dark theme

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline /> {/* This normalizes styles and applies the theme's background */}
        <Container sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to My MUI App
          </Typography>
          <Button variant="contained" color="primary">
            Click Me
          </Button>
          <ChatComponent></ChatComponent>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
