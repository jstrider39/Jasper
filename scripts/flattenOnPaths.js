function flattenJsonToPipes(jsonData, paths) {
  // Helper: get all scalar key-values of an object
  const flattenObjectScalars = (obj) => {
    const result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] !== "object") {
        result.push(obj[key]);
      }
    }
    return result;
  };

  // Parse paths into segments
  const parsedPaths = paths.map((p) => {
    const isObjectFlatten = p.endsWith("{}");
    const cleanPath = isObjectFlatten ? p.slice(0, -2) : p;
    return {
      raw: p,
      segments: cleanPath.split("."),
      isObjectFlatten,
    };
  });

  // Recursively walk and collect all rows
  const collectRows = (node, pathIndex = 0, rowSoFar = []) => {
    if (!node) return [];

    const segment = parsedPaths[pathIndex];
    if (!segment) return [rowSoFar]; // No more paths, row is complete

    const resultRows = [];

    const traverse = (currentNode, segments, isFlatten, currentRow) => {
      let items = [currentNode];

      for (let i = 0; i < segments.length; i++) {
        const key = segments[i];

        if (key.endsWith("[]")) {
          const baseKey = key.slice(0, -2);
          const arr = items.flatMap((item) => (item && item[baseKey]) || []);
          items = arr;
        } else {
          items = items.map((item) => (item && item[key]) || null);
        }
      }

      items.forEach((item) => {
        let values;
        if (isFlatten) {
          values = flattenObjectScalars(item || {});
        } else {
          values = [item];
        }
        resultRows.push([...currentRow, ...values]);
      });
    };

    traverse(jsonData, segment.segments, segment.isObjectFlatten, rowSoFar);

    return resultRows;
  };

  // Combine results across all paths row-wise
  const buildMatrix = (json, paths) => {
    const rowSets = paths.map((_, i) => collectRows(json, i));
    const maxLength = Math.max(...rowSets.map((set) => set.length));

    // Expand rowSets to have the same number of rows
    const paddedRowSets = rowSets.map((set) => {
      const padRow = new Array(set[0]?.length || 1).fill("");
      const diff = maxLength - set.length;
      return [...set, ...Array(diff).fill(padRow)];
    });

    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const row = paddedRowSets.flatMap((set) => set[i]);
      result.push(row.join("|"));
    }
    return result;
  };

  return buildMatrix(jsonData, parsedPaths);
}
