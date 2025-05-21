const Router = require("@koa/router");
const fs = require("fs").promises;
const path = require("path");

function attachRoutesInfo(ctx) {
  const baseUrl = ctx.origin + "/files";

  const routesInfo = [
    {
      method: "GET",
      path: "/files/{subpath*}",
      fullUrl: `${baseUrl}/{subpath*}`,
      description: "List folders and files in a directory",
      example: `${baseUrl}/documents/projects`,
    },
    {
      method: "POST",
      path: "/files/rename/{subpath*}",
      fullUrl: `${baseUrl}/rename/{subpath*}`,
      description: "Rename a single file",
      example: `${baseUrl}/rename/documents`,
      payload: {
        oldName: "old.txt",
        newName: "new.txt",
      },
    },
    {
      method: "POST",
      path: "/files/rename-multiple/{subpath*}",
      fullUrl: `${baseUrl}/rename-multiple/{subpath*}`,
      description: "Rename multiple files",
      example: `${baseUrl}/rename-multiple/documents`,
      payload: {
        renames: [
          { oldName: "a.txt", newName: "a-renamed.txt" },
          { oldName: "b.txt", newName: "b-renamed.txt" },
        ],
      },
    },
  ];

  if (ctx.body && typeof ctx.body === "object") {
    ctx.body._routes = routesInfo;
  }
}

const router = new Router();

// Helper: sanitize and resolve full path
function resolveFullPath(base, relativePath = "") {
  const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(base, safePath);
}

//const ROOT_DIR = path.resolve(__dirname, "../your-root-directory");
const ROOT_DIR = path.resolve(__dirname, "../");

// Route: GET /files/*path - List folders and files in directory
router.get("(.*)", async (ctx) => {
  const subPath = ctx.params[0] || "";
  const fullPath = resolveFullPath(ROOT_DIR, subPath);

  try {
    const dirContents = await fs.readdir(fullPath, { withFileTypes: true });
    const files = dirContents.filter((d) => d.isFile()).map((f) => f.name);
    const folders = dirContents.filter((d) => d.isDirectory()).map((f) => f.name);

    ctx.body = { path: subPath, folders, files };
    attachRoutesInfo(ctx);
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: "Invalid path or permission denied", details: err.message };
  }
});

// Route: POST /files/rename/*path - Rename a single file
router.post("/rename/(.*)", async (ctx) => {
  const subPath = ctx.params[0] || "";
  const { oldName, newName } = ctx.request.body;
  const dirPath = resolveFullPath(ROOT_DIR, subPath);

  try {
    const oldPath = path.join(dirPath, oldName);
    const newPath = path.join(dirPath, newName);

    await fs.rename(oldPath, newPath);
    ctx.body = { success: true, message: "File renamed successfully" };
    attachRoutesInfo(ctx);
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Rename failed", details: err.message };
  }
});

// Route: POST /files/rename-multiple/*path - Rename multiple files
router.post("/rename-multiple/(.*)", async (ctx) => {
  const subPath = ctx.params[0] || "";
  const { renames } = ctx.request.body; // expects array of { oldName, newName }
  const dirPath = resolveFullPath(ROOT_DIR, subPath);

  try {
    for (const { oldName, newName } of renames) {
      const oldPath = path.join(dirPath, oldName);
      const newPath = path.join(dirPath, newName);
      await fs.rename(oldPath, newPath);
    }
    ctx.body = { success: true, message: "Files renamed successfully" };
    attachRoutesInfo(ctx);
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Bulk rename failed", details: err.message };
  }
});

module.exports = router;
