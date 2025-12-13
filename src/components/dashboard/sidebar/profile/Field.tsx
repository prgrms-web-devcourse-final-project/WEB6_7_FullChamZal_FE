import Button from "@/components/common/Button";

type FieldProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  actionLabel?: string;
  onActionClick?: () => void;
  readOnly?: boolean;

  disabled?: boolean;
};

export function Field({
  icon,
  label,
  value,
  isEditing,
  onChange,
  actionLabel,
  onActionClick,
  readOnly,
  disabled,
}: FieldProps) {
  return (
    <div className="space-y-2 w-110">
      <div className="ml-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-sm">{label}</label>
        </div>
      </div>

      {readOnly || !isEditing ? (
        <div className="flex gap-2">
          <p className="flex-1 w-full py-3 px-4 border border-outline rounded-xl">
            {value}
          </p>
          {actionLabel && (
            <Button
              type="button"
              onClick={onActionClick}
              className="md:font-normal w-15 md:w-19"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      ) : (
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full py-3 px-4 border border-outline rounded-xl outline-none
               focus:ring-2 focus:ring-primary-3 disabled:bg-gray-100 disabled:text-text-3"
        />
      )}
    </div>
  );
}
