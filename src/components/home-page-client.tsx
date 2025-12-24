
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePenLine, ListChecks } from "lucide-react"
import dynamic from 'next/dynamic'

const ComplaintForm = dynamic(() => import('@/components/complaint-form').then(mod => mod.ComplaintForm), {
  ssr: false,
  loading: () => <p>Loading form...</p>
})

const ComplaintsList = dynamic(() => import('@/components/complaints-list').then(mod => mod.ComplaintsList), {
  ssr: false,
  loading: () => <p>Loading complaints...</p>
})

export function HomePageClient() {
    return (
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
    )
}
