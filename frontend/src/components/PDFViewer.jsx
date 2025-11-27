import React from "react";

const PDFViewer = ({ pdfUrl, width = "100%", height = "600px" }) => {
  if (!pdfUrl) return <p>No PDF URL provided.</p>;

  return (
    <div style={{ width, height, border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{ border: "none" }}
      >
        <p>
          Your browser does not support PDFs. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>.
        </p>
      </iframe>
    </div>
  );
};

export default PDFViewer;
