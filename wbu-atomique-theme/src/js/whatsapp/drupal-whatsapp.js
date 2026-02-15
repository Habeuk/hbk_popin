import whatsappMessage from "./whatsapp.js";
import AnimateText from "../animate_text/style.js";
import "../../scss/whatsapp/whatsapp.scss";

(function (Drupal, once) {
  Drupal.behaviors.hbkPopinWhatsapp = {
    attach(context, settings) {
      const widgets = once("hbkPopinWhatsapp", ".whatsapp-widget", context);
      if (widgets.length) {
        const message = new whatsappMessage(context, settings);
        message.init();
        //
        const animateText = new AnimateText(context, settings);
        animateText.init();
      }
    },
  };
})(window.Drupal, window.once);
