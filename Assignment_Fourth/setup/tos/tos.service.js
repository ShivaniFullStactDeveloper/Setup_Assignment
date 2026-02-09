const db = require("../../config/database");
const repo = require("./tos.repository");

// Create terms of service with institute mapping
exports.createTos = async (payload) => {
  // Basic validation
  if (!payload.tenant_id) throw new Error("tenant_id required");
  if (!payload.name) throw new Error("ToS name required");
  if (!payload.content) throw new Error("content required");

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Insert ToS master record
    const tos = await repo.insertTos(client, payload);

    // Map ToS to institute types
    for (const type of payload.institute_types) {
      await repo.insertInstituteType(client, tos.id, type);
    }

    await client.query("COMMIT");
    return tos;

  } catch (e) {
    // Rollback on error
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Release DB connection
    client.release();
  }
};

// Get active ToS for institution
exports.getActiveTos = async ({ institutionId }) => {
  if (!institutionId)
    throw new Error("institutionId required");

  return repo.fetchActiveTos(institutionId);
};

// Accept terms of service
exports.acceptTos = async (payload) => {
  if (!payload.tos_id || !payload.institution_id)
    throw new Error("tos_id & institution_id required");

  await repo.insertAcceptance(payload);
};
