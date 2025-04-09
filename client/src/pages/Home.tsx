import { useState } from "react";
import {
  TextInput,
  Button,
  Stack,
  Card,
  Center,
  Image,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMantineColorScheme } from "@mantine/core";
import {
  IconVideo,
  IconLogin,
  IconSun,
  IconMoonStars,
} from "@tabler/icons-react";
import Logo from "../assets/talks-talks.svg";
import { HomeProps } from "../types";

const Home: React.FC<HomeProps> = ({ setUsername }) => {
  const [name, setName] = useState(""); // Your username input
  const [roomId, setRoomId] = useState(""); // Room ID input
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark"; // Dark mode check

  // Create a new room with a random ID
  const createRoom = () => {
    const newRoomId = uuidv4();
    setUsername(name);
    navigate(`/call/${newRoomId}`);
  };

  // Join an existing room with the provided ID
  const joinRoom = () => {
    if (roomId && name) {
      setUsername(name);
      navigate(`/call/${roomId}`);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflowX: "hidden" }}>
      {/* Toggle dark/light mode */}
      <ActionIcon
        variant="outline"
        onClick={() => toggleColorScheme()}
        title="Dark/Light"
        radius="xl"
        size="md"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          border: isDark ? "1px solid #fff" : "1px solid #000",
        }}
      >
        {isDark ? (
          <IconSun color="white" size={16} />
        ) : (
          <IconMoonStars color="black" size={16} />
        )}
      </ActionIcon>

      {/* Center the card on the page */}
      <Center style={{ height: "100vh", background: isDark ? "#000" : "#fff" }}>
        <Card
          shadow="md"
          padding="xl"
          radius="md"
          style={{
            width: 400,
            background: isDark ? "#000" : "#fff",
            border: isDark ? "1px solid #fff" : "1px solid #010826",
          }}
        >
          <Stack gap="xl">
            {/* Logo at the top */}
            <Group justify="flex-start" style={{ width: "100%" }}>
              <Image
                src={Logo}
                alt="Talks-Talks Logo"
                width={70}
                height={70}
                style={{ filter: isDark ? "none" : "invert(1)" }}
              />
            </Group>

            {/* Input for your name */}
            <TextInput
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Your Name"
              variant="unstyled"
              style={{ width: "100%" }}
              styles={{
                input: {
                  background: "transparent",
                  color: isDark ? "#fff" : "#000",
                  borderBottom: isDark ? "1px solid #fff" : "1px solid #000",
                  padding: "0 10px",
                  height: 42,
                  fontSize: 14,
                },
              }}
            />

            {/* Input for room ID */}
            <TextInput
              value={roomId}
              onChange={(e) => setRoomId(e.currentTarget.value)}
              placeholder="Room ID"
              variant="unstyled"
              style={{ width: "100%" }}
              styles={{
                input: {
                  background: "transparent",
                  color: isDark ? "#fff" : "#000",
                  borderBottom: isDark ? "1px solid #fff" : "1px solid #000",
                  padding: "0 10px",
                  height: 42,
                  fontSize: 14,
                },
              }}
            />

            {/* Buttons to create or join a room */}
            <Group justify="space-between" style={{ width: "100%" }}>
              {!roomId && (
                <Button
                  onClick={createRoom}
                  disabled={!name}
                  variant="filled"
                  color={isDark ? "white" : "black"}
                  radius="xl"
                  leftSection={<IconVideo size={20} />}
                  style={{ flex: 1, marginRight: 8 }}
                  styles={{
                    root: {
                      background: isDark ? "#fff" : "#000",
                      color: isDark ? "#000" : "#fff",
                      height: 40,
                      fontSize: 16,
                    },
                  }}
                >
                  Create Room
                </Button>
              )}
              {roomId && (
                <Button
                  onClick={joinRoom}
                  disabled={!name}
                  variant="filled"
                  color={isDark ? "white" : "black"}
                  radius="xl"
                  leftSection={<IconLogin size={20} />}
                  style={{ flex: 1 }}
                  styles={{
                    root: {
                      background: isDark ? "#fff" : "#000",
                      color: isDark ? "#000" : "#fff",
                      height: 40,
                      fontSize: 16,
                    },
                  }}
                >
                  Join Room
                </Button>
              )}
            </Group>
          </Stack>
        </Card>
      </Center>
    </div>
  );
};

export default Home;