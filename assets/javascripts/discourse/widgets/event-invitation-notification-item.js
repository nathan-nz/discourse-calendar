import I18n from "I18n";
import { createWidgetFrom } from "discourse/widgets/widget";
import { DefaultNotificationItem } from "discourse/widgets/default-notification-item";
import { escapeExpression, formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";

createWidgetFrom(
  DefaultNotificationItem,
  "event-invitation-notification-item",
  {
    notificationTitle(notificationName, data) {
      return data.title ? I18n.t(data.title) : "";
    },

    text(notificationName, data) {
      const username = `<span>${formatUsername(data.display_username)}</span>`;
      let description;
      if (data.topic_title) {
        description = `<span data-topic-id="${
          this.attrs.topic_id
        }">${escapeExpression(data.topic_title)}</span>`;
      } else {
        description = this.description(data);
      }

      let translationKey = data.message;
      // TODO: remove the _with_username translation when this widget is
      // removed
      if (
        translationKey ===
        "discourse_post_event.notifications.invite_user_predefined_attendance_notification"
      ) {
        translationKey += "_with_username";
      }
      return I18n.t(translationKey, { description, username });
    },

    icon(notificationName, data) {
      return iconNode(`notification.${data.message}`);
    },
  }
);
