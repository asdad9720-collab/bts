import { useEffect, useRef } from "react";
import bgAudio from "@/assets/audio.mp3";
import { Header } from "@/components/Header";
import { EventBanner } from "@/components/EventBanner";
import { MainContent } from "@/components/MainContent";
import { OrganizerInfo } from "@/components/OrganizerInfo";
import { Footer } from "@/components/Footer";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // autoplay pode ser bloqueado; ignoramos o erro
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <audio ref={audioRef} src={bgAudio} autoPlay loop />
      <Header />
      <main>
        <EventBanner />
        <MainContent />
        <OrganizerInfo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
