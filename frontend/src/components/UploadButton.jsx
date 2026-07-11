import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function UploadButton({ setUploadedFile }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setUploading(true);

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

      if (!response.data.filename) {
        alert("Backend did not return filename.");
        return;
      }

      localStorage.setItem(
        "document_id",
        response.data.filename
      );

      localStorage.setItem(
        "current_pdf",
        file.name
      );

      const oldHistory =
        JSON.parse(localStorage.getItem("pdf_history")) || [];

      const updatedHistory = oldHistory.filter(
        (item) =>
          item.filename !== response.data.filename
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
      console.error(error);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.label
        whileHover={{
          scale: 1.08,
          rotate: 90,
        }}
        whileTap={{
          scale: 0.92,
        }}
        htmlFor="pdf-upload"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300"
      >
        <Plus size={22} />
      </motion.label>

      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleUpload}
      />

      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-[360px] rounded-2xl border border-cyan-500/20 bg-[#0D1B2A] p-6 shadow-2xl"
          >
            <h2 className="text-center text-xl font-bold text-white">
              📄 Uploading PDF...
            </h2>

            <p className="mt-2 text-center text-sm text-slate-400">
              Extracting text & preparing AI...
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "linear",
                }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              This may take 10–20 seconds depending on PDF size.
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}