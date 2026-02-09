const db = require("../../config/database");

// Insert new module
exports.insertModule = async (client, data) => {
  const { rows } = await client.query(
    `
    INSERT INTO modules
    (module_code, name, short_description, description)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      data.module_code,
      data.name,
      data.short_description,
      data.description
    ]
  );
  return rows[0];
};

// Get modules for institution setup 
exports.getModulesForInstitution = async (
  institutionId,
  instituteType
) => {
  const { rows } = await db.query(
    `
    SELECT
      m.id AS module_id,
      m.name,
      mic.lock_mode,
      mic.is_required,
      COALESCE(im.is_enabled, false) AS is_enabled
    FROM modules m
    JOIN module_institute_config mic
      ON mic.module_id = m.id
    LEFT JOIN institution_modules im
      ON im.module_id = m.id
     AND im.institution_id = $1
    WHERE mic.institute_type = $2
    ORDER BY m.name
    `,
    [institutionId, instituteType]
  );
  return rows;
};

// Enable or disable module for institution
exports.upsertInstitutionModule = async (
  institutionId,
  moduleId,
  isEnabled
) => {
  const { rows } = await db.query(
    `
    INSERT INTO institution_modules
      (institution_id, module_id, is_enabled)
    VALUES ($1, $2, $3)
    ON CONFLICT (institution_id, module_id)
    DO UPDATE SET is_enabled = EXCLUDED.is_enabled
    RETURNING *
    `,
    [institutionId, moduleId, isEnabled]
  );
  return rows[0];
};

// Get lock mode for module based on institution type
exports.getLockMode = async (moduleId, institutionId) => {
  const { rows } = await db.query(
    `
    SELECT mic.lock_mode
    FROM module_institute_config mic
    JOIN institution i
      ON i.institute_type = mic.institute_type
    WHERE mic.module_id = $1
      AND i.id = $2
    `,
    [moduleId, institutionId]
  );
  return rows[0]?.lock_mode;
};

// Get enabled modules for runtime use
exports.getEnabledModules = async (institutionId) => {
  const { rows } = await db.query(
    `
    SELECT
      m.id AS module_id,
      m.name
    FROM institution_modules im
    JOIN modules m ON m.id = im.module_id
    WHERE im.institution_id = $1
      AND im.is_enabled = true
    `,
    [institutionId]
  );
  return rows;
};

// Auto seed modules on institution creation
exports.seedInstitutionModules = async (
  client,
  institutionId,
  instituteType
) => {
  await client.query(
    `
    INSERT INTO institution_modules (institution_id, module_id, is_enabled)
    SELECT
      $1,
      mic.module_id,
      CASE
        WHEN mic.lock_mode = 'lock_enabled'
          OR mic.is_required = true
        THEN true
        ELSE false
      END
    FROM module_institute_config mic
    WHERE mic.institute_type = $2
    `,
    [institutionId, instituteType]
  );
};

// Insert institute-specific module rules
exports.insertInstituteConfig = async (client, moduleId, cfg) => {
  await client.query(
    `
    INSERT INTO module_institute_config
    (module_id, institute_type, lock_mode, is_required)
    VALUES ($1,$2,$3,$4)
    `,
    [
      moduleId,
      cfg.institute_type,
      cfg.lock_mode,
      cfg.is_required || false
    ]
  );
};

// Insert permissions under a module
exports.insertModulePermissions = async (
  moduleId,
  permissions
) => {
  const results = [];

  for (const p of permissions) {
    const { rows } = await db.query(
      `
      INSERT INTO module_permissions
      (module_id, permission_key, title, description)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (permission_key) DO NOTHING
      RETURNING *
      `,
      [
        moduleId,
        p.permission_key,
        p.title,
        p.description
      ]
    );

    if (rows.length) results.push(rows[0]);
  }

  return results;
};
