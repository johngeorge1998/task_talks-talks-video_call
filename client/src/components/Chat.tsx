import { useState, useEffect, useRef } from "react";
import { Textarea, Button, ScrollArea, Group, Text } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { ChatProps, Message } from "../types";

// Format timestamp into readable "X secs/mins" or time
const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return `${diff} sec${diff === 1 ? "" : "s"}`;
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} min${mins === 1 ? "" : "s"}`;
  }
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const Chat: React.FC<ChatProps> = ({ socket, roomId, username }) => {
  const [message, setMessage] = useState(""); // Current message input
  const [messages, setMessages] = useState<Message[]>([]); // List of chat messages
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark"; // Dark mode check

  // Listen for incoming messages via socket
  useEffect(() => {
    socket.on("message", (payload: { username: string; text: string }) => {
      setMessages((prev) => [...prev, { ...payload, timestamp: Date.now() }]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a message via socket
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", { roomId, username, text: message });
      setMessage("");
    }
  };

  // Send message on Enter key (no Shift)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "0",
      }}
    >
      {/* Chat message scroll area */}
      <ScrollArea
        style={{
          flex: 1,
          background: isDark ? "#000" : "#fff",
          padding: "10px",
        }}
        viewportRef={scrollAreaRef}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {messages.map((msg, idx) => {
            const isSender = msg.username === username;
            return (
              <Group key={idx} justify={isSender ? "flex-end" : "flex-start"}>
                <div
                  style={{
                    background: isSender
                      ? isDark
                        ? "#fff"
                        : "#000"
                      : isDark
                      ? "#333"
                      : "#f5f5f5",
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: isDark ? "1px solid #333" : "1px solid #e0e0e0",
                  }}
                >
                  <Text
                    size="xs"
                    c={
                      isDark
                        ? isSender
                          ? "#000"
                          : "#fff"
                        : isSender
                        ? "#fff"
                        : "#000"
                    }
                    style={{ fontWeight: 500 }}
                  >
                    {msg.username}
                  </Text>
                  <Text
                    size="sm"
                    c={
                      isDark
                        ? isSender
                          ? "#000"
                          : "#fff"
                        : isSender
                        ? "#fff"
                        : "#000"
                    }
                  >
                    {msg.text}
                  </Text>
                  <Text
                    size="xs"
                    c={
                      isDark
                        ? isSender
                          ? "#666"
                          : "#ccc"
                        : isSender
                        ? "#ccc"
                        : "#666"
                    }
                    style={{ textAlign: "right", marginTop: "2px" }}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </Text>
                </div>
              </Group>
            );
          })}
        </div>
      </ScrollArea>

      {/* Message input and send button */}
      <Group
        gap={0}
        p="xs"
        style={{
          background: isDark ? "#000" : "#fff",
          borderTop: isDark ? "1px solid #333" : "1px solid #e0e0e0",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          autosize
          minRows={1}
          maxRows={3}
          variant="unstyled"
          style={{ flex: 1 }}
          styles={{
            input: {
              borderBottom: isDark ? "1px solid #fff" : "1px solid #000",
              background: "transparent",
              color: isDark ? "#fff" : "#000",
              padding: "8px 10px",
              fontSize: "14px",
            },
          }}
        />
        <Button
          onClick={sendMessage}
          variant="filled"
          color={isDark ? "white" : "black"}
          radius="xl"
          style={{ height: 30 }}
          styles={{
            root: {
              background: isDark ? "#fff" : "#000",
              color: isDark ? "#000" : "#fff",
            },
          }}
        >
          <IconSend size={16} />
        </Button>
      </Group>
    </div>
  );
};