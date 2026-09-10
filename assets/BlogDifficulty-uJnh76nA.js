import{c as o,j as e}from"./index-CLzor95Q.js";import{c as r}from"./utils-CytzSlOG.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]),l={id:1,slug:"convergence-of-gradient-descent-for-smooth-functions",title:"Convergence of Gradient Descent for Smooth Functions",author:"Ali Zindari",date:"2026-02-27",excerpt:"A short proof of the standard descent guarantee for gradient descent on smooth nonconvex functions.",image:"/blog-cover-welcome.svg",math:"\\min_{0 \\le t < T}\\lVert\\nabla f(x_t)\\rVert^2 = O(1/T)",tags:["optimization","gradient descent","smoothness"],difficulty:1,content:`# Convergence of Gradient Descent for Smooth Functions

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
`},d={id:2,slug:"washing-machine-dilemma",title:"How Many Shirts Should You Own? The Washing Machine Dilemma",author:"Ali Zindari",date:"2026-08-08",excerpt:"",image:"/blog-cover-laundry.svg",math:"",tags:["optimization","probability","simulation"],difficulty:2,content:String.raw`Recently, I've been thinking about a problem I have to deal with every week. There isn't a washing machine in my apartment. There is just one for the whole building, and everyone shares it. Each wash costs 1.25 €.

I usually do laundry on the weekends. Sometimes the machine is already occupied, so I can't use it right away and have to go back and check several times. And then there is drying, which is slow and boring because I don't use a dryer.

This made me wonder: if I owned more clothes, I wouldn't need to wash them as often. Technically, with infinitely many clothes, I would never need to wash anything, so I would never pay the 1.25 € again. The problem with this plan is that buying infinitely many clothes also costs an infinite amount of money.

Of course, the time horizon matters here. Buying clothes is a one-time expense, while washing keeps costing money again and again. But an infinite horizon doesn't really apply to us, since our lifespan is limited. At some point, we die and never need to wash our clothes again. So the number of future laundry days is always finite. But anyway, that isn't the most interesting place to start.

What I really wanted to know was this: how many clothes should I own if I want to minimize the total cost of buying clothes and doing laundry? And by cost, I don't mean only money. There is also detergent, the time spent checking whether the machine is free, and the slow process of hanging everything up to dry.

So I thought: let's start with the simplest possible version of the problem, then keep making it more complicated until I can no longer solve it. I'm not sure how far I'll get. Let's see.

## Part I: The simplest possible model

Let me begin by removing almost everything that makes laundry annoying in real life. For now, the washing machine is always free, washing and drying take no time, every piece of clothing is identical, one machine load can hold everything, and nothing ever wears out. This is clearly not how laundry works, but it gives us a clean place to start.

I will call each piece of clothing a shirt and assume that I use exactly one clean shirt per day. The same model could be used for any other daily item of clothing.

We only need three fixed quantities and one choice. Let $T$ be the number of days I am planning for, $p$ the price of one shirt, and $F$ the cost of one wash. The quantity $F$ can mean only the machine fee, or it can also include detergent and the value of the time I lose to laundry. The only thing I need to choose is $d$, the number of days between two washes.

### How many shirts do I need?

Suppose I wash once every $d$ days. Since I use one clean shirt per day, I will use $d$ shirts before the next wash. In this simplified world, the shirts become clean again immediately after washing. Therefore, the smallest wardrobe that lets me survive a cycle of $d$ days is

$$
N = d.
$$

Here $N$ is the number of shirts I own. For a fixed washing schedule, buying more than $d$ shirts doesn't reduce the number of washes. So the cheapest choice for a given $d$ is exactly $N=d$.

### The two parts of the bill

Buying $d$ shirts costs

$$
pd.
$$

If the whole experiment lasts $T$ days and I wash every $d$ days, then I use the machine approximately

$$
\frac{T}{d}
$$

times. I say approximately because the final laundry cycle might not end exactly on day $T$. This small boundary detail won't matter as long as $T$ is much larger than $d$.

Since every wash costs $F$, the total washing cost is

$$
F\frac{T}{d} = \frac{FT}{d}.
$$

Putting the wardrobe and laundry costs together gives

$$
C(d) = pd + \frac{FT}{d}.
$$

