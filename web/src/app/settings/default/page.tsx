'use client';

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-[#586e75]">Settings</h1>

      {/* Video Settings */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#586e75]">Video</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Default Quality</Label>
              <p className="text-sm text-[#586e75]/70">Choose preferred video quality for downloads</p>
            </div>
            <Select defaultValue="1080p">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2160p">4K</SelectItem>
                <SelectItem value="1440p">1440p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Auto Convert to MP4</Label>
              <p className="text-sm text-[#586e75]/70">Convert videos to MP4 format after download</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>

      {/* Audio Settings */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#586e75]">Audio</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Audio Format</Label>
              <p className="text-sm text-[#586e75]/70">Choose default audio format</p>
            </div>
            <Select defaultValue="mp3">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="m4a">M4A</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
                <SelectItem value="flac">FLAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Extract Audio from Video</Label>
              <p className="text-sm text-[#586e75]/70">Automatically extract audio when downloading videos</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>

      {/* Download Settings */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#586e75]">Download</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Download Method</Label>
              <p className="text-sm text-[#586e75]/70">Choose preferred download method</p>
            </div>
            <Select defaultValue="auto">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="chunk">Chunked</SelectItem>
                <SelectItem value="stream">Stream</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Concurrent Downloads</Label>
              <p className="text-sm text-[#586e75]/70">Maximum number of simultaneous downloads</p>
            </div>
            <Input type="number" className="w-32" defaultValue="3" min="1" max="10" />
          </div>
        </div>
      </section>

      {/* Instance Settings */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#586e75]">Instances</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-[#586e75] mb-2 block">Custom Instances</Label>
            <p className="text-sm text-[#586e75]/70 mb-4">Add your own Ottodon instances</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input placeholder="https://instance.example.com" className="flex-1" />
                <Button variant="ghost" size="icon" className="text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10]">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="w-full border border-dashed border-[#586e75]/20 text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
              >
                Add Instance
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Settings */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4 text-[#586e75]">Debug</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Enable Debug Mode</Label>
              <p className="text-sm text-[#586e75]/70">Show additional information for troubleshooting</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#586e75]">Verbose Logging</Label>
              <p className="text-sm text-[#586e75]/70">Enable detailed logging for debugging</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#586e75] text-white hover:bg-[#586e75]/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
} 