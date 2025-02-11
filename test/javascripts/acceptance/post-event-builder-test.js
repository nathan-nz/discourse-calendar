import { acceptance, query } from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { click, fillIn, visit } from "@ember/test-helpers";
import selectKit from "discourse/tests/helpers/select-kit-helper";

acceptance("Post event - composer", function (needs) {
  needs.user({ admin: true, can_create_discourse_post_event: true });
  needs.settings({
    discourse_local_dates_enabled: true,
    discourse_calendar_enabled: true,
    discourse_post_event_enabled: true,
    discourse_post_event_allowed_on_groups: "",
    discourse_post_event_allowed_custom_fields: "",
  });

  test("composer event builder", async function (assert) {
    await visit("/");
    await click("#create-topic");
    await click(".toolbar-popup-menu-options .dropdown-select-box-header");
    await click(".toolbar-popup-menu-options *[data-value='insertEvent']");

    const modal = ".discourse-post-event-builder-modal";

    const timezoneInput = selectKit(
      `${modal} .event-field.timezone .timezone-input`
    );
    await timezoneInput.expand();
    await timezoneInput.selectRowByValue("Europe/London");
    assert.strictEqual(
      timezoneInput.header().value(),
      "Europe/London",
      "Timezone can be changed"
    );

    const fromDate = query(`${modal} .from input[type=date]`);
    await fillIn(fromDate, "2022-07-01");

    const fromTime = selectKit(`${modal} .from .d-time-input .select-kit`);
    await fromTime.expand();
    await fromTime.selectRowByName("12:00");

    const toDate = query(`${modal} .to input[type=date]`);
    await fillIn(toDate, "2022-07-01");
    const toTime = selectKit(`${modal} .to .d-time-input .select-kit`);
    await toTime.expand();
    await toTime.selectRowByName("13:00");

    await timezoneInput.expand();
    await timezoneInput.selectRowByName("Europe/Paris");

    assert.strictEqual(fromTime.header().name(), "12:00");
    assert.strictEqual(toTime.header().name(), "13:00");

    await click(`${modal} .modal-footer .btn-primary`);

    const composerContent = query(".d-editor-input").value;

    assert.true(
      composerContent.includes('start="2022-07-01 12:00"'),
      "bbcode has correct start time"
    );
    assert.true(
      composerContent.includes('end="2022-07-01 13:00"'),
      "bbcode has correct end time"
    );
    assert.true(
      composerContent.includes('timezone="Europe/Paris"'),
      "bbcode has correct end time"
    );
  });
});
