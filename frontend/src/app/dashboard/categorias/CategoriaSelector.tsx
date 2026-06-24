"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function CategoriaSelector({
  categorias,
  selected,
}: {
  categorias: string[];
  selected: string | null;
}) {
  const router = useRouter();

  return (
    <div className="relative inline-flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-gray-300 transition-colors">
      <div className="pl-4 pr-2 py-2 text-sm text-gray-500 font-medium">
        Categoría:
      </div>
      <div className="relative">
        <select
          value={selected || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              router.push(`/dashboard/categorias?categoria=${val}`);
            } else {
              router.push(`/dashboard/categorias`);
            }
          }}
          className="appearance-none bg-transparent outline-none pr-10 pl-2 py-2 text-sm font-bold text-gray-900 cursor-pointer w-full focus:ring-0"
        >
          <option value="">Todas las Categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-900">
          <ChevronDown className="w-4 h-4 text-black" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
