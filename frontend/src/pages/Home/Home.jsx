import { useState } from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [uploadedFile, setUploadedFile] = useState("");

  return (
    <div className="flex h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar
        setUploadedFile={setUploadedFile}
        setMessages={setMessages}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        <Header uploadedFile={uploadedFile} />

        <ChatWindow messages={messages} />

        <ChatInput
          messages={messages}
          setMessages={setMessages}
          setUploadedFile={setUploadedFile}
        />

      </div>

    </div>
  );
}