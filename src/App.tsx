import { useState } from "react";
import "./index.css";

function getRandomFaceId() {
  return Math.floor(Math.random() * 69_999)
    .toString()
    .padStart(5, "0");
}

const Face: React.FC<{ id: string }> = ({ id }) => {
  console.log(id);
  return (
    <img
      src={`https://whichfaceisreal.blob.core.windows.net/public/realimages/${id}.jpeg`}
      className="rounded-full h-60 w-60"
    />
  );
};

function App() {
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
      setLives((prev) => prev - 1);
    }
    getNextFace();
  };

  const newClick = () => {
    if (faces.includes(currentFace)) {
      setLives((prev) => prev - 1);
    } else {
      setScore((prev) => prev + 1);
    }
    getNextFace();
  };

  const buttonStyle =
    "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 m-3 border border-gray-400 rounded shadow";

  const Game = () => {
    return (
      <div className="p-6 bg-slate-50 border-2">
        <div className="flex justify-evenly text-2xl border-b">
          <p className=" text-2xl">Lives {lives}</p>
          <p>Score {score}</p>
        </div>
        <div className="flex justify-center pt-4">
          <Face id={currentFace!} />
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
      <div className="h-full flex flex-col justify-center items-center text-3xl text-blue-700 font-mono border-2 bg-slate-50">
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
    <div className="flex justify-center pt-10">
      <div className="w-96 h-96 flex-col items-center justify-center">{lives > 0 ? <Game /> : <FinalScore />}</div>
      <div>
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
