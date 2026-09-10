const localImageUrl = (filename) =>
  `${process.env.PUBLIC_URL || ""}/images/${encodeURIComponent(filename)}`;

const apiImageUrl = (filename) =>
  `${process.env.REACT_APP_API_URL}/images/${encodeURIComponent(filename)}`;

const unavailableImages = new Set([
  "1787655953673-coverImage.jpg",
  "1787655997932-coverImage.jpg",
  "1787656018482-coverImage.jpg",
  "1787656033777-coverImage.jpg",
]);

export const getBookImage = (coverImage) => {
  if (!coverImage) return "";

  // Older records contain Supabase public URLs. Their last path segment is the
  // filename, so use the matching image committed in public/images instead.
  if (coverImage.startsWith("http")) {
    try {
      const url = new URL(coverImage);
      if (url.hostname.endsWith(".supabase.co")) {
        const filename = decodeURIComponent(url.pathname.split("/").pop());
        return unavailableImages.has(filename)
          ? localImageUrl("book-cover-placeholder.svg")
          : localImageUrl(filename);
      }
    } catch {
      return coverImage;
    }

    return coverImage;
  }

  // Local uploads are available from Express while developing. Production uses
  // the committed public/images folder, which Vercel can serve permanently.
  if (window.location.hostname === "localhost" && process.env.REACT_APP_API_URL) {
    return apiImageUrl(coverImage);
  }

  return localImageUrl(coverImage);
};