This one line contains the whole dilemma. The first term grows with $d$: waiting longer between washes means buying more shirts. The second term shrinks with $d$: owning more shirts means fewer visits to the washing machine. The best choice has to balance these two costs.

### Finding the best washing interval

To find the best value of $d$, we differentiate the total cost:

$$
C'(d) = p - \frac{FT}{d^2}.
$$

The derivative tells us what happens to the cost if we increase $d$ slightly. The $p$ comes from the extra wardrobe cost. The negative term comes from the washing money we save by waiting longer.

At the optimum, these two effects balance each other, so $C'(d)=0$:

$$
p = \frac{FT}{d^2}.
$$

Solving for $d$ gives

$$
d^\star = \sqrt{\frac{FT}{p}}.
$$

The star just means "the best choice according to this model." Since we need one shirt per day, the optimal wardrobe size is the same number:

$$
N^\star = d^\star = \sqrt{\frac{FT}{p}}.
$$

If $d$ is smaller than $d^\star$, washing is too frequent and waiting longer lowers the total cost. If $d$ is larger, the wardrobe has become too expensive and waiting longer raises the cost. So this balance point is the minimum.

### A surprisingly neat balance

The optimality condition has a nice interpretation. Starting from

$$
p = \frac{FT}{(d^\star)^2}
$$

and multiplying both sides by $d^\star$ gives

$$
pd^\star = \frac{FT}{d^\star}.
$$

The left side is the money spent on shirts. The right side is the money spent on washing over the full horizon. So, in this very simple model, the optimum splits the total cost equally between the wardrobe and the washing machine.

The square root also makes the result fairly stable. If washing becomes four times more expensive, the optimal number of shirts only doubles. If shirts become four times more expensive, the optimal wardrobe size is cut in half.

### A small numerical example

Suppose I plan for one year, so $T=365$. Let one shirt cost $p=20$ €, and for now let the washing cost contain only the machine fee, so $F=1.25$ €. Then

$$
d^\star = \sqrt{\frac{1.25\times365}{20}} \approx 4.78.
$$

Since the number of shirts must be an integer, I only need to compare the nearby choices. Four shirts costs about 194.06 € over the year, while five shirts costs about 191.25 €. The model therefore chooses five shirts and a wash roughly every five days.

This is only a baseline calculation. It assumes that the machine is always available, that clothes dry instantly, and that there are no restrictions on when I can wash. It also ignores costs beyond the 1.25 € fee. Once waiting time, detergent, drying, and repeated trips downstairs are included, the effective value of $F$ becomes larger, and the model recommends owning more clothes and washing less often.

That is the basic version. The first realistic details I want to add are the time clothes spend drying and the fact that the true cost of doing laundry is more than the machine fee.

## Part II: Drying time and the real cost of a wash

In Part I, washed shirts became available again immediately. In reality, mine remain unavailable while they dry. Let $\ell$ be the number of drying days. I will also allow myself to use $q$ clean items per day instead of exactly one. The first model was the special case $q=1$ and $\ell=0$.

If I wash every $d$ days, I use $qd$ items during the washing cycle. I also need another $q\ell$ items for the days when the previous batch is still drying. The smallest wardrobe that keeps the cycle running is therefore

$$
N=q(d+\ell).
$$

The total cost becomes

$$
\begin{aligned}
C(d)
&=pq(d+\ell)+\frac{FT}{d} \\
&=pq\ell+pqd+\frac{FT}{d}.
\end{aligned}
$$

The term $pq\ell$ is the cost of the extra drying buffer. It doesn't depend on how often I wash. The remaining two terms describe the same tradeoff as before: a longer interval requires more clothes but fewer washes.

Balancing those two terms gives

$$
d^\star=\sqrt{\frac{FT}{pq}},
$$

and the corresponding wardrobe size is

$$
N^\star=q\ell+\sqrt{\frac{qFT}{p}}.
$$

The first result is slightly surprising: drying time increases the number of clothes I need, but it doesn't change the best washing interval. A longer drying time simply adds a fixed buffer of $q\ell$ items. By contrast, using more clothes per day increases the required wardrobe and makes it better to wash more frequently.

The value of $F$ also deserves a more realistic interpretation. The machine itself costs 1.25 €, but a wash also uses detergent and takes time. If I want to describe everything with one objective, I can treat $F$ as an effective cost containing both the direct payment and an approximate value for the inconvenience. This value is personal, but the direction of the result is clear: a larger $F$ means buying more clothes and washing less often.

