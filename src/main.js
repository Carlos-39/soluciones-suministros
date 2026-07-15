// Styles
import './styles/index.css';

// Components
import { NavigationBar } from './components/NavigationBar.js';
import { HeroSection } from './components/HeroSection.js';
import { DifferentiatorsSection } from './components/DifferentiatorsSection.js';
import { PricingSection } from './components/PricingSection.js';
import { ProcessSection } from './components/ProcessSection.js';
import { SplitCtaSection } from './components/SplitCtaSection.js';
import { MapSection } from './components/MapSection.js';
import { FooterSection } from './components/FooterSection.js';
import { ChatbotWidget } from './components/ChatbotWidget.js';

// Hooks
import { initHeroCanvas } from './hooks/useHeroCanvas.js';
import { initPricingCalculator } from './hooks/usePricingCalculator.js';
import { initChatbot } from './hooks/useChatbot.js';
import { initPinnedProcess } from './hooks/usePinnedProcess.js';
import { initBrushstrokes } from './hooks/useBrushstrokes.js';
import { initRevealOnScroll } from './hooks/useRevealOnScroll.js';
import { initMobileNav } from './hooks/useMobileNav.js';
import { initMap3D } from './hooks/useMap3D.js';

// Render components into #app
const app = document.getElementById('app');
app.innerHTML = [
  NavigationBar(),
  HeroSection(),
  DifferentiatorsSection(),
  PricingSection(),
  ProcessSection(),
  SplitCtaSection(),
  MapSection(),
  FooterSection(),
].join('');

// ChatbotWidget lives outside #app (fixed position, appended to body)
document.body.insertAdjacentHTML('beforeend', ChatbotWidget());

// Initialize all hooks (order matters: hero canvas first, reveal last)
initHeroCanvas();
initPricingCalculator();
initPinnedProcess();
initBrushstrokes();
initChatbot();
initRevealOnScroll();
initMobileNav();
initMap3D();
