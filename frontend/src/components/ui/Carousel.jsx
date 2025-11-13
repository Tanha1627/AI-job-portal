import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button"; // adjust if your Button path is different

export function Carousel({ children, className }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => embla && embla.scrollPrev();
  const scrollNext = () => embla && embla.scrollNext();

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => embla.off("select", onSelect);
  }, [embla]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex" ref={emblaRef}>
        {children}
      </div>

      {/* Arrows */}
      <CarouselPrev onClick={scrollPrev} />
      <CarouselNext onClick={scrollNext} />

      {/* Dots */}
      <div className="absolute bottom-2 w-full flex justify-center space-x-2">
        {React.Children.map(children, (_, index) => (
          <button
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              selectedIndex === index ? "bg-blue-600" : "bg-gray-300"
            )}
            onClick={() => embla && embla.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export function CarouselItem({ children, className }) {
  return <div className={cn("flex-[0_0_100%] relative", className)}>{children}</div>;
}

export function CarouselNext({ onClick }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
    >
      →
    </Button>
  );
}

export function CarouselPrev({ onClick }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
    >
      ←
    </Button>
  );
}
