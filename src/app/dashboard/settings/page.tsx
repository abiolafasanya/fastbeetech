"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import authApi from "@/api/AuthApi";
import { handleServerError } from "@/lib/errorHelper";
import UploadDropzone from "@/components/fileUpload";
import UploadApi from "@/api/UploadApi";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  type MaybeUser = {
    name?: string;
    phone?: string;
    avatar?: string;
  } | null;

  const user = useAuthStore((s) => s.user) as MaybeUser;
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const canView = useAuthStore((s) => s.hasPermission("user:view_profile"));

  if (!user) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-4">You must be logged in to access settings.</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-4 text-red-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const handleAvatarUpload = async (): Promise<string | null> => {
    if (avatarFiles.length === 0) return null;
    try {
      const form = new FormData();
      avatarFiles.forEach((f) => form.append("images", f));
      const res = await UploadApi.upload(form);
      if (res?.urls && res.urls.length > 0) return res.urls[0];
      return null;
    } catch (err: unknown) {
      console.error("Avatar upload failed", err);
      toast.error("Failed to upload avatar. Please try again.");
      return null;
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatarUrl = user?.avatar || null;
      if (avatarFiles.length > 0) {
        const uploaded = await handleAvatarUpload();
        if (uploaded) avatarUrl = uploaded;
      }

      const payload = {
        name,
        phone,
        avatar: avatarUrl,
      };

      const response = await authApi.updateProfile(payload);
      // response expected: { status: true, data: user, message }
      if (response?.data) {
        login(response.data);
        toast.success("Profile updated successfully.");
        setAvatarFiles([]);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err: unknown) {
      console.error(err);
      // try to surface a message when possible
      if (axios.isAxiosError(err)) {
        handleServerError(err as AxiosError, "Failed to update profile.");
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const payload = { currentPassword, newPassword };
      const response = await authApi.changePassword(payload);
      if (response?.status) {
        toast.success("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(response?.message || "Failed to change password.");
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        handleServerError(err as AxiosError, "Failed to change password.");
      } else {
        toast.error("Failed to change password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <UploadDropzone
              files={avatarFiles}
              onChange={setAvatarFiles}
              maxFiles={1}
              maxSizeMB={5}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
