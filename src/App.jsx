import React from "react";
import { Button, Container, Typography } from "@mui/material";
import master from "./master";
import ChatApp from "./ChatApp";

function App() {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to My MUI App
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
      <ChatApp></ChatApp>
    </Container>
  );
}

export default App;
