"use client";import { useEffect, useRef, useState } from "react";import { Pause, Play } from "lucide-react";
// Decorative background video for the home hero. It starts only when the visitor hasn't asked for reduced motion or
// data saving, falls back to the poster if the file can't load, and has a pause control (WCAG 2.2.2).
export function HeroVideo({src,poster}:{src:string|null;poster:string}){const ref=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);const [failed,setFailed]=useState(false);
useEffect(()=>{const v=ref.current;if(!v)return;const fail=()=>setFailed(true);const source=v.querySelector("source");
// The server-rendered element may already have failed (missing file, unsupported format) before hydration, so check its
// state and listen directly rather than relying on React's onError.
if(v.error||v.networkState===HTMLMediaElement.NETWORK_NO_SOURCE){fail();return;}source?.addEventListener("error",fail);v.addEventListener("error",fail);
v.muted=true;const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;const saveData=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;if(!reduce&&!saveData)v.play().catch((e:unknown)=>{if((e as {name?:string})?.name==="NotSupportedError")fail();});
return()=>{source?.removeEventListener("error",fail);v.removeEventListener("error",fail);};},[src]);
const toggle=()=>{const v=ref.current;if(!v)return;if(v.paused)v.play().catch(()=>{});else v.pause();};
if(!src||failed)return <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover"/>;
return <><video ref={ref} poster={poster} muted loop playsInline preload="metadata" aria-hidden onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} className="absolute inset-0 h-full w-full object-cover"><source src={src}/></video><button type="button" onClick={toggle} aria-label={playing?"Pause background video":"Play background video"} className="absolute bottom-6 right-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-navy/50 text-white backdrop-blur transition hover:bg-navy/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{playing?<Pause size={18} aria-hidden/>:<Play size={18} aria-hidden/>}</button></>}
