import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Eye,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";



export default function JobListing(jobs, onJobSelect, onGenerateResume, generatingResumeId) {
  const [viewMode, setViewMode] = useState("card");
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // Advanced filters
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [remoteFilter, setRemoteFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  // Define table columns
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                const newSelected = {};
                table.getPrePaginationRowModel().rows.forEach((row) => {
                  newSelected[row.id] = true;
                });
                setSelectedRows(newSelected);
              } else {
                setSelectedRows({});
              }
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelectedRows(prev => ({
                ...prev,
                [row.id]: !!value
              }));
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            Job Title
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.company}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            Location
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{row.getValue("location")}</span>
            {row.original.remote && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Remote
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.getValue("type")}
          </Badge>
        ),
      },
      {
        accessorKey: "salary",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            Salary
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-green-600">
            {row.getValue("salary")}
          </div>
        ),
      },
      {
        accessorKey: "posted",
        header: "Posted",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("posted")}
          </div>
        ),
      },
      {
        accessorKey: "tags",
        header: "Skills",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {(row.getValue("tags")).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {(row.getValue("tags")).length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{(row.getValue("tags")).length - 3}
              </Badge>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const job = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onJobSelect?.(job)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onGenerateResume?.(job)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Resume
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onJobSelect, onGenerateResume]
  );

  console.log(jobs.jobs.sampleJobs);

  // Filter jobs based on advanced filters
  const filteredJobs = useMemo(() => {
    return jobs.jobs.sampleJobs.filter((job) => {
      const matchesGlobal = !globalFilter || 
        job.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        job.company.toLowerCase().includes(globalFilter.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(globalFilter.toLowerCase()));

      const matchesLocation = !locationFilter || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesType = typeFilter === "all" || job.type === typeFilter;

      const matchesRemote = remoteFilter === "all" || 
        (remoteFilter === "remote" && job.remote) ||
        (remoteFilter === "onsite" && !job.remote);

      const matchesExperience = experienceFilter === "all" || 
        job.experienceLevel === experienceFilter;

      const matchesSalary = salaryFilter === "all" || (() => {
        const salaryRange = job.salary.replace(/[,$k]/g, '').split(' - ');
        const minSalary = parseInt(salaryRange[0]) * 1000;
        
        switch (salaryFilter) {
          case "50k":
            return minSalary < 50000;
          case "50k-100k":
            return minSalary >= 50000 && minSalary < 100000;
          case "100k-150k":
            return minSalary >= 100000 && minSalary < 150000;
          case "150k+":
            return minSalary >= 150000;
          default:
            return true;
        }
      })();

      return matchesGlobal && matchesLocation && matchesType && 
             matchesRemote && matchesExperience && matchesSalary;
    });
  }, [jobs, globalFilter, locationFilter, typeFilter, remoteFilter, experienceFilter, salaryFilter]);

  // Initialize table
  const table = useReactTable({
    data: filteredJobs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: viewMode === "card" ? 12 : 10,
      },
    },
  });

  const selectedJobsCount = Object.values(selectedRows).filter(Boolean).length;

  const clearAllFilters = () => {
    setGlobalFilter("");
    setLocationFilter("");
    setTypeFilter("all");
    setRemoteFilter("all");
    setExperienceFilter("all");
    setSalaryFilter("all");
    setColumnFilters([]);
  };

  const hasActiveFilters = globalFilter || locationFilter || 
    typeFilter !== "all" || remoteFilter !== "all" || 
    experienceFilter !== "all" || salaryFilter !== "all";

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {table.getRowModel().rows.map((row) => {
        const job = row.original;
        return (
          <Card
            key={job.id}
            className="hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => onJobSelect?.(job)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {job.title}
                </CardTitle>
                <Checkbox
                  checked={selectedRows[row.id] || false}
                  onCheckedChange={(value) => {
                    setSelectedRows(prev => ({
                      ...prev,
                      [row.id]: !!value
                    }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-2"
                />
              </div>
              <CardDescription className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                  {job.remote && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Remote
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {job.type} • {job.posted}
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.tags.length - 4}
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJobSelect?.(job);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
<Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateResume?.(job);
                  }}
                  disabled={generatingResumeId === job.id}
                >
                  {generatingResumeId === job.id ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  AI Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onJobSelect?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No jobs found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6 px-4 py-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Job Listings ({filteredJobs.length})
          </h2>
          <p className="text-muted-foreground">
            {selectedJobsCount > 0 && `${selectedJobsCount} selected • `}
            Browse and filter job opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedJobsCount > 0 && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export ({selectedJobsCount})
            </Button>
          )}
          <div className="flex items-center rounded-lg border p-1">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Search & Filters</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, skills..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select value={remoteFilter} onValueChange={setRemoteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Remote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="onsite">On-site Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid">Mid Level</SelectItem>
                <SelectItem value="Senior">Senior Level</SelectItem>
                <SelectItem value="Lead">Lead/Principal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="50k">Under $50k</SelectItem>
                <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                <SelectItem value="150k+">$150k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {viewMode === "card" ? renderCardView() : renderTableView()}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()} ({filteredJobs.length} total jobs)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
