// Create terminology group
exports.createGroup = (client, data) => {
    return client.query(
      `INSERT INTO terminology_groups (group_key, display_name)
       VALUES ($1, $2)
       RETURNING *`,
      [data.group_key, data.display_name]
    );
  };
  
  // Create terminology term under group
  exports.createTerm = (client, data) => {
    return client.query(
      `INSERT INTO terminology_terms (group_id, term_key, default_label)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.group_id, data.term_key, data.default_label]
    );
  };
  
  // Create or update terminology mapping
  exports.createMapping = (client, data) => {
    return client.query(
      `INSERT INTO terminology_term_mappings
       (term_id, institute_type, language_code, display_label)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (term_id, institute_type, language_code)
       DO UPDATE SET display_label = EXCLUDED.display_label
       RETURNING *`,
      [
        data.term_id,
        data.institute_type,
        data.language_code,
        data.display_label
      ]
    );
  };
  
  // Update terminology group
  exports.updateGroup = (client, id, name) => {
    return client.query(
      `UPDATE terminology_groups
       SET name = $1
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );
  };
  
  // Delete terminology group
  exports.deleteGroup = (client, id) => {
    return client.query(
      `DELETE FROM terminology_groups WHERE id = $1`,
      [id]
    );
  };
  
  // Update terminology term
  exports.updateTerm = (client, id, label) => {
    return client.query(
      `UPDATE terminology_terms
       SET default_label = $1
       WHERE idid = $2
       RETURNING *`,
      [label, id]
    );
  };
  
  // Delete terminology term
  exports.deleteTerm = (client, id) => {
    return client.query(
      `DELETE FROM terminology_terms WHERE id = $1`,
      [id]
    );
  };
  
  // Update terminology mapping
  exports.updateMapping = (client, id, label) => {
    return client.query(
      `UPDATE terminology_term_mappings
       SET display_label = $1
       WHERE id = $2
       RETURNING *`,
      [label, id]
    );
  };
  
  // Delete terminology mapping
  exports.deleteMapping = (client, id) => {
    return client.query(
      `DELETE FROM terminology_term_mappings WHERE id = $1`,
      [id]
    );
  };
  
  // Delete institution-level terminology override
  exports.deleteOverride = (client, id) => {
    return client.query(
      `DELETE FROM institution_terminology_overrides WHERE id = $1`,
      [id]
    );
  };
  