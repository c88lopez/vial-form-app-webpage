import { BookCopy, LucideIcon } from "lucide-react";

type Section = {
  groupName: string;
  groupItems: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
};

export const Sections: Section[] = [
  {
    groupName: "Application",
    groupItems: [
      {
        title: "Forms",
        url: "/form",
        icon: BookCopy,
      },
    ],
  },
];
