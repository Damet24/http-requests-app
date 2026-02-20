import { BasicAuthForm } from "./BasicAuthForm";
import { BearerAuthForm } from "./BearerAuthForm";
import { APIKeyAuthForm } from "./ApiKeyAuthForm";

export function AuthFormRenderer({ auth, onChangeConfig }) {
    switch (auth?.type) {
        case "basic":
            return (
                <BasicAuthForm
                    auth={auth}
                    onChangeConfig={onChangeConfig}
                />
            );
        case "bearer":
            return (
                <BearerAuthForm
                    auth={auth}
                    onChangeConfig={onChangeConfig}
                />
            );
        case "api":
            return (
                <APIKeyAuthForm
                    auth={auth}
                    onChangeConfig={onChangeConfig}
                />
            );
        default:
            return null;
    }
}
