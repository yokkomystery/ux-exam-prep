import { expect, test } from "@playwright/test";
import { questions } from "../src/data/questions";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
  });
});

test("shows answer feedback after selecting an option", async ({ page }) => {
  await page.goto("/quiz/random");

  await page.getByTestId("answer-option-0").click();

  await expect(page.getByTestId("answer-feedback")).toBeVisible();
  await expect(
    page.getByText(/正解!|不正解\.\.\./)
  ).toBeVisible();
  await expect(page.getByTestId("next-question")).toBeVisible();
});

test("updates bookmark state immediately after answering", async ({ page }) => {
  await page.goto("/quiz/random");

  await page.getByTestId("answer-option-0").click();

  const bookmarkButton = page.getByTestId("bookmark-toggle");
  await bookmarkButton.click();
  await expect(bookmarkButton).toContainText("ブックマーク済み");

  await page.goto("/review");
  await page.getByRole("button", { name: /ブックマーク/ }).click();
  await expect(page.getByText("復習: 1問")).toBeVisible();
});

test("shows result screen after finishing unanswered mode", async ({ page }) => {
  const answeredQuestions = Object.fromEntries(
    questions.slice(0, -1).map((question) => [
      question.id,
      { correct: true, answeredAt: Date.now() },
    ])
  );

  await page.goto("/");
  await page.evaluate((seededAnsweredQuestions) => {
    window.localStorage.setItem(
      "ux-exam-progress",
      JSON.stringify({
        quiz: {
          answeredQuestions: seededAnsweredQuestions,
          bookmarkedQuestions: [],
          everWrongQuestions: [],
        },
        keywords: {
          learnedKeywords: [],
          bookmarkedKeywords: [],
        },
      })
    );
  }, answeredQuestions);

  await page.goto("/quiz/unanswered");
  await page.getByTestId("answer-option-0").click();
  await page.getByTestId("next-question").click();

  await expect(page.getByText("結果発表")).toBeVisible();
});
