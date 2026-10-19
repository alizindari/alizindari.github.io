import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minus, Plus } from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { EventBus, LinkTarget, PDFLinkService, PDFViewer } from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import 'pdfjs-dist/web/pdf_viewer.css';
import cv from '@/files/homepage/CV.pdf';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './CV.css';

GlobalWorkerOptions.workerSrc = workerUrl;

const ToolButton = ({ label, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" className="cv-tool" aria-label={label} {...props}>
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

const CV = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PDFViewer | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Curriculum Vitae | Ali Zindari';
    const controller = new AbortController();
    const eventBus = new EventBus();
    const linkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: LinkTarget.BLANK,
      externalLinkRel: 'noopener noreferrer',
    });
    const options = {
      container: containerRef.current!,
      viewer: pagesRef.current!,
      eventBus,
      linkService,
      removePageBorders: true,
      abortSignal: controller.signal,
    };
    const viewer = new PDFViewer(options);
    viewerRef.current = viewer;
    linkService.setViewer(viewer);

    eventBus.on('pagesinit', () => {
      viewer.currentScaleValue = 'auto';
      setPageCount(viewer.pagesCount);
    });
    eventBus.on('pagerendered', ({ error }: { error?: Error }) => {
      if (!controller.signal.aborted) setStatus(error ? 'error' : 'ready');
    });
    eventBus.on('pagechanging', ({ pageNumber }: { pageNumber: number }) => {
      setPage(pageNumber);
      setPageInput(String(pageNumber));
    });
    eventBus.on('scalechanging', ({ scale: value }: { scale: number }) => setScale(value));

    // Use the PDF's own annotation layer, with every external link in a new tab.
    const task = getDocument({ url: cv });
    task.promise.then(document => {
      if (controller.signal.aborted) return;
      linkService.setDocument(document);
      viewer.setDocument(document);
    }).catch(error => {
      if (!controller.signal.aborted) {
        console.error('Unable to load CV:', error);
        setStatus('error');
      }
    });

    const resize = new ResizeObserver(() => {
      const preset = viewer.currentScaleValue;
      if (viewer.pdfDocument && ['auto', 'page-width', 'page-fit'].includes(preset)) {
        viewer.currentScaleValue = preset;
      }
      viewer.update();
    });
    resize.observe(containerRef.current!);

    return () => {
      document.title = previousTitle;
      resize.disconnect();
      controller.abort();
      viewer.setDocument(null);
      linkService.setDocument(null);
      viewerRef.current = null;
      void task.destroy();
    };
  }, []);

  const goToPage = (value: number) => {
    if (!viewerRef.current || !pageCount) return;
    const number = Number.isFinite(value) ? Math.max(1, Math.min(pageCount, Math.trunc(value))) : page;
    viewerRef.current.currentPageNumber = number;
    setPageInput(String(number));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <main className="cv-document">
        <header className="cv-toolbar">
          <h1>Ali Zindari <span>/ CV</span></h1>
          <div className="cv-controls">
            <div className="cv-control-group" aria-label="Page navigation">
              <ToolButton label="Previous page" disabled={page <= 1 || !pageCount} onClick={() => goToPage(page - 1)}>
                <ChevronLeft size={19} />
              </ToolButton>
              <form onSubmit={event => { event.preventDefault(); goToPage(Number(pageInput)); }}>
                <input aria-label="Page number" inputMode="numeric" pattern="[0-9]*" value={pageInput}
                  disabled={!pageCount} onChange={event => setPageInput(event.target.value)}
                  onBlur={() => goToPage(Number(pageInput))} />
              </form>
              <span className="cv-page-count">/ {pageCount || '-'}</span>
              <ToolButton label="Next page" disabled={!pageCount || page >= pageCount} onClick={() => goToPage(page + 1)}>
                <ChevronRight size={19} />
              </ToolButton>
            </div>
            <div className="cv-control-group" aria-label="Zoom controls">
              <ToolButton label="Zoom out" disabled={!pageCount || scale <= 0.25} onClick={() => {
                if (viewerRef.current) viewerRef.current.currentScale = Math.max(0.25, scale / 1.2);
              }}><Minus size={18} /></ToolButton>
              <output className="cv-zoom" aria-label="Zoom level">{Math.round(scale * 100)}%</output>
              <ToolButton label="Zoom in" disabled={!pageCount || scale >= 4} onClick={() => {
                if (viewerRef.current) viewerRef.current.currentScale = Math.min(4, scale * 1.2);
              }}><Plus size={18} /></ToolButton>
              <ToolButton label="Fit to width" disabled={!pageCount} onClick={() => {
                if (viewerRef.current) viewerRef.current.currentScaleValue = 'page-width';
              }}><Maximize2 size={17} /></ToolButton>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href={cv} download="Ali_Zindari_CV.pdf" target="_blank" rel="noopener noreferrer"
                className="cv-tool cv-download" aria-label="Download CV">
                <Download size={19} />
              </a>
            </TooltipTrigger>
            <TooltipContent>Download CV</TooltipContent>
          </Tooltip>
        </header>
        <div className="cv-pages-region">
          <div ref={containerRef} className="cv-scroll" tabIndex={0} role="region" aria-label="CV pages" aria-busy={status === 'loading'}>
            <div ref={pagesRef} className="pdfViewer" />
          </div>
          {status !== 'ready' && (
            <div className="cv-status" role={status === 'error' ? 'alert' : 'status'}>
              {status === 'error' ? (
                <p>Unable to display the CV. <a href={cv} target="_blank" rel="noopener noreferrer">Open PDF</a></p>
              ) : <p>Loading CV...</p>}
            </div>
          )}
        </div>
      </main>
    </TooltipProvider>
  );
};

export default CV;
