import whatsappMessage from "./whatsapp.js";
import "../../scss/whatsapp/whatsapp.scss";
/**
 * il faudra documenter.
 */
(function (Drupal) {
  Drupal.behaviors.popup = {
    attach: function (context, settings) {
      if (context.querySelectorAll && context.querySelectorAll(".whatsapp-widget").length) {
        const message = new whatsappMessage(context, settings);
        message.init();
      }
    },
  };
})(window.Drupal);
