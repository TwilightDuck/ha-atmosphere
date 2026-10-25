var we=Object.create;var le=Object.defineProperty;var _e=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var ve=Object.getPrototypeOf,$e=Object.prototype.hasOwnProperty;var ke=(p,e)=>()=>(e||p((e={exports:{}}).exports,e),e.exports);var ze=(p,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ye(e))!$e.call(p,i)&&i!==t&&le(p,i,{get:()=>e[i],enumerable:!(a=_e(e,i))||a.enumerable});return p};var Me=(p,e,t)=>(t=p!=null?we(ve(p)):{},ze(e||!p||!p.__esModule?le(t,"default",{value:p,enumerable:!0}):t,p));var pe=ke((de,ee)=>{(function(){"use strict";var p=Math.PI,e=Math.sin,t=Math.cos,a=Math.tan,i=Math.asin,n=Math.atan2,g=Math.acos,s=p/180,c=1e3*60*60*24,f=2440588,o=2451545;function _(r){return r.valueOf()/c-.5+f}function u(r){return new Date((r+.5-f)*c)}function M(r){return _(r)-o}var S=s*23.4397;function x(r,l){return n(e(r)*t(S)-a(l)*e(S),t(r))}function V(r,l){return i(e(l)*t(S)+t(l)*e(S)*e(r))}function C(r,l,d){return n(e(r),t(r)*e(l)-a(d)*t(l))}function Z(r,l,d){return i(e(l)*e(d)+t(l)*t(d)*t(r))}function q(r,l){return s*(280.16+360.9856235*r)-l}function Y(r){return r<0&&(r=0),2967e-7/Math.tan(r+.00312536/(r+.08901179))}function K(r){return s*(357.5291+.98560028*r)}function O(r){var l=s*(1.9148*e(r)+.02*e(2*r)+3e-4*e(3*r)),d=s*102.9372;return r+l+d+p}function J(r){var l=K(r),d=O(l);return{dec:V(d,0),ra:x(d,0)}}var h={};h.getPosition=function(r,l,d){var v=s*-d,b=s*l,k=M(r),y=J(k),z=q(k,v)-y.ra;return{azimuth:C(z,b,y.dec),altitude:Z(z,b,y.dec)}};var F=h.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];h.addTime=function(r,l,d){F.push([r,l,d])};var ne=9e-4;function ge(r,l){return Math.round(r-ne-l/(2*p))}function re(r,l,d){return ne+(r+l)/(2*p)+d}function oe(r,l,d){return o+r+.0053*e(l)-.0069*e(2*d)}function fe(r,l,d){return g((e(r)-e(l)*e(d))/(t(l)*t(d)))}function xe(r){return-2.076*Math.sqrt(r)/60}function be(r,l,d,v,b,k,y){var z=fe(r,d,v),D=re(z,l,b);return oe(D,k,y)}h.getTimes=function(r,l,d,v){v=v||0;var b=s*-d,k=s*l,y=xe(v),z=M(r),D=ge(z,b),L=re(0,b,D),I=K(L),P=O(I),G=V(P,0),A=oe(L,I,P),j,B,W,E,N,U,R={solarNoon:u(A),nadir:u(A-.5)};for(j=0,B=F.length;j<B;j+=1)W=F[j],E=(W[0]+y)*s,N=be(E,b,k,G,D,I,P),U=A-(N-A),R[W[1]]=u(U),R[W[2]]=u(N);return R};function se(r){var l=s*(218.316+13.176396*r),d=s*(134.963+13.064993*r),v=s*(93.272+13.22935*r),b=l+s*6.289*e(d),k=s*5.128*e(v),y=385001-20905*t(d);return{ra:x(b,k),dec:V(b,k),dist:y}}h.getMoonPosition=function(r,l,d){var v=s*-d,b=s*l,k=M(r),y=se(k),z=q(k,v)-y.ra,D=Z(z,b,y.dec),L=n(e(z),a(b)*t(y.dec)-e(y.dec)*t(z));return D=D+Y(D),{azimuth:C(z,b,y.dec),altitude:D,distance:y.dist,parallacticAngle:L}},h.getMoonIllumination=function(r){var l=M(r||new Date),d=J(l),v=se(l),b=149598e3,k=g(e(d.dec)*e(v.dec)+t(d.dec)*t(v.dec)*t(d.ra-v.ra)),y=n(b*e(k),v.dist-b*t(k)),z=n(t(d.dec)*e(d.ra-v.ra),e(d.dec)*t(v.dec)-t(d.dec)*e(v.dec)*t(d.ra-v.ra));return{fraction:(1+t(y))/2,phase:.5+.5*y*(z<0?-1:1)/Math.PI,angle:z}};function X(r,l){return new Date(r.valueOf()+l*c/24)}h.getMoonTimes=function(r,l,d,v){var b=new Date(r);v?b.setUTCHours(0,0,0,0):b.setHours(0,0,0,0);for(var k=.133*s,y=h.getMoonPosition(b,l,d).altitude-k,z,D,L,I,P,G,A,j,B,W,E,N,U,R=1;R<=24&&(z=h.getMoonPosition(X(b,R),l,d).altitude-k,D=h.getMoonPosition(X(b,R+1),l,d).altitude-k,P=(y+D)/2-z,G=(D-y)/2,A=-G/(2*P),j=(P*A+G)*A+z,B=G*G-4*P*z,W=0,B>=0&&(U=Math.sqrt(B)/(Math.abs(P)*2),E=A-U,N=A+U,Math.abs(E)<=1&&W++,Math.abs(N)<=1&&W++,E<-1&&(E=N)),W===1?y<0?L=R+E:I=R+E:W===2&&(L=R+(j<0?N:E),I=R+(j<0?E:N)),!(L&&I));R+=2)y=D;var Q={};return L&&(Q.rise=X(b,L)),I&&(Q.set=X(b,I)),!L&&!I&&(Q[j>0?"alwaysUp":"alwaysDown"]=!0),Q},typeof de=="object"&&typeof ee<"u"?ee.exports=h:typeof define=="function"&&define.amd?define(h):window.SunCalc=h})()});var H=Me(pe(),1);var ce=`:host {
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
.radar-stage {
  position: relative;
  aspect-ratio: 1.25;
  background: #192e3f;
  border-radius: 15px;
  overflow: hidden;
}
.radar-stage img {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: contain;
}
.radar-error {
  position: absolute;
  inset: 0;
  background: #172e45;
  place-content: center;
  text-align: center;
  padding: 24px;
  font-size: 16px;
}
.radar-error:not([hidden]) {
  display: grid;
}
.radar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 15px 0;
}
.radar-controls button {
  padding: 8px 10px;
  white-space: nowrap;
  border-radius: 20px;
  background: #ffffff15;
  font-size: 13px;
}
.radar-slider {
  flex: 1;
  min-width: 0;
  accent-color: #b8e4ff;
}
.radar-time {
  font-size: 13px;
  min-width: 44px;
}
.radar-caption {
  font-size: 11px;
  opacity: 0.65;
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
    display: block !important;
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
.radar-layers {
  position: absolute;
  inset: 0;
}
.radar-zoom-controls {
  display: flex;
  gap: 6px;
  position: absolute;
  z-index: 2;
  right: 35px;
  margin-top: 12px;
}
.radar-zoom-controls button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #d7edffe6;
  color: #173449;
  font-size: 24px;
  box-shadow: 0 2px 6px #0002;
}
.radar-stage {
  aspect-ratio: 640/490;
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
`;var he=`<svg
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
`;var ue=ce.replace("CLOUD_TEXTURE",encodeURIComponent(he));var Re=new URL("./radar-base.png",import.meta.url).href,w=p=>String(p??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),m=(p,e=0)=>p==null||!Number.isFinite(Number(p))?"\u2014":Number(p).toFixed(e),$=p=>p!=null&&Number.isFinite(Number(p)),T=(p,e,t)=>Math.max(e,Math.min(t,p)),Te={sunny:["Sunny","Zonnig"],"clear-night":["Clear","Helder"],partlycloudy:["Partly cloudy","Wisselend bewolkt"],cloudy:["Cloudy","Bewolkt"],rainy:["Rain","Regen"],pouring:["Heavy rain","Zware regen"],snowy:["Snow","Sneeuw"],"snowy-rainy":["Sleet","Natte sneeuw"],lightning:["Thunderstorms","Onweer"],"lightning-rainy":["Thunderstorms","Onweer"],fog:["Fog","Mist"],windy:["Windy","Winderig"],"windy-variant":["Windy","Winderig"],hail:["Hail","Hagel"],exceptional:["Severe weather","Zwaar weer"]},me={en:{currentLocation:"Current location",homeLocation:"Saved location",locating:"Getting your location\u2026",locationDenied:"Location permission is needed. Enable it in your browser or choose your app device.",locationFailed:"Your location could not be retrieved.",unsupported:"KMI weather is available in Belgium and Luxembourg.",chooseDevice:"Choose your GPS device",staleLocation:"Location is old or not precise enough. Refresh your Companion app with Exact location enabled.",appLocation:"Use app location",reported:"Reported",zoomIn:"Zoom in",zoomOut:"Zoom out",hourly:"Hourly forecast",daily:"Daily forecast",feels:"Feels like",sunset:"Sunset",sunrise:"Sunrise",air:"Air quality",wind:"Wind",uv:"UV index",rain:"Precipitation",humidity:"Humidity",visibility:"Visibility",pressure:"Pressure",moon:"Moon",radar:"Rain radar",now:"Now",today:"Today",tomorrow:"Tomorrow",high:"H",low:"L",gusts:"Gusts",dew:"Dew point",warnings:"Weather warnings",clear:"No local warnings",unavailable:"Weather unavailable",stale:"Forecast out of date",warnUnavailable:"Warning status unavailable",upcoming:"Upcoming",active:"Active",until:"until",from:"from",close:"Close",pause:"Pause animation",play:"Animate weather",temperature:"Temperature",updated:"Updated",details:"Details",windmap:"Wind map",rainmap:"Rain map",forecast:"Forecast",lowUV:"Low",moderate:"Moderate",highUV:"High",veryHigh:"Very high",extreme:"Extreme",good:"Good",fair:"Fair",poor:"Poor",veryPoor:"Very poor",extremelyPoor:"Extremely poor",excellent:"Excellent",illuminated:"illuminated",nextFull:"Next full moon",new:"New moon",waxCrescent:"Waxing crescent",first:"First quarter",waxGibbous:"Waxing gibbous",full:"Full moon",waneGibbous:"Waning gibbous",last:"Last quarter",waneCrescent:"Waning crescent",rainSoon:"Rain in the next 90 minutes",noRain:"No rain expected in the next 90 minutes",mapError:"Radar image unavailable",refresh:"Refresh",outlook:"Weather outlook",source:"Weather data",km:"km",rainAmount:"Rainfall",light:"Light",heavy:"Heavy",model:"Modelled air quality",unavailableDetail:"This source is temporarily unavailable.",coverage:"KMI warnings returned for this location. Read the affected areas below.",current:"Current conditions"},nl:{currentLocation:"Huidige locatie",homeLocation:"Opgeslagen locatie",locating:"Je locatie wordt opgehaald\u2026",locationDenied:"Locatietoestemming is nodig. Schakel die in je browser in of kies je app-apparaat.",locationFailed:"Je locatie kon niet worden opgehaald.",unsupported:"KMI-weer is beschikbaar in Belgi\xEB en Luxemburg.",chooseDevice:"Kies je GPS-apparaat",staleLocation:"De locatie is te oud of niet nauwkeurig genoeg. Ververs de Companion-app met Exacte locatie ingeschakeld.",appLocation:"App-locatie gebruiken",reported:"Gemeld",zoomIn:"Inzoomen",zoomOut:"Uitzoomen",hourly:"Uurlijkse verwachting",daily:"Dagelijkse verwachting",feels:"Gevoelstemperatuur",sunset:"Zonsondergang",sunrise:"Zonsopgang",air:"Luchtkwaliteit",wind:"Wind",uv:"UV-index",rain:"Neerslag",humidity:"Luchtvochtigheid",visibility:"Zicht",pressure:"Luchtdruk",moon:"Maan",radar:"Regenradar",now:"Nu",today:"Vandaag",tomorrow:"Morgen",high:"H",low:"L",gusts:"Windstoten",dew:"Dauwpunt",warnings:"Weerwaarschuwingen",clear:"Geen lokale waarschuwingen",unavailable:"Weer niet beschikbaar",stale:"Verwachting verouderd",warnUnavailable:"Waarschuwingsstatus niet beschikbaar",upcoming:"Binnenkort",active:"Actief",until:"tot",from:"vanaf",close:"Sluiten",pause:"Animatie pauzeren",play:"Weer animeren",temperature:"Temperatuur",updated:"Bijgewerkt",details:"Details",windmap:"Windkaart",rainmap:"Regenkaart",forecast:"Verwachting",lowUV:"Laag",moderate:"Matig",highUV:"Hoog",veryHigh:"Zeer hoog",extreme:"Extreem",good:"Goed",fair:"Redelijk",poor:"Slecht",veryPoor:"Zeer slecht",extremelyPoor:"Extreem slecht",excellent:"Uitstekend",illuminated:"verlicht",nextFull:"Volgende volle maan",new:"Nieuwe maan",waxCrescent:"Wassende maan",first:"Eerste kwartier",waxGibbous:"Wassende maan",full:"Volle maan",waneGibbous:"Afnemende maan",last:"Laatste kwartier",waneCrescent:"Afnemende maan",rainSoon:"Regen in de komende 90 minuten",noRain:"Geen regen verwacht in de komende 90 minuten",mapError:"Radarbeeld niet beschikbaar",refresh:"Vernieuwen",outlook:"Weerbericht",source:"Weergegevens",km:"km",rainAmount:"Regenhoeveelheid",light:"Licht",heavy:"Zwaar",model:"Gemodelleerde luchtkwaliteit",unavailableDetail:"Deze bron is tijdelijk niet beschikbaar.",coverage:"KMI-waarschuwingen voor deze locatie. Lees hieronder voor welke gebieden ze gelden.",current:"Huidige omstandigheden"}};function te(p,e=!1,t=28){let a=/rain|pour|hail/.test(p),i=/snow/.test(p),n=/lightning|exceptional/.test(p),g=/cloud|rain|pour|snow|hail|lightning/.test(p),s=p==="clear-night"||e,c="";return/wind/.test(p)?c='<path d="M4 11h21c8 0 8-9 2-9-4 0-5 3-4 5M1 18h32c7 0 7 9 1 9-4 0-4-3-4-4M6 25h12" fill="none" stroke="#e1f2ff" stroke-width="2.4" stroke-linecap="round"/>':p==="fog"?c='<path d="M7 9h26M2 16h34M6 23h30M12 30h20" stroke="#e0edf4" stroke-width="3" stroke-linecap="round"/>':((!g||p==="partlycloudy")&&(c+=s?'<path d="M28 2a15 15 0 1 0 10 23A14 14 0 0 1 28 2Z" fill="#eff5ff"/>':'<g stroke="#ffd05c" stroke-width="2.2" stroke-linecap="round"><path d="M20 1v3m0 28v3M3 18h3m28 0h3M8 6l2 3m20 19 2 2M8 30l2-3M30 8l2-2"/><circle cx="20" cy="18" r="10" fill="#ffd05c" stroke="none"/></g>'),g&&(c+='<path d="M9 29C-1 29-1 16 8 15 10 3 28 4 30 16 40 15 43 29 32 29Z" fill="#f4f8ff"/><path d="M9 29h23c7 0 8-4 8-4H1s2 4 8 4" fill="#c4d8ec" opacity=".5"/>'),a&&(c+='<path d="m12 33-2 5m12-5-2 5m12-5-2 5" stroke="#74d3ff" stroke-width="2.6" stroke-linecap="round"/>'),i&&(c+='<g fill="#b7e6ff"><circle cx="12" cy="35" r="2"/><circle cx="23" cy="38" r="2"/><circle cx="33" cy="34" r="2"/></g>'),n&&(c+='<path d="m22 24-7 10h6l-3 9 12-14h-8l4-5Z" fill="#ffcf55"/>')),`<svg class="weather-icon" width="${t}" height="${t}" viewBox="0 0 42 44" aria-hidden="true">${c}</svg>`}var Ce=["current","warnings","hourly","daily","feels","sun","air","wind","uv","rain","radar","moon","humidity","visibility","pressure"],Le={hourly:"\u25F7",daily:"\u25A6",feels:"\u2668",sunset:"\u2600",sunrise:"\u2600",air:"\u283F",wind:"\u224B",uv:"\u2600",rain:"\u25D2",humidity:"\u2667",visibility:"\u25C9",pressure:"\u25F4",moon:"\u263E",radar:"\u25C9",warnings:"\u25B3"},ae=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._mode="temperature",this._paused=!1,this._fetching=!1,this._reduced=matchMedia("(prefers-reduced-motion: reduce)"),this.shadowRoot.innerHTML=`<style>${ue}</style><ha-card><div class="atmosphere"><div class="sky" aria-hidden="true"><div class="sun-orb"></div><div class="rays"></div><div class="stars"></div><div class="clouds far"></div><div class="clouds near"></div><canvas class="precipitation"></canvas><div class="horizon"></div></div><div class="body"></div></div></ha-card><dialog aria-labelledby="detail-title"><div class="dialog-inner"></div></dialog>`,this.shadowRoot.addEventListener("click",e=>{let t=e.target.closest("[data-action]");t&&this._action(t.dataset.action,t.dataset.value)}),this.shadowRoot.querySelector("dialog").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.close()}),this._onVisibility=()=>this._animate(),this._onMotion=()=>{this._animate(),this._reduced.matches&&(this._radarPlaying=!1,clearInterval(this._radarTimer)),this._render()},this.shadowRoot.querySelector("dialog").addEventListener("close",()=>clearInterval(this._radarTimer)),this._radarFrame=0,this._radarZoom=2.6,this._skyTime=0}setConfig(e){if(e.entity&&!e.entity.startsWith("weather."))throw new Error("Select an Atmosphere weather entity.");this._config={...e},this._locationGeneration=(this._locationGeneration||0)+1,this._locationBusy=!1,this._locationError=null,this._deviceCoords=null,this._locationNote=null,this._data=null,this._lastKey=null,this._hass&&this._fetch()}static getConfigElement(){return document.createElement("atmosphere-card-editor")}static getStubConfig(e){return{entity:Object.keys(e?.states||{}).find(t=>e.states[t].attributes.atmosphere_entry_id)}}getCardSize(){return 15}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6}}set hass(e){if(this._hass=e,!this._config)return;let t=this._entity(),a=`${t?.attributes?.updated_at}|${t?.state}|${e.connection?.connected}`;(!this._data||a!==this._lastKey)&&(this._lastKey=a,this._fetch())}_entity(){let e=this._hass?.states||{};return e[this._config?.entity]||(this._config?.entity?null:Object.values(e).find(t=>t.entity_id.startsWith("weather.")&&t.attributes.atmosphere_entry_id))}connectedCallback(){this._observer||=new IntersectionObserver(e=>{this._visible=e[0].isIntersecting,this._animate()}),this._observer.observe(this),this._resize||=new ResizeObserver(()=>this._sizeCanvas()),this._resize.observe(this),document.addEventListener("visibilitychange",this._onVisibility),this._reduced.addEventListener("change",this._onMotion),this._timer=setInterval(()=>{this._render(),(!this._data||Date.now()-new Date(this._data.updated_at)>8*6e4)&&this._fetch()},6e4),this._render(),this._hass&&this._fetch()}disconnectedCallback(){clearInterval(this._timer),clearInterval(this._radarTimer),cancelAnimationFrame(this._raf),this._observer?.disconnect(),this._resize?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),this._reduced.removeEventListener("change",this._onMotion)}async _fetch(){if(!this._hass||!this._config||this._fetching)return;this._fetching=!0;let e=this._config,t=this._locationGeneration;try{let a=this._entity();if(this._config.entity&&!a)throw new Error(`Entity unavailable: ${this._config.entity}`);let i=await this._hass.callWS(this._deviceCoords?{type:"atmosphere/location",...this._deviceCoords,language:this._data?.language||"nl"}:{type:"atmosphere/data",...a?.attributes?.atmosphere_entry_id?{entry_id:a.attributes.atmosphere_entry_id}:{}});if(e!==this._config||t!==this._locationGeneration)return;this._data=i,this._error=null}catch(a){this._error=a.message||"Connection unavailable"}finally{this._fetching=!1,e!==this._config?this._fetch():this._render()}}get _nl(){return(this._config?.language||this._data?.language||this._hass?.language||"en").startsWith("nl")}_t(e){return me[this._nl?"nl":"en"][e]||e}_condition(e){return Te[e]?.[this._nl?1:0]||"\u2014"}_time(e,t={}){return!e||!Number.isFinite(new Date(e).getTime())?"\u2014":new Intl.DateTimeFormat(this._nl?"nl-BE":"en-GB",{timeZone:this._data?.timezone||"Europe/Brussels",hour:"2-digit",minute:"2-digit",...t}).format(new Date(e))}_date(e,t={}){return new Intl.DateTimeFormat(this._nl?"nl-BE":"en-GB",{timeZone:this._data?.timezone||"Europe/Brussels",...t}).format(new Date(e))}_temp(e){return`${m(e)}${$(e)?"\xB0":""}`}_isStale(){return this._error||!this._data?.available||Date.now()-new Date(this._data.updated_at).getTime()>20*6e4}_warnings(){return(this._data?.warnings||[]).filter(e=>new Date(e.ends_at)>new Date).sort((e,t)=>(t.level||0)-(e.level||0)||new Date(e.starts_at)-new Date(t.starts_at))}_panel(e,t,a=e,i=""){return`<button class="panel ${i}" data-section="${e==="sunrise"||e==="sunset"?"sun":e}" data-action="detail" data-value="${w(a)}"><h2><span aria-hidden="true">${Le[e]||"\u25C9"}</span>${this._t(e)}<span class="chevron" aria-hidden="true">\u203A</span></h2>${t}</button>`}_render(){if(!this.isConnected)return;let e=this.shadowRoot.querySelector(".body");if(!this._data){e.innerHTML=`<div class="empty"><h1>Atmosphere</h1><p>${this._error?w(this._error):this._nl?"Het weer wordt opgehaald\u2026":"Fetching the weather\u2026"}</p><button data-action="refresh">${this._t("refresh")}</button></div>`;return}let t=this._data,a=t.current,i=t.daily[0]||{},n=this._warnings(),g=this._isStale(),s=Date.now()<new Date(t.sun.sunrise)||Date.now()>new Date(t.sun.sunset),c=a.condition||"cloudy",f=this.shadowRoot.querySelector(".atmosphere");f.dataset.condition=c,f.dataset.night=String(s),f.classList.toggle("paused",this._paused||this._reduced.matches||!this._visible||document.hidden);let o=t.hourly.filter(h=>new Date(h.datetime).getTime()>Date.now()-36e5).slice(0,24).map((h,F)=>F===0?{...h,temperature:a.temperature,condition:c,is_daytime:!s}:h),_=e.querySelector(".hours")?.scrollLeft||0,u=e.querySelector(".days")?.scrollTop||0,M=H.default.getMoonIllumination(new Date),S=Date.now()>new Date(t.sun.sunset).getTime(),x=S?"sunrise":"sunset",V=S?H.default.getTimes(new Date(Date.now()+864e5),t.latitude,t.longitude).sunrise:t.sun.sunset,C=t.air?.european_aqi,Z=$(C)?this._t(C<=20?"good":C<=40?"fair":C<=60?"moderate":C<=80?"poor":C<=100?"veryPoor":"extremelyPoor"):"\u2014",q=a.uv_index,Y=$(q)?this._t(q<3?"lowUV":q<6?"moderate":q<8?"highUV":q<11?"veryHigh":"extreme"):"\u2014",K=$(a.wind_bearing)?["N","NE","E","SE","S","SW","W","NW"][Math.round(a.wind_bearing/45)%8]:"\u2014",O=t.rain.filter(h=>new Date(h.datetime)>new Date&&new Date(h.datetime)<new Date(Date.now()+90*6e4)),J=O.some(h=>(h.precipitation||0)>0||h.might_rain);e.innerHTML=`
      <div class="toolbar"><button class="location-pin ${this._deviceCoords?"selected":""}" data-action="locate" aria-label="${this._t("currentLocation")}" aria-busy="${!!this._locationBusy}" title="${this._t("currentLocation")}">\u2316</button><span>${w(this._deviceCoords?t.name:this._config.name||t.name)}</span>${this._deviceCoords?`<button class="home-location" data-action="home" aria-label="${this._t("homeLocation")}">\u2302</button>`:""}<button class="motion" data-action="motion" aria-label="${this._t(this._paused||this._reduced.matches?"play":"pause")}" aria-pressed="${!this._paused&&!this._reduced.matches}">${this._paused?"\u25B7":"\u2161"}</button></div>
      <header class="hero" data-section="current"><h1>${w(this._deviceCoords?t.name:this._config.name||t.name)}</h1><div class="temperature">${this._temp(a.temperature)}</div><div class="condition">${this._condition(c)}</div><div class="hero-range">${$(a.apparent_temperature)?`${this._t("feels")} ${this._temp(a.apparent_temperature)}<span>\xB7</span>`:""}${this._t("high")}:${this._temp(i.temperature)} ${this._t("low")}:${this._temp(i.templow)}</div></header>
      ${g?`<div class="connection-status" role="status">${this._t("stale")} \xB7 ${this._t("warnUnavailable")}<button data-action="refresh">${this._t("refresh")}</button></div>`:""}
      ${this._locationBusy||this._locationError?`<div class="location-status" role="status">${w(this._locationBusy?this._t("locating"):this._locationError)}${!this._locationBusy&&this._appTrackers().length?`<button data-action="app-location">${this._t("appLocation")}</button>`:""}</div>`:""}
      ${this._locationNote?`<div class="location-note">${w(this._locationNote)}</div>`:""}
      <div class="forecast-grid">
        <button data-section="warnings" class="panel warning ${n.length?"has-warning":""} level-${n[0]?.level||0}" data-action="detail" data-value="warnings"><h2><span aria-hidden="true">${n.length?"\u25B3":"\u2713"}</span>${this._t("warnings")}<span class="chevron">\u203A</span></h2>${n.length?`<div class="warning-title">${w(n[0].friendly_name)}</div><div class="warning-line"><span class="severity-dot"></span>${this._t(g?"stale":new Date(n[0].starts_at)<=new Date?"active":"upcoming")} \xB7 ${this._time(n[0].starts_at)} \u2013 ${this._time(n[0].ends_at)}</div><p class="warning-preview">${w(n[0].text)}</p>${n.length>1?`<span class="warning-count">+${n.length-1}</span>`:""}`:`<div class="warning-title">${this._t(g?"warnUnavailable":"clear")}</div><div class="warning-line">KMI / IRM</div>`}</button>
        <section data-section="hourly" class="panel hourly"><div class="panel-header"><h2><span aria-hidden="true">\u25F7</span>${this._t("hourly")}</h2><div class="segmented" role="group" aria-label="${this._t("hourly")}">${["temperature","rain","wind"].map((h,F)=>`<button data-action="mode" data-value="${h}" aria-label="${this._t(h)}" aria-pressed="${this._mode===h}">${["\xB0","\u2667","\u224B"][F]}</button>`).join("")}</div></div><div class="hours">${o.map((h,F)=>`<button class="hour" data-action="hour" data-value="${w(h.datetime)}"><span>${F===0?this._t("now"):this._time(h.datetime,{minute:void 0})}</span>${te(h.condition,!h.is_daytime,32)}<span class="chance">${$(h.precipitation_probability)?m(h.precipitation_probability)+"%":"\u2014"}</span><strong>${this._mode==="temperature"?this._temp(h.temperature):this._mode==="rain"?m(h.precipitation,1):m(h.wind_speed)}</strong>${this._mode!=="temperature"?`<small>${this._mode==="rain"?"mm":"km/h"}</small>`:""}</button>`).join("")}</div></section>
        <section data-section="daily" class="panel daily"><h2><span aria-hidden="true">\u25A6</span>${t.daily.length} ${this._nl?"dagen":"days"}</h2><div class="days">${this._dailyRows(t.daily)}</div></section>
        <div class="metrics">
          ${this._panel("feels",`<div class="metric-value">${this._temp(a.apparent_temperature)}</div><div class="metric-note">${this._nl?"Werkelijk":"Actual"} ${this._temp(a.temperature)}</div><div class="feels-line"><span style="left:${T(50+((a.apparent_temperature??a.temperature)-a.temperature)*4,5,95)}%"></span></div>`)}
          ${this._panel(x,`<div class="metric-value">${this._time(V)}</div>${this._sunArc()}<div class="metric-note sun-note">${this._t(x==="sunset"?"sunrise":"sunset")} ${this._time(t.sun[x==="sunset"?"sunrise":"sunset"])}</div>`,"sun")}
          ${this._panel("air",`<div class="aq-head"><span class="metric-value">${m(C)}</span><span class="aq-category">${Z}</span></div><div class="spectrum aqi"><i style="left:${T((C||0)/120*100,2,98)}%"></i></div><div class="metric-note">European AQI</div>`)}
          ${this._panel("wind",`<div class="wind-layout"><div><span class="metric-value">${m(a.wind_speed)}</span><span class="unit">km/h</span><div class="metric-note">${this._t("gusts")} ${m(a.wind_gust_speed)}</div></div><div class="compass"><span class="north">N</span><span class="west">W</span><span class="east">E</span><span class="south">S</span><div class="needle" style="transform:rotate(${$(a.wind_bearing)?a.wind_bearing:0}deg)"></div><b>${K}</b></div></div>`)}
          ${this._panel("uv",`<div class="metric-value">${m(q,1)}</div><div class="metric-note">${Y}</div><div class="spectrum uv"><i style="left:${T((q||0)/12*100,2,98)}%"></i></div>`)}
          ${this._panel("rain",`<div class="metric-value">${m(i.precipitation,1)}<span class="unit">mm</span></div><div class="metric-note">${this._t("today")}</div><div class="mini-rain">${o.slice(0,18).map(h=>`<i style="height:${T((h.precipitation||0)*35+3,3,40)}px"></i>`).join("")}</div>`)}
        </div>
        <section data-section="radar" class="panel radar-panel"><div class="panel-header"><h2><span aria-hidden="true">\u25C9</span>${this._t("radar")}</h2><button class="text-button" data-action="detail" data-value="radar">${this._t("rainmap")} <span aria-hidden="true">\u2197</span></button></div><button class="rain-outlook" data-action="detail" data-value="radar"><span>${this._t(J?"rainSoon":"noRain")}</span><span aria-hidden="true">\u203A</span></button><div class="rain-chart">${this._rainChart(O)}</div><div class="chart-times"><span>${this._t("now")}</span><span>+30 min</span><span>+60 min</span><span>+90 min</span></div></section>
        ${this._panel("moon",`<div class="moon-layout"><div><div class="moon-phase">${this._moonName(M.phase)}</div><div class="metric-note">${m(M.fraction*100)}% ${this._t("illuminated")}</div><div class="moon-date">${this._date(this._nextFullMoon(),{day:"numeric",month:"short"})}<span>${this._t("nextFull")}</span></div></div><canvas class="moon" width="240" height="240" aria-hidden="true"></canvas></div>`,"moon","moon-panel")}
        <div class="small-metrics">${this._panel("humidity",`<div class="small-value">${m(a.humidity)}<span>%</span></div><div class="metric-note">${this._t("dew")} ${this._temp(a.dew_point)}</div>`)}${this._panel("visibility",`<div class="small-value">${m(a.visibility,1)}<span>km</span></div>`)}${this._panel("pressure",`<div class="small-value">${m(a.pressure)}<span>hPa</span></div><div class="pressure-scale"><span>980</span><i style="left:${T(((a.pressure||1013)-980)/60*100,0,100)}%"></i><span>1040</span></div>`)}</div>
      </div><footer><span>${this._t("updated")} ${this._time(t.updated_at)} \xB7 KMI / IRM</span><button data-action="detail" data-value="source">${this._t("source")} \u24D8</button></footer>`,e.querySelector(".hours").scrollLeft=_,e.querySelector(".days").scrollTop=u,this._applyVisibility(),this._drawMoon(e.querySelector(".moon")),this._sizeCanvas(),this._animate()}_dailyRows(e){let t=e.flatMap(n=>[n.temperature,n.templow]).filter($),a=Math.min(...t)-1,i=Math.max(...t)+1;return e.map((n,g)=>`<button class="day" data-action="day" data-value="${g}" aria-label="${w(this._date(`${n.datetime.slice(0,10)}T12:00:00`,{weekday:"long"}))}: ${this._temp(n.templow)} \u2013 ${this._temp(n.temperature)}"><span class="day-name">${g===0?this._t("today"):this._date(`${n.datetime.slice(0,10)}T12:00:00`,{weekday:"short"})}</span><span class="day-condition">${te(n.condition,!1,28)}<small>${$(n.precipitation_probability)?m(n.precipitation_probability)+"%":""}</small></span><span class="low">${this._temp(n.templow)}</span><span class="range"><span style="left:${T(((n.templow??n.temperature)-a)/(i-a)*100,0,100)}%;width:${Math.max(3,((n.temperature??a)-(n.templow??n.temperature))/(i-a)*100)}%"></span>${g===0&&$(this._data.current.temperature)?`<i style="left:${T((this._data.current.temperature-a)/(i-a)*100,0,100)}%"></i>`:""}</span><span class="high">${this._temp(n.temperature)}</span></button>`).join("")}_sunArc(){let e=this._data,t=new Date(e.sun.sunrise).getTime(),a=new Date(e.sun.sunset).getTime(),i=T((Date.now()-t)/(a-t),0,1),n=10+180*i,g=57-Math.sin(i*Math.PI)*47;return`<svg class="sun-arc" viewBox="0 0 200 76" aria-hidden="true"><path d="M-10 65 Q10 65 40 35 Q100 -28 160 35 Q190 65 210 65" fill="none" stroke="white" stroke-opacity=".22" stroke-width="5"/><path d="M0 57h200" stroke="white" stroke-opacity=".3"/><circle cx="${n}" cy="${g}" r="6" fill="#fff8d9" style="filter:drop-shadow(0 0 6px #fff)"/></svg>`}_rainChart(e){if(!e.length)return'<span class="no-data">\u2014</span>';let t=Math.max(1,...e.map(i=>i.precipitation||0)),a=i=>T((new Date(i.datetime)-Date.now())/(90*6e4)*500,0,500);return`<svg viewBox="0 0 500 64" preserveAspectRatio="none" aria-label="${this._t("rain")}"><path d="M0 62H500M0 32H500" stroke="white" stroke-opacity=".1"/>${e.map((i,n)=>`<rect x="${a(i)}" y="${61-(i.precipitation||0)/t*56}" width="${Math.max(1,500/e.length-2)}" height="${Math.max(1,(i.precipitation||0)/t*56)}" fill="#91dbfa" rx="2"/>`).join("")}</svg>`}_moonName(e){return this._t(["new","waxCrescent","first","waxGibbous","full","waneGibbous","last","waneCrescent"][Math.round(e*8)%8])}_nextFullMoon(){let e=H.default.getMoonIllumination(new Date).phase;for(let t=1;t<=768;t++){let a=new Date(Date.now()+t*36e5),i=H.default.getMoonIllumination(a).phase;if(e<.5&&i>=.5)return a;e=i}return new Date(Date.now()+29.53*864e5)}_drawMoon(e){if(!e)return;let t=e.getContext("2d"),a=e.width,i=a*.43,n=a/2,g=H.default.getMoonIllumination(new Date).phase;t.clearRect(0,0,a,a),t.save(),t.beginPath(),t.arc(n,n,i,0,Math.PI*2),t.clip();let s=t.createRadialGradient(n-i*.25,n-i*.3,0,n,n,i);s.addColorStop(0,"#eceff3"),s.addColorStop(.7,"#bdc6d2"),s.addColorStop(1,"#79899d"),t.fillStyle=s,t.fillRect(0,0,a,a);let c=73,f=()=>(c=c*16807%2147483647,(c-1)/2147483646);for(let u=0;u<260;u++){let M=f()*a,S=f()*a,x=2+f()*14;t.beginPath(),t.ellipse(M,S,x,x*.8,f()*6,0,Math.PI*2),t.fillStyle=`rgba(37,52,73,${f()*.15})`,t.fill(),t.strokeStyle="rgba(255,255,255,.09)",t.lineWidth=1,t.stroke()}let o=g<.5,_=Math.cos(g*2*Math.PI);t.beginPath();for(let u=-i;u<=i;u+=1){let M=Math.sqrt(i*i-u*u),S=(o?1:-1)*_*M;u===-i?t.moveTo(n+S,n+u):t.lineTo(n+S,n+u)}for(let u=i;u>=-i;u-=1){let M=Math.sqrt(i*i-u*u);t.lineTo(n+(o?-M:M),n+u)}t.closePath(),t.fillStyle="rgba(7,17,35,.9)",t.fill(),t.restore()}_sizeCanvas(){let e=this.shadowRoot.querySelector(".precipitation"),t=this.getBoundingClientRect();(e.width!==Math.round(t.width)||e.height!==Math.round(Math.min(t.height,1700)))&&(e.width=Math.round(t.width),e.height=Math.round(Math.min(t.height,1700)))}_animate(){cancelAnimationFrame(this._raf),this._raf=null;let e=this.isConnected&&this._visible&&!document.hidden&&!this._paused&&!this._reduced.matches;this.shadowRoot.querySelector(".atmosphere").classList.toggle("paused",!e);let t=this.shadowRoot.querySelector(".precipitation"),a=t.getContext("2d");a.clearRect(0,0,t.width,t.height);let i=this._data?.current?.condition||"";if(!e)return;let n=/(rain|pour|snow|hail|lightning)/.test(i),g=this.shadowRoot.querySelectorAll(".clouds"),s=/snow/.test(i),c=Array.from({length:n?s?65:100:0},()=>({x:Math.random()*t.width,y:Math.random()*t.height,s:.4+Math.random(),r:1+Math.random()*2})),f=null,o=_=>{let u=f===null?0:Math.min((_-f)/1e3,.05);this._skyTime+=u;let M=.5-.5*Math.cos(this._skyTime/28*Math.PI),S=.5+.5*Math.cos(this._skyTime/42*Math.PI);g[0].style.transform=`translateX(${-4+12*M}%) scale(${1.03+.1*M})`,g[1].style.transform=`translateX(${-4+12*S}%) scale(${1.03+.1*S})`,f=_,a.clearRect(0,0,t.width,t.height),a.strokeStyle="rgba(210,233,255,.3)",a.fillStyle="rgba(238,247,255,.7)",a.lineWidth=.8;for(let x of c)x.y+=u*(s?25:530)*x.s,x.x+=u*(s?Math.sin(_/2e3+x.s)*12:-95),x.y>t.height+30&&(x.y=-30,x.x=Math.random()*t.width),x.x<0&&(x.x=t.width),a.beginPath(),s?(a.arc(x.x,x.y,x.r,0,Math.PI*2),a.fill()):(a.moveTo(x.x,x.y),a.lineTo(x.x-4,x.y+18*x.s),a.stroke());this._raf=requestAnimationFrame(o)};this._raf=requestAnimationFrame(o)}_action(e,t){if(e==="refresh")return this._fetch();if(e==="locate")return this._locate();if(e==="app-location")return this._chooseAppLocation();if(e==="use-tracker")return this._useTracker(t);if(e==="home"){this._locationGeneration++,this._locationBusy=!1,this._deviceCoords=null,this._locationNote=null,this._locationError=null,this._fetch();return}if(e==="radar-zoom"){this._radarZoom=T(this._radarZoom+Number(t),1,6),this._zoomRadar();return}if(e==="motion"){this._paused=!this._paused,this._render();return}if(e==="mode"){this._mode=t,this._render();return}if(e==="close"){clearInterval(this._radarTimer),this.shadowRoot.querySelector("dialog").close();return}if(e==="radar-play"){this._radarPlaying=!this._radarPlaying,this._startRadar();return}if(e==="radar-frame"){this._radarFrame=Number(t),this._paintRadar();return}if(e==="map"){this._showMap(t);return}this._openDetail(e==="detail"?t:e,t)}_openDetail(e,t){clearInterval(this._radarTimer);let a=this._data,i=a.current,n=this._t.bind(this),g=n(e),s="",c=o=>`<dl class="detail-stats">${o.map(([_,u])=>`<div><dt>${w(_)}</dt><dd>${w(u)}</dd></div>`).join("")}</dl>`;if(e==="warnings")s=`<p>${n("coverage")}</p>${this._isStale()?`<p class="error">${n("warnUnavailable")}</p>`:""}${this._warnings().map(o=>`<article class="warning-detail level-${o.level}"><h3><span class="severity-dot"></span>${w(o.friendly_name)}</h3><p class="warning-dates">${this._date(o.starts_at,{weekday:"long",day:"numeric",month:"short"})} ${this._time(o.starts_at)} \u2013 ${this._time(o.ends_at)}</p><p>${w(o.text)}</p><a href="https://www.meteo.be/nl/weer/waarschuwingen" target="_blank" rel="noopener noreferrer">KMI / IRM \u2197</a></article>`).join("")||`<p>${n(this._isStale()?"warnUnavailable":"clear")}</p>`}`;else if(e==="day"||e==="hour"){let o=e==="day"?a.daily[Number(t)]:a.hourly.find(u=>u.datetime===t);g=e==="day"?this._date(o.datetime+"T12:00:00",{weekday:"long",day:"numeric",month:"long"}):this._time(o.datetime);let _=e==="day"?a.hourly.filter(u=>this._date(u.datetime,{day:"numeric",month:"numeric"})===this._date(o.datetime+"T12:00:00",{day:"numeric",month:"numeric"})):a.hourly.filter(u=>new Date(u.datetime)>=new Date(o.datetime)).slice(0,12);s=`<div class="detail-weather">${te(o.condition,!o.is_daytime,64)}<div class="detail-temperature">${this._temp(o.temperature)}</div><p>${this._condition(o.condition)}${o.condition_2&&o.condition_2!==o.condition?" \u2192 "+this._condition(o.condition_2):""}</p></div>${o.text?`<p>${w(o.text)}</p>`:""}${_.length?this._hourChart(_):""}${c([[n("low"),this._temp(o.templow)],[n("rain"),`${m(o.precipitation,1)} mm \xB7 ${m(o.precipitation_probability)}%`],[n("wind"),`${m(o.wind_speed)} km/h`],[n("gusts"),`${m(o.wind_gust_speed)} km/h`]])}`}else if(e==="radar")g=n("radar"),s=`<div class="map-switch"><button data-action="map" data-value="radar">${n("rainmap")}</button><button data-action="map" data-value="wind">${n("windmap")}</button></div><div class="radar-zoom-controls"><button data-action="radar-zoom" data-value="-0.5" aria-label="${n("zoomOut")}">\u2212</button><button data-action="radar-zoom" data-value="0.5" aria-label="${n("zoomIn")}">+</button></div><div class="radar-stage"><div class="radar-layers"><img class="radar-base" src="${w(Re)}" alt=""/><img class="radar-frame" alt="${n("radar")}"/><img class="radar-overlay" alt=""/></div><div class="radar-error" hidden>${n("mapError")}</div></div><div class="radar-controls"><button data-action="radar-play" aria-label="${n("play")}">\u25B6 / \u2161</button><input class="radar-slider" type="range" min="0" max="${Math.max(0,a.radar.frames.length-1)}" value="0" aria-label="${n("radar")}"/><time class="radar-time"></time></div><div class="radar-caption">KMI / IRM \xB7 ${w(a.radar.unit||"mm/10min")}</div><div class="map-host"></div>`;else if(e==="wind")s=`<div class="detail-temperature">${m(i.wind_speed)}<span> km/h</span></div>${c([[n("gusts"),`${m(i.wind_gust_speed)} km/h`],[this._nl?"Windrichting":"Direction",`${m(i.wind_bearing)}\xB0`]])}${this._hourChart(a.hourly.filter(o=>new Date(o.datetime)>new Date).slice(0,24),"wind_speed")}<button class="full-button" data-action="map" data-value="wind">${n("windmap")} \u2197</button><div class="map-host"></div>`;else if(e==="sun")g=this._nl?"Zon":"Sun",s=`${this._sunArc()}${c([[n("sunrise"),this._time(a.sun.sunrise)],[n("sunset"),this._time(a.sun.sunset)],[this._nl?"Ochtendschemering":"Dawn",this._time(a.sun.dawn)],[this._nl?"Avondschemering":"Dusk",this._time(a.sun.dusk)]])}`;else if(e==="moon"){let o=H.default.getMoonIllumination(new Date),_=H.default.getMoonTimes(new Date,a.latitude,a.longitude,!0);s=`<canvas class="moon detail-moon" width="400" height="400"></canvas><h3>${this._moonName(o.phase)}</h3>${c([[n("illuminated"),`${m(o.fraction*100,1)}%`],[n("nextFull"),this._date(this._nextFullMoon(),{day:"numeric",month:"long"})],[this._nl?"Maanopkomst":"Moonrise",this._time(_.rise)],[this._nl?"Maanondergang":"Moonset",this._time(_.set)]])}`}else if(e==="air"){let o=a.air;s=`<div class="detail-temperature">${m(o.european_aqi)}</div><p>European AQI \xB7 ${n("model")}</p>${c([["PM2.5",`${m(o.pm2_5,1)} \xB5g/m\xB3`],["PM10",`${m(o.pm10,1)} \xB5g/m\xB3`],["NO\u2082",`${m(o.nitrogen_dioxide,1)} \xB5g/m\xB3`],["O\u2083",`${m(o.ozone,1)} \xB5g/m\xB3`]])}<p>CAMS ENSEMBLE / Open-Meteo \xB7 ${this._time(o.time?o.time*1e3:null)}</p>`}else if(e==="rain")s=`<div class="detail-temperature">${m(a.daily[0]?.precipitation,1)}<span> mm</span></div><p>${n("today")}</p>${this._hourChart(a.hourly.filter(o=>new Date(o.datetime)>new Date).slice(0,24),"precipitation")}<button class="full-button" data-action="detail" data-value="radar">${n("radar")} \u2197</button>`;else if(e==="source")s=`<p>${w(a.attribution)}</p><p>${this._nl?"Voorspellingen en waarschuwingen worden elke 7 minuten opgehaald. Aanvullende modelgegevens elke 30 minuten. Waarschuwingen kunnen een ruimer gebied betreffen: lees de waarschuwingstekst.":"Forecasts and warnings refresh every 7 minutes; supplementary model data every 30 minutes. Warnings may concern a wider area: read the warning text."}</p><p>${this._nl?"Windkaarten worden op verzoek geladen van Windy. Zon- en maangegevens worden lokaal berekend.":"Wind maps load from Windy on request. Sun and moon information is calculated locally."}</p><p>${n("updated")}: ${this._time(a.updated_at)}${this._isStale()?" \xB7 "+n("stale"):""}</p><a href="https://github.com/TwilightDuck/ha-atmosphere" target="_blank" rel="noopener noreferrer">Atmosphere 1.1.0 \u2197</a>`;else{let o={feels:[i.apparent_temperature,"\xB0C"],uv:[i.uv_index,""],humidity:[i.humidity,"%"],visibility:[i.visibility,"km"],pressure:[i.pressure,"hPa"]},[_,u]=o[e]||[null,""];s=`<div class="detail-temperature">${m(_,e==="uv"?1:0)}<span> ${u}</span></div>${$(_)?"":`<p>${n("unavailableDetail")}</p>`}${e==="feels"?c([[n("temperature"),this._temp(i.temperature)],[n("humidity"),`${m(i.humidity)}%`],[n("wind"),`${m(i.wind_speed)} km/h`]]):e==="humidity"?c([[n("dew"),this._temp(i.dew_point)]]):""}`}let f=this.shadowRoot.querySelector("dialog");if(f.querySelector(".dialog-inner").innerHTML=`<div class="dialog-header"><h2 id="detail-title">${w(g)}</h2><button class="close" data-action="close" aria-label="${n("close")}">\xD7</button></div>${s}`,f.open||f.showModal(),e==="moon"&&this._drawMoon(f.querySelector(".moon")),e==="radar"){if(!a.radar.frames.length){f.querySelector(".radar-stage").textContent=n("mapError"),f.querySelector(".radar-controls").remove();return}let o=a.radar.frames;this._radarFrame=Math.max(0,o.findIndex(_=>new Date(_.time)>=new Date)-1),f.querySelector(".radar-overlay").src=this._safeMedia(a.radar.overlay),f.querySelector(".radar-slider").oninput=_=>{this._radarPlaying=!1,clearInterval(this._radarTimer),this._radarFrame=Number(_.target.value),this._paintRadar()},this._zoomRadar(),this._radarPlaying??=!this._reduced.matches,this._startRadar()}}_safeMedia(e){try{let t=new URL(e);return t.protocol==="https:"&&(t.hostname==="app.meteo.be"||t.hostname==="cdn.meteo.be")?t.href:""}catch{return""}}_paintRadar(){let e=this.shadowRoot.querySelector("dialog"),t=this._data.radar.frames[this._radarFrame];if(!t||!e.open)return;let a=e.querySelector(".radar-frame");a&&(a.onerror=()=>{e.querySelector(".radar-error").hidden=!1},a.onload=()=>{e.querySelector(".radar-error").hidden=!0},a.src=this._safeMedia(t.url),e.querySelector(".radar-time").textContent=this._time(t.time),e.querySelector(".radar-slider").value=this._radarFrame)}_startRadar(){clearInterval(this._radarTimer);let e=this.shadowRoot.querySelector('[data-action="radar-play"]');e&&(e.textContent=this._radarPlaying?"\u2161":"\u25B6",e.setAttribute("aria-label",this._t(this._radarPlaying?"pause":"play"))),this._paintRadar(),this._radarPlaying&&this._data.radar.frames.length>0&&(this._radarTimer=setInterval(()=>{document.hidden||!this.shadowRoot.querySelector("dialog").open||(this._radarFrame=(this._radarFrame+1)%this._data.radar.frames.length,this._paintRadar())},900))}_showMap(e){let t=this.shadowRoot.querySelector("dialog .map-host");if(!t)return;let a=this._data,i=new URL("https://embed.windy.com/embed.html");i.search=new URLSearchParams({type:"map",location:"coordinates",metricWind:"km/h",metricTemp:"\xB0C",zoom:e==="radar"?"10":"9",overlay:e,product:"ecmwf",level:"surface",lat:a.latitude.toFixed(2),lon:a.longitude.toFixed(2),detailLat:a.latitude.toFixed(2),detailLon:a.longitude.toFixed(2),marker:"true",calendar:"now"}).toString(),t.innerHTML=`<iframe title="${this._t(e==="wind"?"windmap":"rainmap")}" src="${w(i.href)}" referrerpolicy="no-referrer" loading="lazy" allowfullscreen></iframe><a href="${w(i.href)}" target="_blank" rel="noopener noreferrer">Windy \u2197</a>`,t.scrollIntoView({block:"nearest",behavior:this._reduced.matches?"instant":"smooth"})}_zoomRadar(){let e=this.shadowRoot.querySelector(".radar-layers");if(!e)return;let t=this._data.radar.center||[.5,.5],a=$(t[0])?T(t[0],0,1):.5,i=$(t[1])?T(t[1],0,1):.5;e.style.transform=`translate(${50-a*100}%, ${50-i*100}%) scale(${this._radarZoom})`,e.style.transformOrigin=`${a*100}% ${i*100}%`}_applyVisibility(){let e=this.shadowRoot,t=this._config.show;e.querySelectorAll("[data-section]").forEach(a=>a.hidden=Array.isArray(t)&&!t.includes(a.dataset.section));for(let a of[".metrics",".small-metrics"]){let i=e.querySelector(a),n=[...i.children].filter(g=>!g.hidden).length;i.hidden=n===0,i.dataset.count=n}for(let a of[[".warning",".hourly"],[".daily",".metrics"],[".radar-panel",".moon-panel"]]){let[i,n]=a.map(g=>e.querySelector(g));i.hidden&&!n.hidden&&(n.style.gridColumn="1 / -1"),n.hidden&&!i.hidden&&(i.style.gridColumn="1 / -1")}}_appTrackers(){let e=this._hass?.states||{},t=this._hass?.user?.id;return t?[...new Set(Object.values(e).filter(i=>i.entity_id.startsWith("person.")&&i.attributes.user_id===t).flatMap(i=>i.attributes.device_trackers||[]))].map(i=>e[i]).filter(i=>i?.attributes.source_type==="gps"&&$(i.attributes.latitude)&&$(i.attributes.longitude)):[]}_trackerFresh(e){let t=e?.attributes||{};return e&&!["unknown","unavailable"].includes(e.state)&&$(t.latitude)&&$(t.longitude)&&$(t.gps_accuracy)&&t.gps_accuracy>=0&&t.gps_accuracy<=250&&Date.now()-new Date(e.last_updated).getTime()<=15*6e4}_chooseAppLocation(){let e=this._appTrackers();if(e.length===1&&this._trackerFresh(e[0]))return this._useTracker(e[0].entity_id);let t=this.shadowRoot.querySelector("dialog");t.querySelector(".dialog-inner").innerHTML=`<div class="dialog-header"><h2 id="detail-title">${this._t("chooseDevice")}</h2><button class="close" data-action="close" aria-label="${this._t("close")}">\xD7</button></div>${e.map(a=>`<button class="tracker-choice" data-action="use-tracker" data-value="${w(a.entity_id)}" ${this._trackerFresh(a)?"":"disabled"}><strong>${w(a.attributes.friendly_name||a.entity_id)}</strong><span>${this._t("reported")} ${this._time(a.last_updated)} \xB7 \xB1${m(a.attributes.gps_accuracy)} m</span></button>`).join("")}<p>${this._t("staleLocation")}</p>`,t.open||t.showModal()}async _useTracker(e){let t=this._appTrackers().find(a=>a.entity_id===e);if(!this._trackerFresh(t)){this._locationError=this._t("staleLocation"),this._render();return}this.shadowRoot.querySelector("dialog").close(),await this._loadLocation(t.attributes,`${t.attributes.friendly_name||e} \xB7 ${this._t("reported")} ${this._time(t.last_updated)} \xB7 \xB1${m(t.attributes.gps_accuracy)} m`)}async _locate(){if(this._locationBusy)return;let e=this._locationGeneration;if((window.externalApp||window.webkit?.messageHandlers?.externalBus)&&this._appTrackers().length)return this._chooseAppLocation();this._locationBusy=!0,this._locationError=null,this._render();try{let t=await new Promise((a,i)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(a,i,{enableHighAccuracy:!0,maximumAge:6e4,timeout:12e3}):i({code:2}));if(e!==this._locationGeneration)return;if(!$(t.coords.accuracy)||t.coords.accuracy>1e3)throw{code:2};await this._loadLocation(t.coords,`${this._t("currentLocation")} \xB7 \xB1${m(t.coords.accuracy)} m`)}catch(t){this._locationError=this._t(t.code===1?"locationDenied":"locationFailed")}finally{this._locationBusy=!1,this._render()}}async _loadLocation(e,t){let a=this._locationGeneration;this._locationBusy=!0,this._locationError=null,this._render();try{let i={latitude:e.latitude,longitude:e.longitude},n=await this._hass.callWS({type:"atmosphere/location",...i,language:this._data?.language||"nl"});if(a!==this._locationGeneration)return;this._locationGeneration++,this._deviceCoords=i,this._data=n,this._locationNote=t,this._error=null}catch(i){this._locationError=this._t(i.code==="unsupported_location"?"unsupported":"locationFailed")}finally{this._locationBusy=!1,this._render()}}_hourChart(e,t="temperature"){let a=e.map(c=>c[t]).filter($);if(!a.length)return"";let i=Math.min(...a),n=Math.max(...a),g=Math.max(1,n-i),s=t==="temperature"?"\xB0":t==="wind_speed"?" km/h":" mm";return`<div class="detail-chart"><svg viewBox="0 0 500 130" role="img" aria-label="${this._t(t==="temperature"?"temperature":t==="wind_speed"?"wind":"rain")}"><path d="M10 110H490M10 55H490" stroke="white" stroke-opacity=".13"/><polyline points="${e.filter(c=>$(c[t])).map((c,f)=>`${10+f*480/Math.max(1,e.length-1)},${105-(c[t]-i)/g*85}`).join(" ")}" fill="none" stroke="#9cdef1" stroke-width="3" stroke-linejoin="round"/>${e.filter((c,f)=>f%Math.max(1,Math.floor(e.length/5))===0).map(c=>`<text x="${10+e.indexOf(c)*480/Math.max(1,e.length-1)}" y="126" fill="#cadbea" font-size="11" text-anchor="middle">${this._time(c.datetime,{minute:void 0})}</text>`).join("")}</svg><div class="chart-times"><span>${m(i,t==="precipitation"?1:0)}${s}</span><span>${m(n,t==="precipitation"?1:0)}${s}</span></div></div>`}},ie=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}setConfig(e){this._config=e,this._render()}set hass(e){this._hass=e,this._render()}_render(){if(!this._hass||!this._config)return;let e=Object.values(this._hass.states).filter(t=>t.entity_id.startsWith("weather.")&&t.attributes.atmosphere_entry_id);this.shadowRoot.innerHTML=`<style>.section-toggle{display:flex;gap:8px;margin:8px 0}fieldset{border:1px solid var(--divider-color);border-radius:10px}label{display:grid;gap:8px;margin:16px 0}select,input{padding:12px;font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px}</style><label>Atmosphere location<select id="entity">${e.map(t=>`<option value="${w(t.entity_id)}" ${this._config.entity===t.entity_id?"selected":""}>${w(t.attributes.friendly_name||t.entity_id)}</option>`).join("")}</select></label><label>Name<input id="name" value="${w(this._config.name||"")}"/></label><label>Card language<select id="language"><option value="auto">Location language</option><option value="nl">Nederlands</option><option value="en">English</option></select></label><fieldset><legend>Visible panels</legend>${Ce.map(t=>`<label class="section-toggle"><input type="checkbox" data-section-choice="${t}" ${!Array.isArray(this._config.show)||this._config.show.includes(t)?"checked":""}/>${me.en[t]||(t==="sun"?"Sunrise and sunset":t)}</label>`).join("")}</fieldset>`,this.shadowRoot.querySelectorAll("[data-section-choice]").forEach(t=>t.addEventListener("change",()=>{let a=[...this.shadowRoot.querySelectorAll("[data-section-choice]:checked")].map(i=>i.dataset.sectionChoice);this._config={...this._config,show:a},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))})),this.shadowRoot.querySelector("#language").value=this._config.language||"auto",this.shadowRoot.querySelectorAll("input:not([type=checkbox]),select").forEach(t=>t.addEventListener("change",()=>{let a={...this._config,[t.id]:t.value};t.id==="language"&&t.value==="auto"&&delete a.language,this._config=a,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}))}};customElements.get("atmosphere-card")||customElements.define("atmosphere-card",ae);customElements.get("atmosphere-card-editor")||customElements.define("atmosphere-card-editor",ie);window.customCards=window.customCards||[];window.customCards.some(p=>p.type==="atmosphere-card")||window.customCards.push({type:"atmosphere-card",name:"Atmosphere Weather",description:"Animated skies, KMI forecasts and local warnings.",preview:!0});
