exports.up = (pgm) => {
  pgm.createTable(
    "users",
    {
      id: {
        type: "uuid",
        primaryKey: "true",
        default: pgm.func("gen_random_uuid()"),
      },
      username: {
        type: "varchar(30)",
        notNull: true,
        unique: true,
      },
      email: {
        type: "varchar(254)",
        notNull: true,
        unique: true,
      },
      password: {
        type: "varchar(72)",
        notNull: true,
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("NOW()"),
      },
      updated_at: {
        type: "timestamptz",
        notNull: false,
      },
    },
    { ifNotExists: true },
  );
};

exports.down = false;
