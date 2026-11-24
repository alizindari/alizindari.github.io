import { CanvasTexture, SRGBColorSpace } from 'three';

export const catFaceWidth = 1.7;
export const catFaceBottom = 0.26;
export const catFaceHeight = 1.64;

export function createJellyCatFace() {
  const canvas = document.createElement('canvas');
  const size = 384;
  canvas.width = canvas.height = size;
  const ink = canvas.getContext('2d')!;
  ink.setTransform(size / catFaceWidth, 0, 0, -size / catFaceHeight,
    size / 2, size * (catFaceBottom + catFaceHeight) / catFaceHeight);

  function oval(x: number, y: number, width: number, height: number, color: string) {
    ink.fillStyle = color;
    ink.beginPath();
    ink.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    ink.fill();
  }

  for (const side of [-1, 1]) {
    ink.save();
    ink.scale(side, 1);
    ink.fillStyle = 'rgba(237, 111, 145, 0.58)';
    ink.beginPath();
    ink.moveTo(0.37, 1.39);
    ink.quadraticCurveTo(0.42, 1.53, 0.475, 1.59);
    ink.quadraticCurveTo(0.50, 1.61, 0.52, 1.56);
    ink.quadraticCurveTo(0.57, 1.48, 0.59, 1.38);
    ink.quadraticCurveTo(0.48, 1.34, 0.37, 1.39);
    ink.fill();
    oval(0.41, 0.71, 0.087, 0.044, 'rgba(230, 76, 133, 0.52)');
    ink.lineCap = 'round';
    ink.lineWidth = 0.020;
    ink.strokeStyle = 'rgba(99, 44, 71, 0.78)';
    ink.beginPath();
    ink.moveTo(0.46, 0.75); ink.quadraticCurveTo(0.52, 0.79, 0.58, 0.78);
    ink.moveTo(0.47, 0.69); ink.quadraticCurveTo(0.52, 0.70, 0.57, 0.67);
    ink.stroke();
    ink.restore();

    const eye = side * 0.26;
    oval(eye, 0.877, 0.072, 0.097, '#341c32');
    oval(eye - 0.022, 0.909, 0.023, 0.027, '#fff9f4');
  }

  ink.lineWidth = 0.021;
  ink.strokeStyle = '#65344f';
  ink.beginPath();
  ink.moveTo(0, 0.72); ink.lineTo(0, 0.661);
  ink.moveTo(-0.099, 0.658);
  ink.quadraticCurveTo(-0.047, 0.604, 0, 0.661);
  ink.quadraticCurveTo(0.047, 0.604, 0.099, 0.658);
  ink.stroke();
  ink.fillStyle = '#a84e70';
  ink.beginPath();
  ink.moveTo(0, 0.700);
  ink.quadraticCurveTo(-0.095, 0.765, -0.041, 0.779);
  ink.quadraticCurveTo(0, 0.786, 0.041, 0.779);
  ink.quadraticCurveTo(0.095, 0.765, 0, 0.700);
  ink.fill();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
