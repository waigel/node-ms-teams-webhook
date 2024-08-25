import React from 'react'
import "./teams-container-light.css"

function MSTeamsCard({ innerRef }: { innerRef: React.RefObject<HTMLDivElement> }) {
    //format time like 2:36 PM
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return (
        <div className='teams-frame'>
            <div className="teams-hexagon-outer"><div className="teams-hexagon-inner"><div className="teams-bot-logo"></div></div></div>
            <div className="teams-inner-frame">
                <div className="teams-botNameAndTime">Test Bot    {time}</div>
                <div className="cardHost teams-card">
                    <div ref={innerRef}></div>
                </div>
            </div>
        </div>
    )
}

export default MSTeamsCard