"use client";
import { Player } from "@remotion/player";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

function RequestFilm({blocked}:{blocked:boolean}){
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const end=blocked?625:875;
  const x=interpolate(frame,[0,1.1*fps,2.2*fps,3.3*fps],[125,375,625,end],{extrapolateRight:"clamp"});
  const stopped=blocked&&frame>=2.2*fps;
  const arrival=blocked?Math.min(2,Math.floor(frame/(1.1*fps))):Math.min(3,Math.floor(frame/(1.1*fps)));
  const pulse=interpolate(frame-arrival*1.1*fps,[0,16],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <svg width="100%" height="100%" viewBox="0 0 1000 56" fill="none" aria-hidden="true">
    <path d="M125 28H875" stroke="var(--hair)" strokeWidth="2"/>
    <path d={`M125 28H${x}`} stroke="var(--red-text)" strokeWidth="2.5"/>
    {[125,375,625,875].map((point,i)=><g key={point}>
      <circle cx={point} cy="28" r="12" fill="var(--paper)" stroke={point<=x?"var(--red-text)":"var(--hair)"} strokeWidth="2"/>
      {i===2?<path d="M620 28l4 4 7-9" stroke={point<=x?"var(--red-text)":"var(--muted)"} strokeWidth="2"/>:<circle cx={point} cy="28" r="3" fill={point<=x?"var(--red-text)":"var(--muted)"}/>}
    </g>)}
    <circle cx={x} cy="28" r={stopped?8:7} fill="var(--red-text)"/>
    <circle cx={125+arrival*250} cy="28" r={12+pulse*12} stroke="var(--red-text)" strokeWidth="1.5" opacity={(1-pulse)*.55}/>
    {stopped&&<path d="M621 24l8 8m0-8-8 8" stroke="var(--paper)" strokeWidth="2"/>}
  </svg>;
}

/** A silent, one-shot graphic, driven entirely by Remotion frames. */
export default function RequestJourney({blocked,run}:{blocked:boolean;run:number}){
  return <Player key={run} component={RequestFilm} inputProps={{blocked}} durationInFrames={100} fps={30} compositionWidth={1000} compositionHeight={56} autoPlay controls={false} loop={false} moveToBeginningWhenEnded={false} clickToPlay={false} doubleClickToFullscreen={false} style={{width:"100%",pointerEvents:"none"}} errorFallback={()=>null}/>;
}
