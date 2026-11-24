import type { BlogFigure as BlogFigureData } from '../data/blogPosts/types';

const BlogFigure = ({ figure }: { figure: BlogFigureData }) => (
  <figure className="blog-figure" style={{ maxWidth: figure.maxWidth }}>
    <a href={figure.src} target="_blank" rel="noopener noreferrer" title="Open full-size figure">
      <img
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading="lazy"
        decoding="async"
      />
    </a>
    <figcaption>{figure.caption}</figcaption>
  </figure>
);

export default BlogFigure;
