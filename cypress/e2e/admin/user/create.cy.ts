import { Prisma } from "@/generated/prisma/client";
import { routes } from "@/lib/utils/routeMapper";

beforeEach(() => {
  cy.task<Prisma.UserModel>("db:getUserByEmail", "test-user-01@example.com")
    .then((user) => {
      return routes.admin.user.withId(user?.id as string, "detail");
    })
    .as("user01UrlDetail");
});

describe("admin.user.create flow", () => {
  it("should not navigate to the /user/create page without authentication", () => {
    cy.visit(routes.admin.user.create);
    cy.document().its("readyState").should("eq", "complete");
    cy.location("pathname").should("eq", "/signIn");
  });

  it("should not navigate to /user/create page without superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-02@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.visit(routes.generic.home);
    cy.visit(routes.admin.user.create);
    cy.contains("Unauthorized").should("exist");
  });

  it("should navigate to user/create page with superuser authentication", () => {
    cy.visit(routes.authentication.signIn);
    cy.getByData("signIn-email").type("test-user-01@example.com");
    cy.getByData("signIn-password").type("12345678");
    cy.getByData("signIn-btn").click();
    cy.visit(routes.generic.home);
    cy.location("pathname").should("eq", "/");
    cy.visit(routes.admin.user.create);
    cy.location("pathname").should("eq", "/admin/user/create");
    cy.get("#user-create-form").should("be.visible");
  });

  it(
    "should create user with superuser signIn",
    {
      retries: {
        runMode: 4,
        openMode: 0,
      },
    },
    () => {
      const userEmail = "test-user-05@example.com";
      const userName = "user 05";
      cy.visit(routes.authentication.signIn);
      cy.getByData("signIn-email").type("test-user-01@example.com");
      cy.getByData("signIn-password").type("12345678");
      cy.getByData("signIn-btn").click();
      cy.visit(routes.generic.home);
      cy.location("pathname").should("eq", "/");
      cy.getByData("nav-user-avatar").should("be.visible");
      cy.visit(routes.admin.user.create);
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="name"]').type(userName);
      cy.getByData("user-create-form-submit-button").eq(0).click();
      cy.location("pathname").should("eq", "/admin/user/list");
      cy.contains(userEmail).click();
      cy.location("pathname").should("contain", "/admin/user/");
      cy.location("pathname").should("contain", "/detail");
      cy.get("input[name='email']").should("have.value", userEmail);
    },
  );
});
