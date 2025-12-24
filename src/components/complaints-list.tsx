import { getComplaints } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

export async function ComplaintsList() {
  const complaints = await getComplaints();

  if (complaints.length === 0) {
    return (
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>No Complaints Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Looks like everything is working perfectly. When a new complaint is submitted, it will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S/N</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>CPU S/N</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Solution</TableHead>
                <TableHead>Signatures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <Badge variant="secondary">{complaint.id}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(complaint.createdAt), 'PPp')}</TableCell>
                  <TableCell>{complaint.roomNumber}</TableCell>
                  <TableCell>{complaint.section}</TableCell>
                  <TableCell>{complaint.cpuSerialNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{complaint.problemDescription}</TableCell>
                  <TableCell className="max-w-xs truncate">{complaint.solution}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      {complaint.userSignature && (
                        <div className="flex flex-col items-center">
                          <Image
                            src={complaint.userSignature}
                            alt="User Signature"
                            width={100}
                            height={50}
                            className="rounded-md bg-white p-1 border"
                          />
                          <span className="text-xs text-muted-foreground mt-1">User</span>
                        </div>
                      )}
                      {complaint.representativeSignature && (
                        <div className="flex flex-col items-center">
                          <Image
                            src={complaint.representativeSignature}
                            alt="Representative Signature"
                            width={100}
                            height={50}
                            className="rounded-md bg-white p-1 border"
                          />
                          <span className="text-xs text-muted-foreground mt-1">Rep.</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
