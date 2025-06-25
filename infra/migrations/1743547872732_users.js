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
        type: "varchar(255)",
        notNull: true,
        unique: true,
      },
      password: {
        type: "varchar(60)",
        notNull: true,
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("timezone('utc', now())"),
      },
      updated_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("timezone('utc', now())"),
      },
    },
    { ifNotExists: true },
  );
};

exports.down = false;
