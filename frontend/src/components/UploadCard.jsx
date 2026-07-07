import { useState } from "react";
import axios from "axios";

export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ PDF uploaded successfully!");
      console.log(response.data);

      // Future me isi filename se chat karenge
      localStorage.setItem("document_id", response.data.filename);

    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
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
            onClick={handleUpload}
            className="mt-6 rounded-xl bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600"
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </>
      )}

      {message && (
        <p className="mt-4 text-cyan-400">{message}</p>
      )}

    </div>
  );
}
