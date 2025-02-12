"use client";

import { useEffect } from "react";

import { useDatabase } from "@/hooks/use-database";
import { useProjectStore } from "@/store/use-project-store";

import { HomeScreen } from "./_components/home-screen/home-screen";
import { ProjectScreen } from "./_components/project-screen/project-screen";

const HomePage = () => {
  const db = useDatabase();
  const ps = useProjectStore();

  useEffect(() => {
  }, [db]);

  return (
    <>
    {/* TODO */}
      {ps.currentProject ? <ProjectScreen /> : <HomeScreen />}
    </>
  );
};

export default HomePage;