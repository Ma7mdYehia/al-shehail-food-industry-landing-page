// Lightweight decorative background video. Always muted/looping/inline with
// metadata preload and no controls — purely decorative (aria-hidden), no JS.
// Caller controls opacity / responsive visibility via className.
type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function BackgroundVideo({ src, poster, className = "" }: Props) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      tabIndex={-1}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
