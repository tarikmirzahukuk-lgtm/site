"use client";

export default function PaylasimButonlari({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/makale/${slug}`
      : "";

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link kopyalandı!");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareTwitter}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors text-sm"
        title="X'te paylaş"
      >
        𝕏
      </button>
      <button
        onClick={shareLinkedIn}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors text-xs font-bold"
        title="LinkedIn'de paylaş"
      >
        in
      </button>
      <button
        onClick={copyLink}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors"
        title="Linki kopyala"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
      </button>
    </div>
  );
}
