describe('Roles & Permisos (RBAC)', () => {
  it('Debe redireccionar a un editor (Municipalidad) si intenta acceder a rutas de SuperAdmin', () => {
    // 1. Visitar la página inicial de login
    cy.visit('/');
    
    // 2. Iniciar sesión como Municipalidad (Editor)
    cy.get('#EntradaIdentificador').type('muni@go.cr'); 
    cy.get('#EntradaPassword').type('password123');
    cy.get('.BotonPrincipalAcceso').click();
    
    // 3. Verificar que logre entrar y se mueva hacia su dashboard correspondiente
    cy.url().should('not.eq', Cypress.config().baseUrl + '/');
    
    // 4. Intentar forzar la navegación a la ruta de SuperAdmin (/dashboard)
    cy.visit('/dashboard');
    
    // 5. Verificar que PrivateRoutes detecte la falta de permisos y lo redirija a /
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
