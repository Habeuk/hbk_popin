<?php

declare(strict_types=1);

namespace Drupal\hbk_popin\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\file\Entity\File;
use Drupal\Core\Url;
use Drupal\Component\Utility\Random;
use Drupal\link\LinkItemInterface;
use Drupal\Component\Utility\Html;
use Drupal\Core\Entity\Element\EntityAutocomplete;
use Drupal\Component\Serialization\Json;

/**
 * Provides a popin block.
 *
 * @Block(
 *   id = "hbk_popin",
 *   admin_label = @Translation("Popin"),
 *   category = @Translation("Popin"),
 * )
 */
final class HbkPopinBlock extends BlockBase {

  /**
   *
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'image_style' => 'large',
      'image' => null,
      'lien' => null,
      'popin_id' => null,
      'settings' => [
        'type_affichage' => 'by_session',
        'position_affichage' => 'center',
        'delais' => 0,
        'duree' => 0,
        'with_bg_cover' => true,
        'status' => true
      ]
    ];
  }

  /**
   *
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['image_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Image Style'),
      '#options' => $this->getStyleImage(),
      '#default_value' => $this->configuration['image_style'] ?? ''
    ];
    $form['lien'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('Lien'),
      '#required' => FALSE,
      '#element_validate' => [
        [
          '\Drupal\link\Plugin\Field\FieldWidget\LinkWidget',
          'validateUriElement'
        ]
      ],
      '#default_value' => self::getUriAsDisplayableString($this->configuration['lien']) ?? '',
      '#placeholder' => "Ajouter un lien",
      '#maxlength' => 2048,
      '#link_type' => LinkItemInterface::LINK_GENERIC,
      '#target_type' => 'node',
      '#attributes' => [
        'data-autocomplete-first-character-blacklist' => '/#?'
      ],
      '#process_default_value' => FALSE,
      '#description' => $this->t('This must be an internal path such as %add-node. You can also start typing the title of a piece of content to select it. <br>
        Enter %front to link to the front page. Enter %nolink to display link text only. <br>
        Enter %button to display keyboard-accessible link text only.', [
        '%add-node' => '/node/add',
        '%front' => '<front>',
        '%nolink' => '<nolink>',
        '%button' => '<button>'
      ])
    ];
    $form['image'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Image'),
      '#description' => $this->t('Charger l\'image'),
      '#default_value' => $this->configuration['image'] ?? null,
      '#upload_location' => 'public://popin/',
      '#upload_validators' => [
        'file_validate_extensions' => [
          'jpg jpeg png gif webp'
        ]
      ],
      '#required' => TRUE
    ];
    $popin_id = $this->configuration['popin_id'];
    if (empty($popin_id)) {
      $popin_id = $this->getPopinId();
    }
    $form['popin_id'] = [
      '#type' => 'hidden',
      '#value' => $popin_id
    ];
    //
    $form['settings'] = [
      '#type' => 'details',
      '#title' => $this->t('Configuration popin'),
      '#open' => true
    ];
    $form['settings']['status'] = [
      '#type' => 'checkbox',
      '#title' => $this->t("Actif"),
      '#default_value' => $this->configuration['settings']['status']
    ];
    $form['settings']['type_affichage'] = [
      '#type' => 'select',
      '#title' => $this->t("Type d'affichage"),
      '#options' => [
        'by_user' => 'Une seule fois par utilisateur',
        'by_session' => 'Une seule fois par session'
      ]
    ];

    $form['settings']['position_affichage'] = [
      '#type' => 'select',
      '#title' => $this->t('Une seule fois par session'),
      '#options' => [
        'center' => 'Center',
        'top_left' => 'Top left',
        'top_right' => 'Top right',
        'bottom_left' => 'Bottom left',
        'bottom_right' => 'bottom right'
      ],
      '#access' => false,
      '#default_value' => $this->configuration['settings']['position_affichage']
    ];
    $form['settings']['with_bg_cover'] = [
      '#type' => 'checkbox',
      '#title' => $this->t("Avec un cover"),
      '#default_value' => $this->configuration['settings']['with_bg_cover'],
      '#access' => false
    ];
    $form['settings']['duree'] = [
      '#type' => 'number',
      '#title' => $this->t("Durée avant l'auto-fermeture (s)"),
      '#default_value' => $this->configuration['settings']['duree'],
      '#access' => false
    ];
    $form['settings']['delais'] = [
      '#type' => 'number',
      '#title' => $this->t("Délais avant affichage (s)"),
      '#default_value' => $this->configuration['settings']['delais']
    ];
    $form['re_init'] = [
      '#type' => 'checkbox',
      '#title' => $this->t("Réinitialiser l'affichage")
    ];
    return $form;
  }

  /**
   *
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['image_style'] = $form_state->getValue('image_style');
    $this->configuration['lien'] = $form_state->getValue('lien');
    $this->configuration['image'] = $form_state->getValue('image');
    $this->configuration['settings'] = $form_state->getValue('settings');
    $this->configuration['popin_id'] = $form_state->getValue('popin_id');
    if ($form_state->getValue('re_init')) {
      $this->configuration['popin_id'] = $this->getPopinId();
    }
    // save image
    if (!empty($this->configuration['image'])) {
      $fid = reset($this->configuration['image']);
      $file = File::load($fid);
      if ($file && $file->isTemporary()) {
        $this->messenger()->addStatus("Save image permanaly");
        $file->setPermanent();
        $file->save();
      }
    }
  }

  /**
   *
   * {@inheritdoc}
   */
  public function build(): array {
    $content = [];
    $url = null;
    try {
      $url = Url::fromUri($this->configuration['lien']);
    } catch (\Exception $e) {
    }
    if ($url) {
      $url = [
        '#type' => 'link',
        '#title' => '',
        '#url' => $url,
        '#options' => [
          'attributes' => [
            'class' => [
              'hbk_popin_block__link'
            ]
          ]
        ]
      ];
    }
    $image_style = $this->configuration['image_style'];
    $file = File::load(reset($this->configuration['image']));
    if ($file) {
      if (!$image_style)
        $image_style = 'large';
      $content[] = [
        '#theme' => 'image_style',
        '#style_name' => $image_style,
        '#uri' => $file->getFileUri()
      ];
    }
    $build['content'] = [
      '#theme' => 'hbk_popin_block',
      '#popin' => [
        $content,
        $url
      ],
      '#attributes' => [
        'class' => [
          'hbk_popin_block__container'
        ]
      ]
    ];
    $build['#attributes'] = [
      'class' => [
        'hbk_popin_block'
      ],
      'data-config' => Json::encode($this->configuration['settings']),
      'data-popin_id' => $this->configuration['popin_id']
    ];
    $build['content']['#attached']['library'][] = 'hbk_popin/popin_style';
    return $build;
  }

