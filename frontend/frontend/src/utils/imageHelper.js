const localImageUrl = (filename) =>
  `${process.env.PUBLIC_URL || ""}/images/${encodeURIComponent(filename)}`;

export const getBookImage = (coverImage) => {
  if (!coverImage) return "";

  // If the database contains a full URL
  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  // Current database records contain only the filename
  return localImageUrl(coverImage);
};