import ChapterHero from "@/components/clarity/ChapterHero";
import ChapterScore from "@/components/clarity/ChapterScore";
import ChapterProfiles from "@/components/clarity/ChapterProfiles";
import ChapterInvest from "@/components/clarity/ChapterInvest";
import ChapterDisclosures from "@/components/clarity/ChapterDisclosures";

export default function HomePage() {
  return (
    <main data-testid="home-main">
      <ChapterHero />
      <ChapterScore />
      <ChapterProfiles />
      <ChapterInvest />
      <ChapterDisclosures />
    </main>
  );
}
