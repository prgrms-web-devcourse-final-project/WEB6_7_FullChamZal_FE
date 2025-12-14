export default function AdminHeader({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-medium">
          {title}
          <span className="text-admin px-1">_</span>
        </h2>
        <p className="text-text-3">{content}</p>
      </div>
    </>
  );
}
