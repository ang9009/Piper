"use strict";
console.log("Register script loaded");
// TODO: this is probably not the best way to figure out which script to use?
const registrationPageUrl = "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration";
if (window.location.href !== registrationPageUrl) {
    throw new Error("This is not the registration page.");
}
const removeNotifs = () => {
    const notifOkBtns = document.getElementsByClassName("notification-flyout-item primary");
    if (notifOkBtns.length !== 0) {
        for (const btn of notifOkBtns) {
            if (btn instanceof HTMLElement) {
                btn.click();
            }
        }
    }
};
// Navigates to the plans tab
const navigateToPlansTab = () => {
    const plansTab = document.getElementById("loadPlans-tab");
    if (!plansTab) {
        throw new Error("Plans tab could not be found");
    }
    plansTab.click();
};
const getDesiredPlan = (targetPlan) => {
    const plans = document.getElementsByClassName("plan-title");
    if (plans.length === 0) {
        throw new Error("Could not find any plans in plans tab");
    }
    const desiredPlan = Array.from(plans).find((plan) => {
        plan.querySelectorAll(".left > span");
        const loweredTargetPlan = targetPlan.toLowerCase();
        if (!plan.ariaLabel) {
            return false;
        }
        const loweredPlanName = plan.ariaLabel.toLowerCase();
        return loweredPlanName.includes(loweredTargetPlan);
    });
    if (!desiredPlan || !(desiredPlan instanceof HTMLElement)) {
        throw new Error("Could not find desired plan");
    }
    return desiredPlan;
};
const waitForPlansToLoad = () => {
    return new Promise((resolve, reject) => {
        const loadingPane = document.querySelector(".loading");
        if (!loadingPane) {
            console.log("No loading pane was found, skipping");
            return resolve();
        }
        const observer = new MutationObserver((mutations, observerInstance) => {
            for (const mutation of mutations) {
                // If loading panel is hidden (style change), plans have loaded in
                if (mutation.attributeName === "style") {
                    observer.disconnect();
                    return resolve();
                }
            }
        });
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(loadingPane, config);
    });
};
const addAllFromDesiredPlan = (desiredPlanAccordion) => {
    let planAddAllBtn = desiredPlanAccordion.querySelector(".right > button");
    if (planAddAllBtn === undefined || !(planAddAllBtn instanceof HTMLElement)) {
        throw new Error('Targeted plan has no "add all" button');
    }
    planAddAllBtn.click();
};
const waitForCoursesToAdd = () => {
    return new Promise((resolve, reject) => {
        const config = {
            attributes: true,
        };
        const summaryBody = document.querySelector("#summaryBody tbody");
        if (!summaryBody) {
            return reject(new Error("Could not find course summary section"));
        }
        const observer = new MutationObserver((mutations, observerInstance) => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes") {
                    observer.disconnect();
                    return resolve();
                }
            }
        });
        observer.observe(summaryBody, config);
    });
};
// Scripts are injected after the DOM is completed, so no event listeners are
// needed here
const selectPlanAndSubmit = async (targetPlan) => {
    removeNotifs();
    navigateToPlansTab();
    await waitForPlansToLoad();
    const desiredPlanAccordion = getDesiredPlan(targetPlan);
    addAllFromDesiredPlan(desiredPlanAccordion);
    await waitForCoursesToAdd();
    const submitBtn = document.getElementById("saveButton");
    if (!submitBtn) {
        throw Error("Could not find submit button");
    }
    submitBtn.click();
};
selectPlanAndSubmit("asdf");
