import "./commands";

before(() => {
  cy.task("db:reset");
  cy.task("db:seed");
});