For example, if you're a very important person and your time is extremely valuable, then perhaps $F\to\infty$ for you. The model would recommend infinitely many clothes, just so you never have to waste any time doing laundry :)

### Numerical example

Take the same one-year horizon and shirt price as before: $T=365$, $p=20$ €, and $q=1$. Suppose drying takes two days, so $\ell=2$.

If I count only the 1.25 € machine fee, the optimal washing interval is still about $4.78$ days, but the wardrobe size becomes

$$
N^\star=2+4.78=6.78.
$$

After comparing the nearby integers, seven shirts is slightly cheaper than six. The drying delay has added two shirts, while the recommended washing interval remains close to five days.

Now suppose I estimate the effective cost of a wash as 5 €, after including detergent and some value for the time spent checking the machine and hanging clothes to dry. Then

$$
d^\star=\sqrt{\frac{5\times365}{20}}\approx9.55,
$$

and

$$
N^\star=2+9.55=11.55.
$$

The nearby practical choice is around twelve shirts and one wash every nine or ten days. The exact number depends on how I value my time, but the comparison shows something useful: drying time mainly creates a fixed wardrobe buffer, while the inconvenience of each laundry session changes how often I should wash.

This version is more realistic, but it still assumes that every dirty item fits in one load. That is the next assumption to remove.

## Part III: Capacity and multiple loads

So far, I have quietly assumed that the washing machine can hold everything I have used since the previous wash. This is reasonable when the wardrobe is small, but eventually the pile of clothes becomes too large for one load.

Let $K$ be the maximum number of items that fit in the machine. If I wait $d$ days and use $q$ items per day, then I arrive with $qd$ dirty items. The number of loads I need is therefore

$$
m(d)=\left\lceil\frac{qd}{K}\right\rceil.
$$

The ceiling means that we round up. Nine dirty shirts with space for eight still require two loads, even though the second load is almost empty.

If each load has effective cost $F$, the total cost becomes

$$
C_K(d)=pq(d+\ell)+\frac{FT}{d}\left\lceil\frac{qd}{K}\right\rceil.
$$

The wardrobe term is unchanged. The difference is that the washing cost now jumps whenever the dirty pile becomes larger than one, two, or three full loads. The smooth curve from the earlier models has turned into a curve with steps.

### What does capacity change?

As long as $qd\leq K$, everything fits in one load and the result from Part II still applies. But waiting longer than $K/q$ days requires at least two loads. This doesn't save any load fees: every item still has to be washed, and now I also need a larger wardrobe.

Under this model, there is therefore no reason to wait beyond the capacity of one full load. The best interval is

$$
d_K^\star=\min\left\{\sqrt{\frac{FT}{pq}},\frac{K}{q}\right\},
$$

and the corresponding wardrobe size is

$$
N_K^\star=q(d_K^\star+\ell).
$$

So capacity doesn't matter when the earlier optimum already fits in one load. When it doesn't fit, capacity places a hard cap on how long it makes sense to wait.

### Numerical example

Take the second example from Part II: $T=365$, $p=20$ €, $q=1$, $\ell=2$, and $F=5$ €. Without a capacity limit, the model recommended waiting about $9.55$ days.

Now suppose the machine holds at most $K=8$ shirts. The unconstrained plan no longer fits in one load, so the best interval becomes

$$
d_K^\star=\min\{9.55,8\}=8.
$$

Including the two-day drying buffer, I need

$$
N_K^\star=8+2=10
$$

shirts. The total one-year cost is approximately

$$
20\times10+5\times\frac{365}{8}=428.13\text{ €}.
$$

The useful point isn't the exact number. It is that a nearly empty second load is expensive. Once the pile reaches the machine's capacity, washing now is better than buying more clothes just to postpone the same work.

This model charges the full value of $F$ for every load. In reality, some costs are paid per load, such as the machine fee, while other costs are paid once per laundry visit, such as checking the machine and carrying everything downstairs. Separating those two costs could make doing several loads in one visit worthwhile. The machine can also simply be occupied when I arrive, which brings me to the final version.

## Part IV: The machine might be occupied

Until now, every planned wash happened exactly on time. That is the least realistic assumption in the whole story. With one shared machine, I can go downstairs on the right day and still find somebody else's clothes inside.

