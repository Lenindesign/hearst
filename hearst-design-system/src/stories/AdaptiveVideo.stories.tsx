import type { Meta, StoryObj } from "@storybook/react";
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from "@storybook/test";
import { AdaptiveVideo } from "@/components/adaptive-video";

const onError = fn();

const meta = {
  title: "Hearst Plus/Components/Adaptive Video",
  component: AdaptiveVideo,
  args: {
    src: "/storybook-video-fixture.mp4",
    controls: true,
    muted: true,
    playsInline: true,
    preload: "metadata",
    "aria-label": "Production landscape video",
    className: "h-full w-full object-cover",
  },
  decorators: [
    (Story) => (
      <div className="hearst-plus-theme mx-auto w-full max-w-3xl p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production playback primitive shared by Hearst+ feed video, video cards, and the Delish Shorts viewer. It selects native playback for direct MP4, native HLS on capable devices, and hls.js elsewhere. Playback failures are announced and retryable; a missing source is announced without presenting an ineffective retry.",
      },
    },
  },
} satisfies Meta<typeof AdaptiveVideo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandscapeMp4: Story = {
  name: "Direct MP4: landscape",
  render: (args) => (
    <div className="aspect-video overflow-hidden rounded-[8px] bg-black">
      <AdaptiveVideo {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvas.getByLabelText("Production landscape video");
    await expect(video).toHaveAttribute("playsinline");
    await expect(video).toHaveAttribute("controls");
    await expect(video).toHaveAttribute("preload", "metadata");
    await waitFor(() => {
      expect(video.closest("[data-video-state]")).toHaveAttribute(
        "data-video-state",
        "ready"
      );
    });
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

export const PortraitMp4: Story = {
  name: "Direct MP4: portrait",
  args: {
    src: "/storybook-vertical-video-fixture.mp4",
    "aria-label": "Production portrait video",
  },
  globals: {
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: (args) => (
    <div className="mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-[8px] bg-black">
      <AdaptiveVideo {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const video = within(canvasElement).getByLabelText(
      "Production portrait video"
    );
    const frame = video.closest("[data-video-state]");
    await expect(frame).toHaveAttribute("data-video-state", "ready");
    await expect(frame?.getBoundingClientRect().width).toBeLessThanOrEqual(320);
  },
};

export const PlaybackError: Story = {
  name: "Error: retryable playback failure",
  args: {
    src: "/storybook-missing-video.mp4",
    onError,
    "aria-label": "Unavailable production video",
  },
  render: (args) => (
    <div className="aspect-video overflow-hidden rounded-[8px] bg-black">
      <AdaptiveVideo {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvas.getByLabelText("Unavailable production video");
    fireEvent.error(video);
    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveTextContent(
      "This video could not play on this device."
    );
    await expect(onError).toHaveBeenCalled();
    const retry = within(alert).getByRole("button", { name: "Try again" });
    const rect = retry.getBoundingClientRect();
    await expect(rect.height).toBeGreaterThanOrEqual(44);
    await userEvent.click(retry);
    await waitFor(() => {
      expect(
        canvas.getByText("This video could not play on this device.")
      ).toBeInTheDocument();
    });
  },
};

export const MissingSource: Story = {
  name: "Unavailable: no source",
  args: {
    src: undefined,
    "aria-label": "Video without a source",
  },
  render: (args) => (
    <div className="aspect-video overflow-hidden rounded-[8px] bg-black">
      <AdaptiveVideo {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("No video source is available.");
    await expect(
      canvas.queryByRole("button", { name: "Try again" })
    ).not.toBeInTheDocument();
    await expect(
      canvasElement.querySelector("[data-video-state]")
    ).toHaveAttribute("data-video-state", "unavailable");
  },
};
