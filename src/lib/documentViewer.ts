export const getDocumentViewerUrl = (pdfUrl: string, title: string) => {
  const params = new URLSearchParams({ file: pdfUrl, title });
  return `/document-viewer.html?${params.toString()}`;
};
