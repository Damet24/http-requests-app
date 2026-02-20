import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui"

export function CustomSelect({
                                 value,
                                 options,
                                 onChange,
                                 className,
                                 placeholder = "Select item",
                                 label = "Select",
                             }) {

    const selectedOption = options.find(o => o.value === value);

    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger
                className={`
                    ${className ?? ""}
                    ${selectedOption?.colorText ?? ""}
                `}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>

                    {options.map(option => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className={option.colorText ?? ""}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
