"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import OnboardingScreen from "./OnboardingScreen";
import SetupReminder from "./SetupReminder";
import RealMatchingFeed from "./RealMatchingFeed";

export default function HomeController() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Unauthorized</div>;

  const hasSkills =
    user.skills?.length > 0 || user.skillsToLearn?.length > 0;

  const isPartial =
    user.skills?.length > 0 && user.skillsToLearn?.length === 0;

  // No skills at all
  if (!hasSkills) {
    return <OnboardingScreen />;
  }

  // Partial setup
  if (isPartial) {
    return <SetupReminder user={user} />;
  }

  // Full seup
  return <RealMatchingFeed user={user} />;
}