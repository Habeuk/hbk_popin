<?php
declare(strict_types = 1);

namespace Drupal\hbk_popin\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Stephane888\DrupalUtility\HttpResponse;
use Drupal\Component\Serialization\Json;
use Stephane888\Debug\Repositories\ConfigDrupal;
use Symfony\Component\Mime\Header\MailboxHeader;
use Symfony\Component\Mime\Address;
use Drupal\Component\Utility\Html;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Returns responses for hbk_popin routes.
 */
final class HbkPopinController extends ControllerBase {
  
  /**
   * Builds the response.
   */
  public function __invoke(Request $request) {
    $content = $request->getContent();
    $content = Json::decode($content);
    if (!is_array($content)) {
      throw new BadRequestHttpException('Invalid JSON payload.');
    }
    $message = isset($content['message']) ? trim((string) $content['message']) : '';
    $userContact = isset($content['usercontact']) ? trim((string) $content['usercontact']) : '';
    $sendEmail = isset($content['send_email']) ? trim((string) $content['send_email']) : '';
    if ($message === '') {
      return HttpResponse::response([
        'success' => false,
        'error' => 'Message is required.'
      ], 400);
    }
    $entity_id = $this->createWhatsappMessageEntity($message, $userContact);
    if ($sendEmail !== '') {
      $this->sendMail($sendEmail, $message, $userContact);
    }
    return HttpResponse::response([
      'success' => true,
      'entity_id' => $entity_id,
      '$message' => $message
    ]);
  }
  
  /**
   * Pour l'envoit de mail on charger le plugin.mail configurer par defaut via
   * le
   * module MailSystem.
   *
   * @param string $to
   * @param string $password
   */
  protected function sendMail(string $to, string $message, ?string $usercontact = ''): void {
    $siteInfo = ConfigDrupal::config('system.site');
    $mailSystem = ConfigDrupal::config('mailsystem.settings');
    
    /** @var \Drupal\Core\Mail\MailManagerInterface $pluginMailManager */
    $pluginMailManager = \Drupal::service('plugin.manager.mail');
    
    /** @var \Drupal\Core\Mail\MailInterface $mailPlugin */
    $mailPlugin = $pluginMailManager->createInstance($mailSystem['defaults']['sender']);
    
    // Échappement pour éviter injection HTML dans le mail
    $safeMessage = nl2br(Html::escape($message));
    $safeUserContact = Html::escape((string) $usercontact);
    
    $body = '' . '<h3><strong>Vous avez reçu un nouveau message</strong></h3>' . '<p><strong>Contact :</strong> ' . $safeUserContact . '</p>' . '<h4><strong>Message :</strong></h4>' . '<div>' . $safeMessage . '</div>';
    
    $key = 'hbk_popin_send_mail';
    
    $datas = [
      'id' => $key,
      'to' => $to,
      'subject' => 'Vous avez reçu un nouveau message',
      'body' => $body,
      'headers' => [
        'From' => $siteInfo['mail'],
        'Sender' => $siteInfo['mail'],
        'Return-Path' => $siteInfo['mail'],
        'Content-Type' => 'text/html; charset=UTF-8'
      ]
    ];
    
    $mailbox = new MailboxHeader('From', new Address($siteInfo['mail'], $siteInfo['name']));
    $datas['headers']['From'] = $mailbox->getBodyAsString();
    
    $result = $mailPlugin->mail($datas);
    
    if (!$result) {
      $this->getLogger('hbk_popin')->alert($this->t('There was a problem sending your email notification to @email.', [
        '@email' => $to
      ]));
    }
  }
  
  /**
   * Crée et sauvegarde l'entité hbk_popin_whatsapp_message.
   *
   * @return int|string|null L'ID de l'entité créée (selon storage), ou NULL si
   *         échec.
   */
  protected function createWhatsappMessageEntity(string $message, string $userContact = '') {
    $storage = $this->entityTypeManager()->getStorage('hbk_popin_whatsapp_message');
    /** @var \Drupal\Core\Datetime\DateFormatterInterface $dateFormatter */
    // $dateFormatter = \Drupal::service('date.formatter');
    $label = 'auto';
    $entity = $storage->create([
      'label' => $label,
      'message' => $message,
      'user_contact' => $userContact,
      'status' => 1
    ]);
    $entity->save();
    return $entity->id();
  }
  
}
