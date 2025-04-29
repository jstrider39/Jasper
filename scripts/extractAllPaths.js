function extractPaths(obj, prefix = "") {
  const paths = [];

  function traverse(currentObj, currentPath) {
    if (currentObj === null || typeof currentObj !== "object") {
      paths.push(currentPath);
      return;
    }

    if (Array.isArray(currentObj)) {
      // Handle arrays - add [] notation and recurse into array elements
      for (let i = 0; i < currentObj.length; i++) {
        const element = currentObj[i];

        if (typeof element === "object" && element !== null) {
          // For objects within arrays, continue recursion without adding array index
          traverse(element, `${currentPath}[]`);
        } else {
          // For primitive values in arrays
          paths.push(`${currentPath}[]`);
        }
      }
    } else {
      // Handle objects
      for (const key in currentObj) {
        if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
          const value = currentObj[key];
          const newPath = currentPath ? `${currentPath}.${key}` : key;

          if (typeof value === "object" && value !== null) {
            traverse(value, newPath);
          } else {
            paths.push(newPath);
          }
        }
      }
    }
  }

  traverse(obj, prefix);
  return paths;
}

// Example usage:
const jsonData = {
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
console.log(extractPaths(jsonData));
