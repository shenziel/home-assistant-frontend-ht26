import { mdiShuffle } from "@mdi/js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BarMediaPlayer } from "../../../src/panels/media-browser/ha-bar-media-player";
import type { HomeAssistant } from "../../../src/types";

// Exclude unrelated child implementations from these component tests.
vi.mock("../../../src/components/ha-button", () => ({}));

vi.mock(
  "../../../src/components/media-player/ha-media-player-picker",
  () => ({})
);

type RandomIconButton = HTMLElement & {
  path: string;
  label: string;
};

let element: BarMediaPlayer | undefined;

function getRandomButton(): RandomIconButton | undefined {
  return Array.from(
    element!.shadowRoot!.querySelectorAll<RandomIconButton>("ha-icon-button")
  ).find((button) => button.path === mdiShuffle);
}

describe("ha-bar-media-player random button", () => {
  beforeEach(async () => {
    const entityId = "media_player.test_player";

    // Mock the Home Assistant data used by the bar.
    const hass = {
      states: {
        [entityId]: {
          entity_id: entityId,
          state: "idle",
          attributes: {
            friendly_name: "Test bar media player",
            supported_features: 0,

            // Give the media player a title and hide the progress slider so we can focus on the random button test.
            media_title: "Test station",
            media_duration: Infinity,
          },
          last_changed: "2026-01-01T00:00:00.000Z",
          last_updated: "2026-01-01T00:00:00.000Z",
          context: {
            id: "test-context",
            user_id: null,
            parent_id: null,
          },
        },
      },
      entities: {},
      devices: {},
      areas: {},
      floors: {},
      language: "en",
      localize: vi.fn((key: string) =>
        key === "ui.card.media_player.shuffle" ? "Shuffle" : key
      ),
      translationMetadata: {
        translations: {
          en: {
            isRTL: false,
          },
        },
      },
      locale: {
        language: "en",
        number_format: "language",
        time_format: "language",
      },
      config: {
        components: [],
      },
    } as unknown as HomeAssistant;

    // Create a fresh media-player bar and provide mocked Home Assistant data.
    element = new BarMediaPlayer();
    element.entityId = entityId;
    element.hass = hass;

    document.body.appendChild(element);
    await element.updateComplete;
  });

  // Cleanup is done to prepare for subsequent test cases
  afterEach(() => {
    element?.remove();
    element = undefined;
  });

  it("renders shuffle button", () => {
    const button = getRandomButton();

    expect(button).toBeDefined();
    expect(button!.path).toBe(mdiShuffle);
    expect(button!.label).toBe("Shuffle");
  });
});
