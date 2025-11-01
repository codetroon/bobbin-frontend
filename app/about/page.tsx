import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">About bobbin</h1>

        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Welcome to Bobbin — your trusted destination for premium men&apos;s
            fashion in Bangladesh. We believe clothing is more than just fabric
            — it&apos;s confidence, comfort, and craftsmanship combined. Since
            2019, Bobbin has been creating a complete range of menswear designed
            for modern lifestyles — from Polos and T-Shirts to Shirts, Hoodies,
            Jackets, Denims, Twill Pants, Punjabis, and Trousers. Every product
            is carefully developed in our own production setup — from cutting to
            stitching — ensuring long-lasting quality and comfort you can feel.
            Our fabric selection includes a variety of cotton, pique, twill,
            denim, fleece, and blended materials, crafted to suit
            Bangladesh&apos;s weather and everyday wear. Whether it&apos;s a
            weekend casual look, an office day, or a festive occasion, Bobbin
            brings you versatile essentials for every moment.
          </p>

          <h2 className="pt-6 text-2xl font-semibold text-foreground">
            Our Commitment
          </h2>

          <ul className="space-y-3 pl-6">
            <li className="list-disc">
              <strong className="text-foreground">Premium Quality:</strong> We
              choose only the finest fabrics and trims for unmatched comfort and
              durability.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Craftsmanship:</strong> Every
              piece is made by skilled hands in our own line under strict
              quality control.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Modern Versatility:</strong>{" "}
              From classic polos to denim jackets, our designs balance function
              with fashion.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Customer Focus:</strong> We
              listen, adapt, and continuously refine — because your satisfaction
              defines our success.
            </li>
          </ul>

          <h2 className="pt-6 text-2xl font-semibold text-foreground">
            Why Choose bobbin?
          </h2>

          <p className="leading-relaxed">
            Because we make clothes that look good, feel better, and last
            longer. At Bobbin, you don&apos;t just wear fashion — you wear
            confidence.
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
