import { expect, test, type Page } from "@playwright/test";
import {
  mockEnclaveFailureDocument,
  mockFailureDocument,
  mockSuccessDocument,
} from "../app/dev/fake-document";
import type { VerificationDocument } from "../lib/types/verification";

const HEADER_INSET_PX = 8;
const HEADER_OVERLAP_PX = 12;
const SECTION_RADIUS = "12px";
const TRANSPARENT_BORDER = "rgba(0, 0, 0, 0)";
const PANEL_BACKGROUNDS = {
  light: "rgb(238, 236, 232)",
  dark: "rgb(30, 30, 30)",
};
const VIEWPORT_HEIGHT = 800;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener("message", (event) => {
      if (event.data?.type === "TINFOIL_VERIFICATION_CENTER_READY") {
        document.documentElement.dataset.verifierReady = "true";
      }
    });
  });
});

async function showDocument(
  page: Page,
  document: VerificationDocument,
  darkMode = false,
) {
  await page.goto(`/?darkMode=${darkMode}&showHeader=false`);
  await expect(page.locator("html")).toHaveAttribute(
    "data-verifier-ready",
    "true",
  );
  await page.evaluate((document) => {
    window.postMessage(
      { type: "TINFOIL_VERIFICATION_DOCUMENT", document },
      window.location.origin,
    );
  }, document);
  await expect(
    page.locator('button[aria-controls="verification-step-chip"]'),
  ).toBeEnabled();
}

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 420]) {
    test(`uses inset expandable cards in ${theme} mode at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await showDocument(page, mockSuccessDocument, theme === "dark");

      const hardware = page.getByRole("button", {
        name: /Runtime is Isolated/,
      });
      await expect(hardware).toHaveCSS(
        "border-top-left-radius",
        SECTION_RADIUS,
      );
      await expect(hardware).toHaveCSS("border-top-color", TRANSPARENT_BORDER);
      await hardware.hover();
      await expect(hardware).not.toHaveCSS(
        "border-top-color",
        TRANSPARENT_BORDER,
      );
      await hardware.click();
      await page.mouse.move(0, 0);
      await expect(hardware).toHaveAttribute("aria-expanded", "true");
      await expect(hardware).not.toHaveCSS(
        "border-top-color",
        TRANSPARENT_BORDER,
      );

      const body = page.locator("#verification-step-chip");
      await expect(body).toBeVisible();
      await expect(body).toHaveCSS(
        "background-color",
        PANEL_BACKGROUNDS[theme],
      );
      await expect(body).toHaveCSS("border-top-left-radius", SECTION_RADIUS);
      await expect(body).toHaveCSS("border-top-right-radius", SECTION_RADIUS);
      await expect(body).toHaveCSS("border-bottom-left-radius", "0px");
      await expect(body).toHaveCSS("border-bottom-right-radius", "0px");
      const geometry = await body.evaluate((element) => {
        const section = element.parentElement!.getBoundingClientRect();
        const header = element
          .parentElement!.querySelector("button")!
          .getBoundingClientRect();
        const panel = element.getBoundingClientRect();
        return {
          inset: header.left - panel.left,
          widthDifference: panel.width - header.width,
          overlap: header.bottom - panel.top,
          panelWidth: panel.width,
          sectionWidth: section.width,
        };
      });
      expect(geometry.inset).toBeCloseTo(HEADER_INSET_PX);
      expect(geometry.widthDifference).toBeCloseTo(HEADER_INSET_PX * 2);
      expect(geometry.overlap).toBeCloseTo(HEADER_OVERLAP_PX);
      expect(geometry.panelWidth).toBeCloseTo(geometry.sectionWidth);

      const code = page.getByRole("button", { name: /Code is Auditable/ });
      await code.focus();
      await page.keyboard.press("Space");
      await expect(code).toHaveAttribute("aria-expanded", "true");
      await expect(hardware).toHaveAttribute("aria-expanded", "true");
      await hardware.focus();
      await page.keyboard.press("Enter");
      await expect(hardware).toHaveAttribute("aria-expanded", "false");
      await expect(body).toHaveCount(0);
      await expect(code).toHaveAttribute("aria-expanded", "true");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
}

test("keeps loading sections disabled and collapsed", async ({ page }) => {
  await page.goto("/?showHeader=false");
  const headers = page.locator('button[aria-controls^="verification-step-"]');
  await expect(headers).toHaveCount(3);
  for (const header of await headers.all()) {
    await expect(header).toBeDisabled();
    await expect(header).toHaveAttribute("aria-expanded", "false");
    await expect(header).toHaveCSS("border-top-left-radius", SECTION_RADIUS);
  }
  await expect(page.getByText("Verifying secure enclave...")).toBeVisible();
});

for (const scenario of [
  {
    name: "enclave failure",
    document: mockEnclaveFailureDocument,
    label: /Runtime is Not Isolated/,
    id: "chip",
  },
  {
    name: "measurement mismatch",
    document: mockFailureDocument,
    label: /Fingerprint Mismatch/,
    id: "measurement",
  },
]) {
  test(`preserves expandable error details for ${scenario.name}`, async ({
    page,
  }) => {
    await showDocument(page, scenario.document);
    const header = page.getByRole("button", { name: scenario.label });
    await expect(header).toBeEnabled();
    await header.click();
    await expect(header).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator(`#verification-step-${scenario.id}`),
    ).toBeVisible();
    await expect(
      page.getByText("An error occurred during initialization."),
    ).toBeVisible();
  });
}
