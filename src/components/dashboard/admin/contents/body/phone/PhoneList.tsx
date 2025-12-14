export default function PhoneList({
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
