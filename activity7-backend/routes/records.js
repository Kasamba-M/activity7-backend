const router = require("express").Router();
const pool = require("../db");

const ALLOWED_STATUSES = ["Pending", "In progress", "Completed"];

function parseId(value) {
  // Accept only positive whole-number IDs.
  if (!/^[1-9]\d*$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function validateRecord(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const fields = ["title", "category", "description", "status"];
  for (const field of fields) {
    if (typeof body[field] !== "string") {
      return { error: `${field} must be a string.` };
    }
  }

  const record = {
    title: body.title.trim(),
    category: body.category.trim(),
    description: body.description.trim(),
    status: body.status.trim()
  };

  if (record.title.length < 3 || record.title.length > 80) {
    return { error: "Title must have 3 to 80 characters." };
  }
  if (record.category.length < 2 || record.category.length > 40) {
    return { error: "Category must have 2 to 40 characters." };
  }
  if (record.description.length < 5 || record.description.length > 300) {
    return { error: "Description must have 5 to 300 characters." };
  }
  if (!ALLOWED_STATUSES.includes(record.status)) {
    return { error: "Status must be Pending, In progress or Completed." };
  }

  return { record };
}

// GET /api/records – read all records.
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records ORDER BY id"
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return next(error);
  }
});

// GET /api/records/:id – read one record.
router.get("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "ID must be a positive whole number." });
  }

  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Record with id ${id} was not found.` });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// POST /api/records – create a record.
router.post("/", async (req, res, next) => {
  const validation = validateRecord(req.body);
  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  const { title, category, description, status } = validation.record;
  try {
    const result = await pool.query(
      `INSERT INTO records (title, category, description, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, category, description, status`,
      [title, category, description, status]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// PUT /api/records/:id – replace all four editable fields.
router.put("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "ID must be a positive whole number." });
  }

  const validation = validateRecord(req.body);
  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  const { title, category, description, status } = validation.record;
  try {
    const result = await pool.query(
      `UPDATE records
       SET title = $1, category = $2, description = $3, status = $4
       WHERE id = $5
       RETURNING id, title, category, description, status`,
      [title, category, description, status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Record with id ${id} was not found.` });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/records/:id – delete a record.
router.delete("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "ID must be a positive whole number." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM records WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Record with id ${id} was not found.` });
    }
    return res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
