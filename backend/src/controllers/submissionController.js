const path = require("path");
const { pool } = require("../config/db");
const { safelyRemoveFile } = require("../utils/file");
const { validateSubmissionPayload } = require("../validators/submissionValidator");

function mapSubmissionRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    attachmentFileName: row.attachment_file_name,
    attachmentPath: row.attachment_path,
    createdAt: row.created_at,
  };
}

async function createSubmission(req, res, next) {
  const validation = validateSubmissionPayload(req.body);

  if (!validation.isValid) {
    if (req.file) {
      await safelyRemoveFile(req.file.path);
    }

    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  if (!req.file) {
    return res.status(422).json({
      success: false,
      message: "Attachment file is required.",
      errors: {
        attachment: "Attachment file is required.",
      },
    });
  }

  const { fullName, email, phone, city } = validation.normalized;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.execute(
      "SELECT id FROM submissions WHERE email = ? LIMIT 1",
      [email],
    );

    if (existingRows.length > 0) {
      await safelyRemoveFile(req.file.path);
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "A submission with this email already exists.",
      });
    }

    const relativeAttachmentPath = path.posix.join(
      "uploads",
      path.basename(req.file.path),
    );

    const [result] = await connection.execute(
      `INSERT INTO submissions
        (full_name, email, phone, city, attachment_file_name, attachment_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        phone,
        city,
        req.file.originalname,
        relativeAttachmentPath,
      ],
    );

    const [rows] = await connection.execute(
      "SELECT * FROM submissions WHERE id = ?",
      [result.insertId],
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Submission created successfully.",
      data: mapSubmissionRow(rows[0]),
    });
  } catch (error) {
    await connection.rollback();

    if (req.file) {
      await safelyRemoveFile(req.file.path);
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A submission with this email already exists.",
      });
    }

    return next(error);
  } finally {
    connection.release();
  }
}

async function listSubmissions(req, res, next) {
  const search = (req.query.search || "").trim();
  const name = (req.query.name || "").trim();
  const email = (req.query.email || "").trim();
  const parsedLimit = Number(req.query.limit || 50);
  const parsedOffset = Number(req.query.offset || 0);
  const limit = Number.isFinite(parsedLimit) ? Math.min(parsedLimit, 100) : 50;
  const offset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
  const sort = (req.query.sort || "newest").toLowerCase() === "oldest" ? "ASC" : "DESC";
  const conditions = [];
  const values = [];

  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push("(full_name LIKE ? OR email LIKE ?)");
    values.push(searchTerm, searchTerm);
  }

  if (name) {
    conditions.push("full_name LIKE ?");
    values.push(`%${name}%`);
  }

  if (email) {
    conditions.push("email LIKE ?");
    values.push(`%${email}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM submissions ${whereClause}`,
      values,
    );

    const [rows] = await pool.execute(
      `SELECT * FROM submissions
       ${whereClause}
       ORDER BY created_at ${sort}
       LIMIT ${limit} OFFSET ${offset}`,
      values,
    );

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully.",
      data: rows.map(mapSubmissionRow),
      meta: {
        total: countRows[0].total,
        limit,
        offset,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getSubmissionById(req, res, next) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM submissions WHERE id = ? LIMIT 1",
      [req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission fetched successfully.",
      data: mapSubmissionRow(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
}

async function downloadAttachment(req, res, next) {
  try {
    const [rows] = await pool.execute(
      "SELECT attachment_path, attachment_file_name FROM submissions WHERE id = ? LIMIT 1",
      [req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const row = rows[0];
    const absolutePath = path.join(process.cwd(), row.attachment_path);

    return res.download(absolutePath, row.attachment_file_name);
  } catch (error) {
    return next(error);
  }
}

async function deleteSubmission(req, res, next) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT * FROM submissions WHERE id = ? LIMIT 1",
      [req.params.id],
    );

    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const row = rows[0];

    await connection.execute("DELETE FROM submissions WHERE id = ?", [req.params.id]);
    await connection.commit();
    await safelyRemoveFile(path.join(process.cwd(), row.attachment_path));

    return res.status(200).json({
      success: true,
      message: "Submission deleted successfully.",
    });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
}

async function getSubmissionStats(req, res, next) {
  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) AS total FROM submissions",
    );

    return res.status(200).json({
      success: true,
      message: "Submission stats fetched successfully.",
      data: {
        total: rows[0].total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createSubmission,
  listSubmissions,
  getSubmissionById,
  downloadAttachment,
  deleteSubmission,
  getSubmissionStats,
};
