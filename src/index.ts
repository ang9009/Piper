const removeNotifs = () => {
  // Get rid of notifications
  const notifOkBtns = document.getElementsByClassName(
    "notification-flyout-item primary"
  );
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

const getDesiredPlan = (targetPlan: string): HTMLElement => {
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

const waitForPlansToLoad = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
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

const addAllFromDesiredPlan = (desiredPlanAccordion: HTMLElement) => {
  let planAddAllBtn = desiredPlanAccordion.querySelector(".right > button");
  if (planAddAllBtn === undefined || !(planAddAllBtn instanceof HTMLElement)) {
    throw new Error('Targeted plan has no "add all" button');
  }
  planAddAllBtn.click();
};

const waitForCoursesToAdd = () => {
  return new Promise<void>((resolve, reject) => {
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

const snipe = async (targetPlan: string) => {
  // const continueBtn = document.getElementById("term-go");
  // continueBtn.click();

  window.addEventListener("load", async () => {
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
  });
};
