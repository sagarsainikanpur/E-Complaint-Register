export type Complaint = {
  id: string;
  userName: string;
  roomNumber: string;
  section: string;
  cpuSerialNumber: string;
  problemDescription: string;
  userSignature: string; // base64 data URL
  representativeName: string;
  solution: string;
  representativeSignature: string; // base64 data URL
  createdAt: string;
};
