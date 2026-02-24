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
        .locator("a")
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

export function seeMoreButton(section: Locator): Locator {
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
  // Skill items are <li> elements within the skills section's list
  return skillsSection.locator("ul li");
}

export function addSkillButton(page: Page): Locator {
  // The "Add skill" button lives in the skills section header.
  // PT-BR: "Adicionar competência"; EN: "Add skill"
  // Use aria-label for precision instead of broad text matching.
  return page
    .locator(
      'button[aria-label*="Adicionar competência"], ' +
      'button[aria-label*="Add skill"]'
    )
    .first();
}

// -- Jobs search page --

export function jobSearchResultsList(page: Page): Locator {
  // The main <ul> containing job result cards.
  // LinkedIn uses scaffold-layout__list-container for the authenticated view.
  return page
    .locator(".scaffold-layout__list-container ul")
    .first();
}

export function jobCardItems(container: Locator): Locator {
  // Direct <li> children of the results list.
  return container.locator(":scope > li");
}

export function jobCardTitle(jobCard: Locator): Locator {
  // Job title is an <a> with class containing "job-card" and a nested <span>
  // or a direct <strong> / <a> inside the card.
  return jobCard
    .locator("a[class*='job-card'] strong, a[class*='job-card'] span[aria-hidden='true']")
    .first();
}

/**
 * Extract job ID from a job card element.
 * LinkedIn job cards have data-occludable-job-id or a link to /jobs/view/{id}/.
 */
