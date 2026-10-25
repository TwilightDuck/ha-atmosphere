var kt=Object.create;var pt=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var zt=Object.getOwnPropertyNames;var St=Object.getPrototypeOf,Dt=Object.prototype.hasOwnProperty;var Lt=(s,t)=>()=>(t||s((t={exports:{}}).exports,t),t.exports);var Ct=(s,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of zt(t))!Dt.call(s,a)&&a!==e&&pt(s,a,{get:()=>t[a],enumerable:!(i=Mt(t,a))||i.enumerable});return s};var Tt=(s,t,e)=>(e=s!=null?kt(St(s)):{},Ct(t||!s||!s.__esModule?pt(e,"default",{value:s,enumerable:!0}):e,s));var ht=Lt((ct,nt)=>{(function(){"use strict";var s=Math.PI,t=Math.sin,e=Math.cos,i=Math.tan,a=Math.asin,n=Math.atan2,p=Math.acos,d=s/180,h=1e3*60*60*24,w=2440588,o=2451545;function y(r){return r.valueOf()/h-.5+w}function g(r){return new Date((r+.5-w)*h)}function v(r){return y(r)-o}var E=d*23.4397;function x(r,c){return n(t(r)*e(E)-i(c)*t(E),e(r))}function R(r,c){return a(t(c)*e(E)+e(c)*t(E)*t(r))}function P(r,c,u){return n(t(r),e(r)*t(c)-i(u)*e(c))}function M(r,c,u){return a(t(c)*t(u)+e(c)*e(u)*e(r))}function _(r,c){return d*(280.16+360.9856235*r)-c}function A(r){return r<0&&(r=0),2967e-7/Math.tan(r+.00312536/(r+.08901179))}function K(r){return d*(357.5291+.98560028*r)}function l(r){var c=d*(1.9148*t(r)+.02*t(2*r)+3e-4*t(3*r)),u=d*102.9372;return r+c+u+s}function U(r){var c=K(r),u=l(c);return{dec:R(u,0),ra:x(u,0)}}var S={};S.getPosition=function(r,c,u){var z=d*-u,b=d*c,D=v(r),$=U(D),L=_(D,z)-$.ra;return{azimuth:P(L,b,$.dec),altitude:M(L,b,$.dec)}};var f=S.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];S.addTime=function(r,c,u){f.push([r,c,u])};var j=9e-4;function yt(r,c){return Math.round(r-j-c/(2*s))}function st(r,c,u){return j+(r+c)/(2*s)+u}function lt(r,c,u){return o+r+.0053*t(c)-.0069*t(2*u)}function vt(r,c,u){return p((t(r)-t(c)*t(u))/(e(c)*e(u)))}function _t(r){return-2.076*Math.sqrt(r)/60}function $t(r,c,u,z,b,D,$){var L=vt(r,u,z),q=st(L,c,b);return lt(q,D,$)}S.getTimes=function(r,c,u,z){z=z||0;var b=d*-u,D=d*c,$=_t(z),L=v(r),q=yt(L,b),I=st(0,b,q),H=K(I),V=l(H),J=R(V,0),N=lt(I,H,V),Z,Y,B,F,O,Q,W={solarNoon:g(N),nadir:g(N-.5)};for(Z=0,Y=f.length;Z<Y;Z+=1)B=f[Z],F=(B[0]+$)*d,O=$t(F,b,D,J,q,H,V),Q=N-(O-N),W[B[1]]=g(Q),W[B[2]]=g(O);return W};function dt(r){var c=d*(218.316+13.176396*r),u=d*(134.963+13.064993*r),z=d*(93.272+13.22935*r),b=c+d*6.289*t(u),D=d*5.128*t(z),$=385001-20905*e(u);return{ra:x(b,D),dec:R(b,D),dist:$}}S.getMoonPosition=function(r,c,u){var z=d*-u,b=d*c,D=v(r),$=dt(D),L=_(D,z)-$.ra,q=M(L,b,$.dec),I=n(t(L),i(b)*e($.dec)-t($.dec)*e(L));return q=q+A(q),{azimuth:P(L,b,$.dec),altitude:q,distance:$.dist,parallacticAngle:I}},S.getMoonIllumination=function(r){var c=v(r||new Date),u=U(c),z=dt(c),b=149598e3,D=p(t(u.dec)*t(z.dec)+e(u.dec)*e(z.dec)*e(u.ra-z.ra)),$=n(b*t(D),z.dist-b*e(D)),L=n(e(u.dec)*t(u.ra-z.ra),t(u.dec)*e(z.dec)-e(u.dec)*t(z.dec)*e(u.ra-z.ra));return{fraction:(1+e($))/2,phase:.5+.5*$*(L<0?-1:1)/Math.PI,angle:L}};function tt(r,c){return new Date(r.valueOf()+c*h/24)}S.getMoonTimes=function(r,c,u,z){var b=new Date(r);z?b.setUTCHours(0,0,0,0):b.setHours(0,0,0,0);for(var D=.133*d,$=S.getMoonPosition(b,c,u).altitude-D,L,q,I,H,V,J,N,Z,Y,B,F,O,Q,W=1;W<=24&&(L=S.getMoonPosition(tt(b,W),c,u).altitude-D,q=S.getMoonPosition(tt(b,W+1),c,u).altitude-D,V=($+q)/2-L,J=(q-$)/2,N=-J/(2*V),Z=(V*N+J)*N+L,Y=J*J-4*V*L,B=0,Y>=0&&(Q=Math.sqrt(Y)/(Math.abs(V)*2),F=N-Q,O=N+Q,Math.abs(F)<=1&&B++,Math.abs(O)<=1&&B++,F<-1&&(F=O)),B===1?$<0?I=W+F:H=W+F:B===2&&(I=W+(Z<0?O:F),H=W+(Z<0?F:O)),!(I&&H));W+=2)$=q;var et={};return I&&(et.rise=tt(b,I)),H&&(et.set=tt(b,H)),!I&&!H&&(et[Z>0?"alwaysUp":"alwaysDown"]=!0),et},typeof ct=="object"&&typeof nt<"u"?nt.exports=S:typeof define=="function"&&define.amd?define(S):window.SunCalc=S})()});var X=Tt(ht(),1);var ut=`:host {
  display: block;
  container-type: inline-size;
  color: #fff;
  --glass: rgba(24, 67, 113, 0.36);
  --muted: #c2d8ec;
  --line: rgba(238, 247, 255, 0.19);
  --radius: 22px;
  font-family:
    -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
* {
  box-sizing: border-box;
}
ha-card {
  display: block;
  border: 0;
  background: transparent;
  border-radius: 26px;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 20px 70px #0b203729;
}
button,
a,
input {
  -webkit-tap-highlight-color: transparent;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid #c0e9ff;
  outline-offset: 4px;
}
button {
  border: 0;
}
button:disabled {
  cursor: default;
}
button:active {
  filter: brightness(1.08);
}
a {
  color: #c4eaff;
  text-underline-offset: 4px;
}
h1,
h2,
h3,
p {
  margin: 0;
}
button h2 {
  text-align: left;
}
.atmosphere {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 0;
  background: #3674a9;
}
.sky {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(
    155deg,
    #14568c 0%,
    #367bb1 32%,
    #759fc3 65%,
    #b0c6d8 100%
  );
  transition: background 1.5s;
}
.sky:after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(15, 51, 85, 0.1), transparent 60%);
}
.sun-orb {
  position: absolute;
  top: -80px;
  left: 68%;
  width: 340px;
  height: 340px;
  background: radial-gradient(
    circle,
    #fffcece6 0,
    #fffbeaa6 4%,
    #ffffe33d 18%,
    #f5f8eb17 40%,
    transparent 68%
  );
  filter: blur(6px);
  transform: translateX(-50%);
}
.rays {
  position: absolute;
  left: 25%;
  top: -230px;
  width: 120%;
  height: 850px;
  opacity: 0.2;
  transform: rotate(20deg);
  background: conic-gradient(
    from 130deg at 38% 0,
    transparent 0deg,
    #fffae7 8deg,
    transparent 14deg,
    #fdfbe9 16deg,
    transparent 23deg,
    #fff6de 29deg,
    transparent 36deg
  );
  filter: blur(12px);
}
.clouds {
  position: absolute;
  width: 145%;
  height: 750px;
  left: -20%;
  top: -180px;
  background-image: url("data:image/svg+xml,CLOUD_TEXTURE");
  background-size: 100% 100%;
  opacity: 0.5;

  will-change: transform;
}
.clouds.near {
  top: 60px;
  left: -25%;
  width: 160%;
  height: 800px;
  opacity: 0.24;

  transform: scaleX(-1);
}
.horizon {
  position: absolute;
  bottom: -30%;
  left: -25%;
  width: 150%;
  height: 65%;
  background: radial-gradient(
    ellipse,
    rgba(203, 223, 239, 0.25),
    transparent 65%
  );
}
.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 8% 8%, white 70%, transparent),
    radial-gradient(1px 1px at 20% 15%, white 70%, transparent),
    radial-gradient(1px 1px at 65% 11%, white 70%, transparent),
    radial-gradient(1px 1px at 92% 21%, white 70%, transparent),
    radial-gradient(1.5px 1.5px at 77% 5%, white 70%, transparent),
    radial-gradient(1px 1px at 40% 6%, white 70%, transparent);
  opacity: 0;
}
.precipitation {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  opacity: 0.75;
}
.paused .clouds {
  animation-play-state: paused;
}
.atmosphere[data-condition="sunny"] .clouds {
  opacity: 0.21;
}
.atmosphere[data-condition="sunny"] .sky {
  background: linear-gradient(160deg, #176db5, #4c99cd 50%, #b3d7e8);
}
.atmosphere[data-condition="cloudy"] .sun-orb {
  opacity: 0.55;
}
.atmosphere[data-condition="cloudy"] .clouds {
  opacity: 0.65;
}
.atmosphere[data-condition="cloudy"] .sky {
  background: linear-gradient(155deg, #3a657f, #7796ad 60%, #a5b9c8);
}
.atmosphere[data-condition*="rain"] .sky,
.atmosphere[data-condition="pouring"] .sky,
.atmosphere[data-condition*="lightning"] .sky {
  background: linear-gradient(145deg, #263b59, #4e6c86 55%, #8da3b5);
}
.atmosphere[data-condition*="rain"] .sun-orb,
.atmosphere[data-condition*="lightning"] .sun-orb {
  opacity: 0;
}
.atmosphere[data-condition*="snow"] .sky {
  background: linear-gradient(155deg, #687d96, #91a9bd 55%, #b9c8d7);
}
.atmosphere[data-condition="fog"] .sky {
  background: linear-gradient(155deg, #7f929f, #9fadb8 60%, #b7c4cc);
}
.atmosphere[data-night="true"] .sky {
  background: linear-gradient(155deg, #09152f, #183453 55%, #41566d);
}
.atmosphere[data-night="true"] .sun-orb {
  background: radial-gradient(
    circle,
    #edf3ff 0,
    #c1d2f5c9 4%,
    #afbfe329 7%,
    transparent 42%
  );
  width: 200px;
  height: 200px;
  top: 0;
  left: 78%;
  filter: blur(1px);
}
.atmosphere[data-night="true"] .rays {
  opacity: 0;
}
.atmosphere[data-night="true"] .stars {
  opacity: 0.7;
}
.atmosphere[data-night="true"] .clouds {
  opacity: 0.17;
}
.atmosphere[data-night="true"] {
  --glass: rgba(18, 38, 65, 0.5);
}
.body {
  max-width: 1210px;
  margin: auto;
  padding: 24px 42px 20px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
  color: #e7f0fa;
}
.location-pin {
  font-size: 22px;
  line-height: 1;
}
.motion {
  margin-left: auto;
  background: rgba(30, 71, 110, 0.2);
  border: 1px solid #d1e4f52b;
  backdrop-filter: blur(12px);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  font-size: 14px;
}
.hero {
  text-align: center;
  padding: 48px 0 47px;
  text-shadow: 0 2px 18px #224d6d22;
}
.hero h1 {
  font-size: 37px;
  letter-spacing: -1px;
  font-weight: 400;
  line-height: 1.15;
}
.temperature {
  font-size: 108px;
  font-weight: 200;
  letter-spacing: -7px;
  line-height: 1.1;
  padding-right: 0;
  margin: 0 0 0 12px;
}
.condition {
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 7px;
  letter-spacing: -0.35px;
}
.hero-range {
  font-size: 16px;
  font-weight: 500;
}
.hero-range span {
  padding: 0 9px;
  opacity: 0.65;
}
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}
.panel {
  display: block;
  min-width: 0;
  position: relative;
  overflow: hidden;
  text-align: left;
  color: white;
  background: var(--glass);
  border-radius: var(--radius);
  border: 1px solid #e0effb12;
  padding: 19px 20px;
  box-shadow: inset 0 1px 0 #ffffff06;
  backdrop-filter: blur(22px) saturate(1.15);
  -webkit-backdrop-filter: blur(22px) saturate(1.15);
}
button.panel {
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}
button.panel:hover {
  background: rgba(21, 62, 105, 0.47);
  box-shadow: inset 0 1px 0 #ffffff18;
}
h2 {
  font-size: 14px;
  font-weight: 550;
  color: #dfedf8;
  display: flex;
  gap: 7px;
  align-items: center;
  line-height: 1.3;
  letter-spacing: -0.1px;
}
h2 > span:first-child {
  opacity: 0.72;
  font-size: 17px;
  font-weight: 400;
  line-height: 1;
}
.chevron {
  margin-left: auto;
  font-size: 20px !important;
  opacity: 0.4 !important;
  line-height: 1 !important;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.warning {
  grid-column: span 5;
  min-height: 179px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.warning.has-warning {
  justify-content: flex-start;
}
.warning h2 {
  margin-bottom: 15px;
}
.warning-title {
  font-size: 22px;
  font-weight: 550;
  letter-spacing: -0.4px;
  line-height: 1.2;
}
.has-warning .warning-title {
  font-size: 23px;
}
.warning-line {
  font-size: 13px;
  color: #d6e7f7;
  margin-top: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.severity-dot {
  display: inline-block;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f9d367;
  box-shadow: 0 0 9px #f9d36733;
}
.level-2 .severity-dot {
  background: #ffab5a;
}
.level-3 .severity-dot {
  background: #ff766e;
}
.warning-preview {
  font-size: 13px;
  line-height: 1.45;
  margin-top: 12px;
  opacity: 0.88;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.warning-count {
  position: absolute;
  right: 18px;
  bottom: 12px;
  font-size: 12px;
  opacity: 0.7;
}
.hourly {
  grid-column: span 7;
  padding-bottom: 13px;
}
.segmented {
  display: flex;
  background: #ffffff0d;
  border-radius: 20px;
  padding: 3px;
  gap: 3px;
}
.segmented button {
  background: transparent;
  color: #daeafb;
  border-radius: 20px;
  width: 31px;
  height: 27px;
  display: grid;
  place-items: center;
  font-size: 19px;
  padding: 0;
}
.segmented button[aria-pressed="true"] {
  background: #d4e9fa42;
  color: #fff;
}
.hours {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  margin: 17px -20px 0;
  padding: 0 20px 3px;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
}
.hours::-webkit-scrollbar {
  display: none;
}
.hour {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 0 0 43px;
  background: transparent;
  padding: 2px 0;
  color: white;
  scroll-snap-align: start;
}
.hour > span:first-child {
  font-size: 13px;
  font-weight: 550;
}
.weather-icon {
  display: block;
  overflow: visible;
  flex-shrink: 0;
}
.hour .weather-icon {
  margin-top: 5px;
  margin-bottom: 0;
  filter: drop-shadow(0 2px 2px #17456715);
}
.hour .chance {
  color: #a8e2ff;
  font-size: 10px;
  min-height: 13px;
}
.hour strong {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}
.hour small {
  font-size: 10px;
  opacity: 0.7;
}
.daily {
  grid-column: span 5;
  align-self: stretch;
  padding-bottom: 7px;
}
.daily h2 {
  padding-bottom: 6px;
}
.day {
  display: grid;
  grid-template-columns: 64px 33px 29px 1fr 30px;
  gap: 9px;
  align-items: center;
  width: 100%;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  font-size: 18px;
  min-height: 70px;
}
.day:last-child {
  border: 0;
}
.day-name {
  font-size: 16px;
  font-weight: 550;
}
.day-condition {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.day-condition small {
  color: #abe2fa;
  font-size: 10px;
  line-height: 1;
}
.low {
  color: #c4dcef;
  text-align: right;
}
.high {
  text-align: right;
  font-weight: 600;
}
.range {
  height: 5px;
  background: #143b6236;
  border-radius: 8px;
  position: relative;
  display: block;
}
.range > span {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #7bd5d7, #d9dfa1);
  border-radius: 8px;
  min-width: 3px;
}
.range > i {
  position: absolute;
  top: -1px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: white;
  border: 1.5px solid #407da9;
  transform: translateX(-50%);
}
.metrics {
  grid-column: span 7;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.metrics .panel {
  min-height: 151px;
  padding: 17px 18px 14px;
}
.metric-value {
  font-size: 43px;
  line-height: 1.15;
  font-weight: 400;
  letter-spacing: -1.8px;
  margin-top: 10px;
}
.unit {
  display: inline-block;
  font-size: 15px;
  font-weight: 450;
  letter-spacing: 0;
  padding-left: 5px;
  opacity: 0.85;
}
.metric-note {
  font-size: 13px;
  line-height: 1.5;
  margin-top: 2px;
  color: #dfedf8;
}
.feels-line {
  height: 5px;
  border-radius: 5px;
  margin: 20px 0 7px;
  background: linear-gradient(90deg, #81c7df, #afdfc2, #e9dda4);
  position: relative;
}
.feels-line:after {
  content: "";
  height: 12px;
  width: 2px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: -3px;
}
.feels-line span {
  position: absolute;
  background: white;
  width: 9px;
  height: 9px;
  border: 2px solid #97d5d0;
  border-radius: 50%;
  top: -2px;
}
.sun-arc {
  display: block;
  width: 100%;
  height: 57px;
  margin: 0 -1px -12px;
  overflow: visible;
}
.sun-note {
  position: relative;
  padding-top: 0;
}
.aq-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.aq-category {
  font-size: 17px;
  font-weight: 500;
}
.spectrum {
  height: 5px;
  border-radius: 20px;
  position: relative;
  margin: 18px 0 10px;
}
.spectrum.aqi {
  background: linear-gradient(
    90deg,
    #76d2ef,
    #63d7b2,
    #d2dc69,
    #e9c168,
    #f08474,
    #cd80bc
  );
}
.spectrum.uv {
  background: linear-gradient(
    90deg,
    #6bd4c6,
    #d2df83,
    #ecc876,
    #e38d83,
    #b98fb8
  );
  margin-top: 17px;
}
.spectrum i {
  position: absolute;
  top: -2px;
  border: 2px solid #d6e9f4;
  background: white;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  transform: translateX(-50%);
}
.wind-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-top: 9px;
}
.wind-layout .metric-value {
  margin-top: 0;
}
.wind-layout .unit {
  display: block;
  padding: 0;
  font-size: 12px;
}
.wind-layout .metric-note {
  font-size: 11px;
  margin-top: 5px;
  white-space: nowrap;
}
.compass {
  position: relative;
  border-radius: 50%;
  height: 94px;
  width: 94px;
  flex: 0 0 94px;
  background: repeating-conic-gradient(
    from 0deg,
    #f3f9ff42 0deg 1deg,
    transparent 1deg 6deg
  );
  border: 6px solid transparent;
  background-clip: padding-box;
}
.compass:before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #44759c;
}
.compass span {
  position: absolute;
  font-size: 10px;
  color: #e7f0f8;
  line-height: 10px;
  z-index: 1;
}
.north {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.south {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.west {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.east {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.compass b {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 600;
  z-index: 2;
}
.needle {
  position: absolute;
  width: 2px;
  height: 62px;
  left: 40px;
  top: 10px;
  background: linear-gradient(
    0deg,
    #cfdeeb55 0 30%,
    transparent 30% 70%,
    #e7f5ff 70%
  );
  transform-origin: center;
}
.needle:after {
  content: "";
  position: absolute;
  left: -3px;
  top: -1px;
  border: 4px solid transparent;
  border-bottom: 7px solid #eef9ff;
  border-top: 0;
}
.mini-rain {
  display: flex;
  gap: 4px;
  height: 33px;
  align-items: flex-end;
  margin: 4px 0 0;
}
.mini-rain i {
  background: #a5d7ec;
  border-radius: 2px;
  width: 5px;
  max-height: 33px;
}
.radar-panel {
  grid-column: span 7;
}
.text-button {
  background: none;
  padding: 0;
  font-size: 12px;
  color: #e4f2ff;
}
.rain-outlook {
  padding: 17px 0 3px;
  background: none;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  font-size: 15px;
  line-height: 1.4;
  width: 100%;
}
.rain-chart {
  height: 64px;
  margin-top: 9px;
}
.rain-chart svg {
  width: 100%;
  height: 100%;
}
.chart-times {
  display: flex;
  justify-content: space-between;
  color: #ccdfed;
  font-size: 10px;
  margin-top: 7px;
}
.moon-panel {
  grid-column: span 5;
}
.moon-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.moon {
  display: block;
  width: 110px;
  height: 110px;
  filter: drop-shadow(0 0 12px #d2e7ff11);
  flex: 0 0 110px;
}
.moon-phase {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.3px;
}
.moon-date {
  font-size: 17px;
  margin-top: 16px;
}
.moon-date span {
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 3px;
}
.small-metrics {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.small-metrics .panel {
  min-height: 129px;
}
.small-value {
  font-size: 35px;
  font-weight: 400;
  letter-spacing: -1px;
  margin-top: 13px;
}
.small-value span {
  font-size: 17px;
  margin-left: 5px;
  letter-spacing: 0;
}
.pressure-scale {
  position: relative;
  height: 1px;
  background: #ffffff30;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.pressure-scale span {
  font-size: 9px;
  transform: translateY(5px);
  opacity: 0.7;
}
.pressure-scale i {
  position: absolute;
  width: 4px;
  height: 10px;
  top: -4px;
  background: #e6f7ff;
  border-radius: 2px;
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  font-size: 10px;
  line-height: 1.5;
  color: #e6eff8b3;
  margin: 20px 2px 0;
}
footer button {
  font: inherit;
  background: none;
  padding: 5px 0;
  color: inherit;
}
.connection-status {
  background: #725c35b0;
  backdrop-filter: blur(10px);
  border: 1px solid #ffe1a740;
  border-radius: 12px;
  font-size: 13px;
  padding: 13px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.connection-status button {
  margin-left: auto;
  background: none;
  text-decoration: underline;
}
.empty {
  min-height: 300px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 20px;
}
.empty button {
  background: #ffffff20;
  border-radius: 20px;
  padding: 9px 20px;
}
.no-data {
  color: var(--muted);
}
dialog {
  position: fixed;
  color: #f6faff;
  background: linear-gradient(145deg, #244e72f5, #18324efc);
  border: 1px solid #d6ecff2b;
  border-radius: 26px;
  padding: 0;
  width: min(610px, calc(100vw - 28px));
  max-height: min(88dvh, 1000px);
  box-shadow: 0 25px 100px #07172f77;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  font-family: inherit;
  overscroll-behavior: contain;
}
dialog::backdrop {
  background: #07162a65;
  backdrop-filter: blur(7px);
}
.dialog-inner {
  padding: 26px;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.dialog-header h2 {
  font-size: 23px;
  font-weight: 550;
  letter-spacing: -0.5px;
  color: white;
}
.close {
  font-size: 26px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e6f1ff16;
  font-weight: 300;
  display: grid;
  place-items: center;
  padding: 0;
}
.dialog-inner p {
  font-size: 15px;
  line-height: 1.65;
  color: #e0ecf7;
  margin: 15px 0;
  white-space: pre-line;
}
.dialog-inner a {
  font-size: 13px;
}
.detail-temperature {
  font-size: 68px;
  font-weight: 250;
  letter-spacing: -2px;
  margin: 10px 0;
}
.detail-temperature span {
  font-size: 25px;
  letter-spacing: -0.5px;
}
.detail-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.detail-weather .detail-temperature {
  margin-bottom: 0;
}
.detail-weather p {
  margin-top: 0;
}
.detail-stats {
  margin: 22px 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 22px;
}
.detail-stats > div {
  border-top: 1px solid #ffffff20;
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.detail-stats dt {
  color: #c3d8e9;
  font-size: 13px;
}
.detail-stats dd {
  font-size: 20px;
  margin: 0;
  font-weight: 500;
}
.detail-chart {
  margin: 25px 0 15px;
}
.detail-chart svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.detail-chart .chart-times {
  font-size: 12px;
}
.detail-moon {
  margin: 10px auto 24px;
  width: 210px;
  height: 210px;
}
.warning-detail {
  padding: 22px 0;
  border-top: 1px solid #e6eff82b;
}
.warning-detail h3 {
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 9px;
}
.warning-dates {
  font-size: 13px !important;
  color: #bed4e7 !important;
}
.map-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.map-switch button,
.full-button {
  background: #d9edff1c;
  border: 1px solid #d9edff1a;
  border-radius: 20px;
  padding: 10px 18px;
  font-size: 14px;
}
.full-button {
  margin-top: 15px;
}
.map-host iframe {
  width: 100%;
  height: 440px;
  border: 0;
  border-radius: 14px;
  margin-top: 20px;
}
.map-host > a {
  display: block;
  margin-top: 8px;
}
.error {
  color: #ffd3a4 !important;
}
.dialog-inner > .sun-arc {
  height: 150px;
  margin: 30px auto 20px;
}
@keyframes cloud-drift {
  from {
    transform: translateX(-4%) scale(1.03);
  }
  to {
    transform: translateX(8%) scale(1.13);
  }
}
@media (prefers-reduced-motion: reduce) {
  .clouds {
    animation: none !important;
  }
  button.panel {
    transition: none;
  }
  .sky {
    transition: none;
  }
}
@container (max-width:850px) {
  .body {
    padding: 20px 24px 18px;
  }
  .hero {
    padding-top: 32px;
    padding-bottom: 36px;
  }
  .hero h1 {
    font-size: 32px;
  }
  .temperature {
    font-size: 94px;
  }
  .forecast-grid {
    gap: 12px;
  }
  .panel {
    padding: 17px 16px;
    --radius: 19px;
  }
  .warning {
    grid-column: span 12;
    min-height: 115px;
  }
  .warning.has-warning {
    min-height: 150px;
  }
  .warning h2 {
    margin-bottom: 10px;
  }
  .warning-preview {
    -webkit-line-clamp: 1;
  }
  .hourly {
    grid-column: span 12;
  }
  .hours {
    gap: 24px;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .daily {
    grid-column: span 6;
  }
  .metrics {
    grid-column: span 6;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .metrics .panel {
    min-height: 115px;
  }
  .metrics .panel:nth-child(3),
  .metrics .panel:nth-child(5),
  .metrics .panel:nth-child(6) {
    grid-column: auto;
  }
  .daily {
    grid-row: span 1;
  }
  .day {
    grid-template-columns: 68px 26px 27px 1fr 28px;
    gap: 6px;
    padding: 17px 0;
    min-height: 79px;
  }
  .metric-value {
    font-size: 35px;
  }
  .sun-arc {
    height: 42px;
  }
  .radar-panel {
    grid-column: span 6;
  }
  .moon-panel {
    grid-column: span 6;
  }
  .moon {
    width: 90px;
    height: 90px;
    flex-basis: 90px;
  }
  .moon-layout {
    flex-wrap: wrap;
  }
  .moon-phase {
    font-size: 17px;
  }
  .small-metrics {
    gap: 12px;
  }
  .small-metrics .panel {
    padding: 16px 14px;
  }
  .small-metrics h2 {
    font-size: 12px;
    gap: 5px;
  }
  .small-metrics .metric-note {
    font-size: 11px;
  }
  .small-value {
    font-size: 29px;
  }
  .small-value span {
    font-size: 13px;
  }
  .aq-category {
    font-size: 14px;
  }
  .wind-layout {
    margin-top: 4px;
  }
  .compass {
    height: 84px;
    width: 84px;
    flex-basis: 84px;
  }
  .needle {
    left: 35px;
    top: 5px;
  }
}
@container (max-width:540px) {
  .body {
    padding: 14px 14px 16px;
  }
  .toolbar {
    font-size: 12px;
  }
  .hero {
    padding: 26px 0 31px;
  }
  .hero h1 {
    font-size: 30px;
  }
  .temperature {
    font-size: 98px;
    letter-spacing: -6px;
    line-height: 1.08;
  }
  .condition {
    font-size: 20px;
  }
  .hero-range {
    font-size: 14px;
  }
  .forecast-grid {
    gap: 12px;
  }
  .warning,
  .hourly,
  .daily,
  .metrics,
  .radar-panel,
  .moon-panel {
    grid-column: 1/-1;
  }
  .warning {
    min-height: 112px;
  }
  .has-warning .warning-title {
    font-size: 21px;
  }
  .warning-preview {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }
  .warning-line {
    font-size: 12px;
  }
  .hours {
    gap: 15px;
    margin-top: 15px;
  }
  .panel-header h2 {
    font-size: 13px;
  }
  .day {
    grid-template-columns: 70px 34px 32px 1fr 32px;
    gap: 10px;
    min-height: 61px;
    padding: 10px 0;
    font-size: 17px;
  }
  .day-name {
    font-size: 15px;
  }
  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .metrics .panel {
    min-height: 155px;
    padding: 16px 14px 14px;
  }
  .metrics h2 {
    font-size: 12px;
  }
  .metric-value {
    font-size: 39px;
    letter-spacing: -1.5px;
  }
  .metric-note {
    font-size: 12px;
  }
  .wind-layout .metric-value {
    font-size: 30px;
  }
  .wind-layout .unit {
    font-size: 11px;
  }
  .wind-layout .metric-note {
    font-size: 10px;
    white-space: normal;
  }
  .compass {
    height: 76px;
    width: 76px;
    flex: 0 0 76px;
    border-width: 4px;
  }
  .needle {
    left: 33px;
    top: 6px;
    height: 55px;
  }
  .compass span {
    font-size: 9px;
  }
  .compass b {
    font-size: 11px;
  }
  .sun-arc {
    height: 53px;
    margin-bottom: -7px;
  }
  .spectrum {
    margin-top: 16px;
  }
  .moon-layout {
    flex-wrap: nowrap;
  }
  .moon {
    width: 120px;
    height: 120px;
    flex-basis: 120px;
  }
  .moon-phase {
    font-size: 21px;
  }
  .moon-date {
    margin-top: 19px;
  }
  .moon-panel {
    min-height: 195px;
  }
  .small-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .small-metrics .panel:last-child {
    grid-column: 1/-1;
    min-height: 115px;
  }
  .small-metrics h2 {
    font-size: 12px;
  }
  .small-metrics .panel:last-child .small-value {
    font-size: 35px;
  }
  .connection-status {
    font-size: 12px;
    flex-wrap: wrap;
  }
  footer {
    font-size: 9px;
    gap: 6px;
  }
  .motion {
    height: 30px;
    width: 30px;
  }
  .radar-panel {
    padding-bottom: 18px;
  }
  .rain-outlook {
    font-size: 14px;
  }
  h2 {
    font-size: 13px;
  }
}
@container (max-width:340px) {
  .body {
    padding: 10px;
  }
  .metrics .panel {
    padding: 14px 11px;
  }
  .compass {
    height: 64px;
    width: 64px;
    flex-basis: 64px;
  }
  .needle {
    left: 27px;
    top: 4px;
    height: 47px;
  }
  .wind-layout .metric-value {
    font-size: 27px;
  }
  .day {
    gap: 6px;
    grid-template-columns: 61px 29px 30px 1fr 30px;
  }
  .segmented button {
    width: 26px;
  }
  .panel-header h2 {
    font-size: 12px;
  }
}

[hidden] {
  display: none !important;
}
.location-pin {
  border: 1px solid #d1e4f52b;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  background: #ffffff10;
  display: grid;
  place-items: center;
  color: #eaf7ff;
  flex: 0 0 34px;
  padding: 0;
}
.location-pin.selected {
  background: #b4e3ff45;
}
.home-location {
  background: none;
  font-size: 24px;
  padding: 0 4px;
}
.location-status {
  font-size: 13px;
  line-height: 1.5;
  padding: 10px 0 16px;
}
.location-status button {
  margin-left: 12px;
  background: #ffffff15;
  border-radius: 20px;
  padding: 6px 12px;
}
.location-note {
  font-size: 11px;
  color: #dbe9f4;
  text-align: center;
  margin: -20px 0 22px;
}
.tracker-choice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 15px 0;
  border-top: 1px solid #ffffff25;
  background: none;
  text-align: left;
}
.tracker-choice span {
  font-size: 12px;
  color: #b8cfe3;
}
.tracker-choice:disabled {
  opacity: 0.4;
}
@container (max-width:300px) {
  .toolbar {
    gap: 4px;
  }
  .hero-range {
    font-size: 12px;
  }
  .condition {
    font-size: 17px;
  }
  .hero h1 {
    font-size: 26px;
  }
  .temperature {
    font-size: 80px;
  }
  .panel {
    padding: 14px 11px;
  }
  .day {
    grid-template-columns: minmax(39px, 1fr) 22px 25px minmax(18px, 1fr) 25px;
    gap: 4px;
    font-size: 14px;
  }
  .day-name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .metrics {
    grid-template-columns: 1fr;
  }
  .metrics .panel {
    min-height: 125px;
  }
  .small-metrics {
    grid-template-columns: 1fr;
  }
  .small-metrics .panel:last-child {
    grid-column: auto;
  }
  .hour {
    flex-basis: 38px;
  }
  .panel-header {
    flex-wrap: wrap;
  }
  .warning-title,
  .has-warning .warning-title {
    font-size: 19px;
  }
  .warning-line {
    font-size: 11px;
  }
  .moon {
    width: 80px;
    height: 80px;
    flex-basis: 80px;
  }
  .moon-phase {
    font-size: 17px;
  }
  .moon-date {
    font-size: 15px;
  }
  .sun-arc {
    height: 40px;
  }
  footer {
    flex-wrap: wrap;
  }
}

.metrics[data-count="1"],
.small-metrics[data-count="1"] {
  grid-template-columns: minmax(0, 1fr);
}
.small-metrics[data-count="2"] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@container (max-width:300px) {
  .small-metrics[data-count] {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Shared vector geometry avoids font-baseline differences between platforms. */
.ui-icon {
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
  pointer-events: none;
}
h2 > span:first-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 20px;
  line-height: 1;
}
h2 {
  min-height: 20px;
}
.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 20px;
}
.segmented button,
.motion,
.location-pin,
.home-location,
.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  flex-shrink: 0;
  padding: 0;
}
.segmented button {
  width: 35px;
  height: 29px;
}
.close {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
}
.condition {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  background: none;
  color: inherit;
  padding: 0 6px;
  margin-bottom: 7px;
  line-height: 1.3;
}
.condition .ui-icon {
  opacity: 0.5;
}
.day-condition {
  min-height: 45px;
  display: grid;
  grid-template-rows: 30px 11px;
  align-items: center;
  justify-items: center;
  gap: 2px;
}
.day-condition .weather-icon {
  width: 28px;
  height: 30px;
}
.day-condition small {
  line-height: 11px;
}
.hour {
  display: grid;
  grid-template-rows: 17px 37px 13px 23px;
  justify-items: center;
  align-items: center;
  gap: 3px;
}
.hour .weather-icon {
  margin: 0;
  width: 32px;
  height: 35px;
}
.hour .chance {
  height: 13px;
  line-height: 13px;
}
.hour > small {
  line-height: 11px;
  grid-row: 5;
}
.clouds.bank {
  top: 180px;
  left: -28%;
  width: 160%;
  height: 520px;
  opacity: 0.22;
  filter: blur(5px);
  background-position: 40% 60%;
  will-change: transform;
}
.clouds.near {
  opacity: 0.36;
}
.rays {
  transform-origin: 38% 0;
  will-change: transform;
}
.sun-orb {
  will-change: transform;
}
.sky-moon {
  position: absolute;
  right: 12%;
  top: 28px;
  width: 112px;
  height: 112px;
  opacity: 0;
  filter: drop-shadow(0 0 20px #b7d5ff22);
}
.atmosphere[data-night="true"] .sky-moon {
  opacity: 0.88;
}
.atmosphere[data-night="true"] .sun-orb {
  opacity: 0.14;
}
.atmosphere[data-night="true"] .stars {
  opacity: 0;
}
.atmosphere[data-night="true"] .clouds.bank {
  opacity: 0.1;
}
.atmosphere[data-condition="sunny"] .clouds.bank {
  opacity: 0.12;
}
.atmosphere[data-condition="fog"] .clouds.bank {
  opacity: 0.5;
  filter: blur(22px);
}
.atmosphere[data-condition*="rain"] .clouds.near,
.atmosphere[data-condition="pouring"] .clouds.near {
  opacity: 0.64;
}
.current-detail {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.current-detail .detail-temperature {
  margin-bottom: 0;
}
.current-detail p {
  margin-top: 0;
}
.metrics[data-count="5"] .panel:last-child {
  grid-column: 1/-1;
  min-height: 130px;
}
.map-dialog {
  width: min(1140px, calc(100vw - 24px));
  max-height: 94dvh;
  overflow: hidden;
  background: #173753;
}
.map-dialog .dialog-inner {
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 94dvh;
}
.map-dialog .dialog-header {
  margin-bottom: 14px;
}
.map-dialog .map-switch {
  margin-bottom: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
  gap: 8px;
}
.map-switch button[aria-pressed="true"] {
  background: #c9e7ff3b;
  border-color: #d9f0ff55;
}
.map-dialog .map-host {
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.map-dialog .map-host iframe {
  height: min(72dvh, 760px);
  min-height: 320px;
  margin: 0;
  border-radius: 14px;
  background: #1c3d56;
  flex: 1 1 auto;
}
.map-host > a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-end;
  font-size: 11px;
  opacity: 0.75;
  margin: 9px 2px 0;
}
.detail-chart svg {
  overflow: visible;
}
.detail-chart {
  padding-top: 12px;
}
.detail-chart circle {
  filter: drop-shadow(0 0 4px #b9efff22);
}
@container (max-width:540px) {
  .metrics[data-count="5"] .panel:last-child {
    grid-column: 1/-1;
  }
  .sky-moon {
    right: 7%;
    width: 88px;
    height: 88px;
    top: 22px;
  }
  .segmented button {
    width: 31px;
  }
  .day-condition {
    min-height: 41px;
    grid-template-rows: 28px 10px;
    gap: 1px;
  }
  .hour {
    grid-template-rows: 16px 34px 12px 22px;
  }
}
@media (max-width: 600px) {
  .map-dialog {
    width: 100vw;
    max-width: 100vw;
    height: 96dvh;
    max-height: 96dvh;
    margin: 4dvh 0 0;
    border-radius: 22px 22px 0 0;
  }
  .map-dialog .dialog-inner {
    height: 100%;
    max-height: 96dvh;
    padding: 17px 12px;
  }
  .map-dialog .dialog-header {
    padding: 0 5px;
  }
  .map-dialog .dialog-header h2 {
    font-size: 20px;
  }
  .map-dialog .map-host {
    flex: 1;
  }
  .map-dialog .map-host iframe {
    height: 100%;
    min-height: 0;
    border-radius: 12px;
  }
  .map-switch button {
    font-size: 12px;
    padding: 9px 12px;
  }
  .close {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }
}
.atmosphere[data-night="true"][data-condition="cloudy"] .sky-moon {
  opacity: 0.28;
}
.atmosphere[data-night="true"][data-condition*="rain"] .sky-moon,
.atmosphere[data-night="true"][data-condition="pouring"] .sky-moon,
.atmosphere[data-night="true"][data-condition*="snow"] .sky-moon {
  opacity: 0;
}
.sky:before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 78% 12%, #ffe3b4aa, transparent 43%),
    linear-gradient(178deg, transparent 20%, #ddae9c55 73%, #e9c6ac88);
  opacity: var(--twilight, 0);
  pointer-events: none;
}
.atmosphere[data-night="true"] .clouds.near {
  opacity: 0.22;
}
.atmosphere[data-condition="cloudy"] .rays {
  opacity: 0.1;
}
.panel[data-section="rain"] .detail-chart {
  margin: 7px 0 -4px;
  padding: 0;
}
.panel[data-section="rain"] .detail-chart svg {
  height: 75px;
  width: 100%;
}
.panel[data-section="rain"] .chart-times {
  display: none;
}
`;var mt=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1200"
  height="700"
  viewBox="0 0 1200 700"
