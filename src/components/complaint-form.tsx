"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useFormStatus } from 'react-dom';


import { submitComplaint } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "@/components/signature-pad";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Wrench, ShieldCheck, Signature, Package, PackageSearch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const complaintSchema = z.object({
  userName: z.string().min(1, "User name is required."),
  roomNumber: z.string().min(1, "Room number is required."),
  section: z.string().min(1, "Section is required."),
  productType: z.string({ required_error: "Product type is required." }).min(1, "Product type is required."),
  productSerialNumber: z.string().min(1, "Product Serial Number is required."),
  problemDescription: z.string().min(10, "Problem description must be at least 10 characters."),
  userSignature: z.string({ required_error: "User signature is required." }).min(1, "User signature is required."),
  representativeName: z.string().min(1, "Representative name is required."),
  solution: z.string().min(10, "Solution must be at least 10 characters."),
  representativeSignature: z.string({ required_error: "Representative signature is required." }).min(1, "Representative signature is required."),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      size="lg"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Complaint"
      )}
    </Button>
  );
}


export function ComplaintForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      userName: "",
      roomNumber: "",
      section: "",
      productType: "",
      productSerialNumber: "",
      problemDescription: "",
      userSignature: "",
      representativeName: "",
      solution: "",
      representativeSignature: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<ComplaintFormValues> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, (data as any)[key]);
    }

    const state = await submitComplaint(initialState, formData);

    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      form.reset();
      router.refresh();
    } else if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> User & Problem Details</CardTitle>
            <CardDescription>Enter the user's information and describe the problem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Separator />
             <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2"><Package /> Product Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="CPU">CPU</SelectItem>
                                <SelectItem value="Printer">Printer</SelectItem>
                                <SelectItem value="UPS">UPS</SelectItem>
                                <SelectItem value="Laptop">Laptop</SelectItem>
                                <SelectItem value="Keyboard">Keyboard</SelectItem>
                                <SelectItem value="Mouse">Mouse</SelectItem>
                                <SelectItem value="RAM">RAM</SelectItem>
                                <SelectItem value="Monitor">Monitor</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="productSerialNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><PackageSearch /> Product Serial Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., SN123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describe the issue in detail..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Separator className="my-6" />
            <FormField
              control={form.control}
              name="userSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Signature /> User Signature</FormLabel>
                  <FormControl>
                    <SignaturePad {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench /> Representative's Solution</CardTitle>
            <CardDescription>Record the solution provided by the representative.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="representativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution Provided</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describe the solution provided..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-6" />
            <FormField
              control={form.control}
              name="representativeSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><ShieldCheck /> Representative Signature</FormLabel>
                  <FormControl>
                    <SignaturePad {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <SubmitButton />
      </form>
    </Form>
  );
}