export async function extractJobId(jobCard: Locator): Promise<string | null> {
  try {
    // Try data attribute first (most reliable)
    const occludable = await jobCard.getAttribute("data-occludable-job-id");
    if (occludable) return occludable;

    // Try the link href
    const link = jobCard.locator("a[href*='/jobs/view/']").first();
    const href = await link.getAttribute("href").catch(() => null);
    if (href) {
      const match = href.match(/\/jobs\/view\/(\d+)/);
      if (match?.[1]) return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

// -- Job details page --

export function jobDetailsTitle(page: Page): Locator {
  // The job title is in an <h1> on the details panel.
  // LinkedIn uses different containers depending on the view.
  return page
    .locator(
      ".job-details-jobs-unified-top-card__job-title h1, " +
      ".jobs-unified-top-card__job-title, " +
      ".t-24.job-details-jobs-unified-top-card__job-title"
    )
    .first();
}

export function jobDetailsDescription(page: Page): Locator {
  // The job description container.
  return page
    .locator(
      "#job-details, " +
      ".jobs-description__content, " +
      ".jobs-description-content"
    )
    .first();
}

export function jobDetailsCompany(page: Page): Locator {
  // Company name link in the job details top card.
  return page
    .locator(
      ".job-details-jobs-unified-top-card__company-name a, " +
      ".jobs-unified-top-card__company-name a"
    )
    .first();
}

export function jobDetailsMetadata(page: Page): Locator {
  // Container with location, seniority, etc.
  return page
    .locator(
      ".job-details-jobs-unified-top-card__primary-description-container, " +
      ".jobs-unified-top-card__subtitle-primary-grouping"
    )
    .first();
}

// -- Post creation (feed page) --

export function startPostButton(page: Page): Locator {
  // PT-BR: "Comece uma publicação" (2025+), older: "Criar publicação"
  // EN: "Start a post"
  // The button is on the feed page, above the post area.
  return page
    .getByRole("button", {
      name: /comece.*publica|criar.*publica|iniciar.*publica|start a post/i,
    })
    .first();
}

export function postEditorDiv(page: Page): Locator {
  // The post editor is a Quill-based contenteditable div with class "ql-editor".
  // Use the less-specific selector since the parent class may change.
  return page
    .locator(".ql-editor")
    .first();
}

export function postSubmitButton(page: Page): Locator {
  // PT-BR: "Publicar"; EN: "Post"
  // The button that publishes the post.
  // Be specific: match the submit button in the share box, not any "Post" text.
  return page
    .locator('.share-actions__primary-action')
    .or(
      page
        .getByRole("button", { name: /^(publicar|post)$/i })
        .first()
    )
    .first();
}

export function postModal(page: Page): Locator {
  // The post creation modal/overlay.
  return page
    .locator('.share-box--is-open, .share-creation-state')
    .first();
}

// -- Post activity feed (own profile) --

export function profileActivitySection(page: Page): Locator {
  // PT-BR: "Atividade"; EN: "Activity"
  return page
    .locator("section")
    .filter({
      has: page.locator("h2").filter({ hasText: /Atividade|Activity/i }),
    })
    .first();
}

export function activityPostItems(page: Page): Locator {
  // Post items on the activity page (/in/{username}/recent-activity/all/).
  // Each post is inside a .feed-shared-update-v2 container.
  return page.locator(".feed-shared-update-v2").locator("visible=true");
}

export function postTextContent(postItem: Locator): Locator {
  // The text body of a post in the feed.
  return postItem
    .locator(
      ".feed-shared-update-v2__description, " +
      ".update-components-text, " +
      '[data-ad-preview="message"]'
    )
    .first();
}

export function postSocialCounts(postItem: Locator): Locator {
  // The social counts bar (reactions, comments) below a post.
  return postItem
    .locator(
      ".social-details-social-counts, " +
      ".feed-shared-social-counts"
    )
    .first();
}

// -- Easy Apply --

export function easyApplyButton(page: Page): Locator {
  // PT-BR: "Candidatura simplificada"; EN: "Easy Apply"
  // The button contains a specific icon + text. Match both.
  return page
    .getByRole("button", { name: /candidatura simplificada|easy apply/i })
    .first();
}

// -- Easy Apply modal --

export function easyApplyModal(page: Page): Locator {
  // The Easy Apply modal has a specific header with the job title.
  // Use the modal that contains the Easy Apply form elements.
  // PT-BR: "Candidatura simplificada"; EN: "Easy Apply"
  return page
    .locator('.artdeco-modal[role="dialog"]')
    .filter({
      has: page.locator(
        'h2[id*="easy-apply"], [class*="jobs-easy-apply"]'
      ),
    })
    .first()
    // Fallback: if the specific filter doesn't match, grab the top-most modal
    .or(page.locator('.artdeco-modal[role="dialog"]').last());
}

export function easyApplyFileInput(modal: Locator): Locator {
  // File upload input in Easy Apply modal (usually hidden, use setInputFiles)
  return modal.locator('input[type="file"]').first();
}

export function easyApplyNextButton(modal: Locator): Locator {
  // PT-BR: "Avançar" / "Próximo"; EN: "Next"
  return modal
    .getByRole("button", { name: /avançar|próximo|next/i })
    .first();
}

export function easyApplyReviewButton(modal: Locator): Locator {
  // PT-BR: "Revisar" / "Verificar"; EN: "Review"
  return modal
    .getByRole("button", { name: /revisar|verificar|review/i })
    .first();
}

export function easyApplySubmitButton(modal: Locator): Locator {
  // PT-BR: "Enviar candidatura"; EN: "Submit application"
  // Be specific to avoid matching "Enviar mensagem" etc.
  return modal
    .getByRole("button", {
      name: /enviar candidatura|submit application/i,
    })
    .first();
}

// -- Post deletion --

export function postMenuButton(postItem: Locator): Locator {
  // The three-dot menu button on a post.
  // PT-BR: "Mais ações"; EN: "More options" / "More actions"
  return postItem
    .locator('button[aria-label*="Mais"], button[aria-label*="More"]')
    .or(postItem.locator('.feed-shared-control-menu__trigger, [aria-label*="mais ações"]'))
    .first();
}

export function deletePostButton(page: Page): Locator {
  // The "Delete" option in the post control menu dropdown.
  // It's an <li> with class feed-shared-control-menu__item.
  // Must scope to menu items to avoid matching the post wrapper <li>.
  // PT-BR: "Excluir publicação"; EN: "Delete post"
  return page
    .locator("li.feed-shared-control-menu__item")
    .filter({ hasText: /excluir|deletar|delete/i })
    .first();
}
