import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplaintForm } from "@/components/complaint-form"
import { ComplaintsList } from "@/components/complaints-list"
import { FilePenLine, ListChecks } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-tight">
          SignAssist
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Your digital complaint and signature solution. Capture issues, solutions, and signatures seamlessly.
        </p>
      </div>

      <Tabs defaultValue="new-complaint" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="new-complaint">
            <FilePenLine className="mr-2 h-4 w-4" />
            New Complaint
          </TabsTrigger>
          <TabsTrigger value="view-complaints">
            <ListChecks className="mr-2 h-4 w-4" />
            View Complaints
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new-complaint" className="mt-6">
          <ComplaintForm />
        </TabsContent>
        <TabsContent value="view-complaints" className="mt-6">
          <ComplaintsList />
        </TabsContent>
      </Tabs>
    </main>
  );
}
