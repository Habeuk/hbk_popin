<?php
declare(strict_types = 1);

namespace Drupal\hbk_popin;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;

/**
 * Provides a list controller for the whatsapp_message entity type.
 */
final class WhatsappMessageListBuilder extends EntityListBuilder {
  
  /**
   *
   * {@inheritdoc}
   */
  public function buildHeader(): array {
    $header['id'] = $this->t('ID');
    $header['message'] = $this->t('message');
    $header['status'] = $this->t('Status');
    $header['uid'] = $this->t('Author');
    $header['changed'] = $this->t('Updated');
    return $header + parent::buildHeader();
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity): array {
    /** @var \Drupal\hbk_popin\WhatsappMessageInterface $entity */
    $row['id'] = $entity->toLink();
    // $row['label'] = $entity->toLink();
    $row['message'] = $entity->get('message')->value;
    $row['status'] = $entity->get('status')->value ? $this->t('Enabled') : $this->t('Disabled');
    $username_options = [
      'label' => 'hidden',
      'settings' => [
        'link' => $entity->get('uid')->entity->isAuthenticated()
      ]
    ];
    $row['uid']['data'] = $entity->get('uid')->view($username_options);
    $row['changed']['data'] = $entity->get('changed')->view([
      'label' => 'hidden'
    ]);
    return $row + parent::buildRow($entity);
  }
  
}
