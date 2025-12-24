
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from "date-fns";
import type { Complaint, ComplaintStatus } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { updateComplaintStatus } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


interface ComplaintDetailsDialogProps {
  complaint: Complaint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDetailsDialog({
  complaint,
  open,
  onOpenChange,
}: ComplaintDetailsDialogProps) {

    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<ComplaintStatus>(complaint.status);

    const handleStatusChange = async (newStatus: ComplaintStatus) => {
        setIsUpdating(true);
        setCurrentStatus(newStatus);
        const result = await updateComplaintStatus(complaint.id, newStatus);
        if (result.success) {
            toast({
                title: "Status Updated",
                description: `Complaint #${complaint.id} marked as ${newStatus}.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.message,
            });
            setCurrentStatus(complaint.status); // revert on failure
        }
        setIsUpdating(false);
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start">
            <span className="break-all">Complaint Details #{complaint.id}</span>
            <Badge variant={currentStatus === 'Closed' ? 'destructive' : 'default'} className="ml-2 shrink-0">{currentStatus}</Badge>
          </DialogTitle>
          <DialogDescription>
            Filed on {format(new Date(complaint.createdAt), "PPP 'at' p")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            {/* User Details */}
            <div>
                <h3 className="text-lg font-semibold mb-2">User & Problem Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium">User Name:</div>
                    <div className="break-words">{complaint.userName}</div>

                    <div className="font-medium">Room Number:</div>
                    <div className="break-words">{complaint.roomNumber}</div>

                    <div className="font-medium">Section:</div>
                    <div className="break-words">{complaint.section}</div>

                    <div className="font-medium">Product Type:</div>
                    <div className="break-words">{complaint.productType}</div>

                    <div className="font-medium">Product Serial Number:</div>
                    <div className="break-words">{complaint.productSerialNumber}</div>

                    <div className="col-span-1 sm:col-span-2 font-medium mt-2">Problem Description:</div>
                    <div className="col-span-1 sm:col-span-2 p-2 bg-muted rounded-md text-muted-foreground break-words whitespace-pre-wrap">{complaint.problemDescription}</div>
                </div>
            </div>

            <Separator />

            {/* Representative Details */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Representative & Solution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium">Representative Name:</div>
                    <div className="break-words">{complaint.representativeName}</div>
                    
                    <div className="col-span-1 sm:col-span-2 font-medium mt-2">Solution Provided:</div>
                    <div className="col-span-1 sm:col-span-2 p-2 bg-muted rounded-md text-muted-foreground break-words whitespace-pre-wrap">{complaint.solution}</div>
                </div>
            </div>

            <Separator />
            
            {/* Signatures */}
            <div>
                 <h3 className="text-lg font-semibold mb-2">Signatures</h3>
                 <div className="flex flex-col sm:flex-row gap-4 justify-around">
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">User Signature</p>
                        <div className="w-[200px] h-[100px] border bg-white rounded-md flex items-center justify-center">
                            <Image src={complaint.userSignature} alt="User Signature" width={200} height={100} className="object-contain w-full h-full p-1"/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Representative Signature</p>
                        <div className="w-[200px] h-[100px] border bg-white rounded-md flex items-center justify-center">
                            <Image src={complaint.representativeSignature} alt="Representative Signature" width={200} height={100} className="object-contain w-full h-full p-1"/>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center gap-4 sm:gap-0 pt-4 border-t">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={currentStatus} onValueChange={(value: ComplaintStatus) => handleStatusChange(value)} disabled={isUpdating}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
