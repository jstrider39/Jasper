function extractPaths(obj, currentPath = "", paths = []) {
  // Base case: if obj is null or not an object, we've reached a leaf node
  if (obj === null || typeof obj !== "object") {
    if (currentPath) paths.push(currentPath);
    return paths;
  }

  // If we have an array
  if (Array.isArray(obj)) {
    // For arrays, we use [] notation and continue recursion for each element
    for (let i = 0; i < obj.length; i++) {
      const newPath = currentPath ? `${currentPath}[${i}]` : `[${i}]`;
      extractPaths(obj[i], newPath, paths);
    }
  } else {
    // For objects, we traverse each property
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Create the new path segment
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        // Recurse with the new path
        extractPaths(obj[key], newPath, paths);
      }
    }
  }

  return paths;
}

// Function to find paths to a specific pattern (like party objects inside roles arrays)
function findPatternPaths(obj) {
  // Get all paths in the object
  const allPaths = extractPaths(obj);
  //return allPaths;
  // Filter paths that match our pattern - ending with 'party' and containing both 'accounts' and 'roles'
  const patternPaths = allPaths.filter(
    (path) => path.endsWith(".party.name") && path.includes("accounts") && path.includes("roles")
  );

  // Extract the common pattern by replacing specific array indices with []
  if (patternPaths.length > 0) {
    const firstPath = patternPaths[0];
    // Replace array indices with [] notation
    return firstPath.replace(/\[\d+\]/g, "[]");
  }

  return null;
}

// Example usage
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

const pathPattern = findPatternPaths(jsonData);
console.log(pathPattern); // Should output: participant.accounts[].roles[].party
