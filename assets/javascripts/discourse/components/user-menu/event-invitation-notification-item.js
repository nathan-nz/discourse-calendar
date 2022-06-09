import UserMenuNotificationItem from "discourse/components/user-menu/notification-item";
import { formatUsername } from "discourse/lib/utilities";
import { emojiUnescape } from "discourse/lib/text";
import I18n from "I18n";

export default class UserMenuDiscourseReactionsReactionNotificationItem extends UserMenuNotificationItem {
  get icon() {
    return `notification.${this.notification.data.message}`;
  }

  get label() {
    return formatUsername(this.notification.data.display_username);
  }

  get description() {
    if (
      this.notification.data.message ===
      "discourse_post_event.notifications.invite_user_predefined_attendance_notification"
    ) {
      return I18n.t(this.notification.data.message, {
        event: this.notification.data.topic_title,
      });
    }
    return this.notification.data.topic_title;
  }

  get descriptionHtmlSafe() {
    return false;
  }
}
