"use client";

import { useEffect } from "react";
import { testDB } from "@/db/tauri-sqlite-db";

import { useDatabase } from "@/hooks/use-database";


const HomePage = () => {
  const db = useDatabase();
  useEffect(() => {
    console.log("here");
    if (db)
      testDB(db);
  }, [db]);

  return (
    <div>

    </div>
  );
};

export default HomePage;