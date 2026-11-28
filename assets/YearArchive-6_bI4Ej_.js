import{c as n,j as r,G as c}from"./index-CXho2oBQ.js";import{c as p}from"./utils-CytzSlOG.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=n("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=n("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]),u=(a,i)=>`/document-viewer.html?${new URLSearchParams({file:a,title:i}).toString()}`,x=({className:a})=>r.jsxs("a",{href:"https://github.com/alizindari/academic-slide-poster-template",target:"_blank",rel:"noopener noreferrer",className:p("group inline-flex items-center gap-2 border-b border-primary/25 pb-1 text-sm font-medium text-primary transition-colors hover:border-primary hover:text-primary-light sm:text-base",a),children:[r.jsx(c,{size:17,strokeWidth:1.9,"aria-hidden":"true"}),r.jsx("span",{children:"Poster & slide templates"}),r.jsx("span",{className:"text-muted-foreground transition-colors group-hover:text-primary",children:"on GitHub"}),r.jsx(m,{size:15,strokeWidth:1.9,className:"transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5","aria-hidden":"true"})]});function g({entries:a,children:i}){const s=new Map;for(const e of a){const t=Number(e.year),o=s.get(t);o?o.push(e):s.set(t,[e])}return r.jsx("div",{className:"year-archive",children:Array.from(s).sort(([e],[t])=>t-e).map(([e,t])=>r.jsxs("section",{"aria-labelledby":`year-${e}`,children:[r.jsx("h2",{id:`year-${e}`,className:"archive-year",children:e}),t.map(i)]},e))})}export{x as A,d as F,g as Y,u as g};
