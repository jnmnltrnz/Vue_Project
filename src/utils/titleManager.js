/**
 * Utility functions for managing browser titles
 */

const BASE_TITLE = 'Employee Management System';

/**
 * Set the browser title
 * @param {string} title - The title to set
 */
export function setTitle(title) {
  if (title) {
    document.title = `${title} - ${BASE_TITLE}`;
  } else {
    document.title = BASE_TITLE;
  }
}

/**
 * Set the browser title with a custom base title
 * @param {string} title - The title to set
 * @param {string} baseTitle - Custom base title
 */
export function setCustomTitle(title, baseTitle = BASE_TITLE) {
  if (title) {
    document.title = `${title} - ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
}

/**
 * Reset the title to the default
 */
export function resetTitle() {
  document.title = BASE_TITLE;
}

/**
 * Get the current title
 * @returns {string} Current document title
 */
export function getCurrentTitle() {
  return document.title;
} 