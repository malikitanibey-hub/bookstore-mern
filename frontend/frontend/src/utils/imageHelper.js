const localImageUrl = (filename) =>
  `${process.env.PUBLIC_URL || ""}/images/${encodeURIComponent(filename)}`;

const unavailableImages = new Set([
  "1787655953673-coverImage.jpg",
  "1787655997932-coverImage.jpg",
  "1787656018482-coverImage.jpg",
  "1787656033777-coverImage.jpg",
]);

export const getBookImage = (coverImage) => {
  if (!coverImage) return "";

  let filename = coverImage;

  // Supports both current filename-only records and older Supabase URLs.
  if (coverImage.startsWith("http")) {
    try {
      const url = new URL(coverImage);
      filename = decodeURIComponent(url.pathname.split("/").pop());
    } catch {
      return localImageUrl("book-cover-placeholder.svg");
    }
  }

  return unavailableImages.has(filename)
    ? localImageUrl("book-cover-placeholder.svg")
    : localImageUrl(filename);
};
