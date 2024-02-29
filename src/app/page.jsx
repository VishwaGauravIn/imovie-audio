"use client";

import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Tooltip } from "react-tooltip";
import Navbar from "@/components/Navbar";
import DisplaySection from "@/components/DisplaySection";
import TimelineTrack from "@/components/TimelineTrack";
import TimelineRibbon from "@/components/TimelineRibbon";

export default function page() {
  // assuming that timeline is of 10min

  const [audioFiles, setAudioFiles] = useState([]);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [bufferTime, setBufferTime] = useState(0); // [0, 600] 10min timeline assuming
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const timelineWidthRef = useRef(null);

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

  function onTimelineDragStop(e) {
    const timelineElement = document.getElementById("timeline");
    const timelineRect = timelineElement.getBoundingClientRect();
    const percentage = (e.clientX - timelineRect.left) / timelineRect.width;
    let durationInSec = percentage * 600; // Assuming 10 minutes timeline
    if (durationInSec > 600) durationInSec = 600; // handle max duration

    let cumulativeDuration = 0;
    let selectedAudioIndex = -1;
    for (let i = 0; i < audioFiles.length; i++) {
      if (cumulativeDuration + audioFiles[i].duration >= durationInSec) {
        selectedAudioIndex = i;
        break;
      }
      cumulativeDuration += audioFiles[i].duration;
    }

    if (selectedAudioIndex !== -1) {
      const selectedAudio = audioFiles[selectedAudioIndex];
      const currentTimeInSelectedAudio = durationInSec - cumulativeDuration;

      audioRef.current.src = selectedAudio.url;
      audioRef.current.currentTime = currentTimeInSelectedAudio;
      audioRef.current.load();
      audioRef.current.play();

      setTimelineWidth(e.clientX);
      setIsDragging(false);
    }
  }

  function handleTimeUpdate() {
    if (isDragging) return;
    setTimelineWidth(
      ((audioRef.current?.currentTime + bufferTime) / 600) *
        document.getElementById("timeline")?.clientWidth
    );
  }

  function handleEnded() {
    const currentAudioIndex = audioFiles.findIndex(
      (audio) => audio.url === audioRef.current.src
    );
    if (currentAudioIndex === audioFiles.length - 1 && audioRef.current) {
      setBufferTime(0);
      setTimelineWidth(0);
      audioRef.current.src = audioFiles[0].url;
      audioRef.current.load();
      audioRef.current.play();
    }
    if (
      audioFiles &&
      audioFiles.length > 0 &&
      currentAudioIndex >= 0 &&
      currentAudioIndex < audioFiles.length
    ) {
      let sum = 0;
      for (let i = 0; i <= currentAudioIndex; i++) {
        sum += audioFiles[i].duration;
      }
      setBufferTime(sum);
    }
    if (audioRef.current && currentAudioIndex < audioFiles.length - 1) {
      const nextAudio = audioFiles[currentAudioIndex + 1];
      audioRef.current.src = nextAudio.url;
      audioRef.current.load();
      audioRef.current.play();
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  function handlePlayPauseButtonClick() {
    if (audioFiles.length === 0) return;
    setIsPlaying((prevState) => !prevState);
  }

  return (
    <main className="min-h-[100vh] h-[100vh] flex flex-col justify-between relative">
      <Navbar handleFileChange={handleFileChange} />
      <DisplaySection />
      <hr className="w-full border-4 border-[#121212]" />
      <div className="h-2/4 text-white relative">
        <TimelineRibbon
          isPlaying={isPlaying}
          handlePlayPauseButtonClick={handlePlayPauseButtonClick}
        />
        <div
          id="timeline"
          className="h-[calc(100% - 56px)] px-2 absolute w-full"
        >
          <Draggable
            axis="x"
            bounds="parent"
            position={{ x: timelineWidth, y: 0 }}
            onStart={() => setIsDragging(true)}
            onStop={onTimelineDragStop}
            ref={timelineWidthRef}
          >
            <div className="w-1 h-48 bg-amber-500 opacity-50 active:opacity-75 rounded-full"></div>
          </Draggable>
        </div>

        <TimelineTrack
          audioFiles={audioFiles}
          setIsDragging={setIsDragging}
          setAudioFiles={setAudioFiles}
          audioRef={audioRef}
          timelineWidthRef={timelineWidthRef}
        />

        {/*  */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          onSeeked={() => {
            const currentAudioIndex = audioFiles.findIndex(
              (audio) => audio.url === audioRef.current.src
            );
            if (audioFiles && audioFiles.length > 0 && currentAudioIndex > 0) {
              let sum = 0;
              for (let i = 0; i <= currentAudioIndex - 1; i++) {
                sum += audioFiles[i].duration;
              }
              setBufferTime(sum);
            } else {
              setBufferTime(0);
            }
          }}
          className="absolute -top-20"
        ></audio>
      </div>
      <Tooltip id="tooltip" />
    </main>
  );
}
