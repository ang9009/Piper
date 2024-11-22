"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const removeNotifs_1 = require("./removeNotifs");
console.log("Register script loaded");
const registrationPageUrl = "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration";
if (window.location.href !== registrationPageUrl) {
    throw new Error("This is not the registration page.");
}
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
const selectPlanAndSubmit = (targetPlan) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Triggered");
    (0, removeNotifs_1.removeNotifs)();
    navigateToPlansTab();
    yield waitForPlansToLoad();
    const desiredPlanAccordion = getDesiredPlan(targetPlan);
    addAllFromDesiredPlan(desiredPlanAccordion);
    yield waitForCoursesToAdd();
    const submitBtn = document.getElementById("saveButton");
    if (!submitBtn) {
        throw Error("Could not find submit button");
    }
    submitBtn.click();
});
selectPlanAndSubmit("asdf");
