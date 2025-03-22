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
      'message' => '', // Message par défaut
      'class_container' => 'right button',
      'block_load_style_scss_js' => 'hbk_popin/custom-buton',
      'reseller_page' => FALSE
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
      '#description' => $this->t('Saisissez le message que vous souhaitez afficher dans le popup.')
    ];
    
    // Ajoute un champ texte pour la classe du conteneur
    $form['class_container'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Class container'),
      '#default_value' => $this->configuration['class_container']
    ];
    
    // Ajoute un champ pour la page de revendeur
    $form['reseller_page'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Reseller Page'),
      '#default_value' => $this->configuration['reseller_page']
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
    // Sauvegarde la valeur de 'class_container' et 'reseller_page'
    $this->configuration['class_container'] = $form_state->getValue('class_container');
    $this->configuration['reseller_page'] = $form_state->getValue('reseller_page');
    $library = $this->configuration['block_load_style_scss_js'];
    $this->LayoutgenentitystylesServices->addStyleFromModule($library, 'hbk_you_custom_popup', 'default');
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function build(): array {
    // Prépare le rendu avec le message et les attributs nécessaires.
    $content = [
      '#theme' => 'hbk_popin_whatsappmessage',
      '#content' => $this->configuration['message'],
      '#attributes' => [
        'class' => [
          'whatsapp-popup'
        ]
      ]
    ];
    //
    return [
      'content' => $content,
      '#attributes' => []
    ];
  }
}
