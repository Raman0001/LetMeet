import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';
const Room = () => {
  const { socket } = useSocket();

  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState();

  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data;
    console.log('New user joined room', emailId);
    const offer = await createOffer();
    socket.emit("call-user", { emailId, offer });
    setRemoteEmailId(emailId);
  }, [createOffer, socket, setRemoteEmailId]);

  const handleIncommingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("incomming-call", from, offer);
    const ans = await createAnswer(offer);
    socket.emit('call-accepted', { emailId: from, ans });
    setRemoteEmailId(from);
  }, [createAnswer, socket, setRemoteEmailId]);

  const handleCallAccepted = useCallback(async (data) => {
    const { ans } = data;
    console.log("call got accepted", ans);
    await setRemoteAns(ans);
  }, [setRemoteAns]);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setMyStream(stream);
  }, []);

  const handleNegotiation = useCallback(async () => {
    const localOffer = await peer.createOffer();
    socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
  }, [peer,remoteEmailId,socket]);

  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined);
    socket.on('incomming-call', handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);

    // return () => {
    //   socket.off('user-joined', handleNewUserJoined);
    //   socket.off('incomming-call', handleIncommingCall);
    //   socket.off("call-accepted", handleCallAccepted);
    // }
  }, [handleNewUserJoined, handleCallAccepted, handleIncommingCall, socket]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation)
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  }, [peer, handleNegotiation]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      <button type='submit' onClick={e => sendStream(myStream)}>send video</button>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing muted />
    </div>
  )
}

export default Room
