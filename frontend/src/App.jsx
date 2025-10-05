import { useState, useEffect, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"
import JobListings from "@/components/JobListings"
import { getJobs } from "@/services/jobService"

export default function App() {

  const [jobs, setJobss] = useState([]);

    useEffect(() => {
      getJobs().then((res) => setJobss(res.data.data.jobs));
    }, []);


    console.log(jobs);


  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
      <AppHeader />
      <JobListings jobs={{jobs}} />
      </div>
    </SidebarProvider>
    
  )
}
