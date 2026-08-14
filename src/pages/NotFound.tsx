import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageMetadata from "@/components/PageMetadata";

const NotFound = () => {
  return (
    <main className="times-page flex min-h-screen items-center justify-center bg-background px-4">
      <PageMetadata
        title="Page not found | Ali Zindari"
        description="The requested page could not be found."
        noIndex
      />
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Page not found</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Return home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
