import WriteForm from "./WriteForm";

type PreviewState = {
  title: string;
  senderName: string;
  receiverName: string;
  content: string;
};

export default function Left({
  preview,
  onPreviewChange,
}: {
  preview: PreviewState;
  onPreviewChange: (next: PreviewState) => void;
}) {
  return (
    <>
      <section className="p-8">
        <WriteForm preview={preview} onPreviewChange={onPreviewChange} />
      </section>
    </>
  );
}
