import config from "../../rootConfig.js";
class whatsappMessage {
  constructor(context, settings = []) {
    this.context = context;
    this.settings = settings;
  }
  init() {
    this.context.querySelectorAll(".whatsapp-widget").forEach((whatsappElement) => {
      const chat = whatsappElement.querySelector(".whatsapp-chat");
      if (!chat) return;
      const phone_number = chat.getAttribute("data-phone-number");
      const send_email = chat.getAttribute("data-send-email");
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
    this.emitEvent("whatsapp:opened", {});
  }
  hideTextarea(whatsappElement) {
    whatsappElement.querySelector(".whatsapp-chat").classList.remove("open");
    whatsappElement.querySelector(".whatsapp-btn").classList.add("open");
  }

  envoyerMessage(whatsappElement, numero, send_email) {
    const numeroClean = (numero || "").replace(/[^\d]/g, "");
    const btn = whatsappElement.querySelector(".whatsapp-message-btn");
    if (!btn) return;
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      // Champs du formulaire
      const messageEl = whatsappElement.querySelector(".whatsapp-message");
      const contactEl = whatsappElement.querySelector(".user-contact");
      const message = (messageEl?.value || "").trim();
      const userContact = (contactEl?.value || "").trim();
      // Vérifie si message vide
      if (!message) {
        messageEl?.classList.add("border-danger", "text-danger");
        setTimeout(() => {
          messageEl?.classList.remove("border-danger", "text-danger");
        }, 700);
        return;
      }
      // Infos supplémentaires
      const pageUrl = window.location.href;
      const pageTitle = document.title;
      const now = new Date();
      const time = now.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const lang = document.documentElement.lang || navigator.language || "";
      const deviceSummary = this.getDeviceSummary();
      // Construction du message enrichi
      const enrichedMessage =
        `${message}\n\n` +
        `---------------\n` +
        `\n[Infos]\n` +
        `Page : ${pageTitle}\n` +
        `URL : ${pageUrl}\n` +
        `Date/heure : ${time}\n` +
        `Langue : ${lang}\n` +
        (userContact ? `Contact : ${userContact}\n` : "") +
        `---------------\n` +
        `\n[Terminal]\n` +
        `Appareil : ${deviceSummary}\n`;
      // Envoi vers Drupal (sauvegarde/email)
      this.sendMail(enrichedMessage, userContact, send_email);
      // Ouverture WhatsApp
      if (numeroClean) {
        const waUrl = "https://wa.me/" + numeroClean + "?text=" + encodeURIComponent(enrichedMessage);
        window.open(waUrl, "_blank");
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

  getDeviceSummary() {
    const ua = navigator.userAgent;
    // Détection OS simplifiée
    let os = "Inconnu";
    if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac/i.test(ua)) os = "macOS";
    else if (/Linux/i.test(ua)) os = "Linux";
    // Détection navigateur simplifiée
    let browser = "Inconnu";
    if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Chrome/i.test(ua)) browser = "Chrome";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Safari/i.test(ua)) browser = "Safari";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";
    // Détection type d'appareil
    let deviceType = "Desktop";
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) deviceType = "Mobile";
    if (/iPad|Tablet/i.test(ua)) deviceType = "Tablette";
    return `${deviceType} (${os}, ${browser})`;
  }
  /**
   * Émet un événement personnalisé
   * @param {string} eventName - Nom de l'événement
   * @param {Object} detail - Données supplémentaires
   */
  emitEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: {
        ...detail,
      },
      bubbles: true,
    });
    this.context.dispatchEvent(event);
  }
}
export default whatsappMessage;
