import{c as se,j as g}from"./index-PRav9IrC.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=se("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]),ie={id:1,slug:"convergence-of-gradient-descent-for-smooth-functions",title:"Convergence of Gradient Descent for Smooth Functions",author:"Ali Zindari",date:"2026-02-27",excerpt:"A short proof of the standard descent guarantee for gradient descent on smooth nonconvex functions.",image:"/blog-cover-welcome.svg",math:"\\min_{0 \\le t < T}\\lVert\\nabla f(x_t)\\rVert^2 = O(1/T)",tags:["optimization","gradient descent","smoothness"],difficulty:1,content:`# Convergence of Gradient Descent for Smooth Functions

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
`},le={id:2,slug:"washing-machine-dilemma",title:"How Many Shirts Should You Own? The Washing Machine Dilemma",author:"Ali Zindari",date:"2026-08-08",excerpt:"",image:"/blog-cover-laundry.svg",math:"",tags:["optimization","probability","simulation"],difficulty:2,content:String.raw`Recently, I've been thinking about a problem I have to deal with every week. There isn't a washing machine in my apartment. There is just one for the whole building, and everyone shares it. Each wash costs 1.25 €.

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

The expected-cost derivation tells us what should be optimized and why. The simulator below carries out the remaining discrete search, runs the random process repeatedly, and compares both average cost and shortage risk.`},Xe=[le,ie];function Q(e){var t,r,o="";if(typeof e=="string"||typeof e=="number")o+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(t=0;t<n;t++)e[t]&&(r=Q(e[t]))&&(o&&(o+=" "),o+=r)}else for(r in e)e[r]&&(o&&(o+=" "),o+=r);return o}function ce(){for(var e,t,r=0,o="",n=arguments.length;r<n;r++)(e=arguments[r])&&(t=Q(e))&&(o&&(o+=" "),o+=t);return o}const B="-",de=e=>{const t=ue(e),{conflictingClassGroups:r,conflictingClassGroupModifiers:o}=e;return{getClassGroupId:l=>{const s=l.split(B);return s[0]===""&&s.length!==1&&s.shift(),ee(s,t)||he(l)},getConflictingClassGroupIds:(l,s)=>{const u=r[l]||[];return s&&o[l]?[...u,...o[l]]:u}}},ee=(e,t)=>{var l;if(e.length===0)return t.classGroupId;const r=e[0],o=t.nextPart.get(r),n=o?ee(e.slice(1),o):void 0;if(n)return n;if(t.validators.length===0)return;const a=e.join(B);return(l=t.validators.find(({validator:s})=>s(a)))==null?void 0:l.classGroupId},D=/^\[(.+)\]$/,he=e=>{if(D.test(e)){const t=D.exec(e)[1],r=t==null?void 0:t.substring(0,t.indexOf(":"));if(r)return"arbitrary.."+r}},ue=e=>{const{theme:t,prefix:r}=e,o={nextPart:new Map,validators:[]};return fe(Object.entries(e.classGroups),r).forEach(([a,l])=>{W(l,o,a,t)}),o},W=(e,t,r,o)=>{e.forEach(n=>{if(typeof n=="string"){const a=n===""?t:Y(t,n);a.classGroupId=r;return}if(typeof n=="function"){if(me(n)){W(n(o),t,r,o);return}t.validators.push({validator:n,classGroupId:r});return}Object.entries(n).forEach(([a,l])=>{W(l,Y(t,a),r,o)})})},Y=(e,t)=>{let r=e;return t.split(B).forEach(o=>{r.nextPart.has(o)||r.nextPart.set(o,{nextPart:new Map,validators:[]}),r=r.nextPart.get(o)}),r},me=e=>e.isThemeGetter,fe=(e,t)=>t?e.map(([r,o])=>{const n=o.map(a=>typeof a=="string"?t+a:typeof a=="object"?Object.fromEntries(Object.entries(a).map(([l,s])=>[t+l,s])):a);return[r,n]}):e,pe=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,r=new Map,o=new Map;const n=(a,l)=>{r.set(a,l),t++,t>e&&(t=0,o=r,r=new Map)};return{get(a){let l=r.get(a);if(l!==void 0)return l;if((l=o.get(a))!==void 0)return n(a,l),l},set(a,l){r.has(a)?r.set(a,l):n(a,l)}}},te="!",be=e=>{const{separator:t,experimentalParseClassName:r}=e,o=t.length===1,n=t[0],a=t.length,l=s=>{const u=[];let f=0,b=0,$;for(let h=0;h<s.length;h++){let p=s[h];if(f===0){if(p===n&&(o||s.slice(h,h+a)===t)){u.push(s.slice(b,h)),b=h+a;continue}if(p==="/"){$=h;continue}}p==="["?f++:p==="]"&&f--}const w=u.length===0?s:s.substring(b),x=w.startsWith(te),v=x?w.substring(1):w,m=$&&$>b?$-b:void 0;return{modifiers:u,hasImportantModifier:x,baseClassName:v,maybePostfixModifierPosition:m}};return r?s=>r({className:s,parseClassName:l}):l},ge=e=>{if(e.length<=1)return e;const t=[];let r=[];return e.forEach(o=>{o[0]==="["?(t.push(...r.sort(),o),r=[]):r.push(o)}),t.push(...r.sort()),t},ye=e=>({cache:pe(e.cacheSize),parseClassName:be(e),...de(e)}),$e=/\s+/,we=(e,t)=>{const{parseClassName:r,getClassGroupId:o,getConflictingClassGroupIds:n}=t,a=[],l=e.trim().split($e);let s="";for(let u=l.length-1;u>=0;u-=1){const f=l[u],{modifiers:b,hasImportantModifier:$,baseClassName:w,maybePostfixModifierPosition:x}=r(f);let v=!!x,m=o(v?w.substring(0,x):w);if(!m){if(!v){s=f+(s.length>0?" "+s:s);continue}if(m=o(w),!m){s=f+(s.length>0?" "+s:s);continue}v=!1}const h=ge(b).join(":"),p=$?h+te:h,y=p+m;if(a.includes(y))continue;a.push(y);const A=n(m,v);for(let z=0;z<A.length;++z){const F=A[z];a.push(p+F)}s=f+(s.length>0?" "+s:s)}return s};function ve(){let e=0,t,r,o="";for(;e<arguments.length;)(t=arguments[e++])&&(r=re(t))&&(o&&(o+=" "),o+=r);return o}const re=e=>{if(typeof e=="string")return e;let t,r="";for(let o=0;o<e.length;o++)e[o]&&(t=re(e[o]))&&(r&&(r+=" "),r+=t);return r};function xe(e,...t){let r,o,n,a=l;function l(u){const f=t.reduce((b,$)=>$(b),e());return r=ye(f),o=r.cache.get,n=r.cache.set,a=s,s(u)}function s(u){const f=o(u);if(f)return f;const b=we(u,r);return n(u,b),b}return function(){return a(ve.apply(null,arguments))}}const c=e=>{const t=r=>r[e]||[];return t.isThemeGetter=!0,t},oe=/^\[(?:([a-z-]+):)?(.+)\]$/i,Te=/^\d+\/\d+$/,Ie=new Set(["px","full","screen"]),ke=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,qe=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,ze=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,Ce=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,Se=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,I=e=>C(e)||Ie.has(e)||Te.test(e),k=e=>S(e,"length",Re),C=e=>!!e&&!Number.isNaN(Number(e)),V=e=>S(e,"number",C),N=e=>!!e&&Number.isInteger(Number(e)),Ae=e=>e.endsWith("%")&&C(e.slice(0,-1)),i=e=>oe.test(e),q=e=>ke.test(e),je=new Set(["length","size","percentage"]),Ne=e=>S(e,je,ae),_e=e=>S(e,"position",ae),Fe=new Set(["image","url"]),Me=e=>S(e,Fe,Pe),Le=e=>S(e,"",Ge),_=()=>!0,S=(e,t,r)=>{const o=oe.exec(e);return o?o[1]?typeof t=="string"?o[1]===t:t.has(o[1]):r(o[2]):!1},Re=e=>qe.test(e)&&!ze.test(e),ae=()=>!1,Ge=e=>Ce.test(e),Pe=e=>Se.test(e),Ee=()=>{const e=c("colors"),t=c("spacing"),r=c("blur"),o=c("brightness"),n=c("borderColor"),a=c("borderRadius"),l=c("borderSpacing"),s=c("borderWidth"),u=c("contrast"),f=c("grayscale"),b=c("hueRotate"),$=c("invert"),w=c("gap"),x=c("gradientColorStops"),v=c("gradientColorStopPositions"),m=c("inset"),h=c("margin"),p=c("opacity"),y=c("padding"),A=c("saturate"),z=c("scale"),F=c("sepia"),K=c("skew"),O=c("space"),X=c("translate"),R=()=>["auto","contain","none"],G=()=>["auto","hidden","clip","visible","scroll"],P=()=>["auto",i,t],d=()=>[i,t],H=()=>["",I,k],M=()=>["auto",C,i],U=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],L=()=>["solid","dashed","dotted","double","none"],J=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],E=()=>["start","end","center","between","around","evenly","stretch"],j=()=>["","0",i],Z=()=>["auto","avoid","all","avoid-page","page","left","right","column"],T=()=>[C,i];return{cacheSize:500,separator:":",theme:{colors:[_],spacing:[I,k],blur:["none","",q,i],brightness:T(),borderColor:[e],borderRadius:["none","","full",q,i],borderSpacing:d(),borderWidth:H(),contrast:T(),grayscale:j(),hueRotate:T(),invert:j(),gap:d(),gradientColorStops:[e],gradientColorStopPositions:[Ae,k],inset:P(),margin:P(),opacity:T(),padding:d(),saturate:T(),scale:T(),sepia:j(),skew:T(),space:d(),translate:d()},classGroups:{aspect:[{aspect:["auto","square","video",i]}],container:["container"],columns:[{columns:[q]}],"break-after":[{"break-after":Z()}],"break-before":[{"break-before":Z()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...U(),i]}],overflow:[{overflow:G()}],"overflow-x":[{"overflow-x":G()}],"overflow-y":[{"overflow-y":G()}],overscroll:[{overscroll:R()}],"overscroll-x":[{"overscroll-x":R()}],"overscroll-y":[{"overscroll-y":R()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[m]}],"inset-x":[{"inset-x":[m]}],"inset-y":[{"inset-y":[m]}],start:[{start:[m]}],end:[{end:[m]}],top:[{top:[m]}],right:[{right:[m]}],bottom:[{bottom:[m]}],left:[{left:[m]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",N,i]}],basis:[{basis:P()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",i]}],grow:[{grow:j()}],shrink:[{shrink:j()}],order:[{order:["first","last","none",N,i]}],"grid-cols":[{"grid-cols":[_]}],"col-start-end":[{col:["auto",{span:["full",N,i]},i]}],"col-start":[{"col-start":M()}],"col-end":[{"col-end":M()}],"grid-rows":[{"grid-rows":[_]}],"row-start-end":[{row:["auto",{span:[N,i]},i]}],"row-start":[{"row-start":M()}],"row-end":[{"row-end":M()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",i]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",i]}],gap:[{gap:[w]}],"gap-x":[{"gap-x":[w]}],"gap-y":[{"gap-y":[w]}],"justify-content":[{justify:["normal",...E()]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal",...E(),"baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":[...E(),"baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[y]}],px:[{px:[y]}],py:[{py:[y]}],ps:[{ps:[y]}],pe:[{pe:[y]}],pt:[{pt:[y]}],pr:[{pr:[y]}],pb:[{pb:[y]}],pl:[{pl:[y]}],m:[{m:[h]}],mx:[{mx:[h]}],my:[{my:[h]}],ms:[{ms:[h]}],me:[{me:[h]}],mt:[{mt:[h]}],mr:[{mr:[h]}],mb:[{mb:[h]}],ml:[{ml:[h]}],"space-x":[{"space-x":[O]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[O]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",i,t]}],"min-w":[{"min-w":[i,t,"min","max","fit"]}],"max-w":[{"max-w":[i,t,"none","full","min","max","fit","prose",{screen:[q]},q]}],h:[{h:[i,t,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[i,t,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[i,t,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[i,t,"auto","min","max","fit"]}],"font-size":[{text:["base",q,k]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",V]}],"font-family":[{font:[_]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",i]}],"line-clamp":[{"line-clamp":["none",C,V]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",I,i]}],"list-image":[{"list-image":["none",i]}],"list-style-type":[{list:["none","disc","decimal",i]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[e]}],"placeholder-opacity":[{"placeholder-opacity":[p]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[e]}],"text-opacity":[{"text-opacity":[p]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...L(),"wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",I,k]}],"underline-offset":[{"underline-offset":["auto",I,i]}],"text-decoration-color":[{decoration:[e]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:d()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",i]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",i]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[p]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...U(),_e]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",Ne]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},Me]}],"bg-color":[{bg:[e]}],"gradient-from-pos":[{from:[v]}],"gradient-via-pos":[{via:[v]}],"gradient-to-pos":[{to:[v]}],"gradient-from":[{from:[x]}],"gradient-via":[{via:[x]}],"gradient-to":[{to:[x]}],rounded:[{rounded:[a]}],"rounded-s":[{"rounded-s":[a]}],"rounded-e":[{"rounded-e":[a]}],"rounded-t":[{"rounded-t":[a]}],"rounded-r":[{"rounded-r":[a]}],"rounded-b":[{"rounded-b":[a]}],"rounded-l":[{"rounded-l":[a]}],"rounded-ss":[{"rounded-ss":[a]}],"rounded-se":[{"rounded-se":[a]}],"rounded-ee":[{"rounded-ee":[a]}],"rounded-es":[{"rounded-es":[a]}],"rounded-tl":[{"rounded-tl":[a]}],"rounded-tr":[{"rounded-tr":[a]}],"rounded-br":[{"rounded-br":[a]}],"rounded-bl":[{"rounded-bl":[a]}],"border-w":[{border:[s]}],"border-w-x":[{"border-x":[s]}],"border-w-y":[{"border-y":[s]}],"border-w-s":[{"border-s":[s]}],"border-w-e":[{"border-e":[s]}],"border-w-t":[{"border-t":[s]}],"border-w-r":[{"border-r":[s]}],"border-w-b":[{"border-b":[s]}],"border-w-l":[{"border-l":[s]}],"border-opacity":[{"border-opacity":[p]}],"border-style":[{border:[...L(),"hidden"]}],"divide-x":[{"divide-x":[s]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[s]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[p]}],"divide-style":[{divide:L()}],"border-color":[{border:[n]}],"border-color-x":[{"border-x":[n]}],"border-color-y":[{"border-y":[n]}],"border-color-s":[{"border-s":[n]}],"border-color-e":[{"border-e":[n]}],"border-color-t":[{"border-t":[n]}],"border-color-r":[{"border-r":[n]}],"border-color-b":[{"border-b":[n]}],"border-color-l":[{"border-l":[n]}],"divide-color":[{divide:[n]}],"outline-style":[{outline:["",...L()]}],"outline-offset":[{"outline-offset":[I,i]}],"outline-w":[{outline:[I,k]}],"outline-color":[{outline:[e]}],"ring-w":[{ring:H()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[e]}],"ring-opacity":[{"ring-opacity":[p]}],"ring-offset-w":[{"ring-offset":[I,k]}],"ring-offset-color":[{"ring-offset":[e]}],shadow:[{shadow:["","inner","none",q,Le]}],"shadow-color":[{shadow:[_]}],opacity:[{opacity:[p]}],"mix-blend":[{"mix-blend":[...J(),"plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":J()}],filter:[{filter:["","none"]}],blur:[{blur:[r]}],brightness:[{brightness:[o]}],contrast:[{contrast:[u]}],"drop-shadow":[{"drop-shadow":["","none",q,i]}],grayscale:[{grayscale:[f]}],"hue-rotate":[{"hue-rotate":[b]}],invert:[{invert:[$]}],saturate:[{saturate:[A]}],sepia:[{sepia:[F]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[r]}],"backdrop-brightness":[{"backdrop-brightness":[o]}],"backdrop-contrast":[{"backdrop-contrast":[u]}],"backdrop-grayscale":[{"backdrop-grayscale":[f]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[b]}],"backdrop-invert":[{"backdrop-invert":[$]}],"backdrop-opacity":[{"backdrop-opacity":[p]}],"backdrop-saturate":[{"backdrop-saturate":[A]}],"backdrop-sepia":[{"backdrop-sepia":[F]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[l]}],"border-spacing-x":[{"border-spacing-x":[l]}],"border-spacing-y":[{"border-spacing-y":[l]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",i]}],duration:[{duration:T()}],ease:[{ease:["linear","in","out","in-out",i]}],delay:[{delay:T()}],animate:[{animate:["none","spin","ping","pulse","bounce",i]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[z]}],"scale-x":[{"scale-x":[z]}],"scale-y":[{"scale-y":[z]}],rotate:[{rotate:[N,i]}],"translate-x":[{"translate-x":[X]}],"translate-y":[{"translate-y":[X]}],"skew-x":[{"skew-x":[K]}],"skew-y":[{"skew-y":[K]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",i]}],accent:[{accent:["auto",e]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",i]}],"caret-color":[{caret:[e]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":d()}],"scroll-mx":[{"scroll-mx":d()}],"scroll-my":[{"scroll-my":d()}],"scroll-ms":[{"scroll-ms":d()}],"scroll-me":[{"scroll-me":d()}],"scroll-mt":[{"scroll-mt":d()}],"scroll-mr":[{"scroll-mr":d()}],"scroll-mb":[{"scroll-mb":d()}],"scroll-ml":[{"scroll-ml":d()}],"scroll-p":[{"scroll-p":d()}],"scroll-px":[{"scroll-px":d()}],"scroll-py":[{"scroll-py":d()}],"scroll-ps":[{"scroll-ps":d()}],"scroll-pe":[{"scroll-pe":d()}],"scroll-pt":[{"scroll-pt":d()}],"scroll-pr":[{"scroll-pr":d()}],"scroll-pb":[{"scroll-pb":d()}],"scroll-pl":[{"scroll-pl":d()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",i]}],fill:[{fill:[e,"none"]}],"stroke-w":[{stroke:[I,k,V]}],stroke:[{stroke:[e,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}},Ve=xe(Ee);function We(...e){return Ve(ce(e))}const Be={1:"Easy",2:"Introductory",3:"Intermediate",4:"Advanced",5:"Research-level"},Ke=["#2a9d8f","#69a85d","#d4a72c","#df713f","#c3454f"],He=({level:e,className:t})=>{const r=Be[e];return g.jsxs("div",{className:We("border-y border-border/80 py-3",t),"aria-label":`Difficulty: ${r}, ${e} out of 5`,title:`Difficulty: ${r} (${e}/5)`,children:[g.jsxs("div",{className:"flex items-center justify-between gap-4",children:[g.jsxs("div",{className:"flex min-w-0 items-center gap-2 text-sm font-medium text-foreground",children:[g.jsx(ne,{size:17,className:"shrink-0 text-muted-foreground","aria-hidden":"true"}),g.jsx("span",{children:"Technical difficulty"})]}),g.jsxs("div",{className:"flex shrink-0 items-baseline gap-2",children:[g.jsx("span",{className:"text-sm font-semibold text-foreground",children:r}),g.jsxs("span",{className:"text-xs tabular-nums text-muted-foreground",children:[e,"/5"]})]})]}),g.jsxs("div",{className:"mt-3","aria-hidden":"true",children:[g.jsx("div",{className:"relative grid h-2.5 grid-cols-5 gap-1",children:Ke.map((o,n)=>g.jsx("span",{className:"rounded-[2px] transition-all duration-300",style:{backgroundColor:o,opacity:n<e?1:.18,transform:n===e-1?"scaleY(1.45)":void 0,boxShadow:n===e-1?`0 0 0 2px hsl(var(--background)), 0 0 0 3px ${o}`:void 0}},o))}),g.jsxs("div",{className:"mt-2 flex justify-between text-[11px] text-muted-foreground",children:[g.jsx("span",{children:"Easy"}),g.jsx("span",{children:"Hard"})]})]})]})};export{He as B,We as a,Xe as b,ce as c};
