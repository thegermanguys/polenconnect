"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Club, EventItem } from "@/lib/types";

// NOTE: this still edits nothing for real — "Save Changes" is a no-op, and
// there's no login system yet to know *which* club belongs to the visitor,
// so it just shows the first club as a preview of the layout. Once Clerk (or
// another auth provider) is wired up, swap `myClub`/`myEvents` for the
// signed-in owner's actual data and add a server action for the save button.
export function DashboardClient({ myClub, myEvents }: { myClub: Club; myEvents: EventItem[] }) {
  return (
    <div className="container py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border">
            <Image src={myClub.logo} alt={myClub.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{myClub.name}</h1>
            <p className="text-sm text-muted-foreground">Club Dashboard · {myClub.citySlug}</p>
          </div>
        </div>
        <Badge variant="green" className="w-fit">Live &amp; Approved</Badge>
      </div>

      <Tabs defaultValue="profile" className="mt-10">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Club details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Club name</Label>
                <Input defaultValue={myClub.name} />
              </div>
              <div className="space-y-2">
                <Label>Captain name</Label>
                <Input defaultValue={myClub.captainName} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={myClub.phone} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={myClub.email} />
              </div>
              <div className="space-y-2">
                <Label>Practice location</Label>
                <Input defaultValue={myClub.practiceLocation} />
              </div>
              <div className="space-y-2">
                <Label>Practice time</Label>
                <Input defaultValue={myClub.practiceTime} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea defaultValue={myClub.description} rows={4} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-border">
                  <Image src={myClub.logo} alt="logo" fill className="object-cover" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" /> Upload New Logo
                </Button>
              </div>
              <Button className="sm:col-span-2 w-fit">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={myClub.coverImage} alt="cover" fill className="object-cover" />
                </div>
                <button className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">Upload photo</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <div className="mb-4 flex justify-end">
            <Button size="sm"><Plus className="h-4 w-4" /> New Event</Button>
          </div>
          <div className="space-y-3">
            {myEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
