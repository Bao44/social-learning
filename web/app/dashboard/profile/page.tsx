"use client";

import { motion } from "framer-motion";
import PhotoGrid from "./components/PhotoGrid";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import StoryHighlights from "./components/Story";

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-md pt-4 sm:max-w-2xl lg:max-w-3xl xl:max-w-5xl pr-5 sm:pl-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-linear-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-linear-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
      <ProfileHeader />
      <StoryHighlights />
      <ProfileTabs />
      <PhotoGrid />
    </div>
  );
}
