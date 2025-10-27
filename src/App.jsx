import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TextToMorse from "./components/TextToMorse";
import MorseToText from "./components/MorseToText";
import Footer from "./components/Footer";
import CheatSheet from "./components/CheatSheet";
import Practice from "./components/Practice";
import SoundQuiz from "./components/SoundQuiz";

function App() {
  return (
    <div className=" font-mono min-h-screen relative transition-colors duration-500">
      {/* Dotted pattern background */}
      <div className="absolute inset-0 -z-10"></div>

      <Navbar />

      <main className="pt-0 mt-0 pb-0">

        
        <section id="converter"> <TextToMorse /> </section>
        <section id="converter"> <MorseToText /> </section>
<section id="practice"> <Practice /> </section>
<section id="quiz"> <SoundQuiz /> </section>
<section id="reference"> <CheatSheet /> </section>


      </main>
      <Footer />
    </div>
  );
}

export default App;