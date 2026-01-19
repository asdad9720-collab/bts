import { Header } from "@/components/Header";
import { EventBanner } from "@/components/EventBanner";
import { MainContent } from "@/components/MainContent";
import { OrganizerInfo } from "@/components/OrganizerInfo";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
