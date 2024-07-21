const Validator = require("fastest-validator");

const v = new Validator();

const userSchema = {
  biography: { type: "string", trim: true, min: 8, max: 255 },
  avatar: { type: "string", trim: true, min: 8 },

  $$strict: true, // no additional properties allowed
};

const userAcoountSchema = {
  accountUserName: {
    type: "string",
    trim: true,
    min: 3,
    max: 255,
    optional: true,
  },
  accountId: { type: "string", trim: true, min: 3, max: 255, optional: true },
  accountEmail: { type: "email", normalize: true, optional: true },
  accountPassword: { type: "string", trim: true, min: 3, optional: true },
  accountType: {
    type: "enum",
    values: ["xbox", "psn", "epic-game", "facebook", "nintendo"],
    optional: true,
  },
  $$strict: true,
};

exports.checkUser = v.compile(userSchema);

exports.checkUserGameAccount = v.compile(userAcoountSchema);
