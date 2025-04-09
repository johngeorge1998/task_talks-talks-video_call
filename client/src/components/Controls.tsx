import { ActionIcon, Group } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import {
  IconVideo,
  IconVideoOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
} from "@tabler/icons-react";
import { ControlsProps } from "../types";

export const Controls: React.FC<ControlsProps> = ({
  toggleVideo,
  toggleAudio,
  leaveCall,
  videoEnabled,
  audioEnabled,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark"; // Dark mode check

  return (
    <Group gap="lg">
      {/* Toggle video button */}
      <ActionIcon
        onClick={toggleVideo}
        variant="filled"
        color={isDark ? "white" : "black"}
        radius="xl"
        size="lg"
        style={{
          width: "50px",
          height: "50px",
          background: isDark
            ? videoEnabled
              ? "#fff"
              : "#ccc"
            : videoEnabled
            ? "#000"
            : "#666",
        }}
      >
        {videoEnabled ? (
          <IconVideo size={24} color={isDark ? "#000" : "#fff"} />
        ) : (
          <IconVideoOff size={24} color={isDark ? "#000" : "#fff"} />
        )}
      </ActionIcon>

      {/* Toggle audio button */}
      <ActionIcon
        onClick={toggleAudio}
        variant="filled"
        color={isDark ? "white" : "black"}
        radius="xl"
        size="lg"
        style={{
          width: "50px",
          height: "50px",
          background: isDark
            ? audioEnabled
              ? "#fff"
              : "#ccc"
            : audioEnabled
            ? "#000"
            : "#666",
        }}
      >
        {audioEnabled ? (
          <IconMicrophone size={24} color={isDark ? "#000" : "#fff"} />
        ) : (
          <IconMicrophoneOff size={24} color={isDark ? "#000" : "#fff"} />
        )}
      </ActionIcon>

      {/* Leave call button */}
      <ActionIcon
        onClick={leaveCall}
        variant="filled"
        color={isDark ? "white" : "black"}
        radius="xl"
        size="lg"
        style={{
          width: "50px",
          height: "50px",
          background: "#ea4335",
        }}
      >
        <IconPhoneOff size={24} color="#fff" />
      </ActionIcon>
    </Group>
  );
};