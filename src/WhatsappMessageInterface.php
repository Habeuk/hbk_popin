<?php

declare(strict_types=1);

namespace Drupal\hbk_popin;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface defining a whatsapp_message entity type.
 */
interface WhatsappMessageInterface extends ContentEntityInterface, EntityOwnerInterface, EntityChangedInterface {

}
