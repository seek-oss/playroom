import {
  assertFrameSetting,
  assertFrameSettingsCount,
  loadPlayroom,
  toggleFrameSettingsForFrameIndex,
  selectFrameSettingForFrameIndex,
  getFrames,
} from '../support/utils';

describe('Frame Settings', () => {
  beforeEach(() => {
    loadPlayroom();
  });

  describe('Settings UI', () => {
    it('should display Settings icon for each frame when frameSettings are configured', () => {
      assertFrameSettingsCount(5);
    });

    it('should show menu with configured settings on click', () => {
      toggleFrameSettingsForFrameIndex(0);

      cy.findByRole('menu', { name: 'Frame settings' }).should('be.visible');
      cy.findByRole('menuitemcheckbox', { name: 'Dark Mode' }).should(
        'be.visible'
      );
      cy.findByRole('menuitemcheckbox', { name: 'Compact Mode' }).should(
        'be.visible'
      );
    });

    it('should have unchecked checkboxes by default when defaultValue is false', () => {
      toggleFrameSettingsForFrameIndex(0);

      assertFrameSetting('Dark Mode', 'false');
      assertFrameSetting('Compact Mode', 'false');
    });
  });

  describe('Settings State Management', () => {
    it('should toggle setting state when clicked', () => {
      toggleFrameSettingsForFrameIndex(0);

      selectFrameSettingForFrameIndex('Dark Mode');

      // Reopen menu and verify it's checked
      toggleFrameSettingsForFrameIndex(0);
      toggleFrameSettingsForFrameIndex(0);

      assertFrameSetting('Dark Mode', 'true');
    });

    it('should maintain independent state for different frames', () => {
      // Toggle Dark Mode on first frame
      toggleFrameSettingsForFrameIndex(0);
      selectFrameSettingForFrameIndex('Dark Mode');
      toggleFrameSettingsForFrameIndex(0);

      // Check second frame's Dark Mode is still unchecked
      toggleFrameSettingsForFrameIndex(1);
      assertFrameSetting('Dark Mode', 'false');
    });

    it('should pass settings to FrameComponent', () => {
      toggleFrameSettingsForFrameIndex(0);
      selectFrameSettingForFrameIndex('Dark Mode');
      toggleFrameSettingsForFrameIndex(0);

      // Check that the FrameComponent displays the settings
      getFrames()
        .first()
        .its('0.contentDocument.documentElement')
        .should((htmlElement) => {
          expect(htmlElement).to.have.attr('data-dark', 'true');
          expect(htmlElement).to.not.have.attr('data-compact');
        });
    });
  });

  describe('Settings Persistence', () => {
    it('should reset settings on page refresh (session-only)', () => {
      toggleFrameSettingsForFrameIndex(0);
      selectFrameSettingForFrameIndex('Dark Mode');
      toggleFrameSettingsForFrameIndex(0);

      cy.reload();

      // Verify setting is reset to default
      toggleFrameSettingsForFrameIndex(0);
      assertFrameSetting('Dark Mode', 'false');
    });
  });

  describe('Multiple Settings', () => {
    it('should allow multiple settings to be toggled independently', () => {
      toggleFrameSettingsForFrameIndex(0);

      // Enable both
      selectFrameSettingForFrameIndex('Dark Mode');
      selectFrameSettingForFrameIndex('Compact Mode');
      toggleFrameSettingsForFrameIndex(0);

      // Reopen and verify both are checked
      toggleFrameSettingsForFrameIndex(0);
      assertFrameSetting('Dark Mode', 'true');
      assertFrameSetting('Compact Mode', 'true');
    });
  });
});
