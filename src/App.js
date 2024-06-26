import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  return (
    <div>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
