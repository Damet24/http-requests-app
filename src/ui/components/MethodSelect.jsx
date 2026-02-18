import { CustomSelect } from "./CustomSelect";

const methodOptions = [
    { value: "GET", label: "GET", color: "text-green-400" },
    { value: "POST", label: "POST", color: "text-blue-400" },
    { value: "PUT", label: "PUT", color: "text-yellow-400" },
    { value: "DELETE", label: "DELETE", color: "text-red-400" }
];

export function MethodSelect({ value, onChange }) {
    return (
        <CustomSelect
            value={value}
            options={methodOptions}
            onChange={onChange}
            className="w-28"
        />
    );
}
