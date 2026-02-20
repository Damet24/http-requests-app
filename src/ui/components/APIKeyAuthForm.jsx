import {
    Field,
    FieldLabel,
    InputGroup,
    InputGroupInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui";

export function APIKeyAuthForm({ auth, onChangeConfig }) {
    const config = auth?.config || {};

    return (
        <div className="flex flex-col gap-3 mt-4 px-2">

            <Field>
                <FieldLabel>Key name</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={config.key || ""}
                        onChange={(e) =>
                            onChangeConfig({ key: e.target.value })
                        }
                    />
                </InputGroup>
            </Field>

            <Field>
                <FieldLabel>Value</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={config.value || ""}
                        onChange={(e) =>
                            onChangeConfig({ value: e.target.value })
                        }
                    />
                </InputGroup>
            </Field>

            <Select
                value={config.in || "header"}
                onValueChange={(value) =>
                    onChangeConfig({ in: value })
                }
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="query">Query Param</SelectItem>
                </SelectContent>
            </Select>

        </div>
    );
}