Suppose I plan to wash after $d$ days. Let $a$ be the probability that the machine is free when I check it. If it is occupied, I wait one day and try again. I will call the number of failed attempts $X$. Then

$$
\mathbb{P}(X=k)=(1-a)^k a,\qquad k=0,1,2,\ldots
$$

This is a geometric random variable. Most of the time the delay is small, but there is no fixed upper bound: in principle, I can be unlucky several days in a row. The actual time between two successful washes is now

$$
D=d+X.
$$

This changes the role of the wardrobe. In the deterministic model, $q(d+\ell)$ items were enough. Now I may want some additional clothes as a buffer against failed attempts. If I own $N$ items, the number of failed days I can tolerate is

$$
b(N,d)=\left\lfloor\frac{N}{q}-d-\ell\right\rfloor.
$$

I run out when the random delay is larger than this buffer. For one laundry cycle, that probability is

$$
\mathbb{P}(X>b)=(1-a)^{b+1}.
$$

Even a small probability per cycle can become noticeable over a full year because the same gamble is repeated many times.

### A fuller cost model

I will now separate the cost of one laundry visit from the cost of each machine load. Let $A$ be the cost paid once when a wash succeeds, $B$ the cost of one load, $H$ the cost of each failed check, and $R$ the emergency cost of being short of one item. The last quantity can represent buying something quickly, changing plans, or simply how much I dislike running out.

During a cycle with delay $X$, I collect $q(d+X)$ dirty items and need

$$
\left\lceil\frac{q(d+X)}{K}\right\rceil
$$

loads. A convenient expression for the cost of that cycle is

$$
A
+B\left\lceil\frac{q(d+X)}{K}\right\rceil
+HX
+R\left[q(d+\ell+X)-N\right]_+,
$$

where $[z]_+=\max\{z,0\}$. The final term is zero when the wardrobe is large enough and positive when I run out.

### Expected cost over the full horizon

The random model doesn't give the same one-line answer as before, but we can still derive the objective that should be minimized. To keep the notation shorter, let

$$
r=1-a.
$$

For a geometric random variable,

$$
\mathbb{E}[X]=\frac{r}{a}.
$$

Therefore, the expected time between two successful washes is

$$
\mathbb{E}[D]=d+\frac{r}{a}.
$$

Over a long horizon, the expected number of successful laundry cycles is approximately

$$
M(d)=\frac{T}{d+r/a}.
$$

This is a renewal approximation: each successful wash starts a new cycle, and the average cycle lasts $d+r/a$ days. The beginning and end of a finite horizon create small boundary effects, which the simulator will keep rather than ignore.

The expected number of loads in one cycle is

$$
\begin{aligned}
L(d)
&=\mathbb{E}\left[\left\lceil\frac{q(d+X)}{K}\right\rceil\right]\\
&=\sum_{k=0}^{\infty}ar^k
\left\lceil\frac{q(d+k)}{K}\right\rceil.
\end{aligned}
$$

The sum has infinitely many terms, but the probabilities $ar^k$ shrink geometrically, so it is easy to evaluate accurately.

Now write the wardrobe size as

$$
N=q(d+\ell+b),
$$

where $b$ is the number of failed days covered by the buffer. The shortage in one cycle is then $q(X-b)_+$. Its expectation has a simple form:

$$
\begin{aligned}
\mathbb{E}[(X-b)_+]
&=\sum_{j=1}^{\infty}\mathbb{P}(X\geq b+j)\\
&=\sum_{j=1}^{\infty}r^{b+j}\\
&=\frac{r^{b+1}}{a}.
\end{aligned}
$$

Therefore, the expected shortage is

$$
q\frac{r^{b+1}}{a}
$$

items per cycle. The expected cost of one complete laundry cycle is therefore

$$
\begin{aligned}
G(d,b)
&=A+BL(d)+H\frac{r}{a}\\
&\quad+Rq\frac{r^{b+1}}{a}.
\end{aligned}
$$

Combining the one-time wardrobe cost with approximately $M(d)$ repeated cycles gives the full expected objective:

$$
J(d,b)
\approx pq(d+\ell+b)+M(d)G(d,b).
$$

Every earlier effect is now visible in this objective: buying more clothes, doing more loads, making failed trips, and running short.

### The optimal buffer for a fixed interval

