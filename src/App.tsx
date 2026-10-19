import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PdfViewer from "./pages/PdfViewer";

const CV = lazy(() => import("./pages/CV"));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Index />} />
      <Route path="/blog/tag/:tag" element={<Index />} />
      <Route path="/blog/:slug" element={<Index />} />
      <Route path="/publications" element={<Index />} />
      <Route path="/presentations" element={<Index />} />
      <Route path="/cv" element={
        <Suspense fallback={<p role="status" className="p-6">Loading CV...</p>}>
          <CV />
        </Suspense>
      } />
      <Route path="/view/pdf" element={<PdfViewer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
