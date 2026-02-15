import "./style.scss";
/**
 * Classe AnimateText
 * Gère l'animation de textes comme un tiroir qui s'ouvre et se ferme
 *
 * @example
 * // Dans ton comportement Drupal
 * (function($, Drupal, drupalSettings) {
 *   Drupal.behaviors.hbkAnimateText = {
 *     attach: function(context, settings) {
 *       const animateText = new AnimateText(context, drupalSettings.hbk_popin?.animate_text || {});
 *       animateText.init();
 *     }
 *   };
 * })(jQuery, Drupal, drupalSettings);
 */
class AnimateText {
  /**
   * Constructeur
   * @param {HTMLElement} context - Le contexte Drupal (généralement document)
   * @param {Object} settings - Les settings passés depuis Drupal
   */
  constructor(context, settings = {}) {
    this.context = context;
    this.settings = {
      messages: settings.hbk_popin?.whatsapp?.message_animate,
    };

    // Configuration par défaut
    this.config = {
      selector: " .content-animate-text",
      textSelector: ".text-animate",
      visibleDuration: 2000,
      hiddenDuration: 4000,
      activeClass: "active",
    };

    // Propriétés d'instance
    this.element = this.context.querySelector(this.config.selector);
    this.textElement = null;
    this.messages = [];
    this.currentIndex = 0;
    this.isVisible = false;
    this.timeoutId = null;
    this.intervalId = null;
    this.maxDisplay = 0;
  }

  /**
   * Initialise l'animation sur tous les éléments correspondants
   */
  init() {
    this.textElement = this.context.querySelector(this.config.textSelector);
    if (!this.textElement) {
      console.warn("AnimateText: Élément texte non trouvé");
      return;
    }
    this.settings.messages = this.settings.messages.trim();
    if (!this.settings.messages || this.settings.messages === "") {
      console.warn("AnimateText: Aucun message trouvé dans les settings");
      return;
    }
    if (this.isAnimationBlocked()) return;
    this.messages = this.parseMessagesString(this.settings.messages);
    // Si pas de messages, on cache l'élément
    if (this.messages.length === 0) {
      return;
    }
    // Initialise le premier message
    this.updateContent();

    // Démarre l'animation
    this.startAnimation();
    //
    this.listeternEvents();
  }

