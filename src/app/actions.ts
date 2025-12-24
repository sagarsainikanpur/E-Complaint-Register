
"use server";

import { revalidatePath } from 'next/cache';
import { addComplaint as dbAddComplaint, getAllComplaints as dbGetAllComplaints, updateComplaintStatus as dbUpdateComplaintStatus } from '@/lib/data';
import type { Complaint, ComplaintStatus } from '@/lib/types';
import { z } from 'zod';

const complaintSchema = z.object({
  userName: z.string().min(1, "User name is required."),
  roomNumber: z.string().min(1, "Room number is required."),
  section: z.string().min(1, "Section is required."),
  productType: z.string().min(1, "Product type is required."),
  productSerialNumber: z.string().min(1, "Product Serial Number is required."),
  problemDescription: z.string().min(10, "Problem description must be at least 10 characters."),
  userSignature: z.string().min(1, "User signature is required."),
  representativeName: z.string().min(1, "Representative name is required."),
  solution: z.string().min(10, "Solution must be at least 10 characters."),
  representativeSignature: z.string().min(1, "Representative signature is required."),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

export async function getComplaints() {
  return await dbGetAllComplaints();
}

export async function submitComplaint(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = complaintSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbAddComplaint(validatedFields.data as any);
    revalidatePath('/');
    return { success: true, message: "Complaint submitted successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An unexpected error occurred on the server." };
  }
}

export async function updateComplaintStatus(complaintId: string, status: ComplaintStatus) {
  try {
    await dbUpdateComplaintStatus(complaintId, status);
    revalidatePath('/');
    return { success: true, message: 'Status updated successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update status' };
  }
}
