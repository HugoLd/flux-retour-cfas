const assert = require("assert").strict;
const { differenceInMinutes, subMinutes } = require("date-fns");
const integrationTests = require("../../../utils/integrationTests");
const users = require("../../../../src/common/components/users");
const { UserModel } = require("../../../../src/common/model");
const { apiRoles, tdbRoles } = require("../../../../src/common/roles");

integrationTests(__filename, () => {
  it("Permet de créer un utilisateur avec mot de passe", async () => {
    const { createUser } = await users();

    const created = await createUser({ username: "user", password: "password" });
    assert.equal(created.username, "user");
    assert.equal(created.permissions.length, 0);
    assert.equal(created.password.startsWith("$6$rounds="), true);

    const found = await UserModel.findOne({ username: "user" });
    assert.equal(found.username, "user");
    assert.equal(found.permissions.length, 0);
    assert.equal(found.password.startsWith("$6$rounds="), true);
  });

  it("Crée un utilisateur avec mot de passe random quand pas de mot de passe fourni", async () => {
    const { createUser } = await users();

    const created = await createUser({ username: "user" });
    assert.equal(created.username, "user");
    assert.equal(created.permissions.length, 0);
    assert.equal(created.password.startsWith("$6$rounds="), true);

    const found = await UserModel.findOne({ username: "user" });
    assert.equal(found.username, "user");
  });

  it("Permet de créer un utilisateur avec les droits d'admin", async () => {
    const { createUser } = await users();

    const user = await createUser({
      username: "userAdmin",
      password: "password",
      permissions: [apiRoles.administrator],
    });
    const found = await UserModel.findOne({ username: "userAdmin" });

    assert.equal(user.permissions.includes(apiRoles.administrator), true);
    assert.equal(found.permissions.includes(apiRoles.administrator), true);
  });

  it("Permet de créer un utilisateur avec un email, les droits de réseau et un réseau", async () => {
    const { createUser } = await users();

    const user = await createUser({
      username: "userAdmin",
      password: "password",
      permissions: [tdbRoles.network],
      email: "email@test.fr",
      network: "test",
    });
    const found = await UserModel.findOne({ username: "userAdmin" });

    assert.equal(user.permissions.includes(tdbRoles.network), true);
    assert.equal(user.network === "test", true);
    assert.equal(user.email === "email@test.fr", true);

    assert.equal(found.permissions.includes(tdbRoles.network), true);
    assert.equal(found.network === "test", true);
    assert.equal(found.email === "email@test.fr", true);
  });

  it("Permet de supprimer un utilisateur", async () => {
    const { createUser, removeUser } = await users();

    await createUser({
      username: "userToDelete",
      password: "password",
      permissions: [apiRoles.administrator],
    });
    await removeUser("userToDelete");

    const found = await UserModel.findOne({ username: "userToDelete" });
    assert.equal(found, null);
  });

  it("Vérifie que le mot de passe est valide", async () => {
    const { createUser, authenticate } = await users();

    await createUser({
      username: "user",
      password: "password",
    });
    const user = await authenticate("user", "password");

    assert.equal(user.username, "user");
  });

  it("Vérifie que le mot de passe est invalide", async () => {
    const { createUser, authenticate } = await users();

    await createUser({
      username: "user",
      password: "password",
    });
    const user = await authenticate("user", "INVALID");

    assert.equal(user, null);
  });

  describe("generatePasswordUpdateToken", () => {
    it("génère un token avec expiration à +24h", async () => {
      const { createUser, generatePasswordUpdateToken } = await users();

      // create user
      const user = await createUser({ username: "user" });

      const token = await generatePasswordUpdateToken("user");
      const userInDb = await UserModel.findOne({ _id: user._id });

      assert.equal(userInDb.password_update_token, token);
      // a few milliseconds have passed since creation
      // so we'll juste make sure expiry is in 23 hours 59 minutes
      const twentyFourHoursInMinutesIsh = 24 * 60 - 1;
      assert.equal(differenceInMinutes(userInDb.password_update_token_expiry, new Date()), twentyFourHoursInMinutesIsh);
    });

    it("renvoie une erreur quand le user n'est pas trouvé", async () => {
      const { createUser, generatePasswordUpdateToken } = await users();

      // create user
      await createUser({ username: "nope" });

      await assert.rejects(
        () => generatePasswordUpdateToken("user"),
        (err) => {
          assert.equal(err.message, "User not found");
          return true;
        }
      );
    });
  });

  describe("updatePassword", () => {
    it("modifie le mot de passe d'un user et invalide le token d'update", async () => {
      const { createUser, updatePassword, generatePasswordUpdateToken } = await users();

      // create user
      const user = await createUser({ username: "user" });
      // generate update token
      const token = await generatePasswordUpdateToken("user");

      await updatePassword(token, "new-password-strong");
      const foundAfterUpdate = await UserModel.findOne({ _id: user._id });

      assert.notEqual(foundAfterUpdate.password, user.password);
      assert.equal(foundAfterUpdate.password_update_token, null);
      assert.equal(foundAfterUpdate.password_update_token_expiry, null);
    });

    it("renvoie une erreur quand le token passé ne permet pas de retrouver le user", async () => {
      const { createUser, updatePassword, generatePasswordUpdateToken } = await users();

      // create user
      await createUser({ username: "user" });
      // generate update token
      await generatePasswordUpdateToken("user");

      await assert.rejects(
        () => updatePassword("wrong token", "new-password-strong"),
        (err) => {
          assert.equal(err.message, "User not found");
          return true;
        }
      );
    });

    it("renvoie une erreur lorsque le nouveau mot de passe est trop court", async () => {
      const { createUser, updatePassword, generatePasswordUpdateToken } = await users();

      // create user
      await createUser({ username: "user" });
      // generate update token
      const token = await generatePasswordUpdateToken("user");

      const shortPassword = "hello-world";

      await assert.rejects(
        () => updatePassword(token, shortPassword),
        (err) => {
          assert.equal(err.message, "Password must be valid (at least 16 characters)");
          return true;
        }
      );
    });

    it("renvoie une erreur lorsque l'update est fait plus de 24h après la création du token", async () => {
      const { createUser, updatePassword, generatePasswordUpdateToken } = await users();

      // create user
      await createUser({ username: "user" });
      // generate update token
      const token = await generatePasswordUpdateToken("user");
      // force password_update_token_expiry to 10 minutes ago
      const user = await UserModel.findOne({ username: "user" });
      user.password_update_token_expiry = subMinutes(new Date(), 10);
      await user.save();

      await assert.rejects(
        () => updatePassword(token, "super-long-strong-password"),
        (err) => {
          assert.equal(err.message, "Password update token has expired");
          return true;
        }
      );
    });

    it("renvoie une erreur lorsque l'update est tenté avec un token null", async () => {
      const { createUser, updatePassword } = await users();

      // create user
      await createUser({ username: "user" });

      await assert.rejects(
        () => updatePassword(null, "super-long-strong-password"),
        (err) => {
          assert.equal(err.message, "User not found");
          return true;
        }
      );
    });

    it("renvoie une erreur lorsque l'update a déjà été fait", async () => {
      const { createUser, updatePassword, generatePasswordUpdateToken } = await users();

      // create user
      await createUser({ username: "user" });

      // generate update token
      const token = await generatePasswordUpdateToken("user");

      // update password first time
      await updatePassword(token, "new-password-strong");

      // try again
      await assert.rejects(
        () => updatePassword(token, "super-long-strong-password"),
        (err) => {
          assert.equal(err.message, "User not found");
          return true;
        }
      );
    });
  });
});
