/* jshint expr: true */

describe("Auth Module", () => {
  const userData = {
    name: "John Doe",
    email: "john@nest.test",
    password: "Secret_123",
  };

  /**
   * 1. error validation (null name, email, and password)
   * 2. error invalid email format
   * 3. error invalid password format
   * 4. registered successfully
   * 5. error duplicatee entry
   */

  describe("Register", () => {
    it("Should return error messages for validation", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        failOnStatusCode: false,
      }).then((response) => {
        // expect(response.status).to.eq(400);
        // expect(response.body.error).to.eq("Bad Request");
        // expect("name should not be empty").to.be.oneOf(response.body.message);
        // expect("email should not be empty").to.be.oneOf(response.body.message);
        // expect("password should not be empty").to.be.oneOf(
        //   response.body.message
        // );
        cy.badRequest(response, [
          "name should not be empty",
          "email should not be empty",
          "password should not be empty",
        ]);
      });
    });

    it("Should return error message for invalid email format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: userData.name,
          email: "john @ nest.test",
          password: userData.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        // expect(response.status).to.eq(400);
        // expect(response.body.error).to.eq("Bad Request");
        // expect("email must be an email").to.be.oneOf(response.body.message);
        cy.badRequest(response, ["email must be an email"]);
      });
    });

    it("Should return error message for invalid email format", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: {
          name: userData.name,
          email: userData.email,
          password: "invalidpassword",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        // expect(response.status).to.eq(400);
        // expect(response.body.error).to.eq("Bad Request");
        // expect("password is not strong enough").to.be.oneOf(
        //   response.body.message
        cy.badRequest(response, ["password is not strong enough"]);
      });
    });

    it("Registered Succesfully", () => {
      cy.resetUsers();
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: userData,
        // failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        const { id, name, email, password } = response.body.data;
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.eq("User registered successfully");
        expect(id).not.to.be.undefined;
        expect(name).to.eq("John Doe");
        expect(email).to.eq("john@nest.test");
        expect(password).to.be.undefined;
      });
    });

    it("Should return error because of duplicate email", () => {
      cy.request({
        method: "POST",
        url: "/auth/register",
        body: userData,
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.eq(500);
        expect(response.body.message).to.eq("Email already exists");
        expect(response.body.success).not.to.be.true;
      });
    });
  });

  describe.only("Login", () => {
    /**
     * 1. unauthorized on failed
     * 2. return access token on success
     */

    it("Should return unauthorized on failed", () => {
      cy.request({
        method: "POST",
        url: "/auth/login",
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        // expect(response.status).to.eq(401);
        // expect(response.body.message).to.eq("Unauthorized");
        cy.unauthorized(response);
      });

      cy.request({
        method: "POST",
        url: "/auth/login",
        body: {
          name: userData.name,
          email: userData.email,
          password: "wrongpassword",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        // expect(response.status).to.eq(401);
        // expect(response.body.message).to.eq("Unauthorized");
        cy.unauthorized(response);
      });
    });

    it("Should return access token on success", () => {
      cy.request({
        method: "POST",
        url: "/auth/login",
        body: userData,
      }).then((response) => {
        cy.log(response);
        // expect(response.body.data.access_token).not.to.be.undefined;
        // expect(response.access_token).to.be.undefined;
        // expect(response.status).to.eq(201);
        // expect(response.body.message).to.eq("Login success");
        // expect(response.body.success).to.be.true;
        cy.authorized(response);
      });
    });
  });
});
