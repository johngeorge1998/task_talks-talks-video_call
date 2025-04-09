import { useParams } from 'react-router-dom';
import { Container, Paper, Group, Title, Text, Flex, ActionIcon } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoPlayer } from '../components/VideoPlayer';
import { Controls } from '../components/Controls';
import { Chat } from '../components/Chat';
import { CallProps } from '../types';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

const Call: React.FC<CallProps> = ({ username }) => {
  const { roomId } = useParams<{ roomId: string }>(); // Get room ID from URL
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark'; // Dark mode check

  // Hook up WebRTC for video/audio functionality
  const { users, stream, userVideo, toggleVideo, toggleAudio, leaveCall, videoEnabled, audioEnabled, socket } = useWebRTC(roomId!, username);

  const totalParticipants = users.length + 1; // Count yourself + others
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.min(totalParticipants, 4)}, 1fr)`, // Grid for video feeds
    gap: '10px',
    height: '100%',
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Container
      fluid
      style={{
        height: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        background: isDark ? '#000' : '#fff',
      }}
    >
      {/* Header with room ID and dark/light toggle */}
      <Paper
        shadow="sm"
        p="md"
        style={{
          background: isDark ? '#000' : '#fff',
          color: isDark ? '#fff' : '#000',
          flexShrink: 0,
          borderBottom: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          position: 'relative',
        }}
      >
        <Flex align="center" justify="space-between">
          <Title order={3}>Meeting: {roomId}</Title>
          <ActionIcon
            variant="outline"
            onClick={() => toggleColorScheme()}
            title="Dark/Light"
            radius="xl"
            size="md"
            style={{
              border: isDark ? '1px solid #fff' : '1px solid #000',
            }}
          >
            {isDark ? <IconSun color='#fff' size={16} /> : <IconMoonStars color='black' size={16} />}
          </ActionIcon>
        </Flex>
      </Paper>

      {/* Main layout: videos on left, chat on right */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Grid of video players */}
          <div style={gridStyles}>
            {stream && (
              <VideoPlayer
                stream={stream}
                username={username}
                muted
                videoEnabled={videoEnabled}
                audioEnabled={audioEnabled}
                ref={userVideo}
              />
            )}
            {users.map((user) => (
              <VideoPlayer
                key={user.id}
                stream={user.stream}
                username={user.username}
                videoEnabled={user.videoEnabled}
                audioEnabled={user.audioEnabled}
              />
            ))}
          </div>
        </div>

        {/* Chat section */}
        <div
          style={{
            width: '350px',
            background: isDark ? '#000' : '#fff',
            borderLeft: isDark ? '1px solid #333' : '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Paper
            p="xs"
            style={{
              background: isDark ? '#000' : '#fff',
              borderBottom: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              flexShrink: 0,
            }}
          >
            <Flex align="center" gap={10}>
              <Text c={isDark ? '#fff' : '#000'} fz={14} fw={600}>
                CHAT
              </Text>
            </Flex>
          </Paper>
          <Chat socket={socket} roomId={roomId!} username={username} />
        </div>
      </div>

      {/* Bottom controls for video/audio/leave */}
      <Group
        justify="center"
        p="md"
        style={{
          background: isDark ? '#000' : '#fff',
          borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          flexShrink: 0,
        }}
      >
        <Controls
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          leaveCall={leaveCall}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
        />
      </Group>
    </Container>
  );
};

export default Call;