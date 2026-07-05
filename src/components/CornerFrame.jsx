export default function CornerFrame({ children, className = "", as: Tag = "div" }) {
  return (
    <Tag className={`corner-frame relative border border-line/40 bg-ink/40 p-6 shadow-blueprint ${className}`}>
      {children}
    </Tag>
  );
}
