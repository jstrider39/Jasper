import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

function JsonTreeViewer({ jsonData }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [detailView, setDetailView] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!jsonData) return;

    const transformedData = transformJsonToTreeData(jsonData);
    setRows(transformedData.rows);
    setColumns(transformedData.columns);
  }, [jsonData]);

  const transformJsonToTreeData = (data) => {
    let rows = [];
    let id = 0;

    // Define columns for tree view
    const columns = [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "value", headerName: "Value", flex: 2 },
      { field: "type", headerName: "Type", width: 120 },
    ];

    const processObject = (obj, path = [], depth = 0) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const currentPath = [...path, key];
        const rowId = id++;

        if (Array.isArray(value)) {
          // Handle array nodes
          rows.push({
            id: rowId,
            name: key,
            value: `Array[${value.length}]`,
            type: "array",
            path: currentPath,
            depth: depth,
          });

          // Process each item in the array
          value.forEach((item, index) => {
            const itemPath = [...currentPath, index.toString()];

            if (typeof item === "object" && item !== null) {
              rows.push({
                id: id++,
                name: `[${index}]`,
                value: "",
                type: Array.isArray(item) ? "array" : "object",
                path: itemPath,
                depth: depth + 1,
              });
              processObject(item, itemPath, depth + 2);
            } else {
              rows.push({
                id: id++,
                name: `[${index}]`,
                value: String(item),
                type: typeof item,
                path: itemPath,
                depth: depth + 1,
              });
            }
          });
        } else if (typeof value === "object" && value !== null) {
          // Handle object nodes
          rows.push({
            id: rowId,
            name: key,
            value: "Object",
            type: "object",
            path: currentPath,
            depth: depth,
          });
          processObject(value, currentPath, depth + 1);
        } else {
          // Handle primitive values
          rows.push({
            id: rowId,
            name: key,
            value: String(value),
            type: typeof value,
            path: currentPath,
            depth: depth,
          });
        }
      });
    };

    processObject(data);
    return { rows, columns };
  };

  const handleRowClick = (params) => {
    const row = params.row;
    // Only open detail view for array objects
    if (row.type === "array") {
      // Find the array data by following the path
      let data = jsonData;
      for (const pathPart of row.path) {
        data = data[pathPart];
      }

      if (Array.isArray(data) && data.length > 0) {
        setDetailView({
          title: row.path.join("."),
          data: data,
        });
        setDetailOpen(true);
      }
    }
  };

  const handleClose = () => {
    setDetailOpen(false);
  };

  // Generate columns for detail view table dynamically
  const generateDetailColumns = (data) => {
    if (!data || data.length === 0) return [];

    // Use the first object to determine columns
    const firstItem = data[0];
    if (typeof firstItem !== "object" || firstItem === null) {
      return [{ field: "value", headerName: "Value", flex: 1 }];
    }

    return Object.keys(firstItem).map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
      width: 150,
    }));
  };

  // Generate rows for detail view
  const generateDetailRows = (data) => {
    if (!data || data.length === 0) return [];

    // Handle arrays of primitive values
    if (typeof data[0] !== "object" || data[0] === null) {
      return data.map((item, index) => ({
        id: index,
        value: String(item),
      }));
    }

    // Handle arrays of objects
    return data.map((item, index) => ({
      id: index,
      ...item,
    }));
  };

  return (
    <>
      <Paper elevation={3}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            treeData
            getTreeDataPath={(row) => row.path}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            onRowClick={handleRowClick}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      {detailView && (
        <Dialog open={detailOpen} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogTitle>
            Array: {detailView.title}
            <Button onClick={handleClose} style={{ position: "absolute", right: 8, top: 8 }}>
              Close
            </Button>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={generateDetailRows(detailView.data)}
                columns={generateDetailColumns(detailView.data)}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
              />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default JsonTreeViewer;
