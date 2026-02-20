import {CustomSelect} from "./CustomSelect";
import {HttpMethods, MethodColors} from "../../domain/models/constants";

export function MethodSelect({value, onChange}) {

    const options = Object.entries(HttpMethods).map(([key, value]) => ({
        value,
        label: key,
        colorText: MethodColors[key]
    }))

    return (
        <CustomSelect
            value={value}
            options={options}
            onChange={onChange}
            className="w-28"
        />
    );
}
