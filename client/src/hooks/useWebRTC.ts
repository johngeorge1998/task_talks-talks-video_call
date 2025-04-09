import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import { User, UseWebRTCReturn } from "../types";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", { autoConnect: false });

export const useWebRTC = (
  roomId: string,
  username: string
): UseWebRTCReturn => {
  const [users, setUsers] = useState<User[]>([]); // List of users in the room
  const [stream, setStream] = useState<MediaStream | null>(null); // Your video/audio stream
  const [videoEnabled, setVideoEnabled] = useState(true); // Is your video on?
  const [audioEnabled, setAudioEnabled] = useState(true); // Is your audio on?
  const userVideo = useRef<HTMLVideoElement | null>(null); // Ref to your video element
  const peersRef = useRef<{ peerID: string; peer: MediaConnection }[]>([]); // Tracks peer connections
  const peerInstance = useRef<Peer | null>(null); // Your PeerJS instance
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        // Grab your camera and mic stream
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        if (userVideo.current) userVideo.current.srcObject = userStream;

        // Setup PeerJS for WebRTC
        const peer = new Peer({
          host: "localhost",
          port: 5000,
          path: "/peerjs",
          debug: 3,
        });
        peerInstance.current = peer;

        // When your peer ID is ready, join the room
        peer.on("open", (peerId) => {
          socket.connect();
          socket.on("connect", () => {
            socket.emit("join-room", {
              roomId,
              username,
              peerId,
              videoEnabled,
              audioEnabled,
            });
          });
        });

        // Connect to everyone already in the room
        socket.on("all-users", (users: User[]) => {
          users.forEach((user) => {
            if (
              user.id !== socket.id &&
              user.peerId &&
              user.peerId !== "pending"
            ) {
              const existingCall = peersRef.current.find(
                (p) => p.peerID === user.id
              );
              if (!existingCall) {
                const call = peer.call(user.peerId, userStream);
                call.on("stream", (remoteStream) => {
                  setUsers((prev) => {
                    if (!prev.some((u) => u.id === user.id)) {
                      return [...prev, { ...user, stream: remoteStream }];
                    }
                    return prev;
                  });
                });
                peersRef.current.push({ peerID: user.id, peer: call });
              }
            }
          });
        });

        // Handle new users joining
        socket.on(
          "user-joined",
          (payload: {
            id: string;
            username: string;
            peerId: string;
            videoEnabled: boolean;
            audioEnabled: boolean;
          }) => {
            if (
              payload.id !== socket.id &&
              payload.peerId &&
              payload.peerId !== "pending"
            ) {
              const existingCall = peersRef.current.find(
                (p) => p.peerID === payload.id
              );
              if (!existingCall) {
                const call = peer.call(payload.peerId, userStream);
                call.on("stream", (remoteStream) => {
                  setUsers((prev) => {
                    if (!prev.some((u) => u.id === payload.id)) {
                      return [...prev, { ...payload, stream: remoteStream }];
                    }
                    return prev;
                  });
                });
                peersRef.current.push({ peerID: payload.id, peer: call });
              }
            }
          }
        );

        // Answer incoming calls from others
        peer.on("call", (call) => {
          call.answer(userStream);
          call.on("stream", () => {
            setUsers((prev) => {
              const existingUser = prev.find((u) => u.peerId === call.peer);
              if (!existingUser) return prev;
              return prev;
            });
          });
          peersRef.current.push({ peerID: call.peer, peer: call });
        });

        // Update when someone toggles their video/audio
        socket.on(
          "user-toggled",
          ({ id, videoEnabled: vEnabled, audioEnabled: aEnabled }) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === id
                  ? { ...u, videoEnabled: vEnabled, audioEnabled: aEnabled }
                  : u
              )
            );
          }
        );

        // Handle when someone leaves the room
        socket.on("user-left", (id: string) => {
          const peerCall = peersRef.current.find((p) => p.peerID === id);
          peerCall?.peer.close();
          peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
          setUsers((prev) => {
            const newUsers = prev.filter((u) => u.id !== id);
            if (newUsers.length === 0) navigate("/");
            return newUsers;
          });
        });

        // Redirect if socket disconnects
        socket.on("disconnect", () => {
          navigate("/");
        });
      } catch (err) {
        console.error("Error initializing WebRTC:", err);
      }
    };

    init();

    // Cleanup: disconnect and stop streams
    return () => {
      socket.disconnect();
      peerInstance.current?.destroy();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, username, navigate]);

  // Toggle your video on/off
  const toggleVideo = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    const newState = !videoEnabled;
    videoTrack.enabled = newState;
    setVideoEnabled(newState);
    socket.emit("toggle-state", {
      roomId,
      id: socket.id,
      videoEnabled: newState,
      audioEnabled,
    });
    if (userVideo.current && newState) {
      userVideo.current
        .play()
        .catch((err) => console.error("Play failed:", err));
    }
  };

  // Toggle your audio on/off
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      const newState = !audioEnabled;
      audioTrack.enabled = newState;
      setAudioEnabled(newState);
      socket.emit("toggle-state", {
        roomId,
        id: socket.id,
        videoEnabled,
        audioEnabled: newState,
      });
    }
  };

  // Leave the call and clean up
  const leaveCall = () => {
    socket.emit("leave-room", roomId);
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    navigate("/");
  };

  return {
    users,
    stream,
    userVideo,
    toggleVideo,
    toggleAudio,
    leaveCall,
    videoEnabled,
    audioEnabled,
    socket,
  };
};