<?php

declare(strict_types=1);

namespace Drupal\hbk_popin\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a popup block.
 *
 * @Block(
 *   id = "hbk_popin_popup",
 *   admin_label = @Translation("Popup"),
 *   category = @Translation("Custom"),
 * )
 */
final class PopupBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'message' => '',  // Message par défaut
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    // Ajoute un champ texte pour que l'utilisateur saisisse un message
    $form['message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message du popup WhatsApp'),
      '#default_value' => $this->configuration['message'],
      '#description' => $this->t('Saisissez le message que vous souhaitez afficher dans le popup.'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    // Sauvegarde la valeur du champ 'message' dans la configuration
    $this->configuration['message'] = $form_state->getValue('message');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    // Prépare le rendu avec le message et les attributs nécessaires
    return [
      '#theme' => 'hbk_popin_whatsappmessage',  // Indique le template Twig à utiliser
      '#content' => $this->configuration['message'],  // Passe le message du popup comme variable
      '#attributes' => ['class' => ['whatsapp-popup']],  // Attributs HTML pour personnaliser le bloc
    ];
  }
}
