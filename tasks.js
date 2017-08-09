module.exports = [
  '/admin/content',
  '/admin/content/scheduled',
  '/admin/content/files',
  '/admin/content/media',
  '/node/add',
  '/node/add/article',
  // Meta tags token browser
  [
    { selector: '#edit-field-meta-tags-0 [role=button]', wait: '#edit-field-meta-tags-0-basic' },
    { selector: '.token-dialog', wait: '.token-tree' }
  ],
  'reload',
  // Paragraphs
  [
    { selector: '#edit-field-paragraphs-add-more-first-button-area-add-more', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="text"]', wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="quote"]', wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="link"]', wait: '[data-drupal-selector="edit-field-paragraphs-1-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="instagram"]', wait: '[data-drupal-selector="edit-field-paragraphs-2-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="twitter"]', wait: '[data-drupal-selector="edit-field-paragraphs-3-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="gallery"]', wait: '[data-drupal-selector="edit-field-paragraphs-4-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="image"]', wait: '[data-drupal-selector="edit-field-paragraphs-5-subform"]'},
    { selector: '[name="first_button_add_modal"]', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="video"]', wait: '[data-drupal-selector="edit-field-paragraphs-6-subform"]'}
  ],
  'reload',
  // Modals in paragraphs
  [
    { selector: '#edit-field-paragraphs-add-more-first-button-area-add-more', wait: '.paragraphs-add-dialog' },
    { selector: '[data-type="image"]', wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'},
    { selector: '[name="field_paragraphs_0_subform_field_image_entity_browser_entity_browser"]', wait: '#entity_browser_iframe_image_browser'}
  ],
  '/node/add/page',
  '/media/add',
  '/admin/structure/block',
  [
    { selector: '#edit-blocks-region-header-title span', wait: '.block-add-table' }
  ],
  '/admin/structure/block/manage/thunder_base_branding',
  '/admin/structure/types/manage/article',
  '/admin/structure/types/manage/article/fields',
  '/admin/structure/types/manage/article/form-display',
  '/admin/structure/types/manage/article/display',
  '/admin/appearance',
  '/admin/modules',
  '/admin/people',
  '/admin/config/system/site-information'
]