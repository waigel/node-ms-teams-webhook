"use client";

import CodeEditor from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import * as AdaptiveCards from "adaptivecards";
import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MSTeamsCard from "../components/ms-teams-card";
import exampleMessageCard from "../data/example-message-card.json" assert {
  type: "json",
};
import _jsonSchema from "../schemas/adaptive-card.json" assert { type: "json" };
import { APIRequest } from "./api/use-object/api-request";
import { IAdaptiveCardSchema } from "./api/use-object/schema";

function Editor() {
  const { toast } = useToast();

  const { object, submit, isLoading, error, stop } = useObject<
    unknown,
    APIRequest
  >({
    api: "/api/use-object",
    schema: IAdaptiveCardSchema,
  });

  const [messageCardInput, setMessageCardInput] = useState<string>(
    JSON.stringify(exampleMessageCard, null, 2),
  );
  const [instroduction, setInstroduction] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      var adaptiveCard = new AdaptiveCards.AdaptiveCard();
      adaptiveCard.parse(object);
      var renderedCard = adaptiveCard.render();
      if (renderedCard && ref.current) {
        //set the inside the card ref
        ref.current?.setHTMLUnsafe(renderedCard.outerHTML);
      }
    } catch (e) {
      //do nothing
    }
  }, [object]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      JSON.parse(messageCardInput);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: e.message,
      });
      return;
    }
    submit({
      json: JSON.stringify(JSON.parse(messageCardInput)),
      instructions: instroduction,
    });
  }

  useEffect(() => {
    console.log(error);
    if (error) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "An error occurred",
      });
      stop();
    }
  }, [error, toast, stop]);

  return (
    <form action="#" onSubmit={handleSubmit}>
      <TabsContent value="edit" className="mt-0 border-0 p-0">
        <div className="flex flex-col space-y-4">
          <div className="grid h-full gap-6 lg:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-1 flex-col space-y-2">
                <Label htmlFor="input">Input</Label>
                <CodeEditor
                  value={messageCardInput}
                  onChange={(value) => setMessageCardInput(value ?? "")}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Add additional instructions (optional)"
                  value={instroduction}
                  onChange={(e) => setInstroduction(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-[21px] min-h-[400px] lg:min-h-[700px]">
              <Tabs defaultValue="preview" className="flex-1 h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="h-full">
                  <div className="rounded-md border bg-muted h-full">
                    <div className="p-8">
                      <MSTeamsCard innerRef={ref} />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="code" className="h-full">
                  <div className="rounded-md border bg-muted h-full">
                    <Textarea
                      //event if click inside the textarea, the text will be selected
                      onClick={(e) => {
                        e.currentTarget.select();
                        navigator.clipboard.writeText(e.currentTarget.value);
                        toast({
                          variant: "default",
                          title: "Copied",
                          description:
                            "The code has been copied to the clipboard",
                        });
                      }}
                      className="max-h-full min-h-full"
                      readOnly
                      defaultValue={
                        object
                          ? JSON.stringify(object, null, 2)
                          : "Please generate the AdaptiveCard first"
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  Generate AdaptiveCard
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              ) : (
                "Generate AdaptiveCard"
              )}
            </Button>
          </div>
        </div>
      </TabsContent>
    </form>
  );
}

export default Editor;
