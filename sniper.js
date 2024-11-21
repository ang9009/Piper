const removeNotifs = () => {
  // Get rid of notifications
  const notifOkBtns = document.getElementsByClassName(
    "notification-flyout-item primary"
  );
  if (notifOkBtns.length !== 0) {
    for (const btn of notifOkBtns) {
      btn.click();
    }
  }
};

const navigateToPlansTab = () => {
  // Go to plans tab
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
    const loweredPlanName = plan.ariaLabel.toLowerCase();
    return loweredPlanName.includes(loweredTargetPlan);
  });
  if (!desiredPlan) {
    throw new Error("Could not find desired plan");
  }
  return desiredPlan;
};

const waitForPlansToLoad = () => {
  return new Promise((resolve, reject) => {
    const loadingPane = document.querySelector(".loading");
    if (!loadingPane) {
      console.log("No loading pane was found, skipping");
      resolve();
    }

    const observer = new MutationObserver((mutations, observerInstance) => {
      for (const mutation of mutations) {
        // If loading panel is hidden (style change), plans have loaded in
        if (mutation.attributeName === "style") {
          observer.disconnect();
          resolve();
        }
      }
    });
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(loadingPane, config);
  });
};

const addAllFromDesiredPlan = (desiredPlanAccordion) => {
  let planAddAllBtn = desiredPlanAccordion.querySelectorAll(".right > button");
  if (planAddAllBtn.length === 0) {
    throw new Error('Targeted plan has no "add all" button');
  }
  planAddAllBtn = planAddAllBtn[0];
  planAddAllBtn.click();
};

const snipe = async (targetPlan) => {
  // const continueBtn = document.getElementById("term-go");
  // continueBtn.click();

  window.addEventListener("load", async () => {
    removeNotifs();
    navigateToPlansTab();

    await waitForPlansToLoad();
    const desiredPlanAccordion = getDesiredPlan(targetPlan);
    addAllFromDesiredPlan(desiredPlanAccordion);

    // ! Wait for cursor to finish loading all

    // Submit
    const submitBtn = document.getElementById("saveButton");
    submitBtn.click();
  });
};

await snipe("CS Spring");
