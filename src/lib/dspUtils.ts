/**
 * Basic Digital Signal Processing utilities
 */

export function computeFFT(data: number[]): number[] {
  const n = data.length;
  // For simplicity in a web demo, we'll use a basic DFT or a simplified power spectrum
  // Real FFT would be better, but let's do a basic magnitude spectrum
  
  // We'll limit to a power of 2 for better performance if needed, 
  // but for visualization 512 or 1024 points is enough.
  const fftSize = Math.min(n, 1024);
  const spectrum: number[] = new Array(fftSize / 2).fill(0);
  
  for (let k = 0; k < fftSize / 2; k++) {
    let real = 0;
    let imag = 0;
    for (let t = 0; t < fftSize; t++) {
      const angle = (2 * Math.PI * k * t) / fftSize;
      real += data[t] * Math.cos(angle);
      imag -= data[t] * Math.sin(angle);
    }
    spectrum[k] = Math.sqrt(real * real + imag * imag) / fftSize;
  }
  
  return spectrum;
}
