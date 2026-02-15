<?php
declare(strict_types = 1);

namespace Drupal\hbk_popin\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\layoutgenentitystyles\Services\LayoutgenentitystylesServices;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Provides a popup block.
 *
 * @Block(
 *   id = "hbk_popin_popup",
 *   admin_label = @Translation("Popup WhatsApp"),
 *   category = @Translation("Popin"),
 * )
 */
final class PopupWhatsAppBlock extends BlockBase implements ContainerFactoryPluginInterface {
  /**
   *
   * @var LayoutgenentitystylesServices
   */
  protected $LayoutgenentitystylesServices;
  
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LayoutgenentitystylesServices $LayoutgenentitystylesServices) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->LayoutgenentitystylesServices = $LayoutgenentitystylesServices;
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static($configuration, $plugin_id, $plugin_definition, $container->get('layoutgenentitystyles.add.style.theme'));
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'message' => '',
      'placeholder' => '',
      'class_container' => 'right button',
      'titre' => '',
      'phone_number' => '',
      'send_email' => ''
      // 'block_load_style_scss_js' => 'hbk_popin/custom-buton'
    ];
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    // Ajoute un champ texte pour que l'utilisateur saisisse un message
    $form['message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message du popup WhatsApp'),
      '#default_value' => $this->configuration['message'],
      '#description' => $this->t('Saisissez le message que vous souhaitez afficher dans le popup')
    ];
    $form['message_animate'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message du popup WhatsApp'),
      '#default_value' => $this->configuration['message_animate'],
      '#description' => $this->t('Saisissez les textes qui seront animés')
    ];
    //
    $form['placeholder'] = [
      '#type' => 'textfield',
      '#title' => 'Placeholder',
      '#default_value' => $this->configuration['placeholder']
    ];
    $form['titre'] = [
      '#type' => 'textfield',
      '#title' => 'Titre',
      '#default_value' => $this->configuration['titre']
    ];
    $form['send_email'] = [
      '#type' => 'textfield',
      '#title' => "Envoit une copie du message à",
      '#default_value' => $this->configuration['send_email']
    ];
    // Ajoute un champ texte pour la classe du conteneur
    $form['class_container'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Class container'),
      '#default_value' => $this->configuration['class_container']
    ];
    // Ajoute un champ pour la page de revendeur
    $form['phone_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Phone number'),
      '#default_value' => $this->configuration['phone_number'],
      '#required' => true
    ];
    return $form;
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    // Sauvegarde la valeur du champ 'message' dans la configuration
    $this->configuration['message'] = $form_state->getValue('message');
    // Sauvegarde la valeur de 'class_container' et 'phone_number'
    $this->configuration['class_container'] = $form_state->getValue('class_container');
    $this->configuration['placeholder'] = $form_state->getValue('placeholder');
    $this->configuration['phone_number'] = $form_state->getValue('phone_number');
    $this->configuration['titre'] = $form_state->getValue('titre');
    $this->configuration['send_email'] = $form_state->getValue('send_email');
    $this->configuration['message_animate'] = $form_state->getValue('message_animate');
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function build(): array {
    // Prépare le rendu avec le message et les attributs nécessaires.
    $content = [
      '#theme' => 'hbk_popin_whatsappmessage',
      '#popin_content' => $this->configuration['message'] ?? '',
      '#popin_placeholder' => $this->configuration['placeholder'] ?? '',
      '#phone_number' => $this->configuration['phone_number'] ?? '',
      '#popin_titre' => $this->configuration['titre'] ?? '',
      '#popin_send_email' => $this->configuration['send_email'] ?? '',
      '#attributes' => [
        'class' => [
          'whatsapp-popup',
          $this->configuration['class_container']
        ]
      ]
    ];
    $content['#attached']['drupalSettings']['hbk_popin'] = [
      'whatsapp' => [
        'number' => $this->configuration['phone_number'] ?? '',
        'message_animate' => $this->configuration['message_animate'] ?? ''
      ]
    ];
    $content['#attached']['library'][] = 'hbk_popin/popin_whasapp';
    //
    return [
      'content' => $content,
      '#attributes' => []
    ];
  }
}
