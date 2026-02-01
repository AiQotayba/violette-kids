import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileHero } from "@/components/home/mobile-hero";
import { StoriesRow } from "@/components/home/stories-row";
import { VideosRow } from "@/components/home/videos-row";
import { GamesRow } from "@/components/home/games-row";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <MobileHeader />
      <main className="flex-1">
        <MobileHero />
        <StoriesRow />
        <VideosRow />
        <GamesRow />
      </main>
      <BottomNav />
    </div>
  );
}
