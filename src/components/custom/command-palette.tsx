"use client";

import { FileTextIcon, FolderIcon, HomeIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/custom/language-provider";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export type CommandPaletteItem = Readonly<{
  id: string;
  title: string;
  titleEn?: string;
  href: string;
  group: "pages" | "projects" | "blogs";
}>;

type CommandPaletteProps = Readonly<{
  items: CommandPaletteItem[];
}>;

const OPEN_EVENT = "command-palette:open";

export function CommandPalette({ items }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const labels = {
    empty: language === "vi" ? "Không tìm thấy kết quả." : "No results found.",
    placeholder:
      language === "vi"
        ? "Tìm trang, dự án, bài viết..."
        : "Search pages, projects, blogs...",
    pages: language === "vi" ? "Trang" : "Pages",
    projects: language === "vi" ? "Dự án" : "Projects",
    blogs: language === "vi" ? "Bài viết" : "Blogs",
  };

  const grouped = useMemo(() => {
    const groups: Record<CommandPaletteItem["group"], CommandPaletteItem[]> = {
      pages: [],
      projects: [],
      blogs: [],
    };
    for (const item of items) groups[item.group].push(item);
    return groups;
  }, [items]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const isCmdK = (e.metaKey || e.ctrlKey) && isK;
      if (isCmdK) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    const onOpen = () => setOpen(true);

    globalThis.addEventListener("keydown", onKeyDown);
    globalThis.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      globalThis.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const run = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette">
      <Command>
        <CommandInput placeholder={labels.placeholder} />
        <CommandList>
          <CommandEmpty>{labels.empty}</CommandEmpty>

          <CommandGroup heading={labels.pages}>
            {grouped.pages.map((item) => (
              <CommandItem key={item.id} onSelect={() => run(item.href)}>
                {item.href === "/" ? <HomeIcon /> : <SearchIcon />}
                <span className="flex-1">
                  {language === "vi"
                    ? item.title
                    : (item.titleEn ?? item.title)}
                </span>
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={labels.projects}>
            {grouped.projects.map((item) => (
              <CommandItem key={item.id} onSelect={() => run(item.href)}>
                <FolderIcon />
                <span className="flex-1">{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={labels.blogs}>
            {grouped.blogs.map((item) => (
              <CommandItem key={item.id} onSelect={() => run(item.href)}>
                <FileTextIcon />
                <span className="flex-1">{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function openCommandPalette() {
  globalThis.dispatchEvent(new Event(OPEN_EVENT));
}
