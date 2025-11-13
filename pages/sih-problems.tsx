import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Head from 'next/head';

interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  psNumber: string;
  theme: string;
  lastDate: string;
  status: string;
  tags: string[];
  url: string;
}

export default function SIHProblems() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const limit = 6;

  useEffect(() => {
    // Update URL when filters change
    const query: any = {};
    if (searchTerm) query.search = searchTerm;
    if (category) query.category = category;
    if (theme) query.theme = theme;
    if (page > 1) query.page = page;
    
    router.push({
      pathname: '/sih-problems',
      query,
    }, undefined, { shallow: true });

    // Fetch problem statements
    fetchProblemStatements();
  }, [searchTerm, category, theme, page]);

  useEffect(() => {
    // Initialize from URL on component mount
    const { search, category: urlCategory, theme: urlTheme, page: urlPage } = router.query;
    if (search) setSearchTerm(search as string);
    if (urlCategory) setCategory(urlCategory as string);
    if (urlTheme) setTheme(urlTheme as string);
    if (urlPage) setPage(parseInt(urlPage as string, 10));
  }, [router.query]);

  const fetchProblemStatements = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: searchTerm,
        category,
        theme,
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const response = await fetch(`/api/sih/problem-statements?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProblemStatements(data.data.problemStatements);
        setTotalPages(data.data.totalPages);
        setCategories(data.data.filters?.categories || []);
        setThemes(data.data.filters?.themes || []);
      }
    } catch (error) {
      console.error('Error fetching problem statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setTheme('');
    setPage(1);
  };

  const renderProblemCard = (problem: ProblemStatement) => (
    <Card key={problem.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {problem.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {problem.psNumber} • {problem.organization}
            </CardDescription>
          </div>
          <Badge variant={problem.status === 'Open' ? 'default' : 'secondary'}>
            {problem.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {problem.theme}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {problem.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {problem.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {problem.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {problem.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{problem.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <span className="text-xs text-muted-foreground">
          Last Date: {problem.lastDate}
        </span>
        <Button variant="outline" size="sm" asChild>
          <a 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            View Details <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Head>
        <title>SIH Problem Statements | SyncIn</title>
        <meta name="description" content="Browse and search through Smart India Hackathon problem statements" />
      </Head>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Smart India Hackathon Problem Statements</h1>
        <p className="text-muted-foreground">
          Browse and search through the latest problem statements from SIH
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search problem statements..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                placeholder="Search problem statements..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Themes</SelectItem>
                {themes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || category || theme) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="ml-auto text-sm text-muted-foreground"
                size="sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Tabs */}
    <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
      <TabsList>
        <TabsTrigger value="all">All Problems</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="recent">Recently Added</TabsTrigger>
        <TabsTrigger value="popular">Most Viewed</TabsTrigger>
      </TabsList>
    </Tabs>

    {/* Problem Statements Grid */}
    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    ) : problemStatements.length > 0 ? (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemStatements.map(renderProblemCard)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </>
    ) : (
      <div className="text-center py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No problem statements found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
        <Button variant="outline" className="mt-4" onClick={clearFilters}>
          Clear all filters
        </Button>
      </div>
    )}
  </div>
);
}
