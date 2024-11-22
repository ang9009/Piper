"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotifs = void 0;
const removeNotifs = () => {
    // Get rid of notifications
    const notifOkBtns = document.getElementsByClassName("notification-flyout-item primary");
    if (notifOkBtns.length !== 0) {
        for (const btn of notifOkBtns) {
            if (btn instanceof HTMLElement) {
                btn.click();
            }
        }
    }
};
exports.removeNotifs = removeNotifs;
