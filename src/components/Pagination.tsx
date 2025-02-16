import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  return (
    <div className="flex justify-center mt-6 gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          className={`w-8 h-8 p-0 ${
            currentPage === i + 1 ? "bg-black text-white" : ""
          }`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
};