>
  <filter id="cloud">
    <feTurbulence
      type="fractalNoise"
      baseFrequency=".006 .012"
      numOctaves="5"
      seed="8"
    />
    <feColorMatrix
      type="matrix"
      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.5 0 0 0 -.5"
    />
    <feGaussianBlur stdDeviation="1.8" />
  </filter>
  <mask id="fade">
    <radialGradient id="g">
      <stop stop-color="white" />
      <stop offset="1" stop-color="black" />
    </radialGradient>
    <ellipse cx="600" cy="350" rx="700" ry="330" fill="url(#g)" />
  </mask>
  <rect
    width="1200"
    height="700"
    filter="url(#cloud)"
    mask="url(#fade)"
    opacity=".7"
  />
</svg>
`;var gt=ut.replace("CLOUD_TEXTURE",encodeURIComponent(mt));var ft={temperature:'<path d="M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0Z"/><path d="M12 7v10"/>',rain:'<path d="M12 3S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z"/><path d="M9 16a3 3 0 0 0 3 3"/>',wind:'<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M5 17h5a2.5 2.5 0 1 1-2.5 2.5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',location:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',home:'<path d="m3 10 9-7 9 7v10H5V10m4 10v-7h6v7"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="m8 4 12 8-12 8Z"/>',chevron:'<path d="m9 5 7 7-7 7"/>',arrow:'<path d="M6 18 18 6M6 6h12v12"/>',hourly:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',daily:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18M7 14h2m6 0h2m-10 4h2"/>',sun:'<circle cx="12" cy="11" r="4"/><path d="M12 2v2M4.2 3.2l1.4 1.4M1 11h2m18 0h2M18.4 4.6l1.4-1.4M3 19h18M12 21v1"/>',air:'<path d="M3 7h13a2.5 2.5 0 1 0-2.5-2.5M3 12h17M3 17h10a2.5 2.5 0 1 1-2.5 2.5"/>',uv:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',moon:'<path d="M20.5 14A9 9 0 0 1 10 3a9 9 0 1 0 10.5 11Z"/>',humidity:'<path d="M12 3S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z"/><path d="m9 17 6-6"/><circle cx="9" cy="11" r=".5"/><circle cx="15" cy="17" r=".5"/>',visibility:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',pressure:'<path d="M4 19a10 10 0 1 1 16 0M12 12l5-5"/><circle cx="12" cy="12" r="2"/><path d="M12 3v2M4 11h2m12 0h2"/>',radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 6-7"/><circle cx="9" cy="15" r=".7"/>',warnings:'<path d="m10.3 3.5-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 8v5m0 4h.01"/>',check:'<path d="m5 12 4 4L19 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>'};function T(s,t=20){let e={feels:"temperature",sunrise:"sun",sunset:"sun"}[s]||s;return`<svg class="ui-icon" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ft[e]||ft.info}</svg>`}function it(s){if(!s.length)return"";if(s.length===1)return`M${s[0][0]},${s[0][1]}`;let t=s.slice(1).map((i,a)=>(i[1]-s[a][1])/(i[0]-s[a][0])),e=s.map((i,a)=>a===0?t[0]:a===s.length-1?t.at(-1):t[a-1]*t[a]<=0?0:2/(1/t[a-1]+1/t[a]));return t.forEach((i,a)=>{if(i===0){e[a]=e[a+1]=0;return}let n=Math.hypot(e[a]/i,e[a+1]/i);n>3&&(e[a]*=3/n,e[a+1]*=3/n)}),`M${s[0][0]},${s[0][1]}`+s.slice(1).map((i,a)=>{let n=s[a],p=(i[0]-n[0])/3;return`C${n[0]+p},${n[1]+e[a]*p} ${i[0]-p},${i[1]-e[a+1]*p} ${i[0]},${i[1]}`}).join("")}var k=s=>String(s??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),m=(s,t=0)=>s==null||!Number.isFinite(Number(s))?"\u2014":Number(s).toFixed(t),C=s=>s!=null&&Number.isFinite(Number(s)),G=(s,t,e)=>Math.max(t,Math.min(e,s)),qt={sunny:["Sunny","Zonnig"],"clear-night":["Clear","Helder"],partlycloudy:["Partly cloudy","Wisselend bewolkt"],cloudy:["Cloudy","Bewolkt"],rainy:["Rain","Regen"],pouring:["Heavy rain","Zware regen"],snowy:["Snow","Sneeuw"],"snowy-rainy":["Sleet","Natte sneeuw"],lightning:["Thunderstorms","Onweer"],"lightning-rainy":["Thunderstorms","Onweer"],fog:["Fog","Mist"],windy:["Windy","Winderig"],"windy-variant":["Windy","Winderig"],hail:["Hail","Hagel"],exceptional:["Severe weather","Zwaar weer"]},xt={en:{currentLocation:"Current location",homeLocation:"Saved location",locating:"Getting your location\u2026",locationDenied:"Location permission is needed. Enable it in your browser or choose your app device.",locationFailed:"Your location could not be retrieved.",unsupported:"KMI weather is available in Belgium and Luxembourg.",chooseDevice:"Choose your GPS device",staleLocation:"Location is old or not precise enough. Refresh your Companion app with Exact location enabled.",appLocation:"Use app location",reported:"Reported",zoomIn:"Zoom in",zoomOut:"Zoom out",hourly:"Hourly forecast",daily:"Daily forecast",feels:"Feels like",sunset:"Sunset",sunrise:"Sunrise",air:"Air quality",wind:"Wind",uv:"UV index",rain:"Precipitation",humidity:"Humidity",visibility:"Visibility",pressure:"Pressure",moon:"Moon",radar:"Rain radar",now:"Now",today:"Today",tomorrow:"Tomorrow",high:"H",low:"L",gusts:"Gusts",dew:"Dew point",warnings:"Weather warnings",clear:"No local warnings",unavailable:"Weather unavailable",stale:"Forecast out of date",warnUnavailable:"Warning status unavailable",upcoming:"Upcoming",active:"Active",until:"until",from:"from",close:"Close",pause:"Pause animation",play:"Animate weather",temperature:"Temperature",updated:"Updated",details:"Details",windmap:"Wind map",rainmap:"Rain map",forecast:"Forecast",lowUV:"Low",moderate:"Moderate",highUV:"High",veryHigh:"Very high",extreme:"Extreme",good:"Good",fair:"Fair",poor:"Poor",veryPoor:"Very poor",extremelyPoor:"Extremely poor",excellent:"Excellent",illuminated:"illuminated",nextFull:"Next full moon",new:"New moon",waxCrescent:"Waxing crescent",first:"First quarter",waxGibbous:"Waxing gibbous",full:"Full moon",waneGibbous:"Waning gibbous",last:"Last quarter",waneCrescent:"Waning crescent",rainSoon:"Rain in the next 90 minutes",noRain:"No rain expected in the next 90 minutes",mapError:"Radar image unavailable",refresh:"Refresh",outlook:"Weather outlook",source:"Weather data",km:"km",rainAmount:"Rainfall",light:"Light",heavy:"Heavy",model:"Modelled air quality",unavailableDetail:"This source is temporarily unavailable.",coverage:"KMI warnings returned for this location. Read the affected areas below.",current:"Current conditions"},nl:{currentLocation:"Huidige locatie",homeLocation:"Opgeslagen locatie",locating:"Je locatie wordt opgehaald\u2026",locationDenied:"Locatietoestemming is nodig. Schakel die in je browser in of kies je app-apparaat.",locationFailed:"Je locatie kon niet worden opgehaald.",unsupported:"KMI-weer is beschikbaar in Belgi\xEB en Luxemburg.",chooseDevice:"Kies je GPS-apparaat",staleLocation:"De locatie is te oud of niet nauwkeurig genoeg. Ververs de Companion-app met Exacte locatie ingeschakeld.",appLocation:"App-locatie gebruiken",reported:"Gemeld",zoomIn:"Inzoomen",zoomOut:"Uitzoomen",hourly:"Uurlijkse verwachting",daily:"Dagelijkse verwachting",feels:"Gevoelstemperatuur",sunset:"Zonsondergang",sunrise:"Zonsopgang",air:"Luchtkwaliteit",wind:"Wind",uv:"UV-index",rain:"Neerslag",humidity:"Luchtvochtigheid",visibility:"Zicht",pressure:"Luchtdruk",moon:"Maan",radar:"Regenradar",now:"Nu",today:"Vandaag",tomorrow:"Morgen",high:"H",low:"L",gusts:"Windstoten",dew:"Dauwpunt",warnings:"Weerwaarschuwingen",clear:"Geen lokale waarschuwingen",unavailable:"Weer niet beschikbaar",stale:"Verwachting verouderd",warnUnavailable:"Waarschuwingsstatus niet beschikbaar",upcoming:"Binnenkort",active:"Actief",until:"tot",from:"vanaf",close:"Sluiten",pause:"Animatie pauzeren",play:"Weer animeren",temperature:"Temperatuur",updated:"Bijgewerkt",details:"Details",windmap:"Windkaart",rainmap:"Regenkaart",forecast:"Verwachting",lowUV:"Laag",moderate:"Matig",highUV:"Hoog",veryHigh:"Zeer hoog",extreme:"Extreem",good:"Goed",fair:"Redelijk",poor:"Slecht",veryPoor:"Zeer slecht",extremelyPoor:"Extreem slecht",excellent:"Uitstekend",illuminated:"verlicht",nextFull:"Volgende volle maan",new:"Nieuwe maan",waxCrescent:"Wassende maan",first:"Eerste kwartier",waxGibbous:"Wassende maan",full:"Volle maan",waneGibbous:"Afnemende maan",last:"Laatste kwartier",waneCrescent:"Afnemende maan",rainSoon:"Regen in de komende 90 minuten",noRain:"Geen regen verwacht in de komende 90 minuten",mapError:"Radarbeeld niet beschikbaar",refresh:"Vernieuwen",outlook:"Weerbericht",source:"Weergegevens",km:"km",rainAmount:"Regenhoeveelheid",light:"Licht",heavy:"Zwaar",model:"Gemodelleerde luchtkwaliteit",unavailableDetail:"Deze bron is tijdelijk niet beschikbaar.",coverage:"KMI-waarschuwingen voor deze locatie. Lees hieronder voor welke gebieden ze gelden.",current:"Huidige omstandigheden"}};function at(s,t=!1,e=28){let i=/rain|pour|hail/.test(s),a=/snow/.test(s),n=/lightning|exceptional/.test(s),p=/cloud|rain|pour|snow|hail|lightning/.test(s),d=s==="clear-night"||t,h="";return/wind/.test(s)?h='<path d="M4 11h21c8 0 8-9 2-9-4 0-5 3-4 5M1 18h32c7 0 7 9 1 9-4 0-4-3-4-4M6 25h12" fill="none" stroke="#e1f2ff" stroke-width="2.4" stroke-linecap="round"/>':s==="fog"?h='<path d="M7 9h26M2 16h34M6 23h30M12 30h20" stroke="#e0edf4" stroke-width="3" stroke-linecap="round"/>':((!p||s==="partlycloudy")&&(h+=d?'<path d="M28 2a15 15 0 1 0 10 23A14 14 0 0 1 28 2Z" fill="#eff5ff"/>':'<g stroke="#ffd05c" stroke-width="2.2" stroke-linecap="round"><path d="M20 1v3m0 28v3M3 18h3m28 0h3M8 6l2 3m20 19 2 2M8 30l2-3M30 8l2-2"/><circle cx="20" cy="18" r="10" fill="#ffd05c" stroke="none"/></g>'),p&&(h+='<path d="M9 29C-1 29-1 16 8 15 10 3 28 4 30 16 40 15 43 29 32 29Z" fill="#f4f8ff"/><path d="M9 29h23c7 0 8-4 8-4H1s2 4 8 4" fill="#c4d8ec" opacity=".5"/>'),i&&(h+='<path d="m12 33-2 5m12-5-2 5m12-5-2 5" stroke="#74d3ff" stroke-width="2.6" stroke-linecap="round"/>'),a&&(h+='<g fill="#b7e6ff"><circle cx="12" cy="35" r="2"/><circle cx="23" cy="38" r="2"/><circle cx="33" cy="34" r="2"/></g>'),n&&(h+='<path d="m22 24-7 10h6l-3 9 12-14h-8l4-5Z" fill="#ffcf55"/>')),`<svg class="weather-icon" width="${e}" height="${e}" viewBox="-2 -2 46 48" aria-hidden="true">${h}</svg>`}var wt=["current","warnings","hourly","daily","feels","sun","air","wind","uv","rain","radar","moon","humidity","visibility","pressure"],bt=wt.filter(s=>!["feels","humidity","visibility","pressure"].includes(s)),ot=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._mode="temperature",this._paused=!1,this._fetching=!1,this._reduced=matchMedia("(prefers-reduced-motion: reduce)"),this.shadowRoot.innerHTML=`<style>${gt}</style><ha-card><div class="atmosphere"><div class="sky" aria-hidden="true"><div class="sun-orb"></div><div class="rays"></div><div class="stars"></div><div class="clouds far"></div><div class="clouds near"></div><div class="clouds bank"></div><canvas class="sky-moon" width="240" height="240"></canvas><canvas class="precipitation"></canvas><div class="horizon"></div></div><div class="body"></div></div></ha-card><dialog aria-labelledby="detail-title"><div class="dialog-inner"></div></dialog>`,this.shadowRoot.addEventListener("click",t=>{let e=t.target.closest("[data-action]");e&&this._action(e.dataset.action,e.dataset.value)}),this.shadowRoot.querySelector("dialog").addEventListener("click",t=>{t.target===t.currentTarget&&t.currentTarget.close()}),this._onVisibility=()=>this._animate(),this._onMotion=()=>{this._animate(),this._render()},this.shadowRoot.querySelector("dialog").addEventListener("close",()=>this.shadowRoot.querySelectorAll("dialog iframe").forEach(t=>t.remove())),this._skyTime=0}setConfig(t){if(t.entity&&!t.entity.startsWith("weather."))throw new Error("Select an Atmosphere weather entity.");this._config={...t},this._locationGeneration=(this._locationGeneration||0)+1,this._locationBusy=!1,this._locationError=null,this._deviceCoords=null,this._locationNote=null,this._data=null,this._lastKey=null,this._hass&&this._fetch()}static getConfigElement(){return document.createElement("atmosphere-card-editor")}static getStubConfig(t){return{entity:Object.keys(t?.states||{}).find(e=>t.states[e].attributes.atmosphere_entry_id)}}getCardSize(){return 15}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}set hass(t){if(this._hass=t,!this._config)return;let e=this._entity(),i=`${e?.attributes?.updated_at}|${e?.state}|${t.connection?.connected}`;(!this._data||i!==this._lastKey)&&(this._lastKey=i,this._fetch())}_entity(){let t=this._hass?.states||{};return t[this._config?.entity]||(this._config?.entity?null:Object.values(t).find(e=>e.entity_id.startsWith("weather.")&&e.attributes.atmosphere_entry_id))}connectedCallback(){this._observer||=new IntersectionObserver(t=>{this._visible=t[0].isIntersecting,this._animate()}),this._observer.observe(this),this._resize||=new ResizeObserver(()=>this._sizeCanvas()),this._resize.observe(this),document.addEventListener("visibilitychange",this._onVisibility),this._reduced.addEventListener("change",this._onMotion),this._timer=setInterval(()=>{this._render(),(!this._data||Date.now()-new Date(this._data.updated_at)>8*6e4)&&this._fetch()},6e4),this._render(),this._hass&&this._fetch()}disconnectedCallback(){clearInterval(this._timer),cancelAnimationFrame(this._raf),this._observer?.disconnect(),this._resize?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),this._reduced.removeEventListener("change",this._onMotion)}async _fetch(){if(!this._hass||!this._config||this._fetching)return;this._fetching=!0;let t=this._config,e=this._locationGeneration;try{let i=this._entity();if(this._config.entity&&!i)throw new Error(`Entity unavailable: ${this._config.entity}`);let a=await this._hass.callWS(this._deviceCoords?{type:"atmosphere/location",...this._deviceCoords,language:this._data?.language||"nl"}:{type:"atmosphere/data",...i?.attributes?.atmosphere_entry_id?{entry_id:i.attributes.atmosphere_entry_id}:{}});if(t!==this._config||e!==this._locationGeneration)return;this._data=a,this._error=null}catch(i){this._error=i.message||"Connection unavailable"}finally{this._fetching=!1,t!==this._config?this._fetch():this._render()}}get _nl(){return(this._config?.language||this._data?.language||this._hass?.language||"en").startsWith("nl")}_t(t){return xt[this._nl?"nl":"en"][t]||t}_condition(t){return qt[t]?.[this._nl?1:0]||"\u2014"}_time(t,e={}){return!t||!Number.isFinite(new Date(t).getTime())?"\u2014":new Intl.DateTimeFormat(this._nl?"nl-BE":"en-GB",{timeZone:this._data?.timezone||"Europe/Brussels",hour:"2-digit",minute:"2-digit",...e}).format(new Date(t))}_date(t,e={}){return new Intl.DateTimeFormat(this._nl?"nl-BE":"en-GB",{timeZone:this._data?.timezone||"Europe/Brussels",...e}).format(new Date(t))}_temp(t){return`${m(t)}${C(t)?"\xB0":""}`}_isStale(){return this._error||!this._data?.available||Date.now()-new Date(this._data.updated_at).getTime()>20*6e4}_warnings(){return(this._data?.warnings||[]).filter(t=>new Date(t.ends_at)>new Date).sort((t,e)=>(e.level||0)-(t.level||0)||new Date(t.starts_at)-new Date(e.starts_at))}_panel(t,e,i=t,a=""){return`<button class="panel ${a}" data-section="${t==="sunrise"||t==="sunset"?"sun":t}" data-action="detail" data-value="${k(i)}"><h2><span aria-hidden="true">${T(t,18)}</span>${this._t(t)}<span class="chevron" aria-hidden="true">${T("chevron",14)}</span></h2>${e}</button>`}_render(){if(!this.isConnected)return;let t=this.shadowRoot.querySelector(".body");if(!this._data){t.innerHTML=`<div class="empty"><h1>Atmosphere</h1><p>${this._error?k(this._error):this._nl?"Het weer wordt opgehaald\u2026":"Fetching the weather\u2026"}</p><button data-action="refresh">${this._t("refresh")}</button></div>`;return}let e=this._data,i=e.current,a=e.daily[0]||{},n=this._warnings(),p=this._isStale(),d=Date.now()<new Date(e.sun.sunrise)||Date.now()>new Date(e.sun.sunset),h=i.condition||"cloudy",w=this.shadowRoot.querySelector(".atmosphere");w.dataset.condition=h,w.dataset.night=String(d);let o=Math.min(Math.abs(Date.now()-new Date(e.sun.sunrise)),Math.abs(Date.now()-new Date(e.sun.sunset)));w.style.setProperty("--twilight",String(G(1-o/(85*6e4),0,1)*(d?.25:.6))),w.classList.toggle("paused",this._paused||this._reduced.matches||!this._visible||document.hidden);let y=e.hourly.filter(f=>new Date(f.datetime).getTime()>Date.now()-36e5).slice(0,24).map((f,j)=>j===0?{...f,temperature:i.temperature,condition:h,is_daytime:!d}:f),g=t.querySelector(".hours")?.scrollLeft||0,v=t.querySelector(".days")?.scrollTop||0,E=X.default.getMoonIllumination(new Date),x=Date.now()>new Date(e.sun.sunset).getTime(),R=x?"sunrise":"sunset",P=x?X.default.getTimes(new Date(Date.now()+864e5),e.latitude,e.longitude).sunrise:e.sun.sunset,M=e.air?.european_aqi,_=C(M)?this._t(M<=20?"good":M<=40?"fair":M<=60?"moderate":M<=80?"poor":M<=100?"veryPoor":"extremelyPoor"):"\u2014",A=i.uv_index,K=C(A)?this._t(A<3?"lowUV":A<6?"moderate":A<8?"highUV":A<11?"veryHigh":"extreme"):"\u2014",l=C(i.wind_bearing)?["N","NE","E","SE","S","SW","W","NW"][Math.round(i.wind_bearing/45)%8]:"\u2014",U=e.rain.filter(f=>new Date(f.datetime)>new Date&&new Date(f.datetime)<new Date(Date.now()+90*6e4)),S=U.some(f=>(f.precipitation||0)>0||f.might_rain);t.innerHTML=`
      <div class="toolbar"><button class="location-pin ${this._deviceCoords?"selected":""}" data-action="locate" aria-label="${this._t("currentLocation")}" aria-busy="${!!this._locationBusy}" title="${this._t("currentLocation")}">${T("location",20)}</button><span>${k(this._deviceCoords?e.name:this._config.name||e.name)}</span>${this._deviceCoords?`<button class="home-location" data-action="home" aria-label="${this._t("homeLocation")}">${T("home",22)}</button>`:""}<button class="motion" data-action="motion" aria-label="${this._t(this._paused||this._reduced.matches?"play":"pause")}" aria-pressed="${!this._paused&&!this._reduced.matches}">${T(this._paused?"play":"pause",16)}</button></div>
      <header class="hero" data-section="current"><h1>${k(this._deviceCoords?e.name:this._config.name||e.name)}</h1><div class="temperature">${this._temp(i.temperature)}</div><button class="condition" data-action="detail" data-value="current" aria-label="${this._t("current")}">${this._condition(h)}${T("chevron",14)}</button><div class="hero-range">${C(i.apparent_temperature)?`${this._t("feels")} ${this._temp(i.apparent_temperature)}<span>\xB7</span>`:""}${this._t("high")}:${this._temp(a.temperature)} ${this._t("low")}:${this._temp(a.templow)}</div></header>
      ${p?`<div class="connection-status" role="status">${this._t("stale")} \xB7 ${this._t("warnUnavailable")}<button data-action="refresh">${this._t("refresh")}</button></div>`:""}
      ${this._locationBusy||this._locationError?`<div class="location-status" role="status">${k(this._locationBusy?this._t("locating"):this._locationError)}${!this._locationBusy&&this._appTrackers().length?`<button data-action="app-location">${this._t("appLocation")}</button>`:""}</div>`:""}
      ${this._locationNote?`<div class="location-note">${k(this._locationNote)}</div>`:""}
      <div class="forecast-grid">
        <button data-section="warnings" class="panel warning ${n.length?"has-warning":""} level-${n[0]?.level||0}" data-action="detail" data-value="warnings"><h2><span aria-hidden="true">${T(n.length?"warnings":"check",18)}</span>${this._t("warnings")}<span class="chevron" aria-hidden="true">${T("chevron",14)}</span></h2>${n.length?`<div class="warning-title">${k(n[0].friendly_name)}</div><div class="warning-line"><span class="severity-dot"></span>${this._t(p?"stale":new Date(n[0].starts_at)<=new Date?"active":"upcoming")} \xB7 ${this._time(n[0].starts_at)} \u2013 ${this._time(n[0].ends_at)}</div><p class="warning-preview">${k(n[0].text)}</p>${n.length>1?`<span class="warning-count">+${n.length-1}</span>`:""}`:`<div class="warning-title">${this._t(p?"warnUnavailable":"clear")}</div><div class="warning-line">KMI / IRM</div>`}</button>
        <section data-section="hourly" class="panel hourly"><div class="panel-header"><h2><span aria-hidden="true">${T("hourly",18)}</span>${this._t("hourly")}</h2><div class="segmented" role="group" aria-label="${this._t("hourly")}">${["temperature","rain","wind"].map((f,j)=>`<button data-action="mode" data-value="${f}" aria-label="${this._t(f)}" aria-pressed="${this._mode===f}">${T(f,18)}</button>`).join("")}</div></div><div class="hours">${y.map((f,j)=>`<button class="hour" data-action="hour" data-value="${k(f.datetime)}"><span>${j===0?this._t("now"):this._time(f.datetime,{minute:void 0})}</span>${at(f.condition,!f.is_daytime,32)}<span class="chance">${C(f.precipitation_probability)?m(f.precipitation_probability)+"%":"\u2014"}</span><strong>${this._mode==="temperature"?this._temp(f.temperature):this._mode==="rain"?m(f.precipitation,1):m(f.wind_speed)}</strong>${this._mode!=="temperature"?`<small>${this._mode==="rain"?"mm":"km/h"}</small>`:""}</button>`).join("")}</div></section>
        <section data-section="daily" class="panel daily"><h2><span aria-hidden="true">${T("daily",18)}</span>${e.daily.length} ${this._nl?"dagen":"days"}</h2><div class="days">${this._dailyRows(e.daily)}</div></section>
        <div class="metrics">
          ${this._panel("feels",`<div class="metric-value">${this._temp(i.apparent_temperature)}</div><div class="metric-note">${this._nl?"Werkelijk":"Actual"} ${this._temp(i.temperature)}</div><div class="feels-line"><span style="left:${G(50+((i.apparent_temperature??i.temperature)-i.temperature)*4,5,95)}%"></span></div>`)}
          ${this._panel(R,`<div class="metric-value">${this._time(P)}</div>${this._sunArc()}<div class="metric-note sun-note">${this._t(R==="sunset"?"sunrise":"sunset")} ${this._time(e.sun[R==="sunset"?"sunrise":"sunset"])}</div>`,"sun")}
          ${this._panel("air",`<div class="aq-head"><span class="metric-value">${m(M)}</span><span class="aq-category">${_}</span></div><div class="spectrum aqi"><i style="left:${G((M||0)/120*100,2,98)}%"></i></div><div class="metric-note">European AQI</div>`)}
          ${this._panel("wind",`<div class="wind-layout"><div><span class="metric-value">${m(i.wind_speed)}</span><span class="unit">km/h</span></div><div class="compass"><span class="north">N</span><span class="west">W</span><span class="east">E</span><span class="south">S</span><div class="needle" style="transform:rotate(${C(i.wind_bearing)?i.wind_bearing:0}deg)"></div><b>${l}</b></div></div><div class="metric-note">${this._t("gusts")} ${m(i.wind_gust_speed)} km/h</div>`)}
          ${this._panel("uv",`<div class="metric-value">${m(A,1)}</div><div class="metric-note">${K}</div><div class="spectrum uv"><i style="left:${G((A||0)/12*100,2,98)}%"></i></div>`)}
          ${this._panel("rain",`<div class="metric-value">${m(a.precipitation,1)}<span class="unit">mm</span></div><div class="metric-note">${this._t("today")}</div>${this._hourChart(y,"precipitation")}`)}
        </div>
        <section data-section="radar" class="panel radar-panel"><div class="panel-header"><h2><span aria-hidden="true">${T("radar",18)}</span>${this._t("radar")}</h2><button class="text-button" data-action="detail" data-value="radar">${this._t("rainmap")} <span aria-hidden="true">${T("arrow",14)}</span></button></div><button class="rain-outlook" data-action="detail" data-value="radar"><span>${this._t(S?"rainSoon":"noRain")}</span><span aria-hidden="true">${T("chevron",14)}</span></button><div class="rain-chart">${this._rainChart(U)}</div><div class="chart-times"><span>${this._t("now")}</span><span>+30 min</span><span>+60 min</span><span>+90 min</span></div></section>
        ${this._panel("moon",`<div class="moon-layout"><div><div class="moon-phase">${this._moonName(E.phase)}</div><div class="metric-note">${m(E.fraction*100)}% ${this._t("illuminated")}</div><div class="moon-date">${this._date(this._nextFullMoon(),{day:"numeric",month:"short"})}<span>${this._t("nextFull")}</span></div></div><canvas class="moon" width="240" height="240" aria-hidden="true"></canvas></div>`,"moon","moon-panel")}
        <div class="small-metrics">${this._panel("humidity",`<div class="small-value">${m(i.humidity)}<span>%</span></div><div class="metric-note">${this._t("dew")} ${this._temp(i.dew_point)}</div>`)}${this._panel("visibility",`<div class="small-value">${m(i.visibility,1)}<span>km</span></div>`)}${this._panel("pressure",`<div class="small-value">${m(i.pressure)}<span>hPa</span></div><div class="pressure-scale"><span>980</span><i style="left:${G(((i.pressure||1013)-980)/60*100,0,100)}%"></i><span>1040</span></div>`)}</div>
      </div><footer><span>${this._t("updated")} ${this._time(e.updated_at)} \xB7 KMI / IRM</span><button data-action="detail" data-value="source">${this._t("source")} \u24D8</button></footer>`,t.querySelector(".hours").scrollLeft=g,t.querySelector(".days").scrollTop=v,this._applyVisibility(),this._drawMoon(t.querySelector(".moon")),this._drawMoon(this.shadowRoot.querySelector(".sky-moon")),this._sizeCanvas(),this._animate()}_dailyRows(t){let e=t.flatMap(n=>[n.temperature,n.templow]).filter(C),i=Math.min(...e)-1,a=Math.max(...e)+1;return t.map((n,p)=>`<button class="day" data-action="day" data-value="${p}" aria-label="${k(this._date(`${n.datetime.slice(0,10)}T12:00:00`,{weekday:"long"}))}: ${this._temp(n.templow)} \u2013 ${this._temp(n.temperature)}"><span class="day-name">${p===0?this._t("today"):this._date(`${n.datetime.slice(0,10)}T12:00:00`,{weekday:"short"})}</span><span class="day-condition">${at(n.condition,!1,28)}<small>${C(n.precipitation_probability)?m(n.precipitation_probability)+"%":""}</small></span><span class="low">${this._temp(n.templow)}</span><span class="range"><span style="left:${G(((n.templow??n.temperature)-i)/(a-i)*100,0,100)}%;width:${Math.max(3,((n.temperature??i)-(n.templow??n.temperature))/(a-i)*100)}%"></span>${p===0&&C(this._data.current.temperature)?`<i style="left:${G((this._data.current.temperature-i)/(a-i)*100,0,100)}%"></i>`:""}</span><span class="high">${this._temp(n.temperature)}</span></button>`).join("")}_sunArc(){let t=this._data,e=new Date(t.sun.sunrise).getTime(),i=new Date(t.sun.sunset).getTime(),a=G((Date.now()-e)/(i-e),0,1),n=10+180*a,p=57-Math.sin(a*Math.PI)*47;return`<svg class="sun-arc" viewBox="0 0 200 76" aria-hidden="true"><path d="${it(Array.from({length:25},(h,w)=>{let o=-10+w*220/24;return[o,57-Math.sin((o-10)/180*Math.PI)*47]}))}" fill="none" stroke="white" stroke-opacity=".22" stroke-width="5"/><path d="M0 57h200" stroke="white" stroke-opacity=".3"/><circle cx="${n}" cy="${p}" r="6" fill="#fff8d9" style="filter:drop-shadow(0 0 6px #fff)"/></svg>`}_rainChart(t){if(!t.length)return'<span class="no-data">\u2014</span>';let e=Math.max(1,...t.map(p=>p.precipitation||0)),i=t.map(p=>[G((new Date(p.datetime)-Date.now())/(90*6e4)*500,0,500),60-(p.precipitation||0)/e*54]).filter((p,d,h)=>!d||p[0]>h[d-1][0]),a=it(i),n=a+`L${i.at(-1)[0]},62L${i[0][0]},62Z`;return`<svg viewBox="0 0 500 64" preserveAspectRatio="none" aria-label="${this._t("rain")}"><defs><linearGradient id="nowcast-fill" x2="0" y2="1"><stop stop-color="#9ce1ee" stop-opacity=".5"/><stop offset="1" stop-color="#9ce1ee" stop-opacity=".02"/></linearGradient></defs><path d="M0 62H500M0 32H500" stroke="white" stroke-opacity=".1"/><path d="${n}" fill="url(#nowcast-fill)"/><path d="${a}" fill="none" stroke="#aeeaf3" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`}_moonName(t){return this._t(["new","waxCrescent","first","waxGibbous","full","waneGibbous","last","waneCrescent"][Math.round(t*8)%8])}_nextFullMoon(){let t=X.default.getMoonIllumination(new Date).phase;for(let e=1;e<=768;e++){let i=new Date(Date.now()+e*36e5),a=X.default.getMoonIllumination(i).phase;if(t<.5&&a>=.5)return i;t=a}return new Date(Date.now()+29.53*864e5)}_drawMoon(t){if(!t)return;let e=t.getContext("2d"),i=t.width,a=i*.43,n=i/2,p=X.default.getMoonIllumination(new Date).phase;e.clearRect(0,0,i,i),e.save(),e.beginPath(),e.arc(n,n,a,0,Math.PI*2),e.clip();let d=e.createRadialGradient(n-a*.25,n-a*.3,0,n,n,a);d.addColorStop(0,"#eceff3"),d.addColorStop(.7,"#bdc6d2"),d.addColorStop(1,"#79899d"),e.fillStyle=d,e.fillRect(0,0,i,i);let h=73,w=()=>(h=h*16807%2147483647,(h-1)/2147483646);for(let g=0;g<260;g++){let v=w()*i,E=w()*i,x=2+w()*14;e.beginPath(),e.ellipse(v,E,x,x*.8,w()*6,0,Math.PI*2),e.fillStyle=`rgba(37,52,73,${w()*.15})`,e.fill(),e.strokeStyle="rgba(255,255,255,.09)",e.lineWidth=1,e.stroke()}let o=p<.5,y=Math.cos(p*2*Math.PI);e.beginPath();for(let g=-a;g<=a;g+=1){let v=Math.sqrt(a*a-g*g),E=(o?1:-1)*y*v;g===-a?e.moveTo(n+E,n+g):e.lineTo(n+E,n+g)}for(let g=a;g>=-a;g-=1){let v=Math.sqrt(a*a-g*g);e.lineTo(n+(o?-v:v),n+g)}e.closePath(),e.fillStyle="rgba(7,17,35,.9)",e.fill(),e.restore()}_sizeCanvas(){let t=this.shadowRoot.querySelector(".precipitation"),e=this.getBoundingClientRect();(t.width!==Math.round(e.width)||t.height!==Math.round(Math.min(e.height,1700)))&&(t.width=Math.round(e.width),t.height=Math.round(Math.min(e.height,1700)))}_animate(){cancelAnimationFrame(this._raf),this._raf=null;let t=this.isConnected&&this._visible&&!document.hidden&&!this._paused&&!this._reduced.matches;this.shadowRoot.querySelector(".atmosphere").classList.toggle("paused",!t);let e=this.shadowRoot.querySelector(".precipitation"),i=e.getContext("2d");i.clearRect(0,0,e.width,e.height);let a=this._data?.current?.condition||"";if(!t)return;let n=this.shadowRoot.querySelector(".atmosphere").dataset.night==="true",p=/(rain|pour|snow|hail|lightning)/.test(a),d=/snow|hail/.test(a),h=G((this._data?.current?.wind_speed||12)/22,.55,2.5),w=this.shadowRoot.querySelectorAll(".clouds"),o=this.shadowRoot.querySelector(".sun-orb"),y=this.shadowRoot.querySelector(".rays"),g=this.shadowRoot.querySelector(".horizon"),v=p?d?"snow":"rain":n?"stars":h>1?"wind":"motes",E=`${v}:${e.width}:${e.height}`;if(this._particleSignature!==E){this._particleSignature=E;let P=v==="stars"?95:v==="rain"?125:v==="snow"?80:32;this._particles=Array.from({length:P},(M,_)=>({x:Math.random()*e.width,y:Math.random()*e.height,s:.4+Math.random(),r:.7+Math.random()*1.6,phase:_*2.39}))}let x=null,R=P=>{let M=x===null?0:Math.min((P-x)/1e3,.05);x=P,this._skyTime+=M;let _=this._skyTime,A=.5-.5*Math.cos(_*h/19*Math.PI),K=.5+.5*Math.cos(_*h/28*Math.PI);w[0].style.transform=`translateX(${-8+20*A}%) translateY(${Math.sin(_/17)*5}px) scale(${1.02+.07*A})`,w[1].style.transform=`translateX(${-12+25*K}%) translateY(${Math.cos(_/13)*9}px) scale(${1.05+.08*K})`,w[2].style.transform=`translateX(${Math.sin(_*h/23)*13}%) translateY(${Math.sin(_/11)*13}px) scale(1.12)`,o.style.transform=`translateX(-50%) translateY(${Math.sin(_/12)*5}px) scale(${1+.04*Math.sin(_/9)})`,y.style.transform=`rotate(${16+Math.sin(_/18)*5}deg) translateX(${Math.sin(_/10)*15}px)`,g.style.opacity=String(.65+.2*Math.sin(_/13)),g.style.transform=`translateX(${Math.sin(_/31)*3}%)`,i.clearRect(0,0,e.width,e.height);for(let l of this._particles)i.beginPath(),v==="stars"?(i.globalAlpha=(.3+.6*(.5+.5*Math.sin(_*.7+l.phase)))*G(1-l.y/e.height,.15,1),i.fillStyle="#edf6ff",i.arc(l.x,l.y,l.r*.65,0,Math.PI*2),i.fill()):v==="motes"?(l.y-=M*5*l.s,l.x+=M*8*l.s,i.globalAlpha=.13+.1*Math.sin(_+l.phase),i.fillStyle="#fff9df",i.arc(l.x,l.y,l.r,0,Math.PI*2),i.fill()):v==="wind"?(l.x+=M*80*h*l.s,l.y+=M*Math.sin(_+l.phase)*3,i.globalAlpha=.06,i.strokeStyle="#e4f3ff",i.lineWidth=.65,i.moveTo(l.x,l.y),i.quadraticCurveTo(l.x+20,l.y-3,l.x+55*l.s,l.y),i.stroke()):v==="snow"?(l.y+=M*25*l.s,l.x+=M*(Math.sin(_/2+l.phase)*10-15*h),i.globalAlpha=.35+l.s*.3,i.fillStyle="#eef8ff",i.arc(l.x,l.y,l.r,0,Math.PI*2),i.fill()):(l.y+=M*570*l.s,l.x-=M*85*h,i.globalAlpha=.14+l.s*.16,i.strokeStyle="#d6edff",i.lineWidth=.65,i.moveTo(l.x,l.y),i.lineTo(l.x+h*3,l.y-18*l.s),i.stroke()),l.y>e.height+30&&(l.y=-30),l.y<-35&&(l.y=e.height+25),l.x>e.width+60&&(l.x=-60),l.x<-65&&(l.x=e.width+60);if(i.globalAlpha=1,n&&!p){let l=_%37;if(l>27&&l<28.5){let U=(l-27)/1.5,S=e.width*(.2+.5*U),f=35+U*150;i.globalAlpha=Math.sin(U*Math.PI)*.65;let j=i.createLinearGradient(S-60,f-22,S,f);j.addColorStop(0,"transparent"),j.addColorStop(1,"#ecf7ff"),i.strokeStyle=j,i.lineWidth=1.4,i.beginPath(),i.moveTo(S-60,f-22),i.lineTo(S,f),i.stroke(),i.globalAlpha=1}}this._raf=requestAnimationFrame(R)};this._raf=requestAnimationFrame(R)}_action(t,e){if(t==="refresh")return this._fetch();if(t==="locate")return this._locate();if(t==="app-location")return this._chooseAppLocation();if(t==="use-tracker")return this._useTracker(e);if(t==="home"){this._locationGeneration++,this._locationBusy=!1,this._deviceCoords=null,this._locationNote=null,this._locationError=null,this._fetch();return}if(t==="motion"){this._paused=!this._paused,this._render();return}if(t==="mode"){this._mode=e,this._render();return}if(t==="close"){this.shadowRoot.querySelector("dialog").close();return}if(t==="map"){this._showMap(e);return}this._openDetail(t==="detail"?e:t,e)}_openDetail(t,e){let i=this._data,a=i.current,n=this._t.bind(this),p=n(t),d="",h=o=>`<dl class="detail-stats">${o.map(([y,g])=>`<div><dt>${k(y)}</dt><dd>${k(g)}</dd></div>`).join("")}</dl>`;if(t==="current")p=n("current"),d=`<div class="current-detail">${at(a.condition,!1,60)}<div class="detail-temperature">${this._temp(a.temperature)}</div><p>${this._condition(a.condition)}</p></div>${h([[n("feels"),this._temp(a.apparent_temperature)],[n("humidity"),m(a.humidity)+"%"],[n("dew"),this._temp(a.dew_point)],[n("visibility"),m(a.visibility,1)+" km"],[n("pressure"),m(a.pressure)+" hPa"],[n("wind"),m(a.wind_speed)+" km/h"]])}`;else if(t==="warnings")d=`<p>${n("coverage")}</p>${this._isStale()?`<p class="error">${n("warnUnavailable")}</p>`:""}${this._warnings().map(o=>`<article class="warning-detail level-${o.level}"><h3><span class="severity-dot"></span>${k(o.friendly_name)}</h3><p class="warning-dates">${this._date(o.starts_at,{weekday:"long",day:"numeric",month:"short"})} ${this._time(o.starts_at)} \u2013 ${this._time(o.ends_at)}</p><p>${k(o.text)}</p><a href="https://www.meteo.be/nl/weer/waarschuwingen" target="_blank" rel="noopener noreferrer">KMI / IRM \u2197</a></article>`).join("")||`<p>${n(this._isStale()?"warnUnavailable":"clear")}</p>`}`;else if(t==="day"||t==="hour"){let o=t==="day"?i.daily[Number(e)]:i.hourly.find(g=>g.datetime===e);p=t==="day"?this._date(o.datetime+"T12:00:00",{weekday:"long",day:"numeric",month:"long"}):this._time(o.datetime);let y=t==="day"?i.hourly.filter(g=>this._date(g.datetime,{day:"numeric",month:"numeric"})===this._date(o.datetime+"T12:00:00",{day:"numeric",month:"numeric"})):i.hourly.filter(g=>new Date(g.datetime)>=new Date(o.datetime)).slice(0,12);d=`<div class="detail-weather">${at(o.condition,!o.is_daytime,64)}<div class="detail-temperature">${this._temp(o.temperature)}</div><p>${this._condition(o.condition)}${o.condition_2&&o.condition_2!==o.condition?" \u2192 "+this._condition(o.condition_2):""}</p></div>${o.text?`<p>${k(o.text)}</p>`:""}${y.length?this._hourChart(y):""}${h([[n("low"),this._temp(o.templow)],[n("rain"),`${m(o.precipitation,1)} mm \xB7 ${m(o.precipitation_probability)}%`],[n("wind"),`${m(o.wind_speed)} km/h`],[n("gusts"),`${m(o.wind_gust_speed)} km/h`]])}`}else if(t==="radar"||t==="map")p=n(t==="map"&&e==="wind"?"windmap":"radar"),d=`<div class="map-switch" role="group" aria-label="${n("details")}"><button data-action="map" data-value="radar">${n("radar")}</button><button data-action="map" data-value="rain">${n("rain")} \xB7 ${n("forecast")}</button><button data-action="map" data-value="wind">${n("windmap")}</button></div><div class="map-host"></div>`;else if(t==="wind")d=`<div class="detail-temperature">${m(a.wind_speed)}<span> km/h</span></div>${h([[n("gusts"),`${m(a.wind_gust_speed)} km/h`],[this._nl?"Windrichting":"Direction",`${m(a.wind_bearing)}\xB0`]])}${this._hourChart(i.hourly.filter(o=>new Date(o.datetime)>new Date).slice(0,24),"wind_speed")}<button class="full-button" data-action="map" data-value="wind">${n("windmap")} \u2197</button><div class="map-host"></div>`;else if(t==="sun")p=this._nl?"Zon":"Sun",d=`${this._sunArc()}${h([[n("sunrise"),this._time(i.sun.sunrise)],[n("sunset"),this._time(i.sun.sunset)],[this._nl?"Ochtendschemering":"Dawn",this._time(i.sun.dawn)],[this._nl?"Avondschemering":"Dusk",this._time(i.sun.dusk)]])}`;else if(t==="moon"){let o=X.default.getMoonIllumination(new Date),y=X.default.getMoonTimes(new Date,i.latitude,i.longitude,!0);d=`<canvas class="moon detail-moon" width="400" height="400"></canvas><h3>${this._moonName(o.phase)}</h3>${h([[n("illuminated"),`${m(o.fraction*100,1)}%`],[n("nextFull"),this._date(this._nextFullMoon(),{day:"numeric",month:"long"})],[this._nl?"Maanopkomst":"Moonrise",this._time(y.rise)],[this._nl?"Maanondergang":"Moonset",this._time(y.set)]])}`}else if(t==="air"){let o=i.air;d=`<div class="detail-temperature">${m(o.european_aqi)}</div><p>European AQI \xB7 ${n("model")}</p>${h([["PM2.5",`${m(o.pm2_5,1)} \xB5g/m\xB3`],["PM10",`${m(o.pm10,1)} \xB5g/m\xB3`],["NO\u2082",`${m(o.nitrogen_dioxide,1)} \xB5g/m\xB3`],["O\u2083",`${m(o.ozone,1)} \xB5g/m\xB3`]])}<p>CAMS ENSEMBLE / Open-Meteo \xB7 ${this._time(o.time?o.time*1e3:null)}</p>`}else if(t==="rain")d=`<div class="detail-temperature">${m(i.daily[0]?.precipitation,1)}<span> mm</span></div><p>${n("today")}</p>${this._hourChart(i.hourly.filter(o=>new Date(o.datetime)>new Date).slice(0,24),"precipitation")}<button class="full-button" data-action="detail" data-value="radar">${n("radar")} \u2197</button>`;else if(t==="source")d=`<p>${k(i.attribution)}</p><p>${this._nl?"Voorspellingen en waarschuwingen worden elke 7 minuten opgehaald. Aanvullende modelgegevens elke 30 minuten. Waarschuwingen kunnen een ruimer gebied betreffen: lees de waarschuwingstekst.":"Forecasts and warnings refresh every 7 minutes; supplementary model data every 30 minutes. Warnings may concern a wider area: read the warning text."}</p><p>${this._nl?"Windkaarten worden op verzoek geladen van Windy. Zon- en maangegevens worden lokaal berekend.":"Wind maps load from Windy on request. Sun and moon information is calculated locally."}</p><p>${n("updated")}: ${this._time(i.updated_at)}${this._isStale()?" \xB7 "+n("stale"):""}</p><a href="https://github.com/TwilightDuck/ha-atmosphere" target="_blank" rel="noopener noreferrer">Atmosphere 1.2.0 \u2197</a>`;else{let o={feels:[a.apparent_temperature,"\xB0C"],uv:[a.uv_index,""],humidity:[a.humidity,"%"],visibility:[a.visibility,"km"],pressure:[a.pressure,"hPa"]},[y,g]=o[t]||[null,""];d=`<div class="detail-temperature">${m(y,t==="uv"?1:0)}<span> ${g}</span></div>${C(y)?"":`<p>${n("unavailableDetail")}</p>`}${t==="feels"?h([[n("temperature"),this._temp(a.temperature)],[n("humidity"),`${m(a.humidity)}%`],[n("wind"),`${m(a.wind_speed)} km/h`]]):t==="humidity"?h([[n("dew"),this._temp(a.dew_point)]]):""}`}let w=this.shadowRoot.querySelector("dialog");w.querySelector(".dialog-inner").innerHTML=`<div class="dialog-header"><h2 id="detail-title">${k(p)}</h2><button class="close" data-action="close" aria-label="${n("close")}">${T("close",20)}</button></div>${d}`,w.open||w.showModal(),t==="moon"&&this._drawMoon(w.querySelector(".moon")),w.classList.toggle("map-dialog",t==="radar"||t==="map"),(t==="radar"||t==="map")&&this._showMap(t==="map"?e:"radar")}_showMap(t){let e=this.shadowRoot.querySelector("dialog");if(!e.classList.contains("map-dialog"))return this._openDetail("map",t);let i=e.querySelector(".map-host"),a=this._data,n=new URL("https://embed.windy.com/embed.html");n.search=new URLSearchParams({type:"map",location:"coordinates",metricWind:"km/h",metricTemp:"\xB0C",metricRain:"mm",zoom:"11",overlay:t,product:"ecmwf",level:"surface",lat:a.latitude.toFixed(4),lon:a.longitude.toFixed(4),detailLat:a.latitude.toFixed(4),detailLon:a.longitude.toFixed(4),marker:"true",calendar:"now",message:"false"}).toString(),e.querySelector("#detail-title").textContent=this._t(t==="wind"?"windmap":t==="rain"?"rain":"radar"),e.querySelectorAll('[data-action="map"]').forEach(p=>p.setAttribute("aria-pressed",String(p.dataset.value===t))),i.innerHTML=`<iframe title="${this._t(t==="wind"?"windmap":"rainmap")}" src="${k(n.href)}" referrerpolicy="no-referrer" allowfullscreen></iframe><a href="${k(n.href)}" target="_blank" rel="noopener noreferrer">Windy ${T("arrow",13)}</a>`}_applyVisibility(){let t=this.shadowRoot,e=this._config.show||bt;t.querySelectorAll("[data-section]").forEach(i=>i.hidden=Array.isArray(e)&&!e.includes(i.dataset.section));for(let i of[".metrics",".small-metrics"]){let a=t.querySelector(i),n=[...a.children].filter(p=>!p.hidden).length;a.hidden=n===0,a.dataset.count=n}for(let i of[[".warning",".hourly"],[".daily",".metrics"],[".radar-panel",".moon-panel"]]){let[a,n]=i.map(p=>t.querySelector(p));a.hidden&&!n.hidden&&(n.style.gridColumn="1 / -1"),n.hidden&&!a.hidden&&(a.style.gridColumn="1 / -1")}}_appTrackers(){let t=this._hass?.states||{},e=this._hass?.user?.id;return e?[...new Set(Object.values(t).filter(a=>a.entity_id.startsWith("person.")&&a.attributes.user_id===e).flatMap(a=>a.attributes.device_trackers||[]))].map(a=>t[a]).filter(a=>a?.attributes.source_type==="gps"&&C(a.attributes.latitude)&&C(a.attributes.longitude)):[]}_trackerFresh(t){let e=t?.attributes||{};return t&&!["unknown","unavailable"].includes(t.state)&&C(e.latitude)&&C(e.longitude)&&C(e.gps_accuracy)&&e.gps_accuracy>=0&&e.gps_accuracy<=250&&Date.now()-new Date(t.last_updated).getTime()<=15*6e4}_chooseAppLocation(){let t=this._appTrackers();if(t.length===1&&this._trackerFresh(t[0]))return this._useTracker(t[0].entity_id);let e=this.shadowRoot.querySelector("dialog");e.classList.remove("map-dialog"),e.querySelector(".dialog-inner").innerHTML=`<div class="dialog-header"><h2 id="detail-title">${this._t("chooseDevice")}</h2><button class="close" data-action="close" aria-label="${this._t("close")}">${T("close",20)}</button></div>${t.map(i=>`<button class="tracker-choice" data-action="use-tracker" data-value="${k(i.entity_id)}" ${this._trackerFresh(i)?"":"disabled"}><strong>${k(i.attributes.friendly_name||i.entity_id)}</strong><span>${this._t("reported")} ${this._time(i.last_updated)} \xB7 \xB1${m(i.attributes.gps_accuracy)} m</span></button>`).join("")}<p>${this._t("staleLocation")}</p>`,e.open||e.showModal()}async _useTracker(t){let e=this._appTrackers().find(i=>i.entity_id===t);if(!this._trackerFresh(e)){this._locationError=this._t("staleLocation"),this._render();return}this.shadowRoot.querySelector("dialog").close(),await this._loadLocation(e.attributes,`${e.attributes.friendly_name||t} \xB7 ${this._t("reported")} ${this._time(e.last_updated)} \xB7 \xB1${m(e.attributes.gps_accuracy)} m`)}async _locate(){if(this._locationBusy)return;let t=this._locationGeneration;if((window.externalApp||window.webkit?.messageHandlers?.externalBus)&&this._appTrackers().length)return this._chooseAppLocation();this._locationBusy=!0,this._locationError=null,this._render();try{let e=await new Promise((i,a)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(i,a,{enableHighAccuracy:!0,maximumAge:6e4,timeout:12e3}):a({code:2}));if(t!==this._locationGeneration)return;if(!C(e.coords.accuracy)||e.coords.accuracy>1e3)throw{code:2};await this._loadLocation(e.coords,`${this._t("currentLocation")} \xB7 \xB1${m(e.coords.accuracy)} m`)}catch(e){this._locationError=this._t(e.code===1?"locationDenied":"locationFailed")}finally{this._locationBusy=!1,this._render()}}async _loadLocation(t,e){let i=this._locationGeneration;this._locationBusy=!0,this._locationError=null,this._render();try{let a={latitude:t.latitude,longitude:t.longitude},n=await this._hass.callWS({type:"atmosphere/location",...a,language:this._data?.language||"nl"});if(i!==this._locationGeneration)return;this._locationGeneration++,this._deviceCoords=a,this._data=n,this._locationNote=e,this._error=null}catch(a){this._locationError=this._t(a.code==="unsupported_location"?"unsupported":"locationFailed")}finally{this._locationBusy=!1,this._render()}}_hourChart(t,e="temperature"){let i=t.map(x=>x[e]).filter(C);if(!i.length)return"";let a=Math.min(...i),n=Math.max(...i),p=Math.max(1,n-a),d=e==="temperature"?"\xB0":e==="wind_speed"?" km/h":" mm",h=new Date(t[0].datetime).getTime(),w=Math.max(1,new Date(t.at(-1).datetime)-h),o=x=>12+(new Date(x.datetime)-h)/w*476,y=t.filter(x=>C(x[e])).map(x=>[o(x),100-(x[e]-a)/p*75]).filter((x,R,P)=>!R||x[0]>P[R-1][0]),g=it(y),v=g+`L${y.at(-1)[0]},110L${y[0][0]},110Z`,E=t.filter((x,R)=>R%Math.max(1,Math.floor(t.length/5))===0);return`<div class="detail-chart"><svg viewBox="0 0 500 140" role="img" aria-label="${this._t(e==="temperature"?"temperature":e==="wind_speed"?"wind":"rain")}"><defs><linearGradient id="forecast-fill" x2="0" y2="1"><stop stop-color="#a5e8f3" stop-opacity=".3"/><stop offset="1" stop-color="#a5e8f3" stop-opacity="0"/></linearGradient></defs><path d="M12 110H488M12 65H488M12 20H488" stroke="white" stroke-opacity=".1"/><path d="${v}" fill="url(#forecast-fill)"/><path data-forecast-curve d="${g}" fill="none" stroke="#aeeaf3" stroke-width="3" stroke-linecap="round"/>${y.map(([x,R])=>`<circle cx="${x}" cy="${R}" r="2.6" fill="#e4faff" stroke="#3b6888" stroke-width="1.5"/>`).join("")}${E.map(x=>`<text x="${o(x)}" y="133" fill="#cadbea" font-size="11" text-anchor="middle">${this._time(x.datetime,{minute:void 0})}</text>`).join("")}</svg><div class="chart-times"><span>${m(a,e==="precipitation"?1:0)}${d}</span><span>${m(n,e==="precipitation"?1:0)}${d}</span></div></div>`}},rt=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}setConfig(t){this._config=t,this._render()}set hass(t){this._hass=t,this._render()}_render(){if(!this._hass||!this._config)return;let t=Object.values(this._hass.states).filter(e=>e.entity_id.startsWith("weather.")&&e.attributes.atmosphere_entry_id);this.shadowRoot.innerHTML=`<style>.section-toggle{display:flex;gap:8px;margin:8px 0}fieldset{border:1px solid var(--divider-color);border-radius:10px}label{display:grid;gap:8px;margin:16px 0}select,input{padding:12px;font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px}</style><label>Atmosphere location<select id="entity">${t.map(e=>`<option value="${k(e.entity_id)}" ${this._config.entity===e.entity_id?"selected":""}>${k(e.attributes.friendly_name||e.entity_id)}</option>`).join("")}</select></label><label>Name<input id="name" value="${k(this._config.name||"")}"/></label><label>Card language<select id="language"><option value="auto">Location language</option><option value="nl">Nederlands</option><option value="en">English</option></select></label><fieldset><legend>Visible panels</legend>${wt.map(e=>`<label class="section-toggle"><input type="checkbox" data-section-choice="${e}" ${(this._config.show||bt).includes(e)?"checked":""}/>${xt.en[e]||(e==="sun"?"Sunrise and sunset":e)}</label>`).join("")}</fieldset>`,this.shadowRoot.querySelectorAll("[data-section-choice]").forEach(e=>e.addEventListener("change",()=>{let i=[...this.shadowRoot.querySelectorAll("[data-section-choice]:checked")].map(a=>a.dataset.sectionChoice);this._config={...this._config,show:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))})),this.shadowRoot.querySelector("#language").value=this._config.language||"auto",this.shadowRoot.querySelectorAll("input:not([type=checkbox]),select").forEach(e=>e.addEventListener("change",()=>{let i={...this._config,[e.id]:e.value};e.id==="language"&&e.value==="auto"&&delete i.language,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}))}};customElements.get("atmosphere-card")||customElements.define("atmosphere-card",ot);customElements.get("atmosphere-card-editor")||customElements.define("atmosphere-card-editor",rt);window.customCards=window.customCards||[];window.customCards.some(s=>s.type==="atmosphere-card")||window.customCards.push({type:"atmosphere-card",name:"Atmosphere Weather",description:"Animated skies, KMI forecasts and local warnings.",preview:!0});
