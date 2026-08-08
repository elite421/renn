import Image from "next/image";
import { ProductItem } from "../lib/contentStore";

export function ProductCard({ product }: { product: ProductItem }) {
  return (
    <article className="product-card" id={product.slug}>
      <div className="product-card-image">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 760px) 100vw, 30vw" />
      </div>
      <div className="product-card-copy">
        <span>{product.eyebrow}</span>
        <h2>{product.title}</h2>
        <p>{product.text}</p>
        <div className="tag-list">
          {product.highlights.map((highlight, idx) => (
            <b key={idx}>{highlight}</b>
          ))}
        </div>
      </div>
    </article>
  );
}
