import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../providers/Socket"
const Home = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();
    
    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`);
    }, [navigate]);

    useEffect(() => {
        socket.on('joined-room', handleRoomJoined);
        return () => {
            socket.off('joined-room', handleRoomJoined);
        }
        // eslint-disable-next-line
    }, [handleRoomJoined,socket]);

    const handleJoinRoom = (e) => {
        e.preventDefault();
        socket.emit("join-room", { emailId: email, roomId });
    };

    return (
        <div className="bg-gray-100">
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Meeting</h2>
                        <p className="mb-4">Connect To family,friend and peoples.</p>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} id="email" className="outline-none p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Your Email" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700">Room code</label>
                                <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)} id="name" className="outline-none mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Your Room Code" />
                            </div>
                            <button type="submit" onClick={handleJoinRoom} className="w-full bg-black text-white py-2 rounded-md">Enter Room</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
