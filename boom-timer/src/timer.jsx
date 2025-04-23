import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function Timer() {
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [active, setActive] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const playedRef = useRef(false); // sesi sadece bir kere çalmak için

  useEffect(() => {
    let interval;

    if (active && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => {
          const newTime = Math.max(prev - 100, 0);

          // Patlamaya 10 saniye kala sesi çal
          if (newTime <= 10000 && !playedRef.current) {
            const preBoom = new Audio("/explosion.mp3");
            preBoom.play();
            playedRef.current = true;
          }

          return newTime;
        });
      }, 100);
    }

    if (active && remaining === 0) {
      setActive(false);
      setExplosion(true);
      playedRef.current = false;
    }

    return () => clearInterval(interval);
  }, [active, remaining]);

  useEffect(() => {
    if (explosion) {
      const timer = setTimeout(() => {
        setExplosion(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [explosion]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  };

  const handleButtonPress = (value) => {
    if (active) return;
    if (value === "C") {
      setInput("");
    } else if (value === "OK") {
      const parsed = parseFloat(input) * 60 * 1000; // dakikayı milisaniyeye çevir
      if (!isNaN(parsed) && parsed > 0) {
        setRemaining(parsed);
        setActive(true);
        setExplosion(false);
      }
    } else {
      if (input.length < 5) setInput(prev => prev + value);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      color: "#fff"
    }}>
      <div style={{
        position: "relative",
        width: "min(90vw, 320px)",
        aspectRatio: "3 / 4",
      }}>
        <img
          src="/dynamite.png"
          alt="bomba"
          style={{
            width: "100%",
            height: "auto",
            display: explosion ? "none" : "block"
          }}
        />

        {/* Dijital ekran */}
        <div style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "50%",
          height: "40px",
          backgroundColor: "#cddc39",
          color: "#000",
          fontFamily: "'Orbitron', monospace",
          fontSize: "24px",
          textAlign: "center",
          lineHeight: "40px",
          borderRadius: "4px",
          boxShadow: "inset 0 0 10px #888",
        }}>
          {active ? formatTime(remaining) : (input ? `${input} dk` : "Dakika gir")}
        </div>

        {/* Tuş Takımı */}
        <div style={{
          position: "absolute",
          top: "68%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 30px)",
          rowGap: "4px",
        }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map(key => (
            <button
              key={key}
              onClick={() => handleButtonPress(key)}
              style={{
                width: "22px",
                height: "22px",
                backgroundColor: "#222",
                color: "#fff",
                fontSize: "12px",
                border: "1px solid #666",
                borderRadius: "4px",
                padding: 0,
                cursor: "pointer"
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Patlama efekti */}
        {explosion && (
          <img
            src="/boom.gif"
            alt="Patlama"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        )}
      </div>
    </div>
  );
}