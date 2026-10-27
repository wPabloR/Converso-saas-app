import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";
import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  let sessionCompanions: Companion[] = recentSessions;

  try {
    const fromDb = await getRecentSessions(10);
    if (fromDb.length > 0) sessionCompanions = fromDb;
  } catch {
    // Supabase not configured or empty history — show demo data from constants
  }

  return (
    <main>
      <h1>Popular Companions</h1>

      <section className="home-section">
        {companions.length > 0 ? (
          companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))
        ) : (
          <p className="text-lg text-muted-foreground">
            No companions yet. Sign in and create your first one.
          </p>
        )}
      </section>

      <section className="home-section">
        <CompanionList
          title="Recently completed sessions"
          companions={sessionCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
