const db = require("../../config/database");

// Create tenant entry
exports.createTenant = async (client, data) => {
  const { rows } = await client.query(
    `INSERT INTO tenant (tenant_kind, default_language)
     VALUES ($1,$2)
     RETURNING *`,
    [data.tenant_kind, data.default_language]
  );
  return rows[0];
};

// Create institution under tenant
exports.createInstitution = async (client, tenantId, data) => {
  const { rows } = await client.query(
    `INSERT INTO institution
     (tenant_id, institute_type, name, tagline, about, primary_language)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      tenantId,
      data.institute_type,
      data.name,
      data.tagline,
      data.about,
      data.primary_language
    ]
  );
  return rows[0];
};

// Create super admin user for institution
exports.createSuperAdmin = async (
  client,
  instituteId,
  admin,
  passwordHash
) => {
  const { rows } = await client.query(
    `INSERT INTO users
     (institute_id, role, email, mobile, password_hash)
     VALUES ($1,'SUPER_ADMIN',$2,$3,$4)
     RETURNING id,email`,
    [instituteId, admin.email, admin.mobile, passwordHash]
  );
  return rows[0];
};

// Save institution theme settings
exports.createTheme = async (client, instituteId, theme) => {
  await client.query(
    `INSERT INTO institution_theme_settings
     (institute_id, logo_url, splash_color, show_logo, show_tagline)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      instituteId,
      theme.logo_url,
      theme.splash_color,
      theme.show_logo,
      theme.show_tagline
    ]
  );
};

// Add supported languages for institution
exports.addLanguages = async (client, instituteId, languages) => {
  for (const lang of languages) {
    await client.query(
      `INSERT INTO institution_languages
       (institute_id, language_code)
       VALUES ($1,$2)`,
      [instituteId, lang]
    );
  }
};

// Get tenant
exports.getTenantById = async (tenantId) => {
  const { rows } = await db.query(
    `SELECT * FROM tenant WHERE id = $1`,
    [tenantId]
  );
  return rows[0];
};

// Get institution
exports.getInstitutionById = async (institutionId) => {
  const { rows } = await db.query(
    `SELECT * FROM institution WHERE id = $1`,
    [institutionId]
  );
  return rows[0];
};

// Get institution theme
exports.getInstitutionTheme = async (institutionId) => {
  const { rows } = await db.query(
    `SELECT * FROM institution_theme_settings WHERE institute_id = $1`,
    [institutionId]
  );
  return rows[0];
};

// Get institution languages
exports.getInstitutionLanguages = async (institutionId) => {
  const { rows } = await db.query(
    `SELECT language_code FROM institution_languages WHERE institute_id = $1`,
    [institutionId]
  );
  return rows.map(row => row.language_code);
};