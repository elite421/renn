import Image from "next/image";

type PageHeroProps = {
  kicker: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

export function PageHero({ kicker, title, text, image, alt }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="page-hero-image">
        <Image src={image} alt={alt} fill priority sizes="(max-width: 900px) 100vw, 42vw" />
      </div>
    </section>
  );
}
