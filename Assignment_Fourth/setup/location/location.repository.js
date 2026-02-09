// Insert or update institution address
exports.upsertAddress = async (client, data) => {
    await client.query(
      `
      INSERT INTO institution_address
      (institution_id, country, state, city, pincode, address, latitude, longitude)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (institution_id)
      DO UPDATE SET
        country = EXCLUDED.country,
        state = EXCLUDED.state,
        city = EXCLUDED.city,
        pincode = EXCLUDED.pincode,
        address = EXCLUDED.address,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = now()
      `,
      [
        data.institution_id,
        data.address.country,
        data.address.state,
        data.address.city,
        data.address.pincode,
        data.address.address,
        data.location?.latitude,
        data.location?.longitude
      ]
    );
  };
  
  // Insert or update regional settings
  exports.upsertRegional = async (client, data) => {
    await client.query(
      `
      INSERT INTO institution_regional_settings
      (institution_id, time_zone)
      VALUES ($1,$2)
      ON CONFLICT (institution_id)
      DO UPDATE SET
        time_zone = EXCLUDED.time_zone,
        updated_at = now()
      `,
      [
        data.institution_id,
        data.regional.time_zone
      ]
    );
  };
  
 // Replace institution working days
  exports.replaceWorkingDays = async (
    client,
    institutionId,
    days
  ) => {
    await client.query(
      `DELETE FROM institution_working_days
       WHERE institution_id = $1`,
      [institutionId]
    );
  
    for (const day of days) {
      await client.query(
        `INSERT INTO institution_working_days
         (institution_id, day)
         VALUES ($1,$2)`,
        [institutionId, day]
      );
    }
  };
  