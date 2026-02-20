import {Field, FieldLabel, InputGroup, InputGroupInput} from "./ui";
import {useWorkspaceStore} from "../../store/workspaceStore";


export function BearerAuthForm({ auth, onChangeConfig }) {
    const config = auth?.config || {};

    return (
        <div className="flex flex-col gap-3 mt-4 px-2">
            <Field>
                <FieldLabel>Token</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        type="text"
                        placeholder="Token"
                        value={config.token || ""}
                        onChange={(e) =>
                            onChangeConfig({ token: e.target.value })
                        }
                    />
                </InputGroup>
            </Field>
        </div>
    );
}