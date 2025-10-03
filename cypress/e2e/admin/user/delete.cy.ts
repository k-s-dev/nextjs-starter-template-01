import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
  cy.task("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "update");
    })
    .as("user02UrlUpdate");
  cy.task("db:getUserByEmail", "test-user-02@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user02UrlDetail");
  cy.task("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.delete flow", () => {
  it("should not delete user when signIn as non superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.get("@user01UrlDetail").then((url) => {
      cy.visit(url);
      cy.document().should("not.be.visible");
    });
  });

  it("should delete single user when signIn as superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.get("@user02UrlDetail").then((url) => {
      cy.visit(url);
    });
    cy.getByData("delete-user-button").eq(0).click();
    cy.getByData("confirm-delete-button").click();
    cy.visit(routes.admin.user.read);
    cy.contains("test-user-02@example.com").should("not.be.true");
  });

  it("should delete many users when signed in as superuser", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.user.read);
    cy.get("input[type='checkbox']").eq(2).click();
    cy.get("input[type='checkbox']").eq(3).click();
    cy.getByData("delete-all-icon").eq(0).click();
    cy.getByData("confirm-delete-button").click();
    cy.contains("test-user-01@example.com").should("be.visible");
    cy.contains("test-user-02@example.com").should("not.be.true");
  });
});
