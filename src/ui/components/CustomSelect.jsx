import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

export function CustomSelect({
                                 value,
                                 options,
                                 onChange,
                                 className,
                                 placeholder = "Select item",
                                 label = "Select",
                             }) {
    return (
        <Select
            className="w-full"
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger className={`w-full max-w-48 ${className ?? ""}`}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>

                    {options.map(option => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}

                </SelectGroup>
            </SelectContent>
        </Select>
    );

}
