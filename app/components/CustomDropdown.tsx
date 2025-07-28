import { Icon } from "@shopify/polaris";
import { CalendarIcon, ChevronDownIcon } from "@shopify/polaris-icons";

export const CustomSelect = ({
  selected,
  onChange,
  options,
}: {
  selected: string;
  onChange: (value: string) => void;
  options: string[];
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "6px 12px",
        gap: "8px",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      <Icon source={CalendarIcon} tone="base" />
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "14px",
          paddingRight: "16px",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <Icon source={ChevronDownIcon} tone="base" />
    </div>
  );
};
