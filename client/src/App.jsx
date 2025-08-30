import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"
import JobListings from "@/components/JobListings"

export default function App() {

  const sampleJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
      remote: true,
      posted: "2 days ago",
      description: "We are looking for an experienced React developer...",
      tags: ["React", "TypeScript", "Node.js", "GraphQL"],
      experienceLevel: "Senior",
      industry: "Technology",
      size: "200-500"
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      salary: "$90k - $130k",
      type: "Full-time",
      remote: false,
      posted: "1 week ago",
      description: "Join our growing team to build amazing user experiences...",
      tags: ["Vue.js", "JavaScript", "CSS", "HTML"],
      experienceLevel: "Mid",
      industry: "Fintech",
      size: "50-200"
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Digital Agency",
      location: "Remote",
      salary: "$80k - $120k",
      type: "Contract",
      remote: true,
      posted: "3 days ago",
      description: "We need a versatile developer for various client projects...",
      tags: ["React", "Python", "Django", "PostgreSQL"],
      experienceLevel: "Mid",
      industry: "Agency",
      size: "10-50"
    },
    {
      id: 4,
      title: "Junior Web Developer",
      company: "Learning Corp",
      location: "Austin, TX",
      salary: "$50k - $70k",
      type: "Full-time",
      remote: false,
      posted: "5 days ago",
      description: "Perfect role for someone starting their career...",
      tags: ["HTML", "CSS", "JavaScript", "jQuery"],
      experienceLevel: "Entry",
      industry: "Education",
      size: "500+"
    },
    {
      id: 5,
      title: "Lead Frontend Architect",
      company: "Enterprise Solutions",
      location: "Chicago, IL",
      salary: "$150k - $200k",
      type: "Full-time",
      remote: true,
      posted: "1 day ago",
      description: "Lead our frontend architecture and mentor junior developers...",
      tags: ["React", "Angular", "Architecture", "Team Lead"],
      experienceLevel: "Lead",
      industry: "Enterprise",
      size: "1000+"
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
      <AppHeader />
      <JobListings jobs={{sampleJobs}} />
      </div>
    </SidebarProvider>
    
  )
}
