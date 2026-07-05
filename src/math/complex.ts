export interface Complex {
  re: number;
  im: number;
}

export function complex(re: number, im: number): Complex {
  return { re, im };
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

export function absSquared(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

export function multiplyByPhase(z: Complex, t: number): Complex {
  return multiply(z, { re: Math.cos(t), im: Math.sin(t) });
}
