import "./teams-container-light.css";;
import * as AdaptiveCards from "adaptivecards";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function MSTeamsCard({
  object,
  isLoading,
}: { object: any, isLoading: boolean }) {
  const [cachedHtmlBuild, setCachedHtmlBuild] = useState<HTMLElement | undefined>();
  useEffect(() => {
    try {
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      adaptiveCard.parse(object);
      const renderedCard = adaptiveCard.render();
      setCachedHtmlBuild(renderedCard);
    } catch (e) {
      //do nothing
    }
  }, [object]);

  //format time like 2:36 PM
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="teams-frame">
      <div className="teams-hexagon-outer">
        <div className="teams-hexagon-inner">
          <div className="teams-bot-logo"></div>
        </div>
      </div>
      <div className="teams-inner-frame">
        <div className="teams-botNameAndTime">Test Bot {time}</div>
        <div className="cardHost teams-card">
          {isLoading ?
            <Loader2 className="animate-spin h-5 w-5" /> :
            <div dangerouslySetInnerHTML={{ __html: cachedHtmlBuild?.innerHTML ?? "" }}></div>
          }
        </div>
      </div>
    </div>
  );
}

export default MSTeamsCard;