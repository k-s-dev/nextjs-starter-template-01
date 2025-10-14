import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task("db:seed");
  cy.task("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "update");
    })
    .as("user01UrlUpdate");
  cy.task("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.update flow", () => {
  it("should not navigate to the /user/update page without authentication", () => {
    cy.get("@user01UrlUpdate").then((url) => {
      cy.visit(url);
    });
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to /user/update page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.get("@user01UrlUpdate").then((url) => {
      cy.visit(url);
    });
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should navigate to user/update page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.location("pathname").should("eq", "/");
    cy.get("@user01UrlUpdate").then((url) => {
      cy.visit(url);
      cy.location("pathname").should("eq", url);
    });
    cy.get("#user-update-form").should("be.visible");
  });

  it(
    "should update user with superuser authentication",
    {
      retries: {
        runMode: 4,
        openMode: 4,
      },
    },
    () => {
      cy.visit(routes.authentication.signIn);
      cy.getByData("signIn-email").type("test-user-01@example.com");
      cy.getByData("signIn-password").type("12345678");
      cy.getByData("signIn-btn").click();
      cy.location("pathname").should("eq", "/");
      cy.get("@user01UrlUpdate").then((url) => {
        cy.visit(url);
      });
      cy.get('input[name="name"]').as("input").type("superuser 01");
      cy.getByData("save-user-updates-button").eq(0).click();
      cy.get("@user01UrlUpdate").then((url) => {
        cy.location("pathname").should("eq", url);
      });
    },
  );
});
