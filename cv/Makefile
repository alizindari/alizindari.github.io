# Compile from the repository root with: make -C cv
# Copy an edited CV to the website only when ready: make -C cv publish

.PHONY: all publish

all: CV.pdf

CV.pdf: main.tex resume.cls
	latexmk -pdf -interaction=nonstopmode -halt-on-error -file-line-error -outdir=build -jobname=CV main.tex
	cp build/CV.pdf CV.pdf

publish: CV.pdf
	cp CV.pdf ../src/files/homepage/CV.pdf
