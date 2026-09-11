export const LOGO_IMAGE = `${process.env.PUBLIC_URL || ""}/logo.png`;

export const getBookImage = (coverImage) => {
  // If no image was uploaded, show the logo
  if (!coverImage) return LOGO_IMAGE;

  // If the database contains a full URL
  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  // Uploaded files are stored and served by the backend, so point local
  // filenames at the API. Falls back to a relative path if no API URL is set.
  const base = process.env.REACT_APP_API_URL || "";
  return `${base}/images/${encodeURIComponent(coverImage)}`;
};

export const onImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = LOGO_IMAGE;
};