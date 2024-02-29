import React from "react";
import Draggable from "react-draggable";

export default function Timeline({
  audioFiles,
  audioRef,
  setIsDragging,
  timelineWidth,
  setTimelineWidth,
  timelineWidthRef,
}) {
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
  return (
    <div
      id="timeline"
      className="h-[calc(100% - 56px)] px-2 absolute w-full z-10"
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
  );
}
