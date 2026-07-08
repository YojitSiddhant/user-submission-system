const fs = require("fs/promises");
const path = require("path");

async function safelyRemoveFile(filePath) {
  if (!filePath) {
    return;
  }

  const absolutePath = path.resolve(filePath);

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

module.exports = {
  safelyRemoveFile,
};
