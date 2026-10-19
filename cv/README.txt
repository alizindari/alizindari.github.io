Edit main.tex for CV content. resume.cls controls the layout.
Publication entries use \publication{title}{authors}{venue/year}{URL}.
All publications are grouped on the first page. Footers show only a centered
page number; there are no headers.

Requirements: a LaTeX installation with pdflatex, latexmk, fontawesome5,
tabularx, and needspace (available in TeX Live / MacTeX), plus make.

From the repository root:
  make -C cv          Compile cv/CV.pdf; temporary files stay in cv/build/.
  make -C cv publish  Compile and copy the result to the website's CV asset.

The source started as an exact reproduction of the website's original CV.
It is now maintained here, including updated education and publications.
The files in the phd-qe project and Downloads are separate copies.

Compiling alone does not change or deploy the website. The publish target
only updates the local PDF asset; it does not push or deploy anything.
