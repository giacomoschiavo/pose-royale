import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./CanvasVideo.module.css";

const CanvasVideo = ({ gameDraw }) => {
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
  }, [webcamRef, canvasRef, gameDraw]);

  return (
    <div className={styles.container}>
      <Webcam ref={webcamRef} width={640} height={480} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default CanvasVideo;