  /**
   * Charge les styles d'image.
   *
   * @return string[]|\Drupal\Core\StringTranslation\TranslatableMarkup[]|NULL[]
   */
  protected function getStyleImage() {
    $styleStorage = \Drupal::entityTypeManager()->getStorage('image_style');
    $styles = $styleStorage->loadMultiple();
    $image_styles = [];
    foreach ($styles as $style) {
      /** @var ImageStyle $style */
      $image_styles[$style->id()] = $style->label();
    }
    return $image_styles;
  }

  protected function getPopinId() {
    $Random = new Random();
    return Html::cleanCssIdentifier($Random->name(15, true));
  }

  /**
   * Gets the URI without the 'internal:' or 'entity:' scheme.
   *
   * The following two forms of URIs are transformed:
   * - 'entity:' URIs: to entity autocomplete ("label (entity id)") strings;
   * - 'internal:' URIs: the scheme is stripped.
   *
   * This method is the inverse of ::getUserEnteredStringAsUri().
   *
   * @param string $uri
   *        The URI to get the displayable string for.
   *
   * @return string
   *
   * @see static::getUserEnteredStringAsUri()
   */
  protected static function getUriAsDisplayableString($uri) {
    if (!$uri)
      return '';
    $scheme = parse_url($uri, PHP_URL_SCHEME);

    // By default, the displayable string is the URI.
    $displayable_string = $uri;

    // A different displayable string may be chosen in case of the 'internal:'
    // or 'entity:' built-in schemes.
    if ($scheme === 'internal') {
      $uri_reference = explode(':', $uri, 2)[1];

      // @todo '<front>' is valid input for BC reasons, may be removed by
      // https://www.drupal.org/node/2421941
      $path = parse_url($uri, PHP_URL_PATH);
      if ($path === '/') {
        $uri_reference = '<front>' . substr($uri_reference, 1);
      }

      $displayable_string = $uri_reference;
    } elseif ($scheme === 'entity') {
      [
        $entity_type,
        $entity_id
      ] = explode('/', substr($uri, 7), 2);
      // Show the 'entity:' URI as the entity autocomplete would.
      // @todo Support entity types other than 'node'. Will be fixed in
      // https://www.drupal.org/node/2423093.
      if ($entity_type == 'node' && $entity = \Drupal::entityTypeManager()->getStorage($entity_type)->load($entity_id)) {
        $displayable_string = EntityAutocomplete::getEntityLabels([
          $entity
        ]);
      }
    } elseif ($scheme === 'route') {
      $displayable_string = ltrim($displayable_string, 'route:');
    }

    return $displayable_string;
  }
}
