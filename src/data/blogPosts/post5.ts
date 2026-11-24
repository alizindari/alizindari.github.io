import type { BlogPost } from './types';

export const post5: BlogPost = {
  id: 5,
  slug: 'self-attention-one-matrix-at-a-time',
  title: 'Self-Attention from Scratch',
  author: 'Ali Zindari',
  date: '2026-11-16',
  excerpt: 'Building self-attention from two matrix multiplications.',
  image: '/blog/self-attention/cover.png',
  math: '',
  tags: ['self-attention', 'transformers', 'deep learning', 'linear algebra'],
  difficulty: 1,
  theme: 'attention-slides',
  feedbackIntro: "Questions, corrections, or a different way of thinking about this? Feel free to",
  figures: {
    transformer: {
      src: '/blog/self-attention/transformer.svg',
      alt: 'Capital, of, Iran, and is become rows of X and pass through repeated Transformer blocks. A zoomed pre-norm block contains attention and an MLP, each with a residual connection.',
      caption: '',
      width: 1176, height: 490,
    },
    tokens: {
      src: '/blog/self-attention/token-vectors.svg',
      alt: 'Matrix X has four rows: x_1 transpose for Capital, x_2 transpose for of, x_3 transpose for Iran, and x_4 transpose for is.',
      caption: 'One row per token, one column per feature.',
      width: 510, height: 440, maxWidth: 500,
    },
    right: {
      src: '/blog/self-attention/right-multiplication.svg',
      alt: 'Right multiplication Z equals X W applies the same W to each row x_i transpose independently. No rows are combined.',
      caption: 'Right multiplication transforms features within each token.',
      width: 1055, height: 445,
    },
    left: {
      src: '/blog/self-attention/left-multiplication.svg',
      alt: 'Left multiplication Z equals A X replaces row i with a weighted sum of input rows, using row i of A as the weights.',
      caption: 'Left multiplication combines information across tokens.',
      width: 1106, height: 470,
    },
    fixed: {
      src: '/blog/self-attention/fixed-weights.svg',
      alt: 'The prompts Capital of Iran is and Iran\'s capital city is use the same fourth row of a fixed matrix A. The illustrative weight a_43 equals 0.8 points to Iran in the first prompt but city in the second.',
      caption: 'A fixed routing pattern follows positions, even when the relevant word moves.',
      width: 1144, height: 462,
    },
    roles: {
      src: '/blog/self-attention/queries-and-keys.svg',
      alt: 'The query q_4 at is searches keys k_1, k_2, and k_3 at Capital, of, and Iran. Every position also has its own query, key, and value; the drawing focuses on one query.',
      caption: 'The same token plays different roles when it searches and when it is searched.',
      width: 940, height: 216,
    },
    readout: {
      src: '/blog/self-attention/next-token.svg',
      alt: 'Select h_4 from the final matrix H, multiply by the vocabulary matrix W_out, and apply softmax. Tehran is an illustrative next-token completion, not a measured model prediction.',
      caption: 'After the Transformer stack, the last row is used to predict the next token.',
      width: 1144, height: 412,
    },
  },
  references: [
    { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
    { title: 'Introduction to Modern AI (Zico Kolter)', url: 'https://modernaicourse.org/' },
  ],
  content: String.raw`Self-attention is a central part of LLMs. There are all sorts of fancy variants now, but it's still useful to know the basic version. There are many ways to learn it but the explanation I liked best is in [Prof. Zico Kolter's Introduction to Modern AI course](https://modernaicourse.org/).

Here's the idea: given an embedding matrix $\mathbf{X}$ of $T$ tokens, self-attention is just a left and right multiplication of this matrix by two other matrices. 

## Start with the tokens

Take the prompt "Capital of Iran is". A possible next word is "Tehran". I'll treat each word as one token to keep the pictures simple but an actual tokenizer might split things differently. Look at the following picture for an overview of the a very simple LLM. 

[[figure:transformer]]

The matrix $\mathbf{X}$ goes through several transformer blocks. Each block is basically self-attention followed by a simple MLP plus some normalization which is not the topic of this post. Now we focus on self-attention block. 

First put the token vectors into the rows of a matrix $\mathbf X\in\mathbb R^{T\times d}$. Here $T$ is the number of tokens and $d$ is the number of features in each vector. In our example, $T=4$.

[[figure:tokens]]

I'll write $\mathbf x_i\in\mathbb R^d$ as a column vector, so row $i$ of $\mathbf X$ is $\mathbf x_i^\top$. Position information matters too, but isn't drawn in these figures. At a deeper layer, each row can already contain information gathered from earlier tokens.

## Multiply from the right: change the features

Suppose we multiply $\mathbf X$ by a learned matrix $\mathbf W\in\mathbb R^{d\times d}$:

$$
\mathbf Z=\mathbf X{\color{#842B40}\mathbf W}.
$$

[[figure:right]]

Row $i$ of the result is $\mathbf z_i^\top=\mathbf x_i^\top\mathbf W$. The same transformation is applied to every row, independently. It can combine and change features inside each token vector, but this operation alone doesn't move information between tokens.

That's the first piece: changing what each token has to say.

## Multiply from the left: mix the tokens

Now put a matrix $\mathbf A\in\mathbb R^{T\times T}$ on the other side:

$$
\mathbf Z={\color{#842B40}\mathbf A}\mathbf X,
\qquad
\mathbf z_i^\top=\sum_{j=1}^{T}{\color{#842B40}a_{ij}}\mathbf x_j^\top.
$$

[[figure:left]]

This time, row $i$ is a weighted sum of the input rows. The number $a_{ij}$ says how much token $j$ contributes to the output at position $i$. So row $i$ of $\mathbf A$ contains the mixing weights for that position. We haven't yet said where those weights come from, or required them to be probabilities.

Combine the two operations and we get $\mathbf Z=\mathbf A\mathbf X\mathbf W$: transform the features and mix information across tokens. That is the basic shape of an attention head. The important part still missing is how we choose $\mathbf A$.

## Why shouldn't the mixing weights stay fixed?

Imagine that the last position always puts a large weight on position 3. That might be useful for "Capital of Iran is", where position 3 contains "Iran". Now change the prompt to "Iran's capital city is". The country has moved, but the large weight hasn't.

[[figure:fixed]]

The value $a_{43}=0.8$ in the picture is just an example. Both prompts use exactly the same row of $\mathbf A$, so the same strong connection now points to "city". The arrows show where position 4 looks for information. Basically it gets info from all other past tokens but what matter is how strong from each past token. It also receives information from itself but it isn't shown in the picture. 

Now let's make a more flexible choice: let the mixing weights depend on the input.

$$
\mathbf Z={\color{#842B40}\mathbf A(\mathbf X)}\,\mathbf X\mathbf W.
$$

Training learns a rule for producing the weights. At ordinary inference time, the rule's parameters stay fixed, but the matrix it produces changes with the prompt.

## Queries, keys, and values

Let's first give a name to the transformed vectors we're going to mix. Rename the earlier $\mathbf W$ as $\mathbf W_V$ and define the values:

$$
{\color{#2C6292}\mathbf V}=\mathbf X\mathbf W_V,
\qquad
{\color{#2C6292}\mathbf v_j^\top}=\mathbf x_j^\top\mathbf W_V.
$$

Then the output at position 4 is simply

$$
\mathbf z_4^\top=\sum_{j=1}^{4}{\color{#842B40}a_{4j}}{\color{#2C6292}\mathbf v_j^\top}.
$$

The values are the information being combined. We still need to decide how much of each one to use. For that, a token gets two more representations: a query for searching, and a key for being searched.

[[figure:roles]]

A useful way to think about a query is "What information does this position need?" A key describes a token for matching against that query. Every token has a query, a key, and a value, even though the picture focuses on just one query.

We get these representations through two more learned transformations:

$$
\mathbf q_i^\top=\mathbf x_i^\top{\color{#842B40}\mathbf W_Q},
\qquad
\mathbf k_j^\top=\mathbf x_j^\top{\color{#2C6292}\mathbf W_K}.
$$

Why use separate matrices? Searching and being searched are different roles. Separate projections let the model learn different combinations of features for each. Comparing a query with a key gives

$$
\mathbf q_i^\top\mathbf k_j
=\mathbf x_i^\top{\color{#842B40}\mathbf W_Q}{\color{#2C6292}\mathbf W_K^\top}\mathbf x_j.
$$

So this is a learned comparison, not just the dot product between the original token vectors. The key helps determine the weight; the value supplies what gets mixed. 

## Turn the matches into weights

A dot product gives us a score, which can be positive or negative. For the last position of our four-token prompt, scaled dot-product attention turns those scores into weights using softmax:

$$
{\color{#842B40}a_{4j}}
=\frac{\exp(\mathbf q_4^\top\mathbf k_j/\sqrt{d_k})}
{\sum_{r=1}^{4}\exp(\mathbf q_4^\top\mathbf k_r/\sqrt{d_k})}.
$$

Here $d_k$ is the dimension of the queries and keys. For this query, a larger score gets a larger weight. The weights are nonnegative and sum to one, so the output is a weighted average of the value vectors. That doesn't mean the model has found something useful automatically and the projections have to be learned.

The factor $1/\sqrt{d_k}$ controls the score scale. For example, if query and key coordinates were independent, zero-mean, and unit-variance, their dot product would have variance $d_k$. Dividing by $\sqrt{d_k}$ brings that variance back to one. 

## Put all the positions together

Stack the queries, keys, and values into matrices:

$$
\mathbf Q=\mathbf X\mathbf W_Q,\qquad
\mathbf K=\mathbf X\mathbf W_K,\qquad
\mathbf V=\mathbf X\mathbf W_V.
$$

The matrix $\mathbf Q\mathbf K^\top$ contains every query-key score. Applying softmax separately to each row gives the mixing matrix. For unrestricted single-head attention, the whole calculation is

$$
\mathbf Z=
\underbrace{\operatorname{softmax}_{\mathrm{row}}\!\left(
\frac{\mathbf Q\mathbf K^\top}{\sqrt{d_k}}
\right)}_{{\color{#842B40}\mathbf A(\mathbf X)}}
\underbrace{\mathbf X\mathbf W_V}_{{\color{#2C6292}\mathbf V}}.
$$

It's called self-attention because the queries, keys, and values all come from the same sequence. The multiplication picture is useful, but this isn't a fixed linear map of $\mathbf X$: the weights themselves depend on $\mathbf X$.

For the dimensions, $\mathbf W_Q,\mathbf W_K\in\mathbb R^{d\times d_k}$ and $\mathbf W_V\in\mathbb R^{d\times d_v}$. Thus $\mathbf Q,\mathbf K\in\mathbb R^{T\times d_k}$, $\mathbf V\in\mathbb R^{T\times d_v}$, $\mathbf A\in\mathbb R^{T\times T}$, and $\mathbf Z\in\mathbb R^{T\times d_v}$. The earlier square $\mathbf W$ was the special case $d_v=d$.

### One detail for a language model: no looking ahead

In a causal decoder, position $i$ can use only positions $j\leq i$. We enforce that with a mask before softmax:

$$
M_{ij}=\begin{cases}0,&j\leq i,\\-\infty,&j>i,\end{cases}
\qquad
\mathbf A(\mathbf X)=\operatorname{softmax}_{\mathrm{row}}\!\left(
\frac{\mathbf Q\mathbf K^\top}{\sqrt{d_k}}+\mathbf M\right).
$$

The masked entries receive zero weight. In our example, position 4 is the final position, so all four tokens are available to it; its earlier softmax formula already has the correct causal range. Earlier positions have fewer available keys. 

## And how do we get the next word?

The attention output $\mathbf Z$ is still a collection of vectors, not a distribution over words. It goes through the rest of the block and the remaining Transformer layers. After the stack and final normalization, call the resulting matrix $\mathbf H$.

[[figure:readout]]

To predict the next token, use the last row, written as the column vector $\mathbf h_4$, and apply a vocabulary projection followed by softmax. This gives one probability per vocabulary token. Again remember that after all layers and mixups, the token "is" is the only one allowed to look back and see the whole prompt so it receives information from all the tokens in the context. That's why we take this last vector for the final prediction. 

This blog simplified lots of stuffs and nowadays there are more modern versions with other ingredients but this is the core of how attention works. Hope you liked it :)
`,
};
