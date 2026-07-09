const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "..", "..", "storage", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

process.stdout.write(schema.trim() + "\n");
