export function HeadersViewer({ headers }) {
    if (!headers) return null;

    return (
        <div className="h-full overflow-auto text-sm p-3">
            <table className="w-full border-collapse">
                <tbody>
                {Object.entries(headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-zinc-800">
                        <td className="py-1 pr-4 text-zinc-400 font-mono">
                            {key}
                        </td>
                        <td className="py-1 text-zinc-200 break-all">
                            {value}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
