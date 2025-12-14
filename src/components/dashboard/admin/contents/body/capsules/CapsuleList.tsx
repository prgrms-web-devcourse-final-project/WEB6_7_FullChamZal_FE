export default function CapsuleList({
  tab,
  query,
}: {
  tab: string;
  query: string;
}) {
  return (
    <>
      <h1>
        {tab} {query}
      </h1>
    </>
  );
}
