import DataUriParser from "datauri/parser.js";

const getDataUri = (file) => {
  const parser = new DataUriParser();

  // Detect PDF correctly
  const mimeType = file.mimetype || "application/pdf";

  return parser.format(mimeType, file.buffer);
};

export default getDataUri;
