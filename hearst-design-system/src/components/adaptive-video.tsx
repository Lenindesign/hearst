"use client";

import React from "react";

import { Button } from "@/components/ui/button";

type AdaptiveVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> & {
  src?: string;
};

function isHlsSource(src: string) {
  return /\.m3u8(?:$|\?)/i.test(src);
}

const STALLED_START_TIMEOUT_MS = 4500;

function setForwardedRef(
  ref: React.ForwardedRef<HTMLVideoElement>,
  value: HTMLVideoElement | null,
) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const AdaptiveVideo = React.forwardRef<HTMLVideoElement, AdaptiveVideoProps>(
  function AdaptiveVideo(
    { src, className, autoPlay, onError, ...videoProps },
    forwardedRef,
  ) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const stalledStartTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [retryKey, setRetryKey] = React.useState(0);
    const [playbackError, setPlaybackError] = React.useState(false);

    const assignVideoRef = React.useCallback(
      (video: HTMLVideoElement | null) => {
        videoRef.current = video;
        setForwardedRef(forwardedRef, video);
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video || !src) return;

      let disposed = false;
      let destroyHls: (() => void) | undefined;
      setPlaybackError(false);

      const clearStalledStartTimer = () => {
        if (!stalledStartTimerRef.current) return;
        clearTimeout(stalledStartTimerRef.current);
        stalledStartTimerRef.current = null;
      };

      const failPlayback = () => {
        clearStalledStartTimer();
        if (!disposed) setPlaybackError(true);
      };

      const verifyPlaybackStarted = () => {
        clearStalledStartTimer();
        stalledStartTimerRef.current = setTimeout(() => {
          if (disposed) return;
          const hasStarted = !video.paused && video.currentTime > 0;
          const hasEnoughData = video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
          if (!hasStarted && !hasEnoughData) failPlayback();
        }, STALLED_START_TIMEOUT_MS);
      };

      const tryAutoplay = () => {
        if (!autoPlay) return;
        verifyPlaybackStarted();
        void video.play().catch(failPlayback);
      };

      const canPlayNativeHls = Boolean(
        video.canPlayType("application/vnd.apple.mpegurl")
        || video.canPlayType("application/x-mpegURL")
      );

      const loadNativeSource = () => {
        video.src = src;
        video.load();
        tryAutoplay();
      };

      if (!isHlsSource(src)) {
        loadNativeSource();
      } else {
        void import("hls.js")
          .then(({ default: Hls }) => {
            if (disposed) return;
            if (!Hls.isSupported()) {
              if (canPlayNativeHls) {
                loadNativeSource();
              } else {
                failPlayback();
              }
              return;
            }

            const hls = new Hls({
              enableWorker: true,
              backBufferLength: 30,
              maxBufferLength: 30,
            });
            let networkRecoveryAttempts = 0;
            let mediaRecoveryAttempts = 0;

            destroyHls = () => hls.destroy();
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
            hls.on(Hls.Events.MANIFEST_PARSED, tryAutoplay);
            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (!data.fatal) return;

              if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRecoveryAttempts < 1) {
                networkRecoveryAttempts += 1;
                hls.startLoad();
                return;
              }

              if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveryAttempts < 1) {
                mediaRecoveryAttempts += 1;
                hls.recoverMediaError();
                return;
              }

              failPlayback();
              hls.destroy();
            });
          })
          .catch(() => {
            if (disposed) return;
            if (canPlayNativeHls) {
              loadNativeSource();
            } else {
              failPlayback();
            }
          });
      }

      return () => {
        disposed = true;
        clearStalledStartTimer();
        destroyHls?.();
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }, [autoPlay, retryKey, src]);

    return (
      <div className="relative h-full w-full bg-black">
        <video
          {...videoProps}
          ref={assignVideoRef}
          autoPlay={autoPlay}
          className={className}
          onCanPlay={(event) => {
            videoProps.onCanPlay?.(event);
            setPlaybackError(false);
          }}
          onError={(event) => {
            onError?.(event);
            if (!isHlsSource(src ?? "")) setPlaybackError(true);
          }}
          onPlay={(event) => {
            videoProps.onPlay?.(event);
            if ((event.currentTarget.currentTime ?? 0) < 0.25) {
              if (stalledStartTimerRef.current) {
                clearTimeout(stalledStartTimerRef.current);
              }
              stalledStartTimerRef.current = setTimeout(() => {
                const video = videoRef.current;
                if (!video) return;
                const hasStarted = !video.paused && video.currentTime > 0;
                const hasEnoughData = video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
                if (!hasStarted && !hasEnoughData) setPlaybackError(true);
              }, STALLED_START_TIMEOUT_MS);
            }
          }}
          onPlaying={(event) => {
            videoProps.onPlaying?.(event);
            if (stalledStartTimerRef.current) {
              clearTimeout(stalledStartTimerRef.current);
              stalledStartTimerRef.current = null;
            }
            setPlaybackError(false);
          }}
          onStalled={(event) => {
            videoProps.onStalled?.(event);
            if ((event.currentTarget.currentTime ?? 0) < 0.25) {
              if (stalledStartTimerRef.current) {
                clearTimeout(stalledStartTimerRef.current);
              }
              stalledStartTimerRef.current = setTimeout(() => {
                const video = videoRef.current;
                if (!video) return;
                if (video.currentTime < 0.25 && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
                  setPlaybackError(true);
                }
              }, STALLED_START_TIMEOUT_MS);
            }
          }}
        />
        {playbackError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 p-5 text-center text-white">
            <p className="text-sm font-semibold">This video could not play on this device.</p>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 border-white/50 bg-black/40 text-white hover:bg-white hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                setRetryKey((value) => value + 1);
              }}
            >
              Try again
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);
