function extractPipeDelimitedRows(json, paths) {
  const rows = [];
  const headerSet = new Set();

  function resolvePath(obj, path) {
    const parts = path.split(".");
    let stack = [{ current: obj, index: 0, row: {} }];

    for (const part of parts) {
      const newStack = [];

      for (const item of stack) {
        const segment = part.replace(/\[\]$/, "");
        const isArray = part.endsWith("[]");
        const val = item.current?.[segment];

        if (isArray && Array.isArray(val)) {
          val.forEach((sub, i) => {
            newStack.push({
              current: sub,
              index: item.index,
              row: { ...item.row },
            });
          });
        } else if (!isArray && val !== undefined) {
          newStack.push({
            current: val,
            index: item.index,
            row: { ...item.row },
          });
        }
      }

      stack = newStack;
    }

    return stack
      .map((item) => {
        const leaf = item.current;
        if (Array.isArray(leaf)) {
          // Only include scalar values
          return leaf.filter((v) => typeof v !== "object");
        } else if (typeof leaf !== "object") {
          return [leaf];
        } else {
          return [];
        }
      })
      .filter((arr) => arr.length > 0)
      .map((arr, i) => ({
        [path]: arr.join("|"),
      }));
  }

  const mergedRows = {};

  paths.forEach((path) => {
    const results = resolvePath(json, path);
    results.forEach((res, idx) => {
      if (!mergedRows[idx]) mergedRows[idx] = {};
      Object.assign(mergedRows[idx], res);
      headerSet.add(...Object.keys(res));
    });
  });

  const headers = paths;
  rows.push(headers.join("|"));

  Object.values(mergedRows).forEach((rowObj) => {
    const row = headers.map((h) => rowObj[h] || "");
    rows.push(row.join("|"));
  });

  return rows.join("\n");
}

const jsonData = {
  participant: {
    accounts: [
      {
        nickname: "Main",
        roles: [
          { name: "Owner", party: "Alice" },
          { name: "Admin", party: "Bob" },
        ],
        optRoles: [{ name: "Support", party: "Charlie" }],
      },
      {
        nickname: "Backup",
        roles: [{ name: "Viewer", party: "Dana" }],
      },
    ],
  },
};

const paths = [
  "participant.accounts[].nickname",
  "participant.accounts[].roles[]",
  "participant.accounts[].roles[].party",
  "participant.accounts[].optRoles[]",
  "participant.accounts[].optRoles[].party",
];

const result = extractPipeDelimitedRows(jsonData, paths);
console.log(result);
