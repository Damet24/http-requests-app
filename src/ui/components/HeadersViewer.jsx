import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui";

export function HeadersViewer({ headers }) {
    if (!headers) return null;

    return (
        <div className="h-full overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-64">Key</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Object.entries(headers).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell className="font-mono text-muted-foreground wrap-break-word">
                                {key}
                            </TableCell>

                            <TableCell className="wrap-break-word whitespace-pre-wrap max-w-0">
                                {value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
