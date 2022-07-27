import React, { FC } from "react";
import { Profile } from "@strandgeek/powerup";
import { PencilIcon } from "@heroicons/react/solid";

export interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  const { handle } = profile
  return (
    <div className="card w-lg max-w-lg bg-base-100 shadow-xl group">
      <div className="w-full h-[160px]">
        <img
          className="object-cover w-full h-full"
          src="https://placeimg.com/400/225/arch"
          alt="Shoes"
        />
        <figure></figure>
      </div>
      <div className="card-body relative">
        <div className="absolute left-0 top-[-48px] flex items-center justify-center w-full">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://placeimg.com/192/192/people" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="mt-8 text-center font-bold text-lg">
            @{handle.name}#<span className="opacity-40">#{handle.tag}</span>
          </h2>
          <p className="mt-4">
            {profile.description}
          </p>
          <div className="mt-8">
            {profile.tags.map(tag => (
              <span className="mr-2 text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary btn-ghost btn-block mt-8">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
