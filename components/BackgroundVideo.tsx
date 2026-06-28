// Lightweight decorative background video. Always muted/looping/inline with
// metadata preload and no controls — purely decorative (aria-hidden), no JS.
// Caller controls opacity / responsive visibility via className.
type Props = {
  src: string;
  className?: string;
};

export default function BackgroundVideo({ src, className = "" }: Props) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
