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

// -- Skills section (profile page) --

export function profileSkillsSection(page: Page): Locator {
  // LinkedIn PT-BR uses "Competências"; English uses "Skills"
  return page
    .locator("section")
    .filter({
      has: page
        .locator("h2")
        .filter({ hasText: /Competências|Skills/i }),
    })
    .first();
}

export function skillItems(skillsSection: Locator): Locator {
  // Skill items are <li> elements within the skills section container
  return skillsSection.locator("li");
}

export function skillEditButton(skillItem: Locator): Locator {
  // Each skill has an edit button (pencil icon) in a <button>
  // PT-BR: "Editar"; EN: "Edit"
  return skillItem
    .locator("button")
    .filter({ hasText: /editar|edit/i })
    .first();
}

export function skillDeleteButton(skillEditMenu: Locator): Locator {
  // After clicking edit button, a dropdown menu appears.
  // PT-BR: "Deletar"; EN: "Delete"
  return skillEditMenu
    .locator("button")
    .filter({ hasText: /deletar|delete/i })
    .first();
}

export function addSkillButton(skillsSection: Locator): Locator {
  // PT-BR: "Adicionar"; EN: "Add"
  // Usually appears at the top or bottom of the skills section
  return skillsSection
    .locator("button")
    .filter({ hasText: /adicionar|add/i })
    .first();
}

export function skillNameInput(page: Page): Locator {
  // Modal input for skill name. Uses aria-label or placeholder.
  // PT-BR: "Nome da competência"; EN: "Skill name"
  return page
    .getByPlaceholder(/nome da competência|skill name/i)
    .or(page.getByLabel(/nome da competência|skill name/i))
    .first();
}

export function skillModalSaveButton(page: Page): Locator {
  // PT-BR: "Salvar", EN: "Save"
  return page
    .locator(".artdeco-modal")
    .getByRole("button", { name: /^(salvar|save)$/i })
    .first();
}

// -- Jobs search page --

export function jobsSearchContainer(page: Page): Locator {
  // Main container for jobs search results
  return page.locator(".jobs-search__results-list").first();
}

export function jobCards(jobsSearchContainer: Locator): Locator {
  // Individual job card items
  // Usually <div> with role="option" or <li>
  return jobsSearchContainer.locator("[role='option']").or(
    jobsSearchContainer.locator("li")
  );
}

export function jobCardTitle(jobCard: Locator): Locator {
  // Job title within a card
  // Usually an <h3> or span with the job title
  return jobCard.locator("h3, [class*='job-card-title']").first();
}

export function jobIdFromCard(jobCard: Locator): Promise<string | null> {
  // Extract job ID from the job card's data attributes or href
  // Jobs have data-job-id or similar
  return jobCard.getAttribute("data-job-id");
}

// -- Job details page --

export function jobDetailsTitle(page: Page): Locator {
  // Job title on the job details page
  return page.locator(".jobs-details h1").first();
}

export function jobDetailsDescription(page: Page): Locator {
  // Job description/about section
  return page.locator(".jobs-details__main-content").first();
}

export function jobDetailsMetadata(page: Page): Locator {
  // Container with company name, location, seniority, etc.
  return page.locator(".jobs-details-top-card__company-name").first();
}

export function easyApplyButton(page: Page): Locator {
  // PT-BR: "Candidatar-se"; EN: "Easy Apply"
  // Usually a primary button in the job details
  return page
    .getByRole("button", { name: /candidatar|easy apply/i })
    .first();
}

// -- Easy Apply modal --

export function easyApplyModal(page: Page): Locator {
  // The modal dialog container for Easy Apply form
  return page.locator(".artdeco-modal").first();
}

export function easyApplyFormField(modal: Locator, label: string): Locator {
  // Generic form field in Easy Apply modal by label text
  // label: "name", "email", "phone", "message", etc.
  return modal.getByLabel(new RegExp(label, "i")).first();
}

export function easyApplyFileInput(modal: Locator): Locator {
  // File upload input in Easy Apply modal
  return modal.locator('input[type="file"]').first();
}

export function easyApplyNextButton(modal: Locator): Locator {
  // PT-BR: "Próximo"; EN: "Next"
  return modal
    .getByRole("button", { name: /próximo|next/i })
    .first();
}

export function easyApplySubmitButton(modal: Locator): Locator {
  // PT-BR: "Enviar candidatura"; EN: "Submit application" / "Submit"
  return modal
    .getByRole("button", { name: /enviar|submit/i })
    .first();
}

export function easyApplyComplexFormWarning(modal: Locator): Locator {
  // Some forms have dynamic fields that are hard to fill.
  // Check for presence of fields we can't handle.
  return modal.locator("[data-test-form-section-complex]").first();
}
