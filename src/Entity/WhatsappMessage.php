<?php
declare(strict_types = 1);

namespace Drupal\hbk_popin\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\hbk_popin\WhatsappMessageInterface;
use Drupal\user\EntityOwnerTrait;

/**
 * Defines the whatsapp_message entity class.
 *
 * @ContentEntityType(
 *   id = "hbk_popin_whatsapp_message",
 *   label = @Translation("Whatsapp message"),
 *   label_collection = @Translation("Whatsapp messages"),
 *   label_singular = @Translation("Whatsapp message"),
 *   label_plural = @Translation("Whatsapp messages"),
 *   label_count = @PluralTranslation(
 *     singular = "@count Whatsapp messages",
 *     plural = "@count Whatsapp messages",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\hbk_popin\WhatsappMessageListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "form" = {
 *       "add" = "Drupal\hbk_popin\Form\WhatsappMessageForm",
 *       "edit" = "Drupal\hbk_popin\Form\WhatsappMessageForm",
 *       "delete" = "Drupal\Core\Entity\ContentEntityDeleteForm",
 *       "delete-multiple-confirm" = "Drupal\Core\Entity\Form\DeleteMultipleForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "hbk_popin_whatsapp_message",
 *   admin_permission = "administer hbk_popin_whatsapp_message",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid",
 *     "owner" = "uid",
 *   },
 *   links = {
 *     "collection" = "/admin/content/whatsapp-message",
 *     "add-form" = "/whatsapp-message/add",
 *     "canonical" = "/whatsapp-message/{hbk_popin_whatsapp_message}",
 *     "edit-form" = "/whatsapp-message/{hbk_popin_whatsapp_message}/edit",
 *     "delete-form" = "/whatsapp-message/{hbk_popin_whatsapp_message}/delete",
 *     "delete-multiple-form" = "/admin/content/whatsapp-message/delete-multiple",
 *   },
 *   field_ui_base_route = "entity.hbk_popin_whatsapp_message.settings",
 * )
 */
final class WhatsappMessage extends ContentEntityBase implements WhatsappMessageInterface {
  
  use EntityChangedTrait;
  use EntityOwnerTrait;
  
  /**
   *
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage): void {
    parent::preSave($storage);
    if (!$this->getOwnerId()) {
      // If no owner has been set explicitly, make the anonymous user the owner.
      $this->setOwnerId(0);
    }
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type): array {
    $fields = parent::baseFieldDefinitions($entity_type);
    
    $fields['label'] = BaseFieldDefinition::create('string')->setLabel(t('Label'))->setRequired(TRUE)->setSetting('max_length', 255)->setDisplayOptions('form', [
      'type' => 'string_textfield',
      'weight' => -5
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('view', [
      'label' => 'hidden',
      'type' => 'string',
      'weight' => -5
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['status'] = BaseFieldDefinition::create('boolean')->setLabel(t('Status'))->setDefaultValue(TRUE)->setSetting('on_label', 'Enabled')->setDisplayOptions('form', [
      'type' => 'boolean_checkbox',
      'settings' => [
        'display_label' => FALSE
      ],
      'weight' => 0
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('view', [
      'type' => 'boolean',
      'label' => 'above',
      'weight' => 0,
      'settings' => [
        'format' => 'enabled-disabled'
      ]
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['user_contact'] = BaseFieldDefinition::create('string')->setLabel(t('User contact'))->setDescription(t('Email or phone number entered by the user.'))->setSetting('max_length', 255)->setDefaultValue('')->setDisplayOptions('form', [
      'type' => 'string_textfield',
      'weight' => 11
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('view', [
      'label' => 'above',
      'type' => 'string',
      'weight' => 11
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['message'] = BaseFieldDefinition::create('text_long')->setLabel(t('Message'))->setDisplayOptions('form', [
      'type' => 'text_textarea',
      'weight' => 10
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('view', [
      'type' => 'text_default',
      'label' => 'above',
      'weight' => 10
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['uid'] = BaseFieldDefinition::create('entity_reference')->setLabel(t('Author'))->setSetting('target_type', 'user')->setDefaultValueCallback(self::class . '::getDefaultEntityOwner')->setDisplayOptions('form', [
      'type' => 'entity_reference_autocomplete',
      'settings' => [
        'match_operator' => 'CONTAINS',
        'size' => 60,
        'placeholder' => ''
      ],
      'weight' => 15
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('view', [
      'label' => 'above',
      'type' => 'author',
      'weight' => 15
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['created'] = BaseFieldDefinition::create('created')->setLabel(t('Authored on'))->setDescription(t('The time that the whatsapp_message was created.'))->setDisplayOptions('view', [
      'label' => 'above',
      'type' => 'timestamp',
      'weight' => 20
    ])->setDisplayConfigurable('form', TRUE)->setDisplayOptions('form', [
      'type' => 'datetime_timestamp',
      'weight' => 20
    ])->setDisplayConfigurable('view', TRUE);
    
    $fields['changed'] = BaseFieldDefinition::create('changed')->setLabel(t('Changed'))->setDescription(t('The time that the whatsapp_message was last edited.'));
    
    return $fields;
  }
  
}
