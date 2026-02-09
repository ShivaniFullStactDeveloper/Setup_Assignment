const db = require('../../config/database');

// Insert new terms of service
exports.insertTos = async (client, data) => {
  const { rows } = await client.query(
    `INSERT INTO terms_of_service
     (tenant_id, name, type, version, content,
      effective_from, expiry_date, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      data.tenant_id,
      data.name,
      data.type,
      data.version,
      data.content,
      data.effective_from,
      data.expiry_date,
      data.status
    ]
  );
  return rows[0];
};

// Map ToS to institute type
exports.insertInstituteType = async (client, tosId, type) => {
  await client.query(
    `INSERT INTO tos_institute_types (tos_id, institute_type)
     VALUES ($1,$2)`,
    [tosId, type]
  );
};

// Fetch active ToS for institution
exports.fetchActiveTos = async (institutionId) => {
  const { rows } = await db.query(
    `
    SELECT t.*
    FROM terms_of_service t
    JOIN tos_institute_types it ON it.tos_id = t.id
    JOIN institution i ON i.institute_type = it.institute_type
    WHERE i.id = $1
      AND t.status = 'active'
      AND CURRENT_DATE BETWEEN t.effective_from AND t.expiry_date
    `,
    [institutionId]
  );
  return rows[0];
};

// Record ToS acceptance
exports.insertAcceptance = async ({ tos_id, institution_id, accepted_by }) => {
  await db.query(
    `INSERT INTO tos_acceptance
     (tos_id, institution_id, accepted_by)
     VALUES ($1,$2,$3)`,
    [tos_id, institution_id, accepted_by]
  );
};
