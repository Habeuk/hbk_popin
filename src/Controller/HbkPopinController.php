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
    if (!empty($content['message']) && !empty($content['send_email']))
      $this->sendMail($content['send_email'], $content['message'], $content['usercontact']);
    return HttpResponse::response($content);
  }
  
  /**
   * Pour l'envoit de mail on charger le plugin.mail configurer par defaut via
   * le
   * module MailSystem.
   *
   * @param string $to
   * @param string $password
   */
  protected function sendMail($to, $message, $usercontact) {
    $siteInfo = ConfigDrupal::config('system.site');
    $mailSystem = ConfigDrupal::config('mailsystem.settings');
    /**
     * On initialise le chargeur de plugin de mail.
     *
     * @var \Drupal\Core\Mail\MailManager $PluginMailManger
     */
    $PluginMailManger = \Drupal::service('plugin.manager.mail');
    /**
     * On recupere l'instance à partir de l'id du plugin.
     *
     * @var \Drupal\Core\Mail\MailInterface $mailPlugin
     */
    $mailPlugin = $PluginMailManger->createInstance($mailSystem['defaults']['sender']);
    // $module = 'login_rx_vuejs';
    $key = 'hbk_popin_send_mail';
    $message = "Message : <div> $message </div> User contact : <p>$usercontact<p>";
    
    $datas = [
      'id' => $key,
      'to' => $to,
      'subject' => 'Vous avez reçu un nouveau message',
      'body' => $message,
      'headers' => [
        'From' => $siteInfo['mail'],
        'Sender' => $siteInfo['mail'],
        'Return-Path' => $siteInfo['mail']
      ]
    ];
    $mailbox = new MailboxHeader('From', new Address($siteInfo['mail'], $siteInfo['name']));
    $datas['headers']['From'] = $mailbox->getBodyAsString();
    $result = $mailPlugin->mail($datas);
    if (!$result) {
      $message = t(' There was a problem sending your email notification to @email. ', array(
        '@email' => $to
      ));
      $this->getLogger('hbk_popin')->alert($message);
    }
  }
}
