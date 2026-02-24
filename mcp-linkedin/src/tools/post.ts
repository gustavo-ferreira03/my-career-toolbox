import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay, humanType } from "../utils/human.js";
import {
  navigateToFeed,
  navigateToMyActivity,
  scrollToLoadSections,
} from "../utils/navigation.js";
import {
  startPostButton,
  postEditorDiv,
  postSubmitButton,
  postModal,
  activityPostItems,
  postTextContent,
  postSocialCounts,
  postMenuButton,
  deletePostButton,
} from "../utils/locators.js";

/**
 * Rate limiting: track posts created per session to enforce daily cap.
 */
let postsCreatedThisSession = 0;
const MAX_POSTS_PER_SESSION = 3;

/**
 * Type text into LinkedIn's Quill-based contenteditable editor.
 * Standard fill() does not work on contenteditable divs.
 * We click the editor, then use keyboard.type() with human-like delays.
 *
 * For performance, we type word-by-word rather than char-by-char.
 * Newlines use Enter key presses.
 */
async function typeInPostEditor(
  page: Page,
  editor: ReturnType<typeof postEditorDiv>,
  text: string
): Promise<void> {
  // Click to focus the editor
  await editor.click();
  await randomDelay(300, 500);

  // Split into lines, then type word-by-word within each line
  const lines = text.split("\n");
  for (let li = 0; li < lines.length; li++) {
    if (li > 0) {
      await page.keyboard.press("Enter");
      await randomDelay(100, 250);
    }
    const line = lines[li];
    if (line.length === 0) continue;

    // Type the line using keyboard.type with a small per-char delay
    await page.keyboard.type(line, { delay: 15 });

    // Brief pause after each line
    if (li < lines.length - 1) {
      await randomDelay(100, 300);
    }
  }
}

/**
 * Extract social counts (reactions, comments) from a post's social bar.
 */
async function extractSocialCounts(
  postItem: ReturnType<typeof activityPostItems>
): Promise<{ reactions: string; comments: string }> {
  try {
    const countsBar = postSocialCounts(postItem);
    const text = await countsBar.textContent({ timeout: 2000 }).catch(() => "") ?? "";

    // LinkedIn shows counts like "42 reactions" / "42 reacoes" and "5 comments" / "5 comentarios"
    const reactionsMatch = text.match(/(\d[\d.,]*)\s*(rea|curt|like|gost)/i);
    const commentsMatch = text.match(/(\d[\d.,]*)\s*(com[me]nt|coment)/i);

    return {
      reactions: reactionsMatch?.[1] || "0",
      comments: commentsMatch?.[1] || "0",
    };
  } catch {
    return { reactions: "0", comments: "0" };
  }
}

