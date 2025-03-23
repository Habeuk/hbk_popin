import AjaxBasic from "wbuutilities/src/Ajax/basic.js";

export default {
  ...AjaxBasic,
  languageId: window.drupalSettings && window.drupalSettings.path && window.drupalSettings.path.currentLanguage ? window.drupalSettings.path.currentLanguage : null,
};
