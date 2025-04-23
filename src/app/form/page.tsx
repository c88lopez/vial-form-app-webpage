"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IForm } from "@/app/form/types";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const [forms, setForms] = useState<IForm[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form`,
      );

      const json = await response.json();

      setForms(json.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching forms");
    }
  }

  return (
    <div>
      <div className="flex w-full items-center py-4 px-3">
        <div className="flex w-full"></div>

        <Link href="/form/create">
          <Button variant="default">Create Form</Button>
        </Link>
      </div>

      <div className="rounded-md border m-2">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <Link href={`/form/${form.id}`}>
                        <DropdownMenuItem>
                          <Eye />
                          View Form
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
