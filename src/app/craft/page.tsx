import Image from "next/image";

import { AnimatedSection } from "@/components/custom/animated-section";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const items = [
  {
    id: "gradient-1",
    title: "Soft Gradient Study",
    src: "/craft/gradient-1.jpg",
  },
  {
    id: "layout-1",
    title: "Layout Sketch",
    src: "/craft/layout-1.jpg",
  },
] as const;

export default function CraftPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Craft</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A small gallery of visual and interaction experiments.
        </p>
      </header>

      <AnimatedSection>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="group relative overflow-hidden rounded-lg border bg-muted/40"
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-3 left-3 text-sm font-medium text-white drop-shadow">
                      {item.title}
                    </span>
                  </button>
                }
              />
              <DialogContent className="max-w-3xl border-none bg-background/95 p-0">
                <Image
                  src={item.src}
                  alt={item.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-contain"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
