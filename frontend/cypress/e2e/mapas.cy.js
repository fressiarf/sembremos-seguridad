describe('Semáforos y Mapas', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#EntradaIdentificador').type('admin@msp.go.cr');
    cy.get('#EntradaPassword').type('password123');
    cy.get('.BotonPrincipalAcceso').click();
  });

  it('Debe renderizar los mapas territoriales y los semáforos de KPIs en el Dashboard', () => {
    cy.visit('/dashboard');

    // Validar que el componente del mapa exista (ej: Leaflet, Echarts, Google Maps)
    // Buscamos un selector genérico común para mapas o canvas
    cy.get('.echarts-for-react, canvas, .leaflet-container').should('exist');

    // Validar que los semáforos de progreso estén visibles (buscando colores típicos o clases de semáforo)
    // Esto dependerá mucho de cómo esté implementado el semáforo visualmente en React
    cy.get('.text-green-500, .bg-green-500, .text-yellow-500, .bg-yellow-500, .text-red-500, .bg-red-500')
      .should('exist');
      
    // Validar existencia de datos numéricos en los KPIs
    cy.contains(/%|Avance|Progreso/).should('be.visible');
  });
});
