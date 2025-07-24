import AuthGuard from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import OverwhelmedPopCard from "@/components/OverwhelmOrganizer/OverwhelmedPopCard";
import PlansList from "@/components/OverwhelmOrganizer/Plan/PlansList";

const Home = () => {


  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <OverwhelmedPopCard />
          <PlansList />
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default Home;
