import { io } from "socket.io-client";

const socket = io("http://localhost:3009");
function App() {
  const handleSocket = () => {
    socket.emit("conn", "test");
  };

  return (
    <>
      <div className="card">
        <button onClick={handleSocket}>count is </button>
      </div>
    </>
  );
}

export default App;
