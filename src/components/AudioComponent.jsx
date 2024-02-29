import React from "react";

export default function AudioComponent({
  audioFiles,
  audioRef,
  bufferTime,
  setBufferTime,
  setTimelineWidth,
  setIsPlaying,
  isDragging,
}) {
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
  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
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
  );
}
