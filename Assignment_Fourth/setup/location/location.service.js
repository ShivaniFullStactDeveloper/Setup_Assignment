const db = require("../../config/database");
const repo = require("./location.repository");

// Save institution location & regional configuration
exports.saveLocation = async (payload) => {
  if (!payload.institution_id)
    throw new Error("institution_id required");

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    //  Address
    await repo.upsertAddress(client, payload);

    //  Regional settings
    await repo.upsertRegional(client, payload);

    // Update working days
    await repo.replaceWorkingDays(
      client,
      payload.institution_id,
      payload.working_days || []
    );
 // Commit transaction
    await client.query("COMMIT");

    return { institution_id: payload.institution_id };

  } catch (e) {
    // Rollback on error
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Release DB connection
    client.release();
  }
};
