import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import DailyLifeSection from './components/DailyLifeSection'
import ProjectsSection from './components/ProjectsSection'
import LootSection from './components/LootSection'
import ThankYouSection from './components/ThankYouSection'
import { I18nProvider } from '@/lib/i18n'
import ClickSpark from '@/components/ui/ClickSpark'

export default function App() {
  return (
    <I18nProvider>
      <ClickSpark
        sparkColor="#7C3AED"
        sparkSize={10}
        sparkRadius={20}
        sparkCount={6}
        duration={400}
        extraScale={1}
      >
        <main className="overflow-x-clip">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <DailyLifeSection />
          <ProjectsSection />
          <LootSection />
          <ThankYouSection />
        </main>
      </ClickSpark>
    </I18nProvider>
  )
}