  /**
   * Parse une chaîne de messages (séparés par des sauts de ligne)
   * @param {string} messagesString - Chaîne brute du textarea
   * @returns {Array} - Tableau de messages nettoyés
   */
  parseMessagesString(messagesString) {
    return messagesString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * Met à jour le contenu textuel
   */
  updateContent() {
    if (!this.textElement || this.messages.length === 0) return;
    this.textElement.textContent = this.messages[this.currentIndex];
    // Émet un événement
    this.emitEvent("text:updated", {
      text: this.messages[this.currentIndex],
      index: this.currentIndex,
    });
  }

  /**
   * Passe au message suivant
   */
  nextMessage() {
    if (this.messages.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.messages.length;
    this.updateContent();
    return this.currentIndex;
  }

  /**
   * Ouvre le tiroir (affiche le texte)
   */
  open() {
    if (!this.element || this.isVisible) return;
    this.isVisible = true;
    this.element.classList.add(this.config.activeClass);
    this.emitEvent("tiroir:opened", {
      text: this.messages[this.currentIndex],
      index: this.currentIndex,
    });

    return this;
  }

  /**
   * Ferme le tiroir (cache le texte)
   */
  close() {
    if (!this.element || !this.isVisible) return;

    this.isVisible = false;
    this.element.classList.remove(this.config.activeClass);

    // Passe au message suivant après fermeture
    setTimeout(() => {
      this.nextMessage();
    }, 1000);

    this.emitEvent("tiroir:closed", {
      nextText: this.messages[this.currentIndex],
      nextIndex: this.currentIndex,
    });

    return this;
  }

  /**
   * Démarre le cycle d'animation
   */
  startAnimation() {
    this.stopAnimation();

    // Démarre avec le tiroir fermé
    this.close();

    // Lance le cycle
    this.runCycle();

    this.emitEvent("animation:started", {
      messagesCount: this.messages.length,
      visibleDuration: this.config.visibleDuration,
      hiddenDuration: this.config.hiddenDuration,
    });

    return this;
  }

  /**
   * Exécute un cycle complet (fermé → ouvert → fermé)
   */
  runCycle() {
    this.maxDisplay++;
    if (this.maxDisplay == 4) {
      // On cache plus longtemps après 5 affichages pour éviter de lasser les utilisateurs.
      this.config.hiddenDuration = 10000;
    } else if (this.maxDisplay > 10) {
      this.stopAnimation();
      return;
    }
    // Attend la durée caché, puis ouvre
    this.timeoutId = setTimeout(() => {
      this.open();
      // Laisse ouvert pendant visibleDuration, puis ferme
      this.timeoutId = setTimeout(() => {
        this.close();
        // Continue le cycle
        this.runCycle();
      }, this.config.visibleDuration);
    }, this.config.hiddenDuration);
  }

  listeternEvents() {
    this.context.addEventListener("whatsapp:opened", () => {
      this.stopAnimation();
      // 2. Sauvegarde dans localStorage pour 24h ( 24 * 60 * 60 * 1000)
      const expiryTime = Date.now() + 1 * 60 * 60 * 1000;
      localStorage.setItem("whatsapp_animation_blocked", expiryTime.toString());
    });
  }
  /**
   * Vérifie si l'animation est bloquée
   */
  isAnimationBlocked() {
    const expiryTime = localStorage.getItem("whatsapp_animation_blocked");
    if (!expiryTime) {
      return false;
    }
    // Vérifie si le délai de 24h est dépassé
    if (Date.now() > parseInt(expiryTime)) {
      localStorage.removeItem("whatsapp_animation_blocked"); // Nettoie
      return false;
    }
    return true;
  }

  /**
   * Arrête l'animation
   */
  stopAnimation() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitEvent("animation:stopped");
    return this;
  }

  /**
   * Met en pause l'animation (laisse l'état actuel)
   */
  pause() {
    this.stopAnimation();
    this.emitEvent("animation:paused");
    return this;
  }

  /**
   * Reprend l'animation
   */
  resume() {
    if (this.isVisible) {
      // Si visible, on continue le cycle avec la phase actuelle
      this.timeoutId = setTimeout(() => {
        this.close();
        this.runCycle();
      }, this.config.visibleDuration);
    } else {
      // Si caché, on continue le cycle
      this.runCycle();
    }
    this.emitEvent("animation:resumed");
    return this;
  }

  /**
   * Réinitialise l'animation
   */
  reset() {
    this.stopAnimation();
    this.close();
    this.currentIndex = 0;
    this.updateContent();
    this.startAnimation();

    this.emitEvent("animation:reset");

    return this;
  }

  /**
   * Met à jour les messages dynamiquement
   * @param {string} messagesString - Nouvelle chaîne de messages
   */
  updateMessages(messagesString) {
    const oldMessages = [...this.messages];

    if (messagesString) {
      this.messages = this.parseMessagesString(messagesString);
    }

    if (this.messages.length === 0) {
      this.element.style.display = "none";
      this.stopAnimation();
    } else {
      this.element.style.display = "";
      this.currentIndex = 0;
      this.updateContent();

      // Redémarre l'animation si elle était en cours
      if (this.timeoutId) {
        this.startAnimation();
      }
    }

    this.emitEvent("messages:updated", {
      old: oldMessages,
      new: this.messages,
    });

    return this;
  }

  /**
   * Force l'affichage d'un message spécifique
   * @param {number} index - Index du message à afficher
   */
  showMessage(index) {
    if (index >= 0 && index < this.messages.length) {
      this.currentIndex = index;
      this.updateContent();
      this.open();
    }
    return this;
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
        currentIndex: this.currentIndex,
        currentMessage: this.messages[this.currentIndex],
        messagesCount: this.messages.length,
        isVisible: this.isVisible,
      },
      bubbles: true,
    });

    this.element.dispatchEvent(event);
  }
}

// Export pour les modules
export default AnimateText;
