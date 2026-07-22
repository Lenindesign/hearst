import React from "react";

type StaticImageData = {
  src: string;
  height?: number;
  width?: number;
};

type StorybookImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "height" | "src" | "width"
> & {
  src: string | StaticImageData;
  height?: number | `${number}`;
  width?: number | `${number}`;
  fill?: boolean;
  preload?: boolean;
  priority?: boolean;
  quality?: number | `${number}`;
  placeholder?: "blur" | "empty" | `data:image/${string}`;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: (options: { src: string; width: number; quality?: number }) => string;
  onLoadingComplete?: (image: HTMLImageElement) => void;
};

const Image = React.forwardRef<HTMLImageElement, StorybookImageProps>(
  (
    {
      src,
      fill,
      preload,
      priority,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      loader: _loader,
      onLoad,
      onLoadingComplete,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;
    const fillStyle = fill
      ? {
          bottom: 0,
          height: "100%",
          left: 0,
          objectFit: "cover" as const,
          position: "absolute" as const,
          right: 0,
          top: 0,
          width: "100%",
        }
      : undefined;

    return (
      // Storybook intentionally renders Next images as native images outside the Next runtime.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        ref={ref}
        src={resolvedSrc}
        loading={priority || preload ? "eager" : props.loading}
        style={{ ...fillStyle, ...style }}
        onLoad={(event) => {
          onLoad?.(event);
          onLoadingComplete?.(event.currentTarget);
        }}
      />
    );
  },
);

Image.displayName = "Image";

export default Image;
