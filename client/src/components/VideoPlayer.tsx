import { useRef, useEffect } from "react";
import { Card, Text, Center, Avatar } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { VideoPlayerProps } from "../types";

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  username,
  muted,
  videoEnabled = true,
  audioEnabled = true,
  ref,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null); // Fallback ref for the video element
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark"; // Dark mode check

  // Hook up the video stream when it changes
  useEffect(() => {
    const videoElement = ref?.current || videoRef.current;
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      videoElement.play().catch((err) => console.error("Play failed:", err));
    }
  }, [stream, videoEnabled, ref]);

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        background: isDark ? "#000" : "#fff",
        border: isDark ? "1px solid #333" : "1px solid #e0e0e0",
      }}
    >
      {/* Show video if enabled and stream exists, otherwise show avatar */}
      {videoEnabled && stream ? (
        <video
          ref={ref || videoRef}
          autoPlay
          muted={muted || !audioEnabled} // Mute if specified or audio is off
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : (
        <Center
          style={{
            width: "100%",
            height: "100%",
            background: isDark ? "#333" : "#ccc",
            color: isDark ? "#fff" : "#000",
            borderRadius: "8px",
          }}
        >
          <Avatar size="xl" radius="xl" color={isDark ? "gray.7" : "gray.3"}>
            {username[0].toUpperCase()}
          </Avatar>
        </Center>
      )}
      {/* Username label at the bottom */}
      <Text
        size="md"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "#fff",
          background: "rgba(0,0,0,0.6)",
          padding: "8px 16px",
          borderRadius: "12px",
        }}
      >
        {username}
      </Text>
    </Card>
  );
};