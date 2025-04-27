import React, { useState } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import TreeGrid from "./TreeGrid";
import { master } from "./masterSlice";

function App() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const mockData = {
    participant: {
      accounts: [
        {
          accountId: "ACC001",
          name: "Personal Account",
          roles: [
            {
              roleId: "R101",
              name: "Owner",
              party: {
                partyId: "P1001",
                name: "John Smith",
                type: "Individual",
                contactInfo: {
                  email: "john.smith@example.com",
                  phone: "555-123-4567",
                },
              },
            },
            {
              roleId: "R102",
              name: "Administrator",
              party: {
                partyId: "P1002",
                name: "Jane Doe",
                type: "Individual",
                contactInfo: {
                  email: "jane.doe@example.com",
                  phone: "555-987-6543",
                },
              },
            },
          ],
        },
        {
          accountId: "ACC002",
          name: "Business Account",
          roles: [
            {
              roleId: "R201",
              name: "Account Manager",
              party: {
                partyId: "P2001",
                name: "Acme Corporation",
                type: "Organization",
                contactInfo: {
                  email: "info@acmecorp.com",
                  phone: "555-111-2222",
                },
              },
            },
          ],
        },
        {
          accountId: "ACC003",
          name: "Joint Account",
          roles: [
            {
              roleId: "R301",
              name: "Co-owner",
              party: {
                partyId: "P3001",
                name: "Michael Johnson",
                type: "Individual",
                contactInfo: {
                  email: "michael.j@example.com",
                  phone: "555-333-4444",
                },
              },
            },
            {
              roleId: "R302",
              name: "Co-owner",
              party: {
                partyId: "P3002",
                name: "Sarah Johnson",
                type: "Individual",
                contactInfo: {
                  email: "sarah.j@example.com",
                  phone: "555-555-6666",
                },
              },
            },
          ],
        },
      ],
    },
  };
  // Sample data for testing
  const loadSampleData = () => {
    const sampleData = mockData;
    // const sampleData = {
    //   root: {
    //     person: [
    //       { name: "John", age: 30, roles: ["admin", "user"] },
    //       { name: "Jane", age: 25, roles: ["editor"] },
    //       { name: "Bob", age: 40, roles: ["guest", "reviewer"] },
    //     ],
    //     settings: {
    //       darkMode: true,
    //       notifications: {
    //         email: true,
    //         push: false,
    //       },
    //     },
    //   },
    // };
    setJsonData(sampleData);
  };

  return (
    <master.utilsJsx.ThemeProvider>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            JSON Tree Viewer
          </Typography>

          <Box sx={{ mb: 2 }}>
            <input
              accept="application/json"
              style={{ display: "none" }}
              id="upload-json-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-json-file">
              <Button variant="contained" component="span">
                Upload JSON File
              </Button>
            </label>
            <Button variant="outlined" onClick={loadSampleData} sx={{ ml: 2 }}>
              Load Sample Data
            </Button>
          </Box>

          {jsonData && <TreeGrid jsonData={jsonData} />}
        </Box>
      </Container>
    </master.utilsJsx.ThemeProvider>
  );
}

export default App;
