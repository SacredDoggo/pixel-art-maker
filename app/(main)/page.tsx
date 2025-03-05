"use client";

import { useEffect } from "react";

import { useDatabase } from "@/hooks/use-database";
import { useProjectStore } from "@/store/project-store";

import { HomeScreen } from "./_components/home-screen/home-screen";
import { ProjectScreen } from "./_components/project-screen/project-screen";
import { getSoftwareState } from "@/db/software-state";
import { getProjectById } from "@/db/project";

const HomePage = () => {
  const db = useDatabase();
  const ps = useProjectStore();

  useEffect(() => {
    if (!db) return;

    const loadSoftwareState = async () => {
      const softwareState = await getSoftwareState(db);
      if (!softwareState) return;

      const project = await getProjectById(db, softwareState.last_project_id);
      if (!project) return;

      ps.setCurrentProject(project);
    };

    loadSoftwareState();
  }, [db]);

  if (!db) {
    return (
      <div className="h-full flex-1 items-center justify-center overflow-auto">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full flex-1 items-center justify-center overflow-auto">
      {/* TODO */}
      {ps.currentProject ? <ProjectScreen /> : <HomeScreen />}
    </div>
  );
};

export default HomePage;