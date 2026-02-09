const db = require("../../config/database");
const repo = require("./module.repository");


//  CREATE MODULE (ADMIN)
exports.createModule = async (payload) => {
  if (!payload.module?.module_code)
    throw new Error("module_code required");

  const client = await db.connect();

  try {
    await client.query("BEGIN");
  // Insert module master
    const module = await repo.insertModule(
      client,
      payload.module
    );
 // Insert institute-wise module rules
    for (const cfg of payload.institute_config || []) {
      await repo.insertInstituteConfig(
        client,
        module.id,
        cfg
      );
    }

    await client.query("COMMIT");
    return module;

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};


// Get modules for institution setup 
exports.getModulesForInstitution = async (
  institutionId,
  instituteType
) => {
  if (!institutionId)
    throw new Error("institutionId required");

  if (!instituteType)
    throw new Error("instituteType required");

  return repo.getModulesForInstitution(
    institutionId,
    instituteType
  );
};

// Enable or disable module for institution
exports.assignModules = async ({ institution_id, module_id, is_enabled }) => {
  if (!institution_id || !module_id)
    throw new Error("institution_id and module_id required");

  const lock = await repo.getLockMode(module_id, institution_id);

  if (lock === "lock_enabled" && is_enabled === false) {
    throw new Error("This module cannot be disabled");
  }

  return repo.upsertInstitutionModule(
    institution_id,
    module_id,
    is_enabled
  );
};

// Get enabled modules for runtime use
exports.getEnabledModules = async (institutionId) => {
  if (!institutionId) throw new Error("institutionId required");
  return repo.getEnabledModules(institutionId);
};

// AUTO SEED (CALL FROM INSTITUTION SERVICE)
exports.seedInstitutionModules = async (
  client,
  institutionId,
  instituteType
) => {
  await repo.seedInstitutionModules(
    client,
    institutionId,
    instituteType
  );
};

// Auto attach modules based on institute type
exports.seedModulesForInstitution = async (payload) => {
  if (!payload.institution_id)
    throw new Error("institution_id required");

  if (!payload.institute_type)
    throw new Error("institute_type required");

  const client = await db.connect();
  try {
    await client.query("BEGIN");

// Auto attach modules based on institute type
    await repo.seedInstitutionModules(
      client,
      payload.institution_id,
      payload.institute_type
    );

    await client.query("COMMIT");
    return { institution_id: payload.institution_id };

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

// Create permissions under a module
exports.createModulePermissions = async (payload) => {
  if (!payload.module_id)
    throw new Error("module_id required");

  const permissions = payload.permissions
    ? payload.permissions
    : [payload];

  for (const p of permissions) {
    if (!p.permission_key)
      throw new Error("permission_key required");
  }

  return repo.insertModulePermissions(
    payload.module_id,
    permissions
  );
};
