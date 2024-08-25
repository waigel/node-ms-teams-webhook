import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { Metadata } from "next";
import Image from "next/image";
import Editor from "./editor";

export const metadata: Metadata = {
  title: "Adaptive Card Converter",
  description: "Convert MS MessageCard to AdaptiveCard with AI",
};

export default function Home() {
  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">AdaptiveCard</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <div className="space-x-2 md:flex"></div>
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="edit" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6">
              <Editor />
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
