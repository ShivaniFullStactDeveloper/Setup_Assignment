const db = require("../../config/database");
const repo = require("./terminology.repository");

// Create terminology group
exports.createGroup = async (data) => {
  const client = await db.connect();
  try {
    const res = await repo.createGroup(client, data);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Get all terminology groups
exports.getGroups = async () => {
  const { rows } = await db.query(
    `SELECT * FROM terminology_groups ORDER BY display_name`
  );
  return rows;
};

// Create terminology term
exports.createTerm = async (data) => {
  const client = await db.connect();
  try {
    const res = await repo.createTerm(client, data);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Get terms by group
exports.getTermsByGroup = async (groupId) => {
  const { rows } = await db.query(
    `SELECT * FROM terminology_terms WHERE group_id = $1`,
    [groupId]
  );
  return rows;
};

// Create terminology mapping
exports.createMapping = async (data) => {
  const client = await db.connect();
  try {
    const res = await repo.createMapping(client, data);
    return res.rows[0];
  } finally {
    client.release();
  }
};

// Resolve terminology for institution and language
exports.resolveTerminology = async ({ institutionId, instituteType, language }) => {
  const { rows } = await db.query(
    `
    SELECT
      t.term_key,
      COALESCE(io.display_label, tm.display_label, t.default_label) AS label
    FROM terminology_terms t
    LEFT JOIN institution_terminology_overrides io
      ON io.term_id = t.id
     AND io.institution_id = $1
     AND io.language_code = $3
    LEFT JOIN terminology_term_mappings tm
      ON tm.term_id = t.id
     AND tm.institute_type = $2
     AND tm.language_code = $3
    `,
    [institutionId, instituteType, language]
  );
  return rows;
};
