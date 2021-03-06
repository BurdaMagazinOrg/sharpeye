/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require("path");
const fs = require("fs");
const program = require("./cli");
const { options } = require("./sharpeye.conf");

if (program.tasks) {
  module.exports = require(fs.realpathSync(program.tasks));
} else if (
  process.cwd() !== __dirname &&
  fs.existsSync(path.join(process.cwd(), "sharpeye.tasks.js"))
) {
  module.exports = require(path.join(process.cwd(), "sharpeye.tasks.js"));
} else {
  module.exports = [
    {
      name: "Login",
      path: "/user/login",
      noScreenshot: true,
      actions: [
        { $: 'form#user-login-form [name="name"]', fill: options.user },
        { $: 'form#user-login-form [name="pass"]', fill: options.pass },
        { $: "#edit-submit", wait: "#toolbar-administration" }
      ]
    },
    "/admin/content",
    "/admin/content/scheduled",
    "/admin/content/files",
    "/admin/content/media",
    "/node/add",
    "/node/add/article",
    // Meta tags token browser
    {
      name: "Meta tags token browser",
      path: "/node/add/article",
      actions: [
        {
          selector: "#edit-field-meta-tags-0 [role=button]",
          wait: "#edit-field-meta-tags-0-basic"
        },
        { selector: ".token-dialog", wait: ".token-tree" }
      ]
    },
    // Paragraphs
    {
      name: "Paragraphs",
      path: "/node/add/article",
      actions: [
        {
          selector:
            "#edit-field-paragraphs-add-more-first-button-area-add-more",
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="text"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="quote"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="link"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-1-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="instagram"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-2-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="twitter"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-3-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="gallery"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-4-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="image"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-5-subform"]'
        },
        {
          selector: '[name="first_button_add_modal"]',
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="video"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-6-subform"]'
        }
      ]
    },
    // Modals in paragraphs
    {
      name: "Modals in paragraphs",
      path: "/node/add/article",
      element: ".ui-widget-content",
      actions: [
        {
          selector:
            "#edit-field-paragraphs-add-more-first-button-area-add-more",
          wait: ".paragraphs-add-dialog"
        },
        {
          selector: '[data-type="image"]',
          wait: '[data-drupal-selector="edit-field-paragraphs-0-subform"]'
        },
        {
          selector:
            '[name="field_paragraphs_0_subform_field_image_entity_browser_entity_browser"]',
          wait: "#entity_browser_iframe_image_browser"
        },
        {
          switchToFrame: "entity_browser_iframe_image_browser",
          wait: "#entity-browser-image-browser-form"
        },
        { switchToFrame: null }
      ]
    },
    "/node/add/page",
    "/media/add",
    "/admin/structure/block",
    {
      name: "Place block modal",
      path: "/admin/structure/block",
      element: ".ui-widget-content",
      actions: [
        {
          selector: "a#edit-blocks-region-header-title",
          wait: ".block-add-table",
          offset: -150
        }
      ]
    },
    "/admin/structure/block/manage/thunder_base_branding",
    "/admin/structure/types/manage/article",
    "/admin/structure/types/manage/article/fields",
    "/admin/structure/types/manage/article/form-display",
    "/admin/structure/types/manage/article/display",
    "/admin/appearance",
    "/admin/modules",
    "/admin/people",
    "/admin/config/system/site-information",
    {
      name: "Form submission",
      path: "/admin/config/system/site-information",
      noScreenshot: true,
      actions: [{ $: "#edit-site-name", fill: "NEW" }]
    },
    {
      name: "Performance form",
      path: "/admin/config/development/performance",
      actions: [
        "#edit-preprocess-css",
        { $: '#edit-page-cache-maximum-age option[value="900"]' }
      ]
    },
    {
      name: "Replace html",
      path: "/",
      actions: [
        { $: ".field--name-field-image", replace: "<br>Placeholder<br>" }
      ]
    }
  ];
}
