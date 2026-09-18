import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  mockEnclaveFailureDocument,
  mockFailureDocument,
  mockSuccessDocument,
  mockTDXSuccessDocument,
} from "../app/dev/fake-document";
import type { VerificationDocument } from "../lib/types/verification";

const HEADER_INSET_PX = 8;
const HEADER_OVERLAP_PX = 12;
const SECTION_RADIUS = "12px";
const OVERRIDE_RADIUS = "16px";
const HEADER_DIVIDER_WIDTH = "1px";
const VERIFICATION_BADGE_LABEL = /^(Attested|Verified)\s*✓$/;
const BLUE_ACCENTS = {
  light: {
    text: "rgb(16, 52, 125)",
    background: "rgba(16, 52, 125, 0.1)",
    hover: "rgb(31, 69, 143)",
  },
  dark: {
    text: "rgb(147, 197, 253)",
    background: "rgba(147, 197, 253, 0.1)",
    hover: "rgb(191, 219, 254)",
  },
};
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
  const response = await page.goto(`/?darkMode=${darkMode}&showHeader=false`);
  expect(response?.ok()).toBe(true);
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
      await expect(hardware).not.toHaveCSS(
        "border-top-color",
        TRANSPARENT_BORDER,
      );
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
    await expect(header).not.toHaveCSS("border-top-color", TRANSPARENT_BORDER);
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

async function expectRoundedControls(page: Page, radius: string) {
  const controls = page.locator(
    '.rounded-site-lg, .rounded-site-control, button[aria-controls^="verification-step-"]',
  );
  await expect(controls.first()).toBeVisible();
  for (const control of await controls.all()) {
    await expect(control).toHaveCSS("border-radius", radius);
  }
}

async function expandAdditionalInfo(panel: Locator) {
  await panel.getByRole("button", { name: "Show additional info" }).click();
  await expect
    .poll(() => panel.evaluate((element) => element.style.height))
    .toBe("auto");
  await expect
    .poll(() =>
      panel
        .locator(".overflow-hidden.space-y-3")
        .evaluate((element) => element.style.height),
    )
    .toBe("auto");
  await panel.page().evaluate(() => document.fonts.ready.then(() => undefined));
}

for (const theme of ["light", "dark"] as const) {
  test(`uses the global radius for nested cards and controls in ${theme} mode`, async ({
    page,
  }) => {
    await showDocument(page, mockSuccessDocument, theme === "dark");
    for (const id of ["chip", "key", "code"]) {
      await page
        .locator(`button[aria-controls="verification-step-${id}"]`)
        .click();
      const panel = page.locator(`#verification-step-${id}`);
      const badge = panel.getByText(VERIFICATION_BADGE_LABEL);
      await expect(badge).toHaveCSS("color", BLUE_ACCENTS[theme].text);
      await expect(badge).toHaveCSS(
        "background-color",
        BLUE_ACCENTS[theme].background,
      );
      const additionalInfo = panel.getByRole("button", {
        name: "Show additional info",
      });
      await expect(additionalInfo).toHaveCSS("border-radius", SECTION_RADIUS);
      await expandAdditionalInfo(panel);
      await expect(panel.locator(".rounded-site-lg").nth(1)).toBeVisible();
      const links = await panel.getByRole("link").all();
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        await expect(link).toHaveCSS("color", BLUE_ACCENTS[theme].text);
        await link.hover();
        await expect(link).toHaveCSS("color", BLUE_ACCENTS[theme].hover);
        await page.mouse.move(0, 0);
      }
    }
    await expectRoundedControls(page, SECTION_RADIUS);

    await page.evaluate((radius) => {
      document.documentElement.style.setProperty("--radius", radius);
    }, OVERRIDE_RADIUS);
    await expectRoundedControls(page, OVERRIDE_RADIUS);
    for (const panel of await page
      .locator('[id^="verification-step-"]')
      .all()) {
      await expect(panel).toHaveCSS("border-top-left-radius", OVERRIDE_RADIUS);
      await expect(panel).toHaveCSS("border-bottom-left-radius", "0px");
    }
  });

  test(`uses a thin divider without a thick strip beneath the ${theme} header`, async ({
    page,
  }) => {
    await page.goto(`/?darkMode=${theme === "dark"}`);
    const header = page
      .getByText("Verification Center", { exact: true })
      .locator("..")
      .locator("..");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("border-bottom-width", HEADER_DIVIDER_WIDTH);
    await expect(header).toHaveCSS("border-bottom-style", "solid");
    await expect(header).not.toHaveCSS(
      "border-bottom-color",
      TRANSPARENT_BORDER,
    );
    expect(
      await header.evaluate((element) => {
        const bottom = element.getBoundingClientRect().bottom;
        return Array.from(element.children).some(
          (child) => child.getBoundingClientRect().bottom > bottom,
        );
      }),
    ).toBe(false);
  });

  test(`uses theme blue for Intel attestation links in ${theme} mode`, async ({
    page,
  }) => {
    await showDocument(page, mockTDXSuccessDocument, theme === "dark");
    await page.getByRole("button", { name: /Runtime is Isolated/ }).click();
    await expandAdditionalInfo(page.locator("#verification-step-chip"));
    const link = page.getByRole("link", { name: "Intel TDX" });
    await expect(link).toHaveCSS("color", BLUE_ACCENTS[theme].text);
    await link.hover();
    await expect(link).toHaveCSS("color", BLUE_ACCENTS[theme].hover);
  });
}

for (const mode of ["Modal", "Embedded"]) {
  test(`uses the global radius for the badge and ${mode.toLowerCase()} demo`, async ({
    page,
  }) => {
    await page.goto("/dev");
    const badge = page.locator(".app__main").getByRole("button");
    await expect(badge).toHaveCSS("border-radius", SECTION_RADIUS);
    await page.getByLabel(mode, { exact: true }).check();
    const container = page.locator(".tinfoil-verification-theme").locator("..");
    await expect(container).toHaveCSS("border-radius", SECTION_RADIUS);
    await page.evaluate((radius) => {
      document.documentElement.style.setProperty("--radius", radius);
    }, OVERRIDE_RADIUS);
    await expect(container).toHaveCSS("border-radius", OVERRIDE_RADIUS);
    await expect(badge).toHaveCSS("border-radius", OVERRIDE_RADIUS);
  });
}
