import React, { useState } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import MovePanelManager from "./MovePanelManager";
import { master } from "./masterSlice";

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <master.utilsJsx.ThemeProvider>
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Move Panel
          </Typography>

          <Box sx={{ mb: 2 }}>
            <MovePanelManager />
          </Box>
        </Box>
      </Container>
    </master.utilsJsx.ThemeProvider>
  );
}

export default App;
