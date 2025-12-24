import type { Complaint, ComplaintStatus } from '@/lib/types';

// This is a mock in-memory database.
let complaints: Complaint[] = [];
let nextId = 1;

export async function getAllComplaints(): Promise<Complaint[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addComplaint(complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status'>): Promise<Complaint> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newComplaint: Complaint = {
    ...complaintData,
    id: (nextId++).toString(),
    createdAt: new Date().toISOString(),
    status: 'Open',
  };
  complaints.unshift(newComplaint);
  return newComplaint;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const complaintIndex = complaints.findIndex(c => c.id === id);
  if (complaintIndex !== -1) {
    complaints[complaintIndex].status = status;
    return complaints[complaintIndex];
  }
  return undefined;
}
