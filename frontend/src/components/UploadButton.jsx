import { Plus } from "lucide-react";
import axios from "axios";

export default function UploadButton({ setUploadedFile }) {

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", response.data);

      if (!response.data.filename) {
        console.error("Filename missing:", response.data);
        alert("Backend did not return filename.");
        return;
      }

      localStorage.setItem("document_id", response.data.filename);
      localStorage.setItem("current_pdf", file.name);

      console.log(
        "Saved document_id:",
        localStorage.getItem("document_id")
      );

      const oldHistory =
        JSON.parse(localStorage.getItem("pdf_history")) || [];

      const updatedHistory = oldHistory.filter(
        (item) => item.filename !== response.data.filename
      );

      updatedHistory.unshift({
        filename: response.data.filename,
        name: file.name,
      });

      localStorage.setItem(
        "pdf_history",
        JSON.stringify(updatedHistory)
      );

      if (setUploadedFile) {
        setUploadedFile(file.name);
      }

      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("❌ Upload failed.");
    }
  };

  return (
    <>
      <label
        htmlFor="pdf-upload"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500"
      >
        <Plus size={22} className="text-white" />
      </label>

      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleUpload}
      />
    </>
  );
}