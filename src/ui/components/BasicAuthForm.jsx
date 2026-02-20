import {Field, FieldLabel, InputGroup, InputGroupAddon, InputGroupInput} from "./ui";
import {EyeOffIcon, Eye} from "lucide-react";
import {useWorkspaceStore} from "../../store/workspaceStore";
import {useState} from "react";

export function BasicAuthForm({ auth, onChangeConfig }) {
    const config = auth?.config || {};
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-3 mt-4 px-2">
            <Field>
                <FieldLabel>Username</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={config.username || ""}
                        onChange={(e) =>
                            onChangeConfig({ username: e.target.value })
                        }
                    />
                </InputGroup>
            </Field>

            <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        type={showPassword ? "text" : "password"}
                        value={config.password || ""}
                        onChange={(e) =>
                            onChangeConfig({ password: e.target.value })
                        }
                    />
                    <InputGroupAddon
                        className="cursor-pointer"
                        onClick={() => setShowPassword(p => !p)}
                    >
                        {showPassword ? <Eye/> : <EyeOffIcon/>}
                    </InputGroupAddon>
                </InputGroup>
            </Field>
        </div>
    );
}