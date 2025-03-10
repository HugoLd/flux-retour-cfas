const { addHours, isBefore } = require("date-fns");
const { UserModel } = require("../model");
const { generateRandomAlphanumericPhrase } = require("../utils/miscUtils");
const sha512Utils = require("../utils/sha512Utils");
const { validatePassword } = require("../domain/password");
const { escapeRegExp } = require("../utils/regexUtils");

const rehashPassword = (user, password) => {
  user.password = sha512Utils.hash(password);
  return user.save();
};

const PASSWORD_UPDATE_TOKEN_VALIDITY_HOURS = 48;

const isUserPasswordUpdatedTokenValid = (user) => {
  return Boolean(user.password_update_token_expiry) && isBefore(new Date(), user.password_update_token_expiry);
};

module.exports = async () => {
  return {
    authenticate: async (username, password) => {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return null;
      }

      const current = user.password;
      if (sha512Utils.compare(password, current)) {
        if (sha512Utils.isTooWeak(current)) {
          await rehashPassword(user, password);
        }
        return user.toObject();
      }
      return null;
    },
    getUser: (username) => UserModel.findOne({ username }),
    getUserById: async (_id) => {
      const user = await UserModel.findById(_id).lean();

      if (!user) {
        throw new Error(`Unable to find user`);
      }

      return user;
    },
    getAll: async () => {
      return await UserModel.find().lean();
    },
    createUser: async (userProps) => {
      const username = userProps.username;
      const password = userProps.password || generateRandomAlphanumericPhrase(80); // 1 hundred quadragintillion years to crack https://www.security.org/how-secure-is-my-password/
      const passwordHash = sha512Utils.hash(password);
      const permissions = userProps.permissions || [];
      const network = userProps.network || null;
      const region = userProps.region || null;
      const organisme = userProps.organisme || null;
      const email = userProps.email || null;

      const user = new UserModel({
        username,
        password: passwordHash,
        email,
        permissions,
        network,
        region,
        organisme,
        created_at: new Date(),
      });

      await user.save();
      return user.toObject();
    },
    generatePasswordUpdateToken: async (username) => {
      const user = await UserModel.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      const token = generateRandomAlphanumericPhrase(80); // 1 hundred quadragintillion years to crack https://www.security.org/how-secure-is-my-password/

      user.password_update_token = token;
      // token will only be valid for duration defined in PASSWORD_UPDATE_TOKEN_VALIDITY_HOURS
      user.password_update_token_expiry = addHours(new Date(), PASSWORD_UPDATE_TOKEN_VALIDITY_HOURS);
      await user.save();
      return token;
    },
    updatePassword: async (updateToken, password) => {
      if (!validatePassword(password)) throw new Error("Password must be valid (at least 16 characters)");
      // find user with password_update_token and ensures it exists
      const user = await UserModel.findOne({
        password_update_token: updateToken,
        password_update_token_expiry: { $ne: null },
      });

      // throw if user is not found
      if (!user) throw new Error("User not found");

      // token must be valid
      if (!isUserPasswordUpdatedTokenValid(user)) {
        throw new Error("Password update token has expired");
      }

      // we store password hashes only
      const passwordHash = sha512Utils.hash(password);
      user.password = passwordHash;
      user.password_update_token = null;
      user.password_update_token_expiry = null;

      await user.save();

      return user.toObject();
    },
    removeUser: async (username) => {
      const user = await UserModel.findOne({ username });
      if (!user) {
        throw new Error(`Unable to find user ${username}`);
      }

      return await user.deleteOne({ username });
    },
    searchUsers: async (searchCriteria) => {
      const { searchTerm } = searchCriteria;

      const matchStage = {};
      if (searchTerm) {
        matchStage.$or = [
          { username: new RegExp(escapeRegExp(searchTerm), "i") },
          { email: new RegExp(escapeRegExp(searchTerm), "i") },
          { organisme: new RegExp(escapeRegExp(searchTerm), "i") },
          { region: new RegExp(escapeRegExp(searchTerm), "i") },
        ];
      }

      const sortStage = { username: 1 };

      const found = await UserModel.aggregate([{ $match: matchStage }, { $sort: sortStage }]);

      return found.map((user) => {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          permissions: user.permissions,
          network: user.network,
          region: user.region,
          organisme: user.organisme,
          created_at: user.created_at,
        };
      });
    },
    updateUser: async (_id, { username, email, network, region, organisme }) => {
      const user = await UserModel.findById(_id);

      if (!user) {
        throw new Error(`Unable to find user`);
      }

      const updated = await UserModel.findByIdAndUpdate(
        _id,
        {
          username,
          email,
          network,
          region,
          organisme,
        },
        { new: true }
      );

      return updated;
    },
  };
};
