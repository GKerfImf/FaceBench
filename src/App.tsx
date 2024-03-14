import { useState } from "react";
import "./index.css";

function getRandomFaceId() {
  return Math.floor(Math.random() * 69_999)
    .toString()
    .padStart(5, "0");
}

const Face: React.FC<{ faceId: string }> = ({ faceId }) => {
  return (
    <img
      src={`https://whichfaceisreal.blob.core.windows.net/public/realimages/${faceId}.jpeg`}
      className="rounded-full h-60 w-60"
    />
  );
};

function App() {
  const [gameState, setGameState] = useState<"start" | "play" | "finish">("start");

  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const [currentFace, setCurrentFace] = useState<string>(getRandomFaceId());
  const [faces, setFaces] = useState<string[]>([]);

  const [faceQueue, setFaceQueue] = useState<string[]>([
    getRandomFaceId(),
    getRandomFaceId(),
    getRandomFaceId(),
    getRandomFaceId(),
  ]);

  const getNextFace = () => {
    // Record the current face in the history
    if (!faces.includes(currentFace)) {
      setFaces((prev) => [...prev, currentFace]);
    }

    if (faces.length == 0 || Math.random() > 0.5) {
      setCurrentFace(faceQueue[0]);
      setFaceQueue((prev) => [...prev.slice(1), getRandomFaceId()]);
    } else {
      const index = Math.floor(Math.random() * faces.length);
      setCurrentFace(faces[index]);
    }
  };

  const seenClick = () => {
    if (faces.includes(currentFace)) {
      setScore((prev) => prev + 1);
    } else {
      if (lives == 1) {
        setGameState("finish");
      }
      setLives((prev) => prev - 1);
    }
    getNextFace();
  };

  const newClick = () => {
    if (faces.includes(currentFace)) {
      if (lives == 1) {
        setGameState("finish");
      }
      setLives((prev) => prev - 1);
    } else {
      setScore((prev) => prev + 1);
    }
    getNextFace();
  };

  const buttonStyle = "bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 m-3 border border-gray-400 rounded shadow";
  // "rounded bg-amber-500 px-4 py-2 text-sm text-white shadow-sm"

  const Start = () => {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center m-3 p-3 border-b-1 text-blue-900 border-b">
          Human Face Retention Benchmark
        </h1>
        <button
          className={buttonStyle}
          onClick={() => {
            setGameState("play");
          }}
        >
          Start
        </button>
        <div className="group relative m-2 flex justify-center">
          <button className={buttonStyle}> How to play? </button>
          <span className="w-60 absolute top-10 scale-0 rounded bg-gray-800 p-2 text-base text-white group-hover:scale-100 text-center">
            You will be presented with a series of faces. Press "new" if the face is being displayed for the first time.
            Press "seen" if the face has been shown previously. Get as many right answers as possible. You are allowed
            to make up to three mistakes.
          </span>
        </div>
      </div>
    );
  };

  const Game = () => {
    return (
      <div className="p-6 bg-slate-50 h-full ">
        <div className="flex justify-evenly text-2xl border-b">
          <p className=" text-2xl">Lives {lives}</p>
          <p>Score {score}</p>
        </div>
        <div className="flex justify-center pt-4">
          <Face faceId={currentFace!} />
        </div>
        <div className="flex justify-center">
          <button className={buttonStyle} onClick={seenClick}>
            seen
          </button>
          <button className={buttonStyle} onClick={newClick}>
            new
          </button>
        </div>
      </div>
    );
  };

  const FinalScore = () => {
    return (
      <div className="h-full flex flex-col justify-center items-center text-3xl text-blue-700 bg-slate-50">
        <div className="flex flex-col items-center justify-center">
          <p className="w-full text-center">Your score: {score}</p>
          <button
            className={`${buttonStyle} text-sm`}
            onClick={() => {
              window.location.reload();
            }}
          >
            Play again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center pt-10 font-poppins">
      <div className="w-96 h-96 flex-col items-center justify-center border-2">
        {gameState == "start" ? <Start /> : gameState == "play" ? <Game /> : <FinalScore />}
      </div>
      <div>
        {/* For caching reasons, we load a few new images in advance. */}
        {faceQueue.map((e, i) => {
          return (
            <img
              key={i}
              src={`https://whichfaceisreal.blob.core.windows.net/public/realimages/${e}.jpeg`}
              className="h-0 w-0"
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
