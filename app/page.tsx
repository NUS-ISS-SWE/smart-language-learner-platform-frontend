import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: "📚",
    title: "Structured Courses",
    description:
      "Follow curated language courses designed by experts, from beginner to advanced.",
  },
  {
    icon: "🔤",
    title: "Vocabulary Builder",
    description:
      "Grow your vocabulary with smart flashcard sets and spaced-repetition practice.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description:
      "See your learning stats update in real time as you complete lessons and exercises.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Hints",
    description:
      "Get context-aware grammar hints and sentence examples powered by our backend AI.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <span className="text-6xl mb-6">🌐</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl">
          Learn Any Language,{" "}
          <span className="text-indigo-600">Smarter and Faster</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          SmartLangLearn connects you to a powerful microservices backend built on
          Java Spring Boot — delivering real-time lessons, vocabulary sets, and
          progress tracking at scale.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Start for free</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg">Browse courses</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Everything you need to master a new language
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SmartLangLearn · Built with Next.js + Spring Boot
      </footer>
    </div>
  );
}
