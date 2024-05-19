import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { connectMetamask, claimTokens, claimNft } from './blockchain';


function App() {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const paddleHeight = 100;
  const paddleWidth = 10;
  let playerY = 250;
  let ballX = 400;
  let ballY = 300;
  let ballSpeedX = 5;
  let ballSpeedY = 2;

  const drawRect = (ctx, x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  const drawCircle = (ctx, x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  };

  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY + 10 > canvas.height || ballY - 10 < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // Ball collision with player paddle
    if (ballX - 10 < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      setPlayerScore(prevScore => prevScore + 1);
      rewardPlayer(playerScore + 1);
    }

    // Ball out of bounds
    if (ballX + 10 > canvas.width || ballX - 10 < 0) {
      ballSpeedX = -ballSpeedX;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player paddle
    drawRect(ctx, 0, playerY, paddleWidth, paddleHeight, 'white');

    // Draw ball
    drawCircle(ctx, ballX, ballY, 10, 'white');

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText("Score: " + playerScore, canvas.width / 2 - 50, 50);

    requestAnimationFrame(update);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', (evt) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      playerY = evt.clientY - rect.top - root.scrollTop - paddleHeight / 2;
    });
    update();
  }, []);

  const rewardPlayer = async (score) => {
    try {
      // Example logic: claim tokens every 5 points
      if (score % 5 === 0) {
        await claimTokens(score);
        await claimNft(score);
      }
    } catch (error) {
      console.error('Error rewarding player:', error);
    }
  };

  return (
    <div className="App">
      <button onClick={connectMetamask}>Connect Metamask</button>
      <canvas ref={canvasRef} width="800" height="600"></canvas>
    </div>
  );
}

export default App;
