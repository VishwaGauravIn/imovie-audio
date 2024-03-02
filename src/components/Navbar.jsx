import React from "react";

import {
  IconExternalLink,
  IconHelp,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";

export default function Navbar({ setAudioFiles, audioFiles, audioRef }) {
  const handleAddAudio = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "audio/*";
    input.addEventListener("change", handleFileChange);
    input.click();
  };

  const handleFileChange = (e) => {
    const target = e.target;
    const files = Array.from(target.files || []);
    const updatedAudioFiles = files.map((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const audioElement = document.createElement("audio");
        audioElement.src = reader.result;
        audioElement.onloadedmetadata = () => {
          const audio = {
            id: audioFiles.length + index + 1,
            name: file.name,
            url: reader.result,
            duration: audioElement.duration,
            width: (audioElement.duration / (60 * 10)) * 100 + "%", // 10min timeline assuming
            artist: "", // You can extract artist info if available
            albumArt: "", // You can extract album art if available
          };
          setAudioFiles((prevState) => [...prevState, audio]);
          if (audioFiles.length === 0) {
            if (audioRef.current) {
              audioRef.current.src = audio.url;
              audioRef.current.load();
              audioRef.current.play();
            }
          }
        };
      };
    });
  };
  return (
    <nav className="bg-[#121212] shadow-xl justify-between items-center flex w-full h-14 p-2 text-white">
      <a
        href="https://github.com/VishwaGauravIn/imovie-audio"
        target="_blank"
        rel="noreferrer noopener"
        className="opacity-75 hover:opacity-100 transition-all ease-in-out flex justify-center items-center gap-1 text-fuchsia-300"
      >
        GitHub <IconExternalLink className="stroke-1 w-5 h-5" />
      </a>
      <p className="">The Ocean</p>
      <div className="flex gap-4">
        <IconHelp
          data-tooltip-id="tooltip"
          data-tooltip-content="Help"
          className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
        />
        <IconSettings
          data-tooltip-id="tooltip"
          data-tooltip-content="Settings"
          className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
        />
        <IconPlus
          data-tooltip-id="tooltip"
          data-tooltip-content="Add Track"
          className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          onClick={handleAddAudio}
        />
      </div>
    </nav>
  );
}
