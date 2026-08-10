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
    <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">
      {/* Foto profil */}
      <section
        aria-labelledby="avatar-heading"
        className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card"
      >
        <div className="flex items-center justify-between">
          <h2 id="avatar-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
            Foto Profil
          </h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600">
            Visual Avatar
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <Avatar
            name={profile.displayName}
            src={preview}
            className="h-20 w-20 shrink-0 border-2 border-white text-3xl shadow-md"
          />
          <div className="text-[13px] leading-relaxed text-slate-500">
            Tempel link gambar <span className="font-semibold text-slate-800">atau</span> upload file baru. Foto akan langsung diperbarui di etalase publik.
          </div>
        </div>

        <form action={avatarAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="avatarUrl">Link foto (URL HTTP/HTTPS)</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://.../foto.jpg"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 text-[14px] font-semibold text-slate-700 transition-all hover:bg-slate-100 active:scale-98">
              <ImagePlus className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              {preview && preview !== profile.avatar ? "Ganti file" : "Upload dari HP/Laptop"}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
            </label>
            <Button type="submit" disabled={savingAvatar} aria-busy={savingAvatar} className="shrink-0 h-12">
              <Camera className="h-4 w-4" aria-hidden="true" />
              Simpan Foto
            </Button>
          </div>

          {avatarState && "ok" in avatarState && avatarState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Foto profil berhasil diperbarui!
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
        <div className="flex items-center justify-between">
          <h2 id="profile-heading" className="text-[20px] font-extrabold tracking-tight text-slate-900">
            Informasi Etalase
          </h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
            Teks Publik
          </span>
        </div>

        <form action={profileAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Nama Tampilan</Label>
              <Input id="displayName" name="displayName" defaultValue={profile.displayName} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="handle">Handle (@username)</Label>
              <Input id="handle" name="handle" defaultValue={profile.handle} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Deskripsi / Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={profile.bio} placeholder="Deskripsi etalase Anda..." />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Link Profil Utama (TikTok/Shopee)</Label>
            <Input id="link" name="link" type="url" defaultValue={profile.link} />
          </div>

          {profileState && "ok" in profileState && profileState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Informasi profil berhasil disimpan!
            </p>
          )}
          {profileState && "error" in profileState && profileState.error && (
            <p className="text-[13px] font-medium text-rose-600" role="alert">
              {profileState.error}
            </p>
          )}

          <Button type="submit" disabled={savingProfile} aria-busy={savingProfile} className="h-12 font-semibold">
            {savingProfile ? "Menyimpan..." : "Simpan Perubahan Informasi"}
          </Button>
        </form>
      </section>
    </div>
  );
}
