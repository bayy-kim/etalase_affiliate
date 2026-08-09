"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Camera, Check, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/avatar";
import { saveProfileAction, saveAvatarAction } from "@/server/actions/settings";
import type { Profile } from "@/lib/data";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [preview, setPreview] = useState<string | null>(profile.avatar);
  const [profileState, profileAction, savingProfile] = useActionState(saveProfileAction, { ok: false });
  const [avatarState, avatarAction, savingAvatar] = useActionState(saveAvatarAction, { ok: false });

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Foto profil */}
      <section
        aria-labelledby="avatar-heading"
        className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card"
      >
        <h2 id="avatar-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
          Foto Profil
        </h2>

        <div className="flex items-center gap-4">
          <Avatar
            name={profile.displayName}
            src={preview}
            className="h-20 w-20 shrink-0 border border-slate-200 text-3xl shadow-sm"
          />
          <div className="text-[13px] leading-relaxed text-slate-500">
            Tempel link gambar <span className="font-semibold text-slate-800">atau</span> upload dari
            perangkat. Disimpan ke Vercel Blob.
          </div>
        </div>

        <form action={avatarAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="avatarUrl">Link foto (URL)</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://.../foto.jpg"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 text-[14px] font-semibold text-slate-700 transition-colors hover:bg-slate-100">
              <ImagePlus className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              {preview && preview !== profile.avatar ? "Ganti file" : "Upload file"}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
            </label>
            <Button type="submit" disabled={savingAvatar} aria-busy={savingAvatar} className="shrink-0 h-11">
              <Camera className="h-4 w-4" aria-hidden="true" />
              Simpan Foto
            </Button>
          </div>

          {avatarState && "ok" in avatarState && avatarState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Foto profil tersimpan.
            </p>
          )}
          {avatarState && "error" in avatarState && avatarState.error && (
            <p className="text-[13px] font-medium text-rose-600" role="alert">
              {avatarState.error}
            </p>
          )}
        </form>
      </section>

      {/* Data profil */}
      <section
        aria-labelledby="profile-heading"
        className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card"
      >
        <h2 id="profile-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
          Informasi Etalase
        </h2>

        <form action={profileAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Nama</Label>
              <Input id="displayName" name="displayName" defaultValue={profile.displayName} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="handle">Handle</Label>
              <Input id="handle" name="handle" defaultValue={profile.handle} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Link Etalase</Label>
            <Input id="link" name="link" type="url" defaultValue={profile.link} />
          </div>

          {profileState && "ok" in profileState && profileState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Profil tersimpan.
            </p>
          )}
          {profileState && "error" in profileState && profileState.error && (
            <p className="text-[13px] font-medium text-rose-600" role="alert">
              {profileState.error}
            </p>
          )}

          <Button type="submit" disabled={savingProfile} aria-busy={savingProfile} className="h-11 font-semibold">
            {savingProfile ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </form>
      </section>
    </div>
  );
}
