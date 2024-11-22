"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeNotifs_1 = require("./removeNotifs");
const selectTermPageUrl = "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration";
if (window.location.href !== selectTermPageUrl) {
    throw new Error("This is not the select term page.");
}
(0, removeNotifs_1.removeNotifs)();
const continueBtn = document.getElementById("term-go");
if (!continueBtn) {
    alert("Could not find continue button. Please contact ang9009.");
}
else {
    continueBtn.click();
}
console.log("Piper is active!");
