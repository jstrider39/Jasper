function filterJsonByPaths(json, paths) {
  // Create a new object to store the filtered result
  const result = {};

  // Process each path
  paths.forEach((path) => {
    // Split the path into segments
    const segments = path.split(".");

    // Process the current JSON object
    let currentSource = json;
    let currentTarget = result;

    // Traverse through each segment of the path
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Check if we've reached the end of the path
      const isLastSegment = i === segments.length - 1;

      // Handle array notation
      if (segment.endsWith("[]")) {
        const propertyName = segment.slice(0, -2);

        // Initialize the array in the target if it doesn't exist
        if (!currentTarget[propertyName]) {
          currentTarget[propertyName] = [];
        }

        // Process each element in the source array
        if (Array.isArray(currentSource[propertyName])) {
          currentSource[propertyName].forEach((item, index) => {
            // Ensure the corresponding array element exists in the target
            if (!currentTarget[propertyName][index]) {
              currentTarget[propertyName][index] = {};
            }

            // If this is the last segment, we need to add the array element itself
            if (isLastSegment) {
              currentTarget[propertyName][index] = item;
            }

            // If there are more segments, we need to process the next segment
            if (!isLastSegment) {
              // Set up for the next iteration
              const nextSegment = segments[i + 1];
              const nextSource = currentSource[propertyName][index];
              const nextTarget = currentTarget[propertyName][index];

              // If the next segment is also an array notation
              if (nextSegment.endsWith("[]")) {
                const nextProperty = nextSegment.slice(0, -2);
                // Process the nested array recursively
                if (Array.isArray(nextSource[nextProperty])) {
                  filterArrayProperties(nextSource, nextTarget, nextProperty, segments.slice(i + 2).join("."));
                }
                return; // Skip further processing for this path
              }
            }
          });
        }
        return; // Skip further processing for this path
      }

      // Handle regular property (non-array)
      if (!isLastSegment) {
        // Create nested object if it doesn't exist
        if (!currentTarget[segment]) {
          currentTarget[segment] = {};
        }

        // Move to the next level in both source and target
        currentSource = currentSource[segment] || {};
        currentTarget = currentTarget[segment];
      } else {
        // For the last segment, copy the value
        currentTarget[segment] = currentSource[segment];
      }
    }
  });

  return result;
}

// Helper function to handle filtering properties within arrays
function filterArrayProperties(source, target, arrayProp, remainingPath) {
  if (!Array.isArray(source[arrayProp])) return;

  // Initialize the array in the target
  if (!target[arrayProp]) {
    target[arrayProp] = [];
  }

  // Process each element in the array
  source[arrayProp].forEach((item, index) => {
    // Initialize the corresponding element in the target array
    if (!target[arrayProp][index]) {
      target[arrayProp][index] = {};
    }

    if (!remainingPath) {
      // If no remaining path, copy the whole item
      target[arrayProp][index] = item;
    } else {
      // Otherwise, process the remaining path
      const parts = remainingPath.split(".");
      let currentSrc = item;
      let currentTgt = target[arrayProp][index];

      // Process each part of the remaining path
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLastPart = i === parts.length - 1;

        if (part.endsWith("[]")) {
          const nestedArrayProp = part.slice(0, -2);
          const nestedRemaining = parts.slice(i + 1).join(".");
          filterArrayProperties(currentSrc, currentTgt, nestedArrayProp, nestedRemaining);
          return;
        }

        if (isLastPart) {
          // Copy the value for the last part
          currentTgt[part] = currentSrc[part];
        } else {
          // Create nested object if needed
          if (!currentTgt[part]) {
            currentTgt[part] = {};
          }
          currentSrc = currentSrc[part] || {};
          currentTgt = currentTgt[part];
        }
      }
    }
  });
}

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

// Example usage:
const paths = [
  "participant.accounts[].name",
  "participant.accounts[].roles[].name",
  "participant.accounts[].roles[].party.contactInfo.email",
];
paths.splice(2, 1);
const filteredJson = filterJsonByPaths(jsonData, paths);
console.log(JSON.stringify(filteredJson, null, 2));
