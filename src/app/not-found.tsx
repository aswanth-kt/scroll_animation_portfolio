import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-svh flex-col items-start justify-center gap-8">
      <p className="eyebrow">
        <span className="text-accent">Error 404</span> · Off the line
      </p>
      <h1 className="text-[clamp(3rem,10vw,9rem)] leading-[0.9] font-medium tracking-[-0.06em]">
        This track <em className="serif text-accent">doesn&apos;t exist.</em>
      </h1>
      <Link href="/" className="btn btn-accent">
        Back to the station
      </Link>
    </main>
  );
}
