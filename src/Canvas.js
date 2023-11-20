import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./Canvas.module.css";

const Canvas = ({ gameUpdate, gameDraw }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // draw video on canvas
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (webcamRef.current === null) return;
    const video = webcamRef.current.video;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    const draw = () => {
      gameUpdate();
      gameDraw(canvasElement, canvasCtx, video);
      requestId.current = requestAnimationFrame(draw);
    };

    const requestId = { current: null };
    draw();

    return () => {
      // Ferma il loop di gioco quando il componente viene smontato
      if (requestId.current) {
        cancelAnimationFrame(requestId.current);
      }
    };
  }, [webcamRef, canvasRef, gameDraw, gameUpdate]);

  return (
    <div className={styles.container}>
      <Webcam ref={webcamRef} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
