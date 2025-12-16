export default function WriteInput({
  id,
  type,
  placeholder,
  value,
  readOnly = false,
}: {
  id: string;
  type: string;
  placeholder: string;
  value?: string;
  readOnly?: boolean;
}) {
  return (
    <>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        className="py-2.5 px-3 bg-sub-2 rounded-lg w-full outline-none border border-white focus:border focus:border-primary-2"
      />
    </>
  );
}
