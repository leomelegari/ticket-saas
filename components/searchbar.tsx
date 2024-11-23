import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

import Form from "next/form";

function SearchBar() {
  return (
    <div>
      <Form action="/search" className="relative">
        <input
          type="text"
          name="q"
          placeholder="Procure por eventos..."
          className="w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        <Button
          type="submit"
          size="sm"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm font-medium"
        >
          Search
        </Button>
      </Form>
    </div>
  );
}

export default SearchBar;
