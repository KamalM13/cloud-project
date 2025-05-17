import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import useDocker from "@/hooks/use-docker";

interface ImageSearchProps {
  onSelect: (imageName: string) => void;
  value?: string;
}

interface SearchResult {
  name: string;
  description: string;
  stars: number;
  official: boolean;
  automated: boolean;
}

export function ImageSearch({ onSelect, value }: ImageSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchImage } = useDocker();

  useEffect(() => {
    const searchImages = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchImage(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Failed to search images:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchImages, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchImage]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Search for an image..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-96 overflow-y-auto">
          <CommandInput
            placeholder="Search Docker Hub..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Searching..." : "No images found."}
            </CommandEmpty>
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={result.name}
                  value={result.name}
                  onSelect={() => {
                    onSelect(result.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === result.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{result.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {result.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Stars: {result.stars} •{" "}
                      {result.official ? "Official • " : ""}
                      {result.automated ? "Automated" : ""}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
