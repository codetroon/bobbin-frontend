import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">About bobbin</h1>

        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Welcome to bobbin, your destination for premium fashion essentials
            crafted for the modern gentleman. We believe that quality clothing
            should be both accessible and exceptional.
          </p>

          <p className="leading-relaxed">
            Founded with a passion for timeless style and superior
            craftsmanship, bobbin curates a carefully selected collection of
            men&apos;s wear that combines comfort, durability, and contemporary
            design. From everyday essentials like our premium t-shirts and
            joggers to special occasion pieces like our elegant punjabis, every
            item in our collection is chosen with care.
          </p>

          <h2 className="pt-6 text-2xl font-semibold text-foreground">
            Our Commitment
          </h2>

          <ul className="space-y-3 pl-6">
            <li className="list-disc">
              <strong className="text-foreground">Premium Quality:</strong> We
              source only the finest fabrics and materials to ensure lasting
              comfort and durability.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Modern Design:</strong> Our
              pieces blend traditional craftsmanship with contemporary
              aesthetics.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">
                Customer Satisfaction:
              </strong>{" "}
              Your experience matters to us, from browsing to delivery and
              beyond.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">
                Sustainable Practices:
              </strong>{" "}
              We&apos;re committed to responsible sourcing and production.
            </li>
          </ul>

          <h2 className="pt-6 text-2xl font-semibold text-foreground">
            Why Choose bobbin?
          </h2>

          <p className="leading-relaxed">
            At bobbin, we understand that clothing is more than just
            fabric—it&apos;s an expression of who you are. That&apos;s why
            we&apos;ve made it our mission to provide pieces that not only look
            good but feel incredible to wear. Our collection is designed to take
            you from casual weekends to special celebrations with confidence and
            style.
          </p>

          <div className="pt-8">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