For a fixed washing interval $d$, only two terms depend on $b$: buying the buffer and paying for shortages. If I temporarily treat $b$ as a continuous number, then

$$
\frac{\partial J}{\partial b}
=pq
+\frac{T}{d+r/a}\frac{Rq}{a}
r^{b+1}\log r.
$$

Setting this derivative to zero gives

$$
r^{b+1}
=\frac{pa(d+r/a)}{TR(-\log r)},
$$

and therefore

$$
b^\star(d)
=\frac{
\log\left(
\dfrac{pa(d+r/a)}{TR(-\log r)}
\right)
}{\log r}-1.
$$

If this expression is negative, the best buffer is zero. Otherwise, because the number of buffer days must be an integer, I only need to compare the integers immediately below and above $b^\star(d)$.

There is a useful detail here: $q$ disappears from the formula. The optimal buffer measured in days doesn't depend on how many items I use per day. Of course, a buffer of $b$ days still requires $qb$ actual items.

For example, using $a=0.7$, $p=20$ €, $T=365$, $R=60$ €, and $d=8$ gives

$$
b^\star(8)\approx3.49.
$$

So the relevant choices are buffers of three and four days. With $q=1$ and $\ell=2$, the four-day buffer gives $N=8+2+4=14$ items, which is also the default recommendation produced by the simulator.

### What remains to optimize?

The washing interval $d$ still doesn't have one neat square-root formula. The expected-load term $L(d)$ jumps whenever another machine load becomes necessary, and the buffer must be rounded to an integer. But the remaining problem is now precise: for each integer $d$, compute $b^\star(d)$, compare its nearby integers, evaluate $J(d,b)$, and keep the cheapest pair.

The simulator performs this search using complete finite-horizon random histories. This avoids the renewal approximation at the boundaries and also gives quantities that the expected objective alone can't show, such as the full cost distribution and the probability of running out at least once.

### How quickly does the risk accumulate?

Suppose the machine is free with probability $a=0.7$ on each attempt. If my wardrobe can absorb two failed days, then the probability of running out during one cycle is

$$
(1-0.7)^3=0.027.
$$

That is only $2.7\%$ for one cycle. If the horizon contains about $M(d)$ independent cycles, the probability of running out at least once is approximately

$$
1-\left(1-r^{b+1}\right)^{M(d)}.
$$

Over roughly forty cycles, the chance is therefore already quite large. With a buffer of five failed days, the per-cycle probability falls to

$$
0.3^6\approx0.00073,
$$

which is much safer, but those three extra buffer days also require more clothes.

The expected-cost derivation tells us what should be optimized and why. The simulator below carries out the remaining discrete search, runs the random process repeatedly, and compares both average cost and shortage risk.`},u=[d,l],c={1:"Easy",2:"Introductory",3:"Intermediate",4:"Advanced",5:"Research-level"},m=["#2a9d8f","#69a85d","#d4a72c","#df713f","#c3454f"],y=({level:t,className:n})=>{const a=c[t];return e.jsxs("div",{className:r("border-y border-border/80 py-3",n),"aria-label":`Difficulty: ${a}, ${t} out of 5`,title:`Difficulty: ${a} (${t}/5)`,children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-2 text-sm font-medium text-foreground",children:[e.jsx(h,{size:17,className:"shrink-0 text-muted-foreground","aria-hidden":"true"}),e.jsx("span",{children:"Technical difficulty"})]}),e.jsxs("div",{className:"flex shrink-0 items-baseline gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-foreground",children:a}),e.jsxs("span",{className:"text-xs tabular-nums text-muted-foreground",children:[t,"/5"]})]})]}),e.jsxs("div",{className:"mt-3","aria-hidden":"true",children:[e.jsx("div",{className:"relative grid h-2.5 grid-cols-5 gap-1",children:m.map((s,i)=>e.jsx("span",{className:"rounded-[2px] transition-all duration-300",style:{backgroundColor:s,opacity:i<t?1:.18,transform:i===t-1?"scaleY(1.45)":void 0,boxShadow:i===t-1?`0 0 0 2px hsl(var(--background)), 0 0 0 3px ${s}`:void 0}},s))}),e.jsxs("div",{className:"mt-2 flex justify-between text-[11px] text-muted-foreground",children:[e.jsx("span",{children:"Easy"}),e.jsx("span",{children:"Hard"})]})]})]})};export{y as B,u as b};
