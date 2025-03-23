import config from "../../rootConfig.js";
class whatsappMessage {
  constructor(context, settings = []) {
    this.context = context;
    this.settings = settings;
  }
  init() {
    this.context.querySelectorAll(".whatsapp-widget").forEach((whatsappElement) => {
      const phone_number = whatsappElement.querySelector(".whatsapp-chat").getAttribute("data-phone-number");
      const send_email = whatsappElement.querySelector(".whatsapp-chat").getAttribute("data-send-email");
      if (phone_number) {
        whatsappElement.classList.remove("d-none");
        this.hideTextarea(whatsappElement);
      }
      this.closebox(whatsappElement);
      this.envoyerMessage(whatsappElement, phone_number, send_email);
      whatsappElement.querySelector(".whatsapp-btn").addEventListener("click", () => {
        this.ShowTextarea(whatsappElement);
      });
    });
  }
  ShowTextarea(whatsappElement) {
    whatsappElement.querySelector(".whatsapp-chat").classList.add("open");
    whatsappElement.querySelector(".whatsapp-btn").classList.remove("open");
  }
  hideTextarea(whatsappElement) {
    whatsappElement.querySelector(".whatsapp-chat").classList.remove("open");
    whatsappElement.querySelector(".whatsapp-btn").classList.add("open");
  }
  envoyerMessage(whatsappElement, numero, send_email) {
    whatsappElement.querySelector(".whatsapp-message-btn").addEventListener("click", (event) => {
      event.preventDefault();
      var message = whatsappElement.querySelector(".whatsapp-message").value;
      var userContact = whatsappElement.querySelector(".user-contact").value;
      if (message) {
        this.sendMail(message, userContact, send_email);
        var url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(message);
        window.open(url, "_blank");
      } else {
        whatsappElement.querySelector(".whatsapp-message").classList.add("border-danger", "text-danger");
        setTimeout(() => {
          whatsappElement.querySelector(".whatsapp-message").classList.remove("border-danger", "text-danger");
        }, 700);
      }
    });
  }
  sendMail(message, userContact, send_email) {
    config.post("/hbk-popin/save/message", { message: message, usercontact: userContact, send_email: send_email });
  }
  closebox(whatsappElement) {
    whatsappElement.querySelector(".icone-close").addEventListener("click", () => {
      this.hideTextarea(whatsappElement);
    });
  }
}
export default whatsappMessage;
