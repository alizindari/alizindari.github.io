import{c as o,j as e}from"./index-uqPXVNiB.js";import{c as r}from"./utils-CytzSlOG.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("Gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]),l={id:1,slug:"convergence-of-gradient-descent-for-smooth-functions",title:"Convergence of Gradient Descent for Smooth Functions",author:"Ali Zindari",date:"2026-02-27",excerpt:"A short proof of the standard descent guarantee for gradient descent on smooth nonconvex functions.",image:"/blog-cover-gd-v2.png",math:"\\min_{0 \\le t < T}\\lVert\\nabla f(x_t)\\rVert^2 = O(1/T)",tags:["optimization","gradient descent","smoothness"],difficulty:1,content:`# Convergence of Gradient Descent for Smooth Functions

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
`},d={id:2,slug:"washing-machine-dilemma",title:"How Many Shirts Should You Own? The Washing Machine Dilemma",author:"Ali Zindari",date:"2026-08-08",excerpt:"",image:"/blog-cover-laundry-v2.png",math:"",tags:["optimization","probability","simulation"],difficulty:2,content:String.raw`Recently, I've been thinking about a problem I have to deal with every week. There isn't a washing machine in my apartment. There is just one for the whole building, and everyone shares it. Each wash costs 1.25 €.

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

The expected-cost derivation tells us what should be optimized and why. The simulator below carries out the remaining discrete search, runs the random process repeatedly, and compares both average cost and shortage risk.`},c={id:3,slug:"the-iced-tea-no-one-wanted",title:"The Iced Tea No One Wanted",author:"Ali Zindari",date:"2026-09-16",excerpt:"Some personal thoughts on free iced tea, doing theory, and wondering whether any of it matters.",image:"/blog-cover-iced-tea-v2.png",math:"",tags:["personal","research","PhD life"],difficulty:null,feedbackIntro:"I'd be happy to hear your thoughts. Feel free to",content:`The building we work in has a kitchen, and people sometimes leave food or cake there for everyone to share, with a note inviting people to take some if they like. It's free, so almost everything is gone within a few hours. Of course it is. We all love free stuff, right?

One day, someone left some iced tea with the usual note: "Please help yourself." I came back the next day, and it was untouched. Days passed, then weeks, and the free iced tea was still there. No one touched it. That was quite unusual since, as I said, people normally take free stuff within a few hours. Eventually, someone just threw it in the trash.

Then I felt like I was seeing my research in that iced tea. Imagine research so bad and useless that no one wants it, even for free! That's pretty much how I've been feeling about my work lately.

For a while now, I've been asking myself why I'm putting so many hours and so much effort into proving things that absolutely no one cares about. These thoughts started years ago, when I was doing research during my bachelor's, and followed me through ML research in my master's and now my PhD. Especially with the AI we have nowadays, the question feels even more present.

I'm not sure about theoretical research and all the things we prove in simplified scenarios. I mean, who cares? Yeah, I know people say theory is a long-term plan and that we need it to understand how these huge models work. But I'm not sure whether they really mean it, or whether it's just an excuse to convince ourselves: yes, we're doing something useful.

What if it eventually turns out that I've spent my whole life doing all this, only for my research to end up like the iced tea that belongs in the trash? What if no one even wants my research for free? I can't imagine what happens when I tell them, "Hey, I need a salary as well." :)

So yeah, I don't know what the answer is, if there even is one. I enjoy theory, but enjoying something doesn't justify its existence. At least not as a full-time job that I spend most of my life on. As a hobby, it's perfect.

And let's be honest, come on. What percentage of people working in theory produce results that eventually give us something useful? Most papers end up going nowhere and have no real impact.

So should I bet my whole life on being one of those very, very few people who really contribute something through theory? We'll see.
`},m={id:4,slug:"my-undergraduate-years-at-iut",title:"چرا باید شدیدا از صنعتی اصفهان متنفر باشید؟",author:"Ali Zindari",date:"2023-11-11",excerpt:"تجربه‌ها و خاطرات من از دوران کارشناسی در دانشگاه صنعتی اصفهان.",image:"/blog-cover-university-v2.png",math:"",tags:["personal","university","persian"],difficulty:null,language:"fa",content:`## کنکور

ماجرای ورود من به صنعتی صرفا یک اجبار بود. همه چیز به کنکور وابسته بود که من اصلا توش خوب نبودم. تراز های قلمچی یکی از یکی بدتر! یادمه بیشترین ترازم 6100 بود که یک فاجعه ای در مدرسه ی اژه ای 2 به حساب میومد. نهایتا کنکور رو دادم و رتبه ی 2500 منطقه 1 شدم. متاسفانه یا خوشبختانه دوستای من در هر زمینه ای جزو بهترین ها بودن و کنکور رو هم ترکوندن! همه 2و3 رقمی و راهی تهران. با رتبه ای که من آورده بودم هم برق و کامپیوتر تهران نمیشد آورد. واسه ی همین مجبور شدم به ترتیب برق، کامپیوتر و صنایع صنعتی اصفهان رو بزنم. برق و کامپیوتر رو قبول نشدم و نهایتا مجبور به صنایع صنعتی شدم که هیچ علاقه ای بش نداشتم! این در شرایطی بود که تموم دوستام به جز یکی دونفر شریف و تهران قبول شده بودن و باید از همه جدا میشدم.

## جشن ورود صفری ها

جشنی که گرفته بودن رو از قبلش هم میشد حدس زد قراره چه چیزی توش اراعه شه. نهایتا هم همونی شد که انتظار میرفت. یه مجری به شدت نچسب که فک میکنه شدیدا بامزست وارد میشه و مزه میپرونه. بعد یه سری کلیپ پخش میشه با محتویات آشغال. ویو های عجیب غریب از صنعتی، دانشجویانی که روی تخته دارن عبارات ریاضی مینویسن، دانشجو هایی که دارن تو آزمایشگاه ها یه سری چیز قاطی میکنن باهم، یه سری کامپیوتری که دارن با سرعت نور کد میزنن و خلاصه یه مشت آشغال تمپلیت که از تلویزیونم زیاد پخش میشه. بعد یه ویدیو انگیزشی که بیشتر شامل صحنه های غرور آفرین ورزشی کشوره که یه سری قهرمان میشن توش. کلا هدف اینه که دانشجو رو جوگیر کنن. بدترین قسمت مراسم سخنرانی رییس دانشگاه. یه سری حرف بی پایه اساس. نمیدونم ما رنک فلانیم ما صنعتیم و ... بابا خسته نشدین انقد تعریف کردین از خودتون؟ اصن جایی حسابتون میکنن تو دنیا؟ حتی تو کشور؟ یه ابهت توخالی دارین که یه اعتقاد الکی هم بش دارین ازش کوتاه هم نمیاین. بعدم رییس میان و سخت گیری دانشگاه رو توجیه میکنن ما صنعتیم پس سخت میگیریم! بعدم دوباره مجری بیمزه و یه سری آهنگ پاپ چرت و مسابقه و خداحافط.

## تغییر رشته

همون اولای دانشگاه بود که فهمیدم قانون تغییر رشته هست و از همون اول رفتم تو فکرش. اینجوری حداقل میتونستم این فاجعه رو یکم جمعش کنم و حداقل رشته ای که دوست دارم رو توی دانشگاهی که دوست ندارم (ازش متنفرم) بخونم. واسه ی همین تصمیم گرفتم هر کاری لازمه بکنم که معدلم بالا بشه و بتونم رشته رو حداقل تغییر بدم. نتیجش این شد که معدل ترم یک و دوی من نزدیک 19 شد.

## ترمای اول

اولین کلاس روز اول دانشگاه خیلی خوب بود! ریاضی 1 با دکتر بهناز عمومی. هنوزم که هنوزه به نظرم بهترین کلاس و استادم دکتر عمومی بود. خیلی خیلی از انتظاراتم فراتر رفت و کامل از همه چی راضی بودم. اما تهش اینکه هیچکودوم از دوستام نبودن باعث میشد دانشگاه زهر مارم بشه. درسای دیگه هم به این ترتیب بد نبودن و به طور کلی راضی بودم به جز نقشه 1 که ازش متنفر بودم و بسیار توش بد بودم. واسه ی همینم حذفش کردم که معدلو خراب نکنه و هیچوقتم بعدش برش نداشتم.

## تغییر رشته با موفقیت

بعد دو ترم که معدلم خیلی بالا شد درخواست تغییر رشته رو اول تابستون دادم. فک میکردم دیگه دو سه هفته بعدش باید نتیجشو بگن که ذهنم یکم راحت شه. نهایتا بعد 3 ماه!!! و با کلی منت آموزش کل نتیجه رو اعلام کرد. خیلی اذیت کردن خیلی. نه تلفنی جواب میدادن نه اون گلستان لعنتیو آپدیت میکردن. ولی تهش که خبرو فهمیدم خیلی خیلی خوشحال شدم. اون روز خوشحال ترین روزی بود که توی کل دوران صنعتی داشتم. فک میکردم که دیگه همه چی عالی میشه و منم قراره از همه ی درسا و رشتم بیشترین لذت ممکن رو ببرم. ولی عجب اشتباهی میکردم. خیلی احمق بودم.

## ورود به دانشکده ی پر ابهت برق و کامپیوتر

با اینکه خیلی خوشحال بودم به خاطر تغییر رشته، از جو دانشکده حالم به هم میخورد. جو اکثریت اینجوری بود که یه غرور به شدت کاذبی بود که خودشون و بالاتر از بقیه رشته ها میدونستن. هنوزم از اینکه یه سری از بچه های کامپیوتر رشتشون رو جزو هویتشون میدونن متنفرم. کلا یه سری انگار باید به هر نحوی نشون میدادن که برقی و کامپیوترین. در کل من این جمله رو خیلی از بچه ها میشنیدم که علی تو واقعا صنایع رفتی که چی بشه؟ ینی بش علاقه داشتی؟‌چرا برق نزدی؟‌ حالا من علاقه ای به این رشته نداشتم ولی نمیفهمیدم مشکلش چیه واقعا؟‌ برق و کامپیوتر صنعتی مگه چه تحفه ای هست حالا؟‌ بگذریم. درس برنامه نویسی پیشرفته رو برداشتم و خیلی خیلی خوشحال بودم که قراره یه برنامه نویس حرفه ای بشم.

## برنامه نویسی پیشرفته

همه چی خوب بود توی شروع درس ولی هر چی پیش میرفتیم کم کم داشت یه چیزایی مشخص میشد. برام سوال بود این حجم از جزییات بی مصرف و چرا میگن؟ اصن چرا یه زبان دیگه مث جاوا و پایتون رو شروع نمیکنن؟ کلا این صنعتی چه گیری داده که حتما همه رشته ها باید سی کار کنن؟ شریف پایتون و جاوا رو داشت که خیلی جذاب تر به نظر میومد. درس رفت جلو و هی سوالات و تمرینا الکی تر میشدن. یه سری تمرین غیر واقعی به درد نخور که فقط واسه اذیت کردن بود. تهشم میگفتن" نه اینا به دردتون میخوره و شما نمیفهمین و ... ما هم گفتیم باشه. امتحان میان شروع شد و بر خلاف عرف یه قسمت عملی داشت. سوال خیلی سخت و وقت گیر بود. واقعا جاش اینجا نبود. سوالای کتبی واقعا عجیب غریب و بیخود بودن و فقط و فقط به قصد ازار و اذیت دانشجو طراحی شده بودن. مبحث بعد میان هم که هی به درد نخور تر میشد و ختم شد به یه پایانترم بدتر از میان. نمره ی همه خیلی بد شد. ولی انگار صنعتی به هدف خودش رسیده بود و ابهت توخالی خودش رو حفظ کرده بود با این نمرات پایین. نوبت پروژه ی پایانی درس رسید که خیلی همه امیدوار بودیم یه چیز خوبی باشه که بلکه بتونیم چیز یادبگیریم و حال کنیم باش. ولی نتیجه این بود که یه سری موضوع فاجعه داده شد که ارزش یک ثانیه وقت گذشتن رو هم نداشت. در همین حین من با دوستای شریفیم حرف میزدم و حرص میخوردم که چقد پروژه ی اونا جالب تر و بهتر از ماعه. ولی چاره ای نبود دیگه باید همین پروژه ی بیمصرفو میزدیم. تهشم یه 15 بمون دادن و تموم. کم کم معدلم شروع کرد به پایین اومدن و از نزدیک 19 اومد رو 17.

## فاجعه ی طراحی سیستم های دیجیتال 1

درس دیجیتالو خیلی خوشم میومد ازش. چون کلا یه چیز جدید و جالب بود. همه چی درس خوب بود از تکلیفاش و کوییزاش تا اینکه رسیدیم به میان. تی ای درس قبل امتحان یه کلاس گذشت که توضیحات بده و گفت که من تضمین میکنم اگه تمرینا رو بلد باشین امتحانو کامل میشین. تمرین ها و کوییزای درسم خیلی راحت و گلابی بود چون اصن استاد خیلی سطح پایین درس میداد. رفتیم سر جلسه و من از 8 تا سوال فقط 3 تاشو اونم ناقص بلد بودم. بقیشو سفید دادم. امتحان واقعا باور کردنی نبود. هیچ ربطی به درس نداشت. همه ی کلاس گند زدن به جز اونایی که میرفتن سر کلاس دکتر کریمی. بعد های مشخص شد استاد سوالای امتحان دکتر کریمی رو دادن به ما که کلا رویکرد درسیش و سطحش خیلی متفاوت بود از استاد ما. امتحانو گند زدیم و اعصابم خیلی خورد بود چون معدلمو میخواستم وگرنه برم میگردوندن صنایع. استاد همون طور که انتظار میرفت اصلا قبول نمیکرد این امتحان وافعا غیر منصفانه بود و هی میگفت باید بیشتر میخوندین. کلا اساتید در هیچ زمینه ای زیر بار نمیرفتن. مشکل فقط دانشجو بود که مثلا میگفتن درس نمیخونین یا تنبلین یا ازین چرت و پرتا که زیاد بمون میگتفن. پایانترم به بدی میان نبود ولی اونم خیلی سخت بود. نهایتا یه حجم عظیمی از کلاس افتادن و منم با ۱۴ پاس کردم. بازم صنعتی به چیزی که میخواست رسیده بود و گند زده بود به معدل بچه ها. اصن انگار اساتید لذت میبردن از این کار.

## ریز پردازنده و آزش

دیگه مشخص بود صنعتی چه دانشگاهیه. همه چی همینطور بدتر میشد. درسا یکی از یکی بدتر. گل سر سبد همشون درس میکرو و ازمایشگاهش. فک نمیکنم بشه درسی رو بد تر از این اراعه داد. میکروکنترلر ای وی ار مال صد سال پیش اونم با زبون اسمبلی!! ینی ترکیب اشغال تر از این ممکن نیست. سرتاسر این درس چرت و بی مصرف بود. تموم مطالب میشد به روش خیلی خیلی عملی تر و مفید تر بشه ولی همه چی به بدترین شکل پیش میرفت. باز هم یه سری پروژه و تکلیف بی مصرف و به درد نخور. اخه چرا باید یه دانشجوی کامپیوتر بره یه برد و سیم کشیش رو از صفر طراحی کنه و با اسید برد چاپ کنه؟؟ واقعا به چه منطقی؟ بابا به خدا قرار نیس هیچ کودوم تا اخر عمرمون از خود میکرو استفاده کنیم چه برسه به چاپ برد با دست. نصف ترمم که باید با زبون اسمبلی سر و کله میزدیم که به خدا هیچ جای دنیا باش کار نمیکنن. همه ی این ها هم به این خاطر که ما دانشجوی صنعتیم و باید با بقیه فرق کنیم. توهمات مضحک در صنعتی. یکی نیس توی اون دانشگاه بگه چرا باید میکرو و ازش رو پاس کنیم؟ واقعا ازش کافی نیس؟ این درس چرت مگه اصن تئوری داره که انقد براش واحد گذشتین؟ از درس بدتر اون ازمایشگاه زمان بر بی مصرفش. هنوز که هنوزه یاد سوالاش میوفتم حالم به هم میخوره. بعد میری سر جلسه ی امتحان میبینی یه سری سوال از برق قدرت ور داشتن دادن!! آخه چراااااا؟؟؟ واقعا چی فک میکنین پیش خودتون؟ اول درسم میان یه جوری موتیویشن میدن که انگار میخان چه گلی به سرمون بزنن. لعنت به این درس و آزش واقعا

## سیگنال و پردازش سیگنال

سیگنال کلا کابوس اکثر بچه ها بود. یه درس که همه ازش متنفرن و واقعا هیچکس نمیدونه چرا باید توی چارت کامپیوتر باشه. بگذریم. این درس یه حجم وحشتناکی داره که اساتید هم اصرار دارن کل کتاب رو توی یه ترم درس بدن. نتیجش میشه تدریس افتضاح که هر جلسه استاد باید هول بزنه که درس و بده و بره جلو. برای استاد در صنعتی هییییچ اهمیتی نداره که شما فهمیدی یا نه یا خوب درس داده یا نه. فقط میخاد تخته سیاه کنه بره جلو که به سرفصلاش برسه. تهشم یه امتحان وحشتناک توی وقت محدود بگیره و بره که همه بیوفتن. کیفیت تدریس افتضاح، سرعت درس فوق العاده بالا تکلیف خیلی زیاد، امتحان خیلی سخت و یادگیری صفر. انگار هدف این درس صرفا اینه که ادمو از صنعتی متنفر تر از اون چیزی که هست بکنه. حالا من یه غلطی کردم بعد این درس پردازش سیگنالم ور داشتم و یه فاجعه ی دیگه رو هم دیدم. استاد یه سری جزوه از قبل نوشته و میاد توی ویدیو از روش میخونه. بابا درس پردازش سیگناله نیازه یکم شهود بده نه که بری کتاب اپنهایمو از اول با دست بنویسی بعد از روش بخونی. امتحان هام که فوق العاده سخت و غیر منطقی تو تایم کم. یه جوری که دانشجو رو بیشتر بچزونه. من یه سوال دارم واقعا از اساتید سیگنال: واقعا تا حالا به این فکر کردین که چرا تموم بچه ها میرن مکتب خونه ویدیو های دکتر مشهدی و دکتر بابایی رو میبنین؟ ینی همه این کارو میکنن. خب بابا این نشون میده شما افتضاح درس میدی خیلی سادست. یکم برو ویدیو های اونارو ببین ازشون یادبگیر بیا همونجوری درس بده. اصن چرا کلاس سیگنالو تو صنعتی تعطیل نکنیم؟ همه که ویدیو های شریفو میبینن که به مراتب بهتره دیگه چه احتیاجیه که شما اراعش کنین؟ یه سوال طرح کنین پایانترم فقط امتحانشو بگیرین از بچه های انقد منابعم حروم نکنین واسه این درس.

## سیستم های تعبیه شده

قبل هر چی این سوال مطرح میشه که واقعا چنتا درس سخت افزاری و برقی ما باید توی این دانشکده پاس کنیم؟ بابا رشته کامپیوتره میدونین چقد مبحث و درس بهتر هست که بدین؟ بگذریم. درس از لحاظ سرفصل واقعا یه فاجعه بود. یه سری مبحث که اصن معلوم نبود میخاد به کجا برسه. ینی از هر جا یه نوکی میزد. شما ببین فاجعه در این حد بود که حتی مارکوف چین رو توی درس ارائه میدادن و ربطش میدادن به امبدد سیستم. و بعدم مثل همه ی درس های مضخرف صنعتی یه سری پروژه ی به درد نخور که ظاهرا قراره مارو با صنعت آشنا کنه انجام میدیم. حالا ته تهش گروه ما همه کار کرد پروژه رو زدیم و همه چی کار کرد پایانترم رو هم خیلی خوب دادیم و شدیم 15 از 25!!! هیچوقت نفهمیدیم این حجم از نمره چجوری کم شده دیگه از یه جایی به بعد توی اون دانشگاه خراب شده حال و حوصله ی چونه زدن با اساتیدم نداشتم میگفتم به درک.

## هوش محاسباتی

اگر فرض کنیم شما استاد هستین و قراره یک درسی رو به اختیار خودتون اراعه کنین و سرفصل واسش طرح کنین، 100 درصد راحت ترین درس ممکن مباحث مرتبط با هوش مصنوعی و ماشین لرنینگ خواهد بود. ینی با این حجم گستردگی این رشته و منابع بی نهایتی که ازش توی اینترنت هست شما باید خیلی خیلی آدم خاصی باشی که این درسو بد اراعه بدی. صنعتی اصفهان در این زمینه یک فاجعه به بار آورد و واقعا گند زد. درس به بدترین شکل ممکن اراعه شد با مباحث پخش و بی سر و ته. ادم اصن باورش نمیشه که همچین درسیو بشه انقد بد ارائه کرد. بابا تنها کاری که لازم بود انجام بدین این بود که برین همین کورسو که توی بهترین دانشگاه های دنیا ارائه شده رو و تموم متریالش رو به شکل مجانی گذشتن روی سایتشون کپی کنی. فقققط کپی کنی. ینی همین کار رو هم نمیتونستین انجام بدین؟ اخه این چه سرفصل اشغالی بود که واسه این درس گذشتین؟ ینی نتیجه ی این همه جلسه که با هم گذشتین تا راجب این درس تصمیمم بگیرین شده این؟؟ پروژه های درسم که یکی از یکی آشغال تر و بی مصرف تر.

## گرایش جدید و مضحک سیستم های هوشمند

در طی یک اقدام بلند پروازانه، صنعتی اصفهان تصمیم میگیره که یه گرایش جدید به کامپیوتر اضافه کنه تا خودشو مثلااا به روز کنه. نتیجه چی میشه؟ طبق معمول فاجعه. یک گرایش بی سر و ته با کورس های بیخود به درد نخور. گرایش اصلا هیچ کاری به هوش مصنوعی نداره. صرفا یه مشت درس سخت افزاریو تحت عنوان هوش مصنوعی قالب میکنن به دانشجو. کلا این دانشکده نمیتونه از مباحث قدیمی و بی مصرف سخت افزاری دست بر داره. خیلی جالبه که ساعت ها هم سر ایجاد این گرایش جلسه گذشته شده و نتیجش نهایتا شده این. واقعا دلم میخاد بدونم خروجی این جلساتی که انقدر اساتید درگیرش بودن چی بود؟ اصلا خروجی ای وجود داشت؟

## طراحی کامپایلر

اول این نکته رو بگم که از این درس از هر درس دیگه ای بیشتر حالم به هم میخوره. ینی تاحالا سابقه نداشته از یه چیزیز انقدر بدم بیاد. کلا این درس جزو درساییه که واقعابرام سواله دلیل وجودش توی چارت درسی چیه؟‌ مثل هزار تا درس دیگه. وجود این درس به طور کامل بی مصرف و به درد نخوره. آدم اصلا تعجب میکنه. استاد جلسه ی اول درس واقعا میاد و یه سری موتیویشن میده که این درس چرا ممکنه به درد بخوره؟‌خیلی خنده داره. حالا چی هست این انگیزه ها؟‌ممکنه بعدا برین توی گوگل طراحی کامپایلر انجام بدین. ینی از هر یک میلیون مهندس کامپیوتر شاید یک نفر این مسیرو بره. ولی بلخره چهل ستون فناوریه و باید برای اون یک نفرم برنامه داشته باشه. انگیزه ی دیگه اینه که مثلا شما کد میزنی کدتو بهنیه تر میزنی چون کامپایلر بلدی. که خب شدیدا خنده داره. حالا بگذریم. درس چجوری اراعه شد؟‌طبق معمول به بد ترین شکل ممکن. مباحث کاملا شلخته و به مبهم ترین شکل ممکن گفته میشد. ینی اصن کلا هیچکس نمیفهمید دقیقا موضوع هر جلسه چیه. عتیقه ترین مباحث کامپیوتر به بدترین شکل اراعه میشه و دیگه خودتون ببینین چه ترکیبی میشه!‌ تکالیف زیاد و کاملا بی ربط به درس طبق معمول. یه سریش حتی به گوشمون هم نخورده بود. بد تر از همه اون پروژه ی وحشتناک وقت گیر به درد نخور. بابا به خدا نیاز نیست یه کامپایلر کامل بنویسیم اخه که چی؟‌به چه دردی میخوره؟‌به یه چیز عادی رضایت بدین دیگه ول کنین دانشجو رو. چند ده ساعت آخه باید روی یه پروژه بی مصرف وقت بذاریم آخه؟‌ هرچند نامردی نکنم و بگم استاد خوب نمره داد آخر ترم و من با دانش تقریبا صفر و بدون تقلب ۱۷ شدم.

## ساختمان های گسسته

اساسا گسسته رو من اصلا درس حساب نمیکنم. ولی کلا فقط یه چیز بگم. آخه ۵ نمره واسه ی حضور در کلاس؟ ۵ نمره؟؟؟ بابا مگه مدرسس؟ به خدا که مدرسه شرف داشت به صنعتی

## طراحی الگوریتم

خیلی خلاصه بگم راجب درس. شلخته و بی محتوی بی هدف و بی شهود. اسون ترین مساعل که توی ۱۰ دقیقه میشد اراعه بشه توی این درس یک ساعتو نیم به بدترین و سخت ترین شکل ممکن اراعه شد. کلا یادم نمیاد چیزی رو از خود استاد فهمیده باشیم. همش با بچه ها میرفتیم بعد کلاس تو یوتیوب اون مبحثو میدیدیم. یادمه اخر ترم چند جلسه استاد نبود و تی ای به جاش میومد و همه به شدت بیشتر استقبال میکردن از کلاس. تازه داشتیم یه چیزایی میفهمیدیم. و همه معتقد بودن ای کاش کل ترم تی ای میومد.

## رباتیک

رباتیک از درسای تازه ارعه شده بود که واسه گرایش سیستم های هوشمند گذشته بودن. کلا فلسفه ی درس مشخص نیست. درس کامل مکانیکه و سینماتیک. کوچکترین ربطی به هوش مصنوعی یا برنامه نویسی ربات نداشت. کیفیت اسلاید ها افتضاح و فرمول های ریاضی که توش بود فقط یه مشت اسکرین شات بود از جای دیگه با کمترین کیفیت. کلا صنعتی وقتی میخاد ایده بزنه و چیز جدیدی اراعه کنه گند میزنه. این فقط محدود به چیزای جدید نیس البته. تو چیزای قدیمی هم گند میزنه.

## آمار و احتمال مهندسی

علاقه ی من هوش مصنوعی و ماشین لرننیگ تعوری هست. و باید بگم که امار و احتمال بسیار بسیار بسیار مهم و حیاتیه برای این زمینه. پس استثناعا این درس واقعا واسم مهم بود برخلاف بقیه درسا که کلا هیچ اهمیتی واسم نداشتن. خب چه اتفاقی افتاد؟‌واقعا توقع دارین چه اتفاقی افتاده باشه؟‌فاجعه ی بعدی رقم خورد. درس دیگه بدتر از این نمیشد اراعه بشه. جلسه ی اول استاد طبق معمول با موتیویشن های خودش وارد شد و مثال معروف و مسخره ی بارون رو زد. اگه احتمال بلد باشی میتونی حساب کنی احتمال اینکه فردا به چتر احتیاج پیدا کنی چقدره؟‌انقد مسخرس که نمیخام راجبش حرف بزنم. استاد کلا تو فکر امتحان بود از اول. هی میگف این مهمه میاد تو امتحان. نمیدونم این پارسال اومده بود. اینو خوب بخونین و از این دست حرفا. ینی کلا استاد ذره ای احترام واسه درسی که خودش میداد نداشت. دریغ از یه ذره سواد و شهود امار احتمالی که به ما منتقل کنه. خب البته اینم انتظار زیادیه کار هر کسی نیس. فاجعه ی درس با قسمت آمار تکمیل شد. یه سری جدول و فرمول دادن بمون توش عدد بذاریم سوال و حل کنیم. به خدا کنکور و دبستان هم حتی انقد احمقانه و آشغال نبودن. حالا پایانترم چجوری بود؟‌بد ترین و سخت ترین سوالات ممکن که خیلی هارو انداخت. هر ترم مینداختن. اصلا خوششون میومد. انگار هدف درس این بود که صرفا یه سریو بندازن. تهشم همه تقصیرا میوفتاد گردن دانشجو ها که شما درس نمیخونین. کلا اهالی صنعتی هیچی رو گردن نمیگیرن چون خودشون بهترین ان و بقیه بد ترین. با اراعه ی این درس پایه ی هممون و نابود کردین. اصلا پایه ای وجود نداره. بازم زحتمش رو دوش خودمون افتاد . لعنت بهت صنعتی

## مسیر صنعتی

واقعا صنعتی توی یه زمینه خوبه خیلی اونم اینه که تو هر زمینه ای واقعا بده. مسیر صنعتی واقعا آشغال بود. چند صد ساعت از هر دانشجوی بیچاره تلف شد؟‌ چقد آخه بشینیم توی اون اتوبوسای لعنتیه همیشه پر؟‌مسیرم که فاجعه. دیگه مگه مسیر زشت تر از این میتونه باشه؟‌واقعا یکی از دلایلی که انقد این دانشگاه بده اینه که دور افتادس. وسط ناکجا اباده و بیابونی. کلا اساتید و سیستم دانشگاه هم همینطوره. ایزوله و بی خبر از همه جا. ولی در هر حال کاش این تنها مشکلش بود.

## محیط صنعتی

احتمالا عکسای صنعتی که دیدید در ۹۰ درصد مواقع به روزای بارونی مربوط بوده که چن روز بیشتر در سال نیست. به جز اون چی؟‌به طور خلاصه بگم:‌یه بیابون بی آب و علف و گرم که هیچی نداره ساختمون هاش یکی از یکی زشت تر و قدیمی ترن. یه مشت ساختمون بتونی پوسیده. در کل صنعتی ظاهرش کسافته و باطنش کسافت تر. بعد هی میان میگن بزرگترین دانشگاه کشور. خب چیکارت کنیم که بزرگی؟‌ هنره مگه یه تیکه زمین بزرگ بی آب و علف داشتن؟‌ کلا در محیط صنعتی راحتی و اسایش دانشجو هیچ راهی نداره. کلا امکانات خاصی ام وجود نداره. وسط دانشگاه یه تیکه زمین خاکی سنگیه که خیلیم عبور و مرور ازش هست ولی واسه ی دانشگاه کلا اهمیتی نداره که یه فکری به حالش بکنه. تهشم بهونشون اینه که بودجه ندارن. البته واسه حصار کشیدن دور خوابگاه دختران بودجه لازم و کافی را دارن. محیط داخل دانشکدم که دیگه نگم. من فک میکنم اگه کسی از روی قصد بخواد یه محیط زشت درست کنه نمیتونه. در و دیوار بتنی. سیستم سرمایش فاجعه و اکثرا خراب. هیچ جای خاصیم برای نشستن یا غذا خوردن دانشجو وجود نداره. حتی یه تریا نداشت دانشکده برق و کامپیوتر. همه چی به شکل اکستریم بد خلاصه. کلا این لوکیشن دور افتاده ی دانشگاه یکی از دلایل جو اشغالشه. یه سری ادم که از دنیای بیرون کامل قطع شدن و از همه جا بیخبرن. واقعا دانشجو های خوابگاهی چه زجر ها که نکشیدن تو اون خراب شده.

## مسعله ی تی ای شدن در صنعتی

من توی دوران تحصیلم واسه ی سه تا درس تی ای شدم که درسای برنامه نویسی و ساختمان داده و معماری کامپیوتر بودن. خب اوایلش که احمق بودم فک میکردم مثلا خیلی توی رزومه تاثیر داره واسه اپلای ولی بعدش دیدم اصلا نداره. پس تنها دلیلی که میموند این بود که ریکام اساتیدو بگیرم. من از قبلش با استاد حرف زدم و گفتم که ریکام میخام در قبال تی ای شدن و اونم قبول کرد. کلی وقت گذشتم و یک ترم تی ای بودم ولی وقتی موقع ریکام شد خانم دکتر پیاممو جواب نمیداد دیگه. حالا بگذریم از این. برای کارگاه کامپیوتر به ما گفتن که صد و پنجاه هزار تومن واسه ی کل ترم بمون میدن. حالا با احمقانه بودن این مبلغ هم کاری ندارم الان. کلی شماره حساب و اینام ازمون گرفتن ولی بعد چی شد؟ طبق معمول هیچی. قطعا این مبلغ واسه ی من هیچ اهمیتی نداره ولی به هر حال حقم بود که صنعتی خوردش و یه ابم روش. مهمه مگه واسشون اصن؟ واسه ی معماری و ساحتمان داده هم همین اتقاق افتاد و تهش هیچی بمون ندادن.  ؟‌

## حاصل ۵ سال تحصیلم چیشد؟

خلاصه بخام بگم هیچی. در کل این ۵ سال هیچی واسم نداشت. هیچ چیز به درد بخوری یاد نگرفتم. حتی همین چیزای چرت و هم خودم یادگرفتم اساتید که بم یاد ندادن. از لحاظ کانکشن و نتورک هم هیچی. ینی من هنوز که هنوزه واسم سواله که چرا یه جو خوب نداشتم توی رشتم؟‌چجوری ما یک بار حتی با هم رشته ایامون یه رستوران نرفتیم؟‌ اخه چطور ممکنه واقعا دوران دانشجویی یک انسان انقد داغون باشه؟‌ این بدترین تصمیم بود که میشد گرفت که خب متاسفانه من اون موقع این اطلاعات رو نداشتم و گند زدم واقعا. امیدوارم اگر کسی این متنو میبینه اشتباه منو نکنه. 

## سخن آخر

در آخر میخوام بگم که صنعتی اشتباه ترین تصمیم زندگی من بود. و خواهد بود. با تک تک سلول های بدنم و از سانت به سانت اون دانشگاه متنفرم. امیدورام هیچوقت به هیچ دلیلی مجبور نشم برگردم به اون خراب شده. شمایی که شاید کنکوری هستی و داری این متنو میخونی. تجربیات من مال کامپیوتره که مطمعنم خیلیش رو میشه تعمیم داد. ولی ازت خواهش میکنم اگه اعصابو روان و معدلت واست مهمه نیا کامپیوتر اینجا. با کله برو دانشگاه اصفهان. اینجا نه اسمی داره نه رسمی. اینجا هیچی نداره. یه غرور کاذبه که اساتید و کادر دارن. توی هیچ رنکینگی نیستن. خلاصه که وقتتو تلف نکن و برو هر جای دیگه به جز اینجا. اینجا اولویت چزوندن دانشجوعه. ازار روانی و متنفر کردن دانشجو نسبت به هر چی اینجا اولویت اینه که بیوفتی و مشروط بشی و هیچی یادنگیری. وای که چه وقتی از من و دوستام تلف شد اینجا. چه کار هایی که میشد با این وقت کرد و نشد. حیف. نیا خلاصه نیا. دیگه چجوری بگم؟
`},g=[c,d,l,m],f={1:"Easy",2:"Introductory",3:"Intermediate",4:"Advanced",5:"Research-level"},u=["#2a9d8f","#69a85d","#d4a72c","#df713f","#c3454f"],p=({level:t,className:n})=>{const a=f[t];return e.jsxs("div",{className:r("border-y border-border/80 py-3",n),"aria-label":`Difficulty: ${a}, ${t} out of 5`,title:`Difficulty: ${a} (${t}/5)`,children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-2 text-sm font-medium text-foreground",children:[e.jsx(h,{size:17,className:"shrink-0 text-muted-foreground","aria-hidden":"true"}),e.jsx("span",{children:"Technical difficulty"})]}),e.jsxs("div",{className:"flex shrink-0 items-baseline gap-2",children:[e.jsx("span",{className:"text-sm font-semibold text-foreground",children:a}),e.jsxs("span",{className:"text-xs tabular-nums text-muted-foreground",children:[t,"/5"]})]})]}),e.jsxs("div",{className:"mt-3","aria-hidden":"true",children:[e.jsx("div",{className:"relative grid h-2.5 grid-cols-5 gap-1",children:u.map((s,i)=>e.jsx("span",{className:"rounded-[2px] transition-all duration-300",style:{backgroundColor:s,opacity:i<t?1:.18,transform:i===t-1?"scaleY(1.45)":void 0,boxShadow:i===t-1?`0 0 0 2px hsl(var(--background)), 0 0 0 3px ${s}`:void 0}},s))}),e.jsxs("div",{className:"mt-2 flex justify-between text-[11px] text-muted-foreground",children:[e.jsx("span",{children:"Easy"}),e.jsx("span",{children:"Hard"})]})]})]})};export{p as B,g as b};
