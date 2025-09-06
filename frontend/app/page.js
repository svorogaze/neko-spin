"use client"
import { useEffect, useState, useRef, useMemo } from "react";

function clamp(v, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }

function cubicDecay(t) { return clamp(Math.pow(t, 3)); }   

function SpinningWheelComponent(props) {
  useEffect(() => {
    let animationFrameId;
    
    const updateSpinning = () => {
      if (props.isSpinning) {
        const elapsed = Date.now() - props.spinningStartTime;
        if (Date.now() - props.lastIndexUpdateTime > props.spinningSpeed) {
          props.setCurrentIndex((props.currentIndex + 1) % props.list.length);
          props.setLastIndexUpdateTime(Date.now());
        }
        
        props.setSpinningSpeed(Math.floor(Math.max(props.spinningSpeed, cubicDecay(elapsed / props.spinningDuration) * props.maxSpeed)));
        
        if (elapsed > props.spinningDuration) {
          props.setIsSpinning(false);
          props.setSpinningSpeed(0);
          if (typeof props.setShowPopup === "function") {
            props.setShowPopup(true);
          }
        } else {
          animationFrameId = requestAnimationFrame(updateSpinning);
        }
      }
    };
    if (props.isSpinning) {
      animationFrameId = requestAnimationFrame(updateSpinning);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [props.isSpinning, props.currentIndex, props.lastIndexUpdateTime, props.spinningSpeed, props.spinningStartTime, props.list.length, props.setShowPopup]);
    let previousElementIndex = (props.currentIndex - 1 + props.list.length) % props.list.length;
    let nextElementIndex = (props.currentIndex + 1) % props.list.length;
    return (
    <div className="w-full flex flex-col items-center justify-center pt-4">
      <a className="text-center w-full justify-center text-text text-4xl truncate block pl-1 pb-1 mb-0.5">
        {props.list[previousElementIndex]}
      </a>
      <a 
        className="text-center w-full justify-center text-text text-4xl border-2 border-text-secondary truncate block pl-1 pr-0.5 py-1"
      >
        {props.list[props.currentIndex]}
      </a>
      <a className="text-center w-full justify-center text-text text-4xl truncate block pl-1 mt-1 pb-1">
        {props.list[nextElementIndex]}
      </a>
    </div>
    );
}

function SpinButton(props) {
  return (
    <button 
      onClick={props.startSpin} 
      className="btn-primary btn"
      disabled={props.isSpinning || props.list.length === 0}
    >
      Spin the wheel
    </button>
  );
}

function shuffle(array) { // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function LoadFromSource(source, props) {
  fetch(`/${source}.json`).then(response => response.json()).then(data => {
    let modifiedList = [...props.loadedList];
    data.forEach(item => {
      modifiedList.push({
        source: source,
        link: item
      })
    });
    shuffle(modifiedList);
    props.setLoadedList(modifiedList);
  }).catch(error => {
    console.error('Error loading JSON:', error);
  })
}

function Checkbox(props) {
   const handleCheckboxChange = (source) => {
    if (!props.isSpinning) {
      props.setIsCheckboxEnabled(new Map(props.isCheckboxEnabled.set(source, !(props.isCheckboxEnabled.get(source) ?? false))));
      if (props.loadedList.filter(item => item.source === source).length === 0) {
        LoadFromSource(source, props);
      }
      if (props.currentIndex >= props.loadedList.filter(item => props.isCheckboxEnabled.get(item.source)).length) {
        props.setCurrentIndex(0);
      }
    }
  };
  return (
    <label className="flex items-center gap-2 text-muted">
      <input
        type="checkbox"
        checked={props.isCheckboxEnabled.get(props.source) ?? false}
        onChange={() => handleCheckboxChange(props.source)}
        className="input"
      />
      <span className="text-muted">{props.label}</span>
    </label>
  );
}

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSpeed, setSpinningSpeed] = useState(0);
  const [spinningStartTime, setSpinningStartTime] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndexUpdateTime, setLastIndexUpdateTime] = useState(Date.now());
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(new Map());
  const [loadedList, setLoadedList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/lets-go-gambling.mp3');
  }, []);

  const list = useMemo(() => {
    let filteredList = [];
    loadedList.forEach((item) => {
        if (isCheckboxEnabled.get(item.source)) {
          filteredList.push(item.link);
        }
      }
    );
    return filteredList;
  }, [isCheckboxEnabled, loadedList]);

  const startSpin = () => {
    if (!isSpinning && list.length > 0) {
      setShowPopup(false);
      setIsSpinning(true);
      setSpinningSpeed(25);
      setSpinningStartTime(Date.now());
      setCurrentIndex(Math.floor(Math.random() * list.length));
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const selectedLink = list.length > 0 ? "https://"+ list[currentIndex] : null;

  return (
      <div className="app-container">
        <div className="card max-w-3xl w-full">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-text text-3xl font-bold m-0">NekoSpin</h1>
            <div className="text-muted" style={{fontSize: '0.95rem'}}>Pick sources & spin</div>
          </div>

          <div className="mt-4 panel flex justify-between items-center">
            <div className="flex-row">
              <Checkbox label="Geocities(34400)" source="geocities" 
              isSpinning={isSpinning} setIsSpinning={setIsSpinning}
              isCheckboxEnabled={isCheckboxEnabled} setIsCheckboxEnabled={setIsCheckboxEnabled}
              currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
              loadedList={loadedList} setLoadedList={setLoadedList}
              />
              <Checkbox label="Neocities(5900)" source="neocities" 
              isSpinning={isSpinning} setIsSpinning={setIsSpinning}
              isCheckboxEnabled={isCheckboxEnabled} setIsCheckboxEnabled={setIsCheckboxEnabled}
              currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
              loadedList={loadedList} setLoadedList={setLoadedList}
              />
              <Checkbox label="Nekoweb(1400)" source="nekoweb" 
              isSpinning={isSpinning} setIsSpinning={setIsSpinning}
              isCheckboxEnabled={isCheckboxEnabled} setIsCheckboxEnabled={setIsCheckboxEnabled}
              currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
              loadedList={loadedList} setLoadedList={setLoadedList}
              />
            </div>

            <div>
              <SpinButton 
                isSpinning={isSpinning} 
                list={list}
                startSpin={startSpin}
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="center mb-3">
              <div className="card wheel-center w-full">
                {list.length > 0 ? (
                  <SpinningWheelComponent isSpinning={isSpinning} setIsSpinning={setIsSpinning} 
                       spinningSpeed={spinningSpeed} setSpinningSpeed={setSpinningSpeed}
                       spinningStartTime={spinningStartTime}
                       currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
                       lastIndexUpdateTime={lastIndexUpdateTime} setLastIndexUpdateTime={setLastIndexUpdateTime}
                       list={list} spinningDuration={3000} maxSpeed={300}
                       setShowPopup={setShowPopup}/>
                ) : null}
              </div>
            </div>

            {list.length === 0 ? (
              <div className="center text-muted mt-2">
                Please select at least one source
              </div>
            ) : null}
          </div>
        </div>

        {showPopup && selectedLink ? (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(2,6,23,0.6)] z-50 animate-fadeIn backdrop-blur-md">
            <div
              role="dialog"
              aria-modal="true"
              className="
              w-[min(720px,92%)] bg-background-color border border-[rgba(255,255,255,0.06)] 
              rounded-[12px] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.6)] transform opacity-0 animate-popIn"
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 overflow-hidden">
                  <div className="text-[1.05rem] font-bold mb-1.5">You landed on</div>
                  <a
                    href={selectedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand inline-block break-words break-all max-w-full whitespace-normal text-[1rem]"
                  >
                    {selectedLink}
                  </a>
                </div>
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={startSpin}
                    className="btn btn-primary py-2 px-3"
                  >
                    Reroll
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className="btn btn-ghost py-2 px-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
  );
}