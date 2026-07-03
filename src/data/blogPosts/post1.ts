import { BlogPost } from './types';

export const post1: BlogPost = {
  id: 1,
  title: "Convergence of Gradient Descent for Smooth Functions",
  author: "Ali Zindari",
  date: "2026-02-27",
  excerpt: "A short proof of the standard descent guarantee for gradient descent on smooth nonconvex functions.",
  image: "/blog-cover-welcome.svg",
  math: "\\min_{0 \\le t < T}\\lVert\\nabla f(x_t)\\rVert^2 = O(1/T)",
  tags: ["optimization", "gradient descent", "smoothness"],
  content: `# Convergence of Gradient Descent for Smooth Functions

I want this blog to be a place for small notes about math and machine learning. As a first test, here is the standard descent argument for gradient descent on a smooth function.

## Gradient descent for smooth functions

Assume $f : \\mathbb{R}^d \\to \\mathbb{R}$ is $L$-smooth and bounded below by $f_\\star$. Recall that $L$-smoothness means

$$
f(y) \\leq f(x) + \\langle \\nabla f(x), y - x \\rangle + \\frac{L}{2}\\lVert y - x\\rVert^2.
$$

Gradient descent with stepsize $\\eta = 1/L$ is

$$
x_{t+1} = x_t - \\frac{1}{L}\\nabla f(x_t).
$$

Plugging $y = x_{t+1}$ into the smoothness inequality gives

$$
\\begin{aligned}
f(x_{t+1})
&\\leq f(x_t)
  - \\frac{1}{L}\\lVert\\nabla f(x_t)\\rVert^2
  + \\frac{L}{2}\\left\\lVert\\frac{1}{L}\\nabla f(x_t)\\right\\rVert^2 \\\\
&= f(x_t) - \\frac{1}{2L}\\lVert\\nabla f(x_t)\\rVert^2.
\\end{aligned}
$$

So each step decreases the function value by an amount proportional to $\\lVert\\nabla f(x_t)\\rVert^2$. Summing this inequality for $t = 0, \\ldots, T-1$ gives

$$
\\sum_{t=0}^{T-1}\\lVert\\nabla f(x_t)\\rVert^2
\\leq 2L\\bigl(f(x_0) - f(x_T)\\bigr)
\\leq 2L\\bigl(f(x_0) - f_\\star\\bigr).
$$

Therefore,

$$
\\min_{0 \\leq t < T}\\lVert\\nabla f(x_t)\\rVert^2
\\leq
\\frac{2L\\bigl(f(x_0) - f_\\star\\bigr)}{T}.
$$

This is the basic $O(1/T)$ convergence guarantee for reaching an approximate stationary point.
`
};
