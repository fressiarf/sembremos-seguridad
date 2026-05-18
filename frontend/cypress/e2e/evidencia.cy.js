describe('Carga de Evidencia y KPIs', () => {
  beforeEach(() => {
    // Iniciar sesión y navegar a la sección de actividades antes de cada prueba
    cy.visit('/');
    cy.get('#EntradaIdentificador').type('muni@go.cr');
    cy.get('#EntradaPassword').type('password123');
    cy.get('.BotonPrincipalAcceso').click();
    cy.visit('/actividades'); // Asumiendo esta ruta
  });

  it('Debe permitir subir un archivo PDF como evidencia', () => {
    // Seleccionar una actividad específica
    cy.contains('Detalles').first().click(); 
    
    // Navegar a la pestaña o botón de subir evidencia
    cy.contains(/Subir Evidencia|Agregar Reporte/i).click();

    // Validar interacción de subida de archivo
    // Cypress no simula drag-and-drop nativo fácilmente sin plugins, pero probamos el input file
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('Archivo PDF simulado para pruebas E2E'),
      fileName: 'evidencia_prueba.pdf',
      mimeType: 'application/pdf',
      lastModified: Date.now(),
    }, { force: true });

    // Llenar campos requeridos
    cy.get('textarea[name="descripcion"]').type('Subida automatizada desde Cypress');
    
    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Verificar notificación de éxito
    cy.contains(/éxito|guardado|correctamente/i).should('be.visible');
  });
});
