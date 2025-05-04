import React, { useState } from "react";
import styles from "./DataGrid.module.css";

const DataGrid = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Sort data
    data.sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridHeader}>
        {columns.map((column) => (
          <div key={column.field} className={styles.headerCell} onClick={() => handleSort(column.field)}>
            {column.headerName}
            {sortConfig.key === column.field && <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>}
          </div>
        ))}
      </div>
      <div className={styles.gridBody}>
        {data.map((row) => (
          <div key={row.id} className={styles.gridRow}>
            {columns.map((column) => (
              <div key={column.field} className={styles.gridCell}>
                {row[column.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
