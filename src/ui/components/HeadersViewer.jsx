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
        <div className="h-full overflow-auto p-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Key</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Object.entries(headers).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell className="font-mono text-muted-foreground">
                                {key}
                            </TableCell>

                            <TableCell className="break-all">
                                {value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
