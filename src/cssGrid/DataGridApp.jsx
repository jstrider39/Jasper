import React from "react";
import DataGrid from "./DataGrid";

const App = () => {
  const data = [
    { id: 1, name: "John Doe", age: 30, city: "New York" },
    { id: 2, name: "Jane Smith", age: 25, city: "Los Angeles" },
    { id: 3, name: "Bob Johnson", age: 35, city: "Chicago" },
    { id: 4, name: "Mike R", age: 73, city: "Dallas" },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "age", headerName: "Age" },
    { field: "city", headerName: "City" },
  ];

  return (
    <div>
      <h1>Custom Data Grid</h1>
      <DataGrid data={data} columns={columns} />
    </div>
  );
};

export default App;
