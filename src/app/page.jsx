"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import Navbar from "@/components/Navbar";
import DisplaySection from "@/components/DisplaySection";
import TimelineTrack from "@/components/TimelineTrack";
import TimelineRibbon from "@/components/TimelineRibbon";
import AudioComponent from "@/components/AudioComponent";
import Timeline from "@/components/Timeline";

export default function page() {
  // assuming that timeline is of 10min

  const [audioFiles, setAudioFiles] = useState([]);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [bufferTime, setBufferTime] = useState(0); // [0, 600] 10min timeline assuming
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const timelineWidthRef = useRef(null);

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
      <Navbar
        setAudioFiles={setAudioFiles}
        audioFiles={audioFiles}
        audioRef={audioRef}
      />
      <DisplaySection />
      <hr className="w-full border-4 border-[#121212]" />
      <div className="h-2/4 text-white relative">
        <TimelineRibbon
          isPlaying={isPlaying}
          handlePlayPauseButtonClick={handlePlayPauseButtonClick}
        />

        <Timeline
          audioFiles={audioFiles}
          audioRef={audioRef}
          setIsDragging={setIsDragging}
          timelineWidth={timelineWidth}
          setTimelineWidth={setTimelineWidth}
          timelineWidthRef={timelineWidthRef}
        />
        <TimelineTrack
          audioFiles={audioFiles}
          setIsDragging={setIsDragging}
          setAudioFiles={setAudioFiles}
          audioRef={audioRef}
          timelineWidthRef={timelineWidthRef}
        />

        <AudioComponent
          audioFiles={audioFiles}
          audioRef={audioRef}
          bufferTime={bufferTime}
          setBufferTime={setBufferTime}
          setTimelineWidth={setTimelineWidth}
          setIsPlaying={setIsPlaying}
          isDragging={isDragging}
        />
      </div>
      <Tooltip id="tooltip" />
    </main>
  );
}
