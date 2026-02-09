const db = require("../../config/database");
const repo = require("./institution.repository");
const { hashPassword } = require("../../utils/passwordUtils");
const moduleService = require("../modules/module.service");

// Setup tenant, institution, admin and default configs
exports.setupInstitution = async (payload) => {

  // Basic validation
  if (!payload.tenant)
    throw new Error("Tenant data is required");

  if (!payload.institution)
    throw new Error("Institution data is required");

  if (!payload.super_admin)
    throw new Error("Super admin data is required");

  if (!payload.languages || payload.languages.length === 0)
    throw new Error("At least one language is required");

  if (!payload.super_admin.email)
    throw new Error("Admin email is required");

  if (!payload.super_admin.password)
    throw new Error("Admin password is required");

  // Start DB transaction
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Create tenant
    const tenant = await repo.createTenant(
      client,
      payload.tenant
    );

    // Create institution
    const institution = await repo.createInstitution(
      client,
      tenant.id,
      payload.institution
    );

    // // Auto attach default modules for institution type
    await moduleService.seedInstitutionModules(
      client,
      institution.id,
      institution.institute_type
    );

    // Create super admin
    const passwordHash = await hashPassword(
      payload.super_admin.password
    );

    const admin = await repo.createSuperAdmin(
      client,
      institution.id,
      payload.super_admin,
      passwordHash
    );

    // Save theme settings (optional)
    if (payload.theme) {
      await repo.createTheme(
        client,
        institution.id,
        payload.theme
      );
    }

    // Add institution languages
    await repo.addLanguages(
      client,
      institution.id,
      payload.languages
    );

    // Commit transaction
    await client.query("COMMIT");

    return {
      tenant_id: tenant.id,
      institution_id: institution.id,
      super_admin: admin
    };

  } catch (err) {
    // Rollback on error
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // Release DB connection
    client.release();
  }
};

// Get institution by id
exports.getInstitutionById = async (institutionId) => {
  if (!institutionId)
    throw new Error("institutionId required");

  return repo.getInstitutionById(institutionId);
};

// Get tenant by id
exports.getTenantById = async (tenantId) => {
  if (!tenantId)
    throw new Error("tenantId required");

  return repo.getTenantById(tenantId);
};

// Get full institution profile
exports.getInstitutionProfile = async (institutionId) => {
  if (!institutionId)
    throw new Error("institutionId required");

  const institution = await repo.getInstitutionById(institutionId);
  const tenant = await repo.getTenantById(institution.tenant_id);
  const theme = await repo.getInstitutionTheme(institutionId);
  const languages = await repo.getInstitutionLanguages(institutionId);

  return {
    tenant,
    institution,
    theme,
    languages
  };
};