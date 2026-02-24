/**
 * Centralized locator strategies for LinkedIn UI elements.
 * Uses aria labels, roles, and text content for resilience against UI changes.
 * CSS selectors are used only as fallbacks.
 *
 * LinkedIn UI language: Portuguese (BR). All aria-labels, button texts, and
 * section headings use PT-BR. English fallbacks are provided where reasonable.
 */
import type { Page, Locator } from "patchright";

// -- Navigation --

export function navProfileLink(page: Page): Locator {
  return page
    .getByRole("link", { name: /view profile|ver perfil/i })
    .first();
}

// -- Profile page (view mode) --

export function profileName(page: Page): Locator {
  return page.locator("h1").first();
}

export function profileHeadline(page: Page): Locator {
  return page.locator(".text-body-medium.break-words").first();
}

export function profileAboutSection(page: Page): Locator {
  // LinkedIn PT-BR uses "Sobre"; English uses "About"
  // The h2 contains duplicated text (visible + sr-only spans): "Sobre\nSobre"
  return page
    .locator("section")
    .filter({
      has: page.locator("h2").filter({ hasText: /Sobre|About/i }),
    })
    .first();
}

export function profileExperienceSection(page: Page): Locator {
  // LinkedIn PT-BR uses "Experiência"; English uses "Experience"
  return page
    .locator("section")
    .filter({
      has: page
        .locator("h2")
        .filter({ hasText: /Experiência|Experience/i }),
    })
    .first();
}

// -- Edit intro modal --

export function editIntroButton(page: Page): Locator {
  // PT-BR: "Editar introdução", EN: "Edit intro"
  return page
    .locator('button[aria-label="Editar introdução"]')
    .or(page.locator('button[aria-label="Edit intro"]'))
    .first();
}

export function headlineInput(page: Page): Locator {
  // The headline field is a TEXTAREA in the edit intro modal.
  // PT-BR label: "Título", EN label: "Headline"
  // The id contains "headline" regardless of language.
  return page
    .locator('.artdeco-modal textarea[id*="headline"]')
    .first()
    .or(page.getByLabel(/t[ií]tulo|headline/i).first());
}

export function saveIntroButton(page: Page): Locator {
  // PT-BR: "Salvar", EN: "Save"
  return page
    .locator(".artdeco-modal")
    .getByRole("button", { name: /^(salvar|save)$/i })
    .first();
}

// -- Edit About section --

export function editAboutLink(page: Page): Locator {
  // The "edit about" control is an <a> link (not a button) with
  // id="navigation-add-edit-deeplink-edit-about" and an SVG with
  // aria-label="Editar sobre" / "Edit about".
  return page
    .locator("#navigation-add-edit-deeplink-edit-about")
    .or(
      profileAboutSection(page)
        .locator('a')
        .filter({ has: page.locator("[data-test-icon='edit-medium']") })
        .first()
    )
    .first();
}

// Keep backward-compatible alias
export const editAboutButton = editAboutLink;

export function aboutTextarea(page: Page): Locator {
  // The about textarea in the edit modal. Id contains "summary".
  // Do NOT use getByLabel with /sobre|about/i -- it also matches the modal
  // dialog itself (via aria-labelledby "Atualizar seção Sobre").
  return page
    .locator('.artdeco-modal textarea[id*="summary"]')
    .first();
}

export function saveAboutButton(page: Page): Locator {
  // PT-BR: "Salvar", EN: "Save"
  return page
    .locator(".artdeco-modal")
    .getByRole("button", { name: /^(salvar|save)$/i })
    .first();
}

// -- "See more" / "Ver mais" button --

export function seeMoreButton(section: Locator, page: Page): Locator {
  return section
    .getByRole("button", { name: /see more|ver mais/i })
    .first();
}

// -- Dismiss modals / overlays --

export function dismissModal(page: Page): Locator {
  // PT-BR: "Fechar", EN: "Dismiss" / "Close"
  return page
    .locator('button[aria-label="Fechar"]')
    .or(page.locator('button[aria-label="Dismiss"]'))
    .or(page.locator('button[aria-label="Close"]'))
    .or(page.locator("button.artdeco-modal__dismiss"))
    .first();
}
