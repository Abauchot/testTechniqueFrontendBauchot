describe('French Regions and Municipalities Search Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Application Layout', () => {
    it('should display the application header', () => {
      cy.get('header h1').should('contain', 'Recherche de Régions et Communes');
    });

    it('should display the theme toggle button', () => {
      cy.get('app-theme-toggle button').should('be.visible');
    });

    it('should navigate to search page by default', () => {
      cy.url().should('include', '/search');
    });
  });

  describe('Dark Mode Toggle', () => {
    it('should toggle between light and dark themes', () => {
      cy.get('html').then(($html) => {
        const initialTheme = $html.attr('data-theme');
        
        cy.get('app-theme-toggle button').click();
        
        cy.get('html').should('have.attr', 'data-theme').and('not.equal', initialTheme);
      });
    });

    it('should persist theme preference in localStorage', () => {
      cy.get('app-theme-toggle button').click();
      
      cy.window().then((win) => {
        const theme = win.localStorage.getItem('app-theme');
        expect(theme).to.be.oneOf(['light', 'dark']);
      });
    });
  });

  describe('Region Search', () => {
    it('should have a search input field', () => {
      cy.get('input#regionName').should('be.visible');
      cy.get('input#regionName').should('have.attr', 'placeholder');
    });

    it('should not show autocomplete for less than 2 characters', () => {
      cy.get('input#regionName').type('N');
      cy.get('.autocomplete-list').should('not.exist');
    });

    it('should display autocomplete suggestions when typing', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        statusCode: 200,
        body: [
          { nom: 'Normandie', code: '28' }
        ]
      }).as('searchRegions');

      cy.get('input#regionName').type('Norm');
      cy.wait('@searchRegions');
      
      cy.get('.autocomplete-list').should('be.visible');
      cy.get('.autocomplete-item').should('have.length.at.least', 1);
      cy.get('.autocomplete-item').first().should('contain', 'Normandie');
    });

    it('should select a region and display departments', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        statusCode: 200,
        body: [
          { nom: 'Normandie', code: '28' }
        ]
      }).as('searchRegions');

      cy.intercept('GET', '**/regions/28/departements', {
        statusCode: 200,
        body: [
          { nom: 'Calvados', code: '14', codeRegion: '28' },
          { nom: 'Eure', code: '27', codeRegion: '28' },
          { nom: 'Manche', code: '50', codeRegion: '28' }
        ]
      }).as('getDepartments');

      cy.get('input#regionName').type('Norm');
      cy.wait('@searchRegions');
      
      cy.get('.autocomplete-item').first().click();
      cy.wait('@getDepartments');

      cy.get('.selected-region').should('be.visible');
      cy.get('.selected-region h3').should('contain', 'Normandie');

      cy.get('.departments-list').should('be.visible');
      cy.get('.department-item').should('have.length', 3);
      cy.get('.department-item').first().should('contain', 'Calvados');
    });

    it('should update URL when region is selected', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        body: [{ nom: 'Normandie', code: '28' }]
      });

      cy.intercept('GET', '**/regions/28/departements', {
        body: [{ nom: 'Calvados', code: '14', codeRegion: '28' }]
      });

      cy.get('input#regionName').type('Norm');
      cy.get('.autocomplete-item').first().click();

      cy.url().should('include', '/search/28');
    });

    it('should clear departments when search input is cleared', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        body: [{ nom: 'Normandie', code: '28' }]
      });

      cy.intercept('GET', '**/regions/28/departements', {
        body: [{ nom: 'Calvados', code: '14', codeRegion: '28' }]
      });

      cy.get('input#regionName').type('Norm');
      cy.get('.autocomplete-item').first().click();
      
      cy.get('.departments-list').should('be.visible');

      cy.get('input#regionName').clear();
      
      cy.get('.departments-list').should('not.exist');
    });
  });

  describe('Municipality List', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/departements/14/communes', {
        statusCode: 200,
        body: Array.from({ length: 50 }, (_, i) => ({
          nom: `Commune ${i + 1}`,
          code: `14${String(i + 1).padStart(3, '0')}`,
          codeDepartement: '14',
          codeRegion: '28'
        }))
      }).as('getMunicipalities');
    });

    it('should navigate to municipality list when department is clicked', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        body: [{ nom: 'Normandie', code: '28' }]
      });

      cy.intercept('GET', '**/regions/28/departements', {
        body: [{ nom: 'Calvados', code: '14', codeRegion: '28' }]
      });

      cy.get('input#regionName').type('Norm');
      cy.get('.autocomplete-item').first().click();
      
      cy.get('.department-item').first().click();

      cy.url().should('include', '/municipalities/14');
      cy.wait('@getMunicipalities');
    });

    it('should display municipalities in a table', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('table').should('be.visible');
      // Table has 4 columns: Nom, Code, Code Département, Code Région
      cy.get('thead th').should('have.length', 4);
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('should display correct number of municipalities per page', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      // Default page size is 10
      cy.get('tbody tr').should('have.length', 10);
    });

    it('should change page size', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.page-size-select').select('20');
      
      cy.get('tbody tr').should('have.length', 20);
      cy.get('.count').should('contain', '50');
    });

    it('should navigate between pages', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('tbody tr').first().should('contain', 'Commune 1');

      // Go to next page - button text is "Suivant →"
      cy.get('.pagination-button').contains('Suivant').click();
      
      cy.get('.page-number.active').should('contain', '2');
      cy.get('tbody tr').first().should('contain', 'Commune 11');

      // Go back to previous page - button text is "← Précédent"
      cy.get('.pagination-button').contains('Précédent').click();
      
      cy.get('.page-number.active').should('contain', '1');
      cy.get('tbody tr').first().should('contain', 'Commune 1');
    });

    it('should navigate to specific page number', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.page-number').contains('3').click();
      
      cy.get('.page-number.active').should('contain', '3');
      cy.get('tbody tr').first().should('contain', 'Commune 21');
    });

    it('should disable previous button on first page', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.pagination-button').contains('Précédent').should('be.disabled');
    });

    it('should disable next button on last page', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.page-number').contains('5').click();
      
      cy.get('.pagination-button').contains('Suivant').should('be.disabled');
    });

    it('should display pagination info correctly', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      // French text: "Page 1 sur 5 (Affichage de 1 à 10 sur 50 communes)"
      cy.get('.pagination-info').should('contain', 'Page 1 sur 5');
      cy.get('.pagination-info').should('contain', 'Affichage de 1 à 10 sur 50 communes');

      cy.get('.page-number').contains('2').click();
      
      cy.get('.pagination-info').should('contain', 'Page 2 sur 5');
      cy.get('.pagination-info').should('contain', 'Affichage de 11 à 20 sur 50 communes');
    });

    it('should navigate back to department list', () => {
      cy.intercept('GET', '**/regions/28', {
        statusCode: 200,
        body: { nom: 'Normandie', code: '28' }
      }).as('getRegion');

      cy.intercept('GET', '**/regions/28/departements', {
        statusCode: 200,
        body: [
          { nom: 'Calvados', code: '14', codeRegion: '28' }
        ]
      }).as('getDepartments');

      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.back-button').click();

      // Should go back in history, not necessarily to /search/28
      // The back button uses location.back()
      cy.url().should('include', '/search');
    });

    it('should navigate to new search', () => {
      cy.visit('/municipalities/14');
      cy.wait('@getMunicipalities');

      cy.get('.search-button').click();

      cy.url().should('include', '/search');
      cy.url().should('not.include', '/28');
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching regions', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        delay: 1000,
        body: [{ nom: 'Normandie', code: '28' }]
      });

      cy.get('input#regionName').type('Norm');
      
      cy.get('.loading-spinner').should('be.visible');
    });

    it('should show loading state while fetching municipalities', () => {
      cy.intercept('GET', '**/departements/14/communes', {
        delay: 1000,
        body: []
      });

      cy.visit('/municipalities/14');
      
      cy.get('.loading').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully for regions', () => {
      cy.intercept('GET', '**/regions?nom=Test*', {
        statusCode: 500,
        body: { error: 'Server error' }
      });

      cy.get('input#regionName').type('Test');
      
      cy.get('input#regionName').should('be.visible');
    });

    it('should handle empty municipality list', () => {
      cy.intercept('GET', '**/departements/99/communes', {
        statusCode: 200,
        body: []
      });

      cy.visit('/municipalities/99');
      
      cy.get('.no-data').should('be.visible');
      // French text: "Aucune commune trouvée pour ce département."
      cy.get('.no-data').should('contain', 'Aucune commune trouvée');
    });
  });

  describe('Direct URL Access', () => {
    it('should load region and departments from URL', () => {
      cy.intercept('GET', '**/regions/28', {
        body: { nom: 'Normandie', code: '28' }
      });

      cy.intercept('GET', '**/regions/28/departements', {
        body: [
          { nom: 'Calvados', code: '14', codeRegion: '28' }
        ]
      });

      cy.visit('/search/28');

      cy.get('.selected-region').should('contain', 'Normandie');
      cy.get('.departments-list').should('be.visible');
    });

    it('should load municipalities from URL', () => {
      cy.intercept('GET', '**/departements/14/communes', {
        body: [
          { nom: 'Caen', code: '14118', codeDepartement: '14', codeRegion: '28' }
        ]
      });

      cy.visit('/municipalities/14');

      cy.get('table tbody tr').should('have.length.at.least', 1);
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.get('header h1').should('be.visible');
      cy.get('input#regionName').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      
      cy.get('header').should('be.visible');
      cy.get('main').should('be.visible');
    });
  });

  describe('Complete User Flow', () => {
    it('should complete full search to municipality flow', () => {
      cy.intercept('GET', '**/regions?nom=Norm*', {
        body: [{ nom: 'Normandie', code: '28' }]
      });

      cy.intercept('GET', '**/regions/28/departements', {
        body: [
          { nom: 'Calvados', code: '14', codeRegion: '28' },
          { nom: 'Eure', code: '27', codeRegion: '28' }
        ]
      });

      cy.intercept('GET', '**/departements/14/communes', {
        body: Array.from({ length: 25 }, (_, i) => ({
          nom: `Commune ${i + 1}`,
          code: `14${String(i + 1).padStart(3, '0')}`,
          codeDepartement: '14',
          codeRegion: '28'
        }))
      });

      // Search
      cy.get('input#regionName').type('Norm');
      cy.get('.autocomplete-item').first().click();

      // Verify departments
      cy.get('.departments-list').should('be.visible');
      cy.get('.department-item').should('have.length', 2);

      // Click on a department
      cy.get('.department-item').first().click();

      // Verify municipalities page
      cy.url().should('include', '/municipalities/14');
      cy.get('table').should('be.visible');
      cy.get('tbody tr').should('have.length', 10);

      // Change page size
      cy.get('.page-size-select').select('20');
      cy.get('tbody tr').should('have.length', 20);

      // Navigate to page 2
      cy.get('.page-number').contains('2').click();
      cy.get('.page-number.active').should('contain', '2');

      // Go back to search
      cy.get('.search-button').click();
      cy.url().should('include', '/search');
    });
  });
});
