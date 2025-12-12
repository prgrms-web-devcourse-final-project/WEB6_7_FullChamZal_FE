import WriteForm from "./WriteForm";
export default function Left() {
  /*  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      visibility, // 여기로 전달됨
    };

    console.log(payload);
  }; */

  return (
    <>
      <section className="p-8">
        <WriteForm />
      </section>
    </>
  );
}
