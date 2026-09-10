import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function LocaleNotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="max-w-xl text-center">
        <Compass className="mx-auto size-12 text-primary-600" aria-hidden />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          The page you are looking for may have been moved or no longer exists. Try one of the
          links below, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">
            Back to Homepage
          </Button>
          <Button href="/products" variant="outline">
            View Products
          </Button>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
