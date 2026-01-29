import whatsappMessage from "./whatsapp.js";
import "../../scss/whatsapp/whatsapp.scss";

(function (Drupal, once) {
  Drupal.behaviors.hbkPopinWhatsapp = {
    attach(context, settings) {
      const widgets = once("hbkPopinWhatsapp", ".whatsapp-widget", context);
      if (widgets.length) {
        const message = new whatsappMessage(context, settings);
        message.init();
      }
    },
  };
})(window.Drupal, window.once);
