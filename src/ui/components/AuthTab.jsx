import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "./ui";
import {AuthFormRenderer} from "./AuthFormRenderer";
import {AuthConfigType} from "../../domain/models/constants";
import {capitalizeFirstLetter} from "../../lib/utils";

export function AuthTab({ inherit, auth, onChangeType, onChangeConfig }) {
    return (
        <>
            <Select
                value={auth?.type || "none"}
                onValueChange={onChangeType}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {Object.entries(AuthConfigType).map(([key, value]) => {
                        if (!inherit && value === AuthConfigType.INHERIT) return null;
                        return <SelectItem value={value}>{capitalizeFirstLetter(value)}</SelectItem>;
                    })}
                </SelectContent>
            </Select>

            <div className="py-2">
                <AuthFormRenderer
                    auth={auth}
                    onChangeConfig={onChangeConfig}
                />
            </div>
        </>
    );
}