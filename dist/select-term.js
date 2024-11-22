"use strict";
// TODO: this is probably not the best way to figure out which script to use?
const selectTermPageUrl = "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration";
if (window.location.href !== selectTermPageUrl) {
    throw new Error("This is not the select term page.");
}
console.log("Piper is active!");
const continueBtn = document.getElementById("term-go");
const errMsg = "Could not find continue button. Please contact ang9009.";
if (!continueBtn) {
    alert(errMsg);
    throw new Error(errMsg);
}
const removeErrors = () => {
    const errorOkBtns = document.querySelectorAll(".error-container button");
    console.log(errorOkBtns);
    if (errorOkBtns.length !== 0) {
        for (const btn of errorOkBtns) {
            if (btn instanceof HTMLElement) {
                btn.click();
            }
        }
    }
};
const handleErrorsAndClick = async () => {
    while (true) {
        continueBtn.click();
        await new Promise((r) => setTimeout(r, 100));
        removeErrors();
        await new Promise((r) => setTimeout(r, 100));
    }
};
handleErrorsAndClick();
