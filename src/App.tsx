import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import "./index.css";

function getRandomFaceId() {
  return Math.floor(Math.random() * 69_999)
    .toString()
    .padStart(5, "0");
}

const HotKey: React.FC<{ value: string }> = ({ value }) => {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      <span className="text-xs">{value}</span>
    </kbd>
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

  const processAction = (action: "seen" | "new") => {
    if ((action == "seen" && faces.includes(currentFace)) || (action == "new" && !faces.includes(currentFace))) {
      setScore((prev) => prev + 1);
    } else if (lives == 1) {
      setGameState("finish");
    } else {
      setLives((prev) => prev - 1);
    }
    getNextFace();
  };

  const Start: React.FC = () => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == " " || e.code == "Space") {
          e.preventDefault();
          setGameState("play");
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const Title: React.FC = () => {
      return <h1 className="text-3xl text-center m-3 p-3 border-b text-blue-900">Human Face Retention Benchmark</h1>;
    };

    const StartButton: React.FC = () => {
      return (
        <Button
          className="m-1"
          variant="outline"
          size="lg"
          onClick={() => {
            setGameState("play");
          }}
        >
          <p>Start</p> &nbsp;
          <HotKey value={"⎵"} />
        </Button>
      );
    };

    const Instructions: React.FC = () => {
      const instructions =
        'You will be presented with a series of faces. Press "new" if the face is being displayed for the first time. Press "seen" if the face has been shown previously. Get as many right answers as possible. You are allowed to make up to three mistakes.';

      return (
        <Popover>
          <PopoverTrigger asChild className="m-1">
            <Button variant="outline" size="lg">
              How to play?
            </Button>
          </PopoverTrigger>
          <PopoverContent>{instructions}</PopoverContent>
        </Popover>
      );
    };

    return (
      <div className="h-full flex flex-col">
        <Title />
        <div className="flex flex-col flex-1 h-full justify-center items-center">
          <StartButton />
          <Instructions />
        </div>
      </div>
    );
  };

  const Game: React.FC = () => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          processAction("seen");
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          processAction("new");
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const Score: React.FC = () => {
      return (
        <div className="flex justify-evenly text-2xl border-b">
          <p className=" text-2xl">Lives {lives}</p>
          <p>Score {score}</p>
        </div>
      );
    };

    const Face: React.FC<{ faceId: string }> = ({ faceId }) => {
      const url = `https://whichfaceisreal.blob.core.windows.net/public/realimages/${faceId}.jpeg`;
      return <img src={url} className="rounded-full h-60 w-60" />;
    };

    const Controls: React.FC = () => {
      return (
        <div className="flex justify-center">
          <Button className="my-4 mx-2" variant="outline" size="default" onClick={() => processAction("seen")}>
            <p>seen &nbsp;</p> <HotKey value={"←"} />
          </Button>
          <Button className="my-4 mx-2" variant="outline" size="default" onClick={() => processAction("new")}>
            <p>new &nbsp;</p> <HotKey value={"→"} />
          </Button>
        </div>
      );
    };

    return (
      <div className="p-6 bg-slate-50 h-full ">
        <Score />
        <div className="flex justify-center pt-4">
          <Face faceId={currentFace!} />
        </div>
        <Controls />
      </div>
    );
  };

  const FinalScore: React.FC = () => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == " " || e.code == "Space") {
          e.preventDefault();
          window.location.reload();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const Score: React.FC = () => {
      return <p className="w-full text-center">Your score: {score}</p>;
    };

    const PlayAgainButton: React.FC = () => {
      return (
        <Button
          className="text-black m-4"
          variant="outline"
          size="lg"
          onClick={() => {
            window.location.reload();
          }}
        >
          <p>Play again</p> &nbsp; <HotKey value={"⎵"} />
        </Button>
      );
    };

    return (
      <div className="h-full flex flex-col justify-center items-center text-3xl text-blue-700 bg-slate-50">
        <div className="flex flex-col items-center justify-center">
          <Score />
          <PlayAgainButton />
        </div>
      </div>
    );
  };

  const Cache: React.FC = () => {
    return (
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
    );
  };
  return (
    <div className="flex justify-center pt-10 font-poppins">
      <div className="w-96 h-96 flex-col items-center justify-center border-2">
        {gameState == "start" ? <Start /> : gameState == "play" ? <Game /> : <FinalScore />}
      </div>
      <Cache />
    </div>
  );
}

export default App;
