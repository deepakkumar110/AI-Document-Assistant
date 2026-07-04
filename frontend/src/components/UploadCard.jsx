import { useState } from "react";

export default function UploadCard() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="mt-16 w-full max-w-3xl rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-900 p-10 text-center">

      <h2 className="text-2xl font-bold text-white">
        Upload Your PDF
      </h2>

      <p className="mt-3 text-gray-400">
        Drag & Drop your PDF here or choose a file.
      </p>

      <input
        type="file"
        accept=".pdf"
        id="pdfUpload"
        className="hidden"
        onChange={handleFileChange}
      />

      <label
        htmlFor="pdfUpload"
        className="mt-6 inline-block cursor-pointer rounded-xl bg-cyan-500 px-6 py-3 font-semibold transition hover:bg-cyan-600"
      >
        Choose PDF
      </label>

      {fileName && (
        <>
          <p className="mt-5 text-cyan-400">
            📄 Selected File: {fileName}
          </p>

          <button
            className="mt-6 rounded-xl bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600"
          >
            Upload PDF
          </button>
        </>
      )}

    </div>
  );
}