export function registerPostTools(server: McpServer): void {
  // ===== create_post =====
  server.registerTool(
    "create_post",
    {
      title: "Create LinkedIn Post (Draft)",
      description:
        "Creates a LinkedIn text post. Opens the post editor, types the content, " +
        "and pauses BEFORE publishing so you can review. " +
        "Use publish_post to actually publish after reviewing. " +
        "Rate limited to 3 posts per session.",
      inputSchema: {
        text: z
          .string()
          .min(1)
          .max(3000)
          .describe(
            "The post text content. Supports line breaks. Max 3000 characters."
          ),
      },
    },
    async ({ text }) => {
      try {
        // Rate limiting
        if (postsCreatedThisSession >= MAX_POSTS_PER_SESSION) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Rate limit reached: ${MAX_POSTS_PER_SESSION} posts already created this session. Wait for a new session to post again.`,
              },
            ],
            isError: true,
          };
        }

        const page = await ensureLoggedIn();

        // Navigate to feed
        await navigateToFeed(page);

        // Click "Start a post" button
        const startBtn = startPostButton(page);
        try {
          await startBtn.waitFor({ state: "visible", timeout: 10000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: "Could not find the 'Start a post' button on the feed. LinkedIn UI may have changed.",
              },
            ],
            isError: true,
          };
        }
        await startBtn.click();
        await randomDelay(1500, 2500);

        // Wait for post editor to appear
        const editor = postEditorDiv(page);
        try {
          await editor.waitFor({ state: "visible", timeout: 10000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: "Post editor did not open. The modal may not have loaded.",
              },
            ],
            isError: true,
          };
        }
        await randomDelay(500, 800);

        // Type the post content
        await typeInPostEditor(page, editor, text);
        await randomDelay(800, 1500);

        // Verify the post button is available (but DO NOT click it)
        const publishBtn = postSubmitButton(page);
        let publishReady = false;
        try {
          publishReady = await publishBtn.isVisible({ timeout: 3000 });
        } catch {
          publishReady = false;
        }

        // Build preview
        const preview = text.length > 200
          ? text.substring(0, 200) + "..."
          : text;

        const lines = [
          "## Post Ready for Review",
          "",
          `Characters: ${text.length}`,
          `Publish button visible: ${publishReady ? "yes" : "no"}`,
          "",
          "### Preview:",
          "",
          preview,
          "",
          publishReady
            ? "Use publish_post to publish this post."
            : "WARNING: Publish button not found. The post may need adjustments.",
        ];

        return {
          content: [
            { type: "text" as const, text: lines.join("\n") },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error creating post: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ===== publish_post =====
  server.registerTool(
    "publish_post",
    {
      title: "Publish Pending LinkedIn Post",
      description:
        "Publishes the post that was prepared by create_post. " +
        "Only use this after reviewing the post preview from create_post.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();

        // Find the publish button in the active post modal
        const publishBtn = postSubmitButton(page);
        try {
          await publishBtn.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: "Publish button not found. No pending post. Run create_post first.",
              },
            ],
            isError: true,
          };
        }

        // Click publish
        await publishBtn.click();
        await randomDelay(3000, 5000);

        // Increment rate limiter
        postsCreatedThisSession++;

        return {
          content: [
            {
              type: "text" as const,
              text: `Post published successfully. (${postsCreatedThisSession}/${MAX_POSTS_PER_SESSION} posts this session)`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error publishing post: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ===== get_my_posts =====
  server.registerTool(
    "get_my_posts",
    {
      title: "Get My Recent LinkedIn Posts",
      description:
        "Reads your recent LinkedIn posts from your activity page. " +
        "Returns post text, and basic engagement metrics (reactions, comments) " +
        "for up to the specified number of posts.",
      inputSchema: {
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .default(5)
          .describe("Maximum number of posts to retrieve (default: 5, max: 20)"),
      },
    },
    async ({ limit }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to activity page
        await navigateToMyActivity(page);

        // Scroll to load more posts
        await scrollToLoadSections(page);
        await randomDelay(1000, 1500);

        // Extract posts
        const postItems = activityPostItems(page);
        const count = await postItems.count();
        const maxPosts = Math.min(count, limit);

        if (maxPosts === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No posts found on your activity page.",
              },
            ],
          };
        }

        const posts: string[] = [];

        for (let i = 0; i < maxPosts; i++) {
          try {
            const item = postItems.nth(i);

            // Extract text content
            const textEl = postTextContent(item);
            const text = await textEl
              .textContent({ timeout: 3000 })
              .catch(() => null);

            if (!text || text.trim().length === 0) continue;

            // Extract social counts
            const counts = await extractSocialCounts(item);

            // Truncate long posts for readability
            const trimmed = text.trim();
            const preview =
              trimmed.length > 300
                ? trimmed.substring(0, 300) + "..."
                : trimmed;

            posts.push(
              [
                `### Post ${posts.length + 1}`,
                "",
                preview,
                "",
                `Reactions: ${counts.reactions} | Comments: ${counts.comments}`,
              ].join("\n")
            );
          } catch {
            // Skip posts that fail to extract
            continue;
          }
        }

        if (posts.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Could not extract text from any posts. LinkedIn UI may have changed.",
              },
            ],
            isError: true,
          };
        }

        const output = [
          `Found ${posts.length} posts:\n`,
          ...posts,
        ].join("\n---\n");

        return {
          content: [{ type: "text" as const, text: output }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error reading posts: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ===== delete_post =====
  server.registerTool(
    "delete_post",
    {
      title: "Delete LinkedIn Post",
      description:
        "Deletes one of your LinkedIn posts by finding it on your activity page and clicking the delete button. " +
        "Requires the post to be visible on the activity page. " +
        "Posts are identified by text content (first 100 chars).",
      inputSchema: {
        postTextPreview: z
          .string()
          .min(5)
          .describe(
            "First ~50-100 characters of the post text to identify which post to delete"
          ),
      },
    },
    async ({ postTextPreview }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to activity page
        await navigateToMyActivity(page);
        await randomDelay(1500, 2500);

        // Extract posts to find the target
        const postItems = activityPostItems(page);
        const count = await postItems.count();

        if (count === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No posts found on your activity page.",
              },
            ],
            isError: true,
          };
        }

        let foundPost = false;

        for (let i = 0; i < count; i++) {
          try {
            const item = postItems.nth(i);
            const textEl = postTextContent(item);
            const text = await textEl
              .textContent({ timeout: 2000 })
              .catch(() => null);

            if (!text || !text.includes(postTextPreview.substring(0, 30))) {
              continue;
            }

            // Found the post! Click the menu button
            const menuBtn = postMenuButton(item);
            try {
              await menuBtn.scrollIntoViewIfNeeded({ timeout: 2000 });
              await randomDelay(300, 500);
              await menuBtn.click();
              await randomDelay(500, 1000);
            } catch {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: "Found post but could not click the menu button.",
                  },
                ],
                isError: true,
              };
            }

            // Click the delete button
            const deleteBtn = deletePostButton(page);
            try {
              await deleteBtn.waitFor({ state: "visible", timeout: 3000 });
            } catch {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: "Menu opened but delete button not found. LinkedIn UI may have changed.",
                  },
                ],
                isError: true,
              };
            }

            await deleteBtn.click();
            await randomDelay(1000, 2000);

            // May need to confirm deletion on a dialog
            // LinkedIn PT-BR uses "Excluir" in the confirmation button
            const confirmSelectors = [
              page.getByRole("button", { name: /excluir|delete/i }).first(),
              page.getByRole("button", { name: /confirmar|confirm/i }).first(),
              page.locator('.artdeco-modal button.artdeco-button--primary').first(),
            ];

            for (const sel of confirmSelectors) {
              try {
                if (await sel.isVisible({ timeout: 2000 })) {
                  await sel.click();
                  await randomDelay(2000, 3000);
                  break;
                }
              } catch {
                // No confirmation dialog with this selector
              }
            }

            foundPost = true;
            break;
          } catch {
            // Skip posts that fail to process
            continue;
          }
        }

        if (!foundPost) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not find a post starting with: "${postTextPreview.substring(0, 50)}"`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Post deleted successfully.`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error deleting post: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
