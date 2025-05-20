const Router = require("@koa/router");
const fs = require("fs").promises;
const path = require("path");

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
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Bulk rename failed", details: err.message };
  }
});

module.exports = router;
