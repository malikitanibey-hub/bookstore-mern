export const getBookImage = (coverImage) => {
  if (!coverImage) return "";

  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  return `/images/${coverImage}`;
};