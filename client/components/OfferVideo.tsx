function toYouTubeEmbed(url: string): string | null {
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) return null;
  if (url.includes('/embed/')) return url;
  const id = url.includes('youtu.be')
    ? url.split('/').pop()?.split('?')[0]
    : new URL(url).searchParams.get('v') || url.split('/').pop()?.split('?')[0];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function toVimeoEmbed(url: string): string | null {
  if (!url.includes('vimeo.com')) return null;
  const id = url.split('/').pop()?.split('?')[0];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

export default function OfferVideo({
  src,
  className = 'w-full h-48 rounded-xl bg-black',
}: {
  src: string;
  className?: string;
}) {
  const youtube = toYouTubeEmbed(src);
  if (youtube) {
    return (
      <iframe
        src={youtube}
        title="offer video"
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const vimeo = toVimeoEmbed(src);
  if (vimeo) {
    return (
      <iframe
        src={vimeo}
        title="offer video"
        className={className}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return <video src={src} controls className={className} />;
}
