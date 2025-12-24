"use client";

import { useEffect, useState, useMemo } from "react";
import { getComplaints } from "@/app/actions";
import type { Complaint } from "@/lib/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { ComplaintDetailsDialog } from "./complaint-details-dialog";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      const data = await getComplaints();
      setComplaints(data);
      setLoading(false);
    }
    fetchComplaints();
  }, []);

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Status", "User Name", "Room", "Section", "Product Type", "Product S/N", "Problem", "Solution", "Representative"];
    const rows = complaints.map(c => [
      c.id,
      format(new Date(c.createdAt), 'PPp'),
      c.status,
      c.userName,
      c.roomNumber,
      c.section,
      c.productType,
      c.productSerialNumber,
      `"${c.problemDescription.replace(/"/g, '""')}"`,
      `"${c.solution.replace(/"/g, '""')}"`,
      c.representativeName,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "complaints.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToTXT = () => {
    let txtContent = complaints.map(c => {
      return `
ID: ${c.id}
Date: ${format(new Date(c.createdAt), 'PPp')}
Status: ${c.status}
User: ${c.userName}
Room: ${c.roomNumber}
Section: ${c.section}
Product Type: ${c.productType}
Product S/N: ${c.productSerialNumber}
Problem: ${c.problemDescription}
Solution: ${c.solution}
Representative: ${c.representativeName}
------------------------------------
      `.trim();
    }).join("\n\n");

    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + txtContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "complaints.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Complaints Report", 14, 16);
    (doc as any).autoTable({
      head: [["ID", "Date", "Status", "User", "Product", "Problem"]],
      body: complaints.map(c => [
        c.id,
        format(new Date(c.createdAt), 'P'),
        c.status,
        c.userName,
        c.productType,
        { content: c.problemDescription, styles: { cellWidth: 'wrap' } }
      ]),
      startY: 20,
    });
    doc.save('complaints.pdf');
  };

  if (loading) {
    return (
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>Loading Complaints...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please wait while we fetch the records.</p>
        </CardContent>
      </Card>
    );
  }

  if (complaints.length === 0) {
    return (
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>No Complaints Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">When a new complaint is submitted, it will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
        <CardTitle>Submitted Complaints</CardTitle>
        <div className="flex gap-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" onClick={exportToCSV}><Download className="mr-2 h-4 w-4" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={exportToTXT}><Download className="mr-2 h-4 w-4" /> TXT</Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}><Download className="mr-2 h-4 w-4" /> PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S/N</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>Product S/N</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Problem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id} onClick={() => setSelectedComplaint(complaint)} className="cursor-pointer">
                  <TableCell>
                    <Badge variant="secondary">{complaint.id}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={complaint.status === 'Closed' ? 'destructive' : 'default'}>
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(complaint.createdAt), 'PPp')}</TableCell>
                  <TableCell>{complaint.userName}</TableCell>
                  <TableCell>{complaint.productType}</TableCell>
                  <TableCell>{complaint.productSerialNumber}</TableCell>
                  <TableCell>{complaint.roomNumber}</TableCell>
                  <TableCell>{complaint.section}</TableCell>
                  <TableCell className="max-w-xs truncate">{complaint.problemDescription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      {selectedComplaint && (
        <ComplaintDetailsDialog
          complaint={selectedComplaint}
          open={!!selectedComplaint}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedComplaint(null);
            }
          }}
        />
      )}
    </Card>
  );
}
