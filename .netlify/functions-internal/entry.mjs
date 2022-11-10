import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape } from 'html-escaper';
import mime from 'mime';
import sharp$1 from 'sharp';
import slugify from 'limax';
/* empty css                                     */import 'http-cache-semantics';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimize } from 'svgo';
import rss from '@astrojs/rss';
import 'cookie';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

const ASTRO_VERSION = "1.6.5";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue (jsx)"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
}
function isOutputFormatSupportsAlpha(value) {
  return ["avif", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

class SharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
      if (transform.background && !isOutputFormatSupportsAlpha(transform.format)) {
        sharpImage.flatten({ background: transform.background });
      }
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return void 0;
  }
}
const get$2 = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$2
}, Symbol.toStringTag, { value: 'Module' }));

const SITE = {
	name: 'betahero',

	origin: 'https://betahero.org',
	basePathname: '/',

	title: 'betahero | inspire, educate and mentor through technology for the heroes of tomorrow',
	description: 'a nonprofit designed to inspire, educate and mentor youth through technology for the heroes of tomorrow',

	googleAnalyticsId: false, // or "G-XXXXXXXXXX",
	googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
};

const BLOG = {
	disabled: false,
	postsPerPage: 4,

	blog: {
		disabled: false,
		pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
	},

	post: {
		disabled: false,
		pathname: '', // empty for /some-post, value for /pathname/some-post 
	},

	category: {
		disabled: false,
		pathname: 'category', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
	},
};

const trim = (str, ch) => {
	let start = 0,
		end = str.length;
	while (start < end && str[start] === ch) ++start;
	while (end > start && str[end - 1] === ch) --end;
	return start > 0 || end < str.length ? str.substring(start, end) : str;
};

const trimSlash = (s) => trim(trim(s, '/'));
const createPath = (...params) => '/' + params.filter((el) => !!el).join('/');

const basePathname = trimSlash(SITE.basePathname);

const cleanSlug = (text) => slugify(trimSlash(text));

const BLOG_BASE = cleanSlug(BLOG?.blog?.pathname);
const POST_BASE = cleanSlug(BLOG?.post?.pathname);
const CATEGORY_BASE = cleanSlug(BLOG?.category?.pathname);
const TAG_BASE = cleanSlug(BLOG?.tag?.pathname);

/** */
const getCanonical = (path = '') => new URL(path, SITE.origin);

/** */
const getPermalink = (slug = '', type = 'page') => {
	const _slug = cleanSlug(slug);

	switch (type) {
		case 'category':
			return createPath(basePathname, CATEGORY_BASE, _slug);

		case 'tag':
			return createPath(basePathname, TAG_BASE, _slug);

		case 'post':
			return createPath(basePathname, POST_BASE, _slug);

		case 'page':
		default:
			return createPath(basePathname, _slug);
	}
};

/** */
const getBlogPermalink = () => getPermalink(BLOG_BASE);

/** */
const getHomePermalink = () => {
	const permalink = getPermalink();
	return permalink !== '/' ? permalink + '/' : permalink;
};

const defaults = {
  templateTitle: "",
  noindex: false,
  nofollow: false,
  defaultOpenGraphImageWidth: 0,
  defaultOpenGraphImageHeight: 0,
  defaultOpenGraphVideoWidth: 0,
  defaultOpenGraphVideoHeight: 0
};
const buildOpenGraphMediaTags = (mediaType, media = [], {
  defaultWidth,
  defaultHeight
} = {}) => {
  return media.reduce((tags, medium, index) => {
    tags.push(`<meta property="og:${mediaType}" content="${medium.url}" />`);
    if (medium.alt) {
      tags.push(`<meta property="og:${mediaType}:alt" content="${medium.alt}" />`);
    }
    if (medium.secureUrl) {
      tags.push(`<meta property="og:${mediaType}:secure_url" content="${medium.secureUrl.toString()}" />`);
    }
    if (medium.type) {
      tags.push(`<meta property="og:${mediaType}:type" content="${medium.type.toString()}" />`);
    }
    if (medium.width) {
      tags.push(`<meta property="og:${mediaType}:width" content="${medium.width.toString()}" />`);
    } else if (defaultWidth) {
      tags.push(`<meta property="og:${mediaType}:width" content="${defaultWidth.toString()}" />`);
    }
    if (medium.height) {
      tags.push(`<meta property="og:${mediaType}:height" content="${medium.height.toString()}" />`);
    } else if (defaultHeight) {
      tags.push(`<meta property="og:${mediaType}:height" content="${defaultHeight.toString()}" />`);
    }
    return tags;
  }, []);
};
const buildTags = (config) => {
  const tagsToRender = [];
  if (config.titleTemplate) {
    defaults.templateTitle = config.titleTemplate;
  }
  let updatedTitle = "";
  if (config.title) {
    updatedTitle = config.title;
    if (defaults.templateTitle) {
      updatedTitle = defaults.templateTitle.replace(/%s/g, () => updatedTitle);
    }
  } else if (config.defaultTitle) {
    updatedTitle = config.defaultTitle;
  }
  if (updatedTitle) {
    tagsToRender.push(`<title>${updatedTitle}</title>`);
  }
  const noindex = config.noindex || defaults.noindex || config.dangerouslySetAllPagesToNoIndex;
  const nofollow = config.nofollow || defaults.nofollow || config.dangerouslySetAllPagesToNoFollow;
  let robotsParams = "";
  if (config.robotsProps) {
    const {
      nosnippet,
      maxSnippet,
      maxImagePreview,
      maxVideoPreview,
      noarchive,
      noimageindex,
      notranslate,
      unavailableAfter
    } = config.robotsProps;
    robotsParams = `${nosnippet ? ",nosnippet" : ""}${maxSnippet ? `,max-snippet:${maxSnippet}` : ""}${maxImagePreview ? `,max-image-preview:${maxImagePreview}` : ""}${noarchive ? ",noarchive" : ""}${unavailableAfter ? `,unavailable_after:${unavailableAfter}` : ""}${noimageindex ? ",noimageindex" : ""}${maxVideoPreview ? `,max-video-preview:${maxVideoPreview}` : ""}${notranslate ? ",notranslate" : ""}`;
  }
  if (noindex || nofollow) {
    if (config.dangerouslySetAllPagesToNoIndex) {
      defaults.noindex = true;
    }
    if (config.dangerouslySetAllPagesToNoFollow) {
      defaults.nofollow = true;
    }
    tagsToRender.push(
      `<meta name="robots" content="${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}${robotsParams}" />`
    );
  } else {
    tagsToRender.push(`<meta name="robots" content="index,follow${robotsParams}" />`);
  }
  if (config.description) {
    tagsToRender.push(`<meta name="description" content="${config.description}" />`);
  }
  if (config.mobileAlternate) {
    tagsToRender.push(
      `<link rel="alternate" media="${config.mobileAlternate.media}" href="${config.mobileAlternate.href}" />`
    );
  }
  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate) => {
      tagsToRender.push(
        `<link rel="alternate" hrefLang="${languageAlternate.hrefLang}" href="${languageAlternate.href}" />`
      );
    });
  }
  if (config.twitter) {
    if (config.twitter.cardType) {
      tagsToRender.push(`<meta name="twitter:card" content="${config.twitter.cardType}" />`);
    }
    if (config.twitter.site) {
      tagsToRender.push(`<meta name="twitter:site" content="${config.twitter.site}" />`);
    }
    if (config.twitter.handle) {
      tagsToRender.push(`<meta name="twitter:creator" content="${config.twitter.handle}" />`);
    }
  }
  if (config.facebook) {
    if (config.facebook.appId) {
      tagsToRender.push(`<meta property="fb:app_id" content="${config.facebook.appId}" />`);
    }
  }
  if (config.openGraph?.title || updatedTitle) {
    tagsToRender.push(`<meta property="og:title" content="${config.openGraph?.title || updatedTitle}" />`);
  }
  if (config.openGraph?.description || config.description) {
    tagsToRender.push(
      `<meta property="og:description" content="${config.openGraph?.description || config.description}" />`
    );
  }
  if (config.openGraph) {
    if (config.openGraph.url || config.canonical) {
      tagsToRender.push(`<meta property="og:url" content="${config.openGraph.url || config.canonical}" />`);
    }
    if (config.openGraph.type) {
      const type = config.openGraph.type.toLowerCase();
      tagsToRender.push(`<meta property="og:type" content="${type}" />`);
      if (type === "profile" && config.openGraph.profile) {
        if (config.openGraph.profile.firstName) {
          tagsToRender.push(`<meta property="profile:first_name" content="${config.openGraph.profile.firstName}" />`);
        }
        if (config.openGraph.profile.lastName) {
          tagsToRender.push(`<meta property="profile:last_name" content="${config.openGraph.profile.lastName}" />`);
        }
        if (config.openGraph.profile.username) {
          tagsToRender.push(`<meta property="profile:username" content="${config.openGraph.profile.username}" />`);
        }
        if (config.openGraph.profile.gender) {
          tagsToRender.push(`<meta property="profile:gender" content="${config.openGraph.profile.gender}" />`);
        }
      } else if (type === "book" && config.openGraph.book) {
        if (config.openGraph.book.authors && config.openGraph.book.authors.length) {
          config.openGraph.book.authors.forEach((author, index) => {
            tagsToRender.push(`<meta property="book:author" content="${author}" />`);
          });
        }
        if (config.openGraph.book.isbn) {
          tagsToRender.push(`<meta property="book:isbn" content="${config.openGraph.book.isbn}" />`);
        }
        if (config.openGraph.book.releaseDate) {
          tagsToRender.push(`<meta property="book:release_date" content="${config.openGraph.book.releaseDate}" />`);
        }
        if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
          config.openGraph.book.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="book:tag" content="${tag}" />`);
          });
        }
      } else if (type === "article" && config.openGraph.article) {
        if (config.openGraph.article.publishedTime) {
          tagsToRender.push(
            `<meta property="article:published_time" content="${config.openGraph.article.publishedTime}" />`
          );
        }
        if (config.openGraph.article.modifiedTime) {
          tagsToRender.push(
            `<meta property="article:modified_time" content="${config.openGraph.article.modifiedTime}" />`
          );
        }
        if (config.openGraph.article.expirationTime) {
          tagsToRender.push(
            `<meta property="article:expiration_time" content="${config.openGraph.article.expirationTime}" />`
          );
        }
        if (config.openGraph.article.authors && config.openGraph.article.authors.length) {
          config.openGraph.article.authors.forEach((author, index) => {
            tagsToRender.push(`<meta property="article:author" content="${author}" />`);
          });
        }
        if (config.openGraph.article.section) {
          tagsToRender.push(`<meta property="article:section" content="${config.openGraph.article.section}" />`);
        }
        if (config.openGraph.article.tags && config.openGraph.article.tags.length) {
          config.openGraph.article.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="article:tag" content="${tag}" />`);
          });
        }
      } else if ((type === "video.movie" || type === "video.episode" || type === "video.tv_show" || type === "video.other") && config.openGraph.video) {
        if (config.openGraph.video.actors && config.openGraph.video.actors.length) {
          config.openGraph.video.actors.forEach((actor, index) => {
            if (actor.profile) {
              tagsToRender.push(`<meta property="video:actor" content="${actor.profile}" />`);
            }
            if (actor.role) {
              tagsToRender.push(`<meta property="video:actor:role" content="${actor.role}" />`);
            }
          });
        }
        if (config.openGraph.video.directors && config.openGraph.video.directors.length) {
          config.openGraph.video.directors.forEach((director, index) => {
            tagsToRender.push(`<meta property="video:director" content="${director}" />`);
          });
        }
        if (config.openGraph.video.writers && config.openGraph.video.writers.length) {
          config.openGraph.video.writers.forEach((writer, index) => {
            tagsToRender.push(`<meta property="video:writer" content="${writer}" />`);
          });
        }
        if (config.openGraph.video.duration) {
          tagsToRender.push(
            `<meta property="video:duration" content="${config.openGraph.video.duration.toString()}" />`
          );
        }
        if (config.openGraph.video.releaseDate) {
          tagsToRender.push(`<meta property="video:release_date" content="${config.openGraph.video.releaseDate}" />`);
        }
        if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
          config.openGraph.video.tags.forEach((tag, index) => {
            tagsToRender.push(`<meta property="video:tag" content="${tag}" />`);
          });
        }
        if (config.openGraph.video.series) {
          tagsToRender.push(`<meta property="video:series" content="${config.openGraph.video.series}" />`);
        }
      }
    }
    if (config.defaultOpenGraphImageWidth) {
      defaults.defaultOpenGraphImageWidth = config.defaultOpenGraphImageWidth;
    }
    if (config.defaultOpenGraphImageHeight) {
      defaults.defaultOpenGraphImageHeight = config.defaultOpenGraphImageHeight;
    }
    if (config.openGraph.images && config.openGraph.images.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("image", config.openGraph.images, {
          defaultWidth: defaults.defaultOpenGraphImageWidth,
          defaultHeight: defaults.defaultOpenGraphImageHeight
        })
      );
    }
    if (config.defaultOpenGraphVideoWidth) {
      defaults.defaultOpenGraphVideoWidth = config.defaultOpenGraphVideoWidth;
    }
    if (config.defaultOpenGraphVideoHeight) {
      defaults.defaultOpenGraphVideoHeight = config.defaultOpenGraphVideoHeight;
    }
    if (config.openGraph.videos && config.openGraph.videos.length) {
      tagsToRender.push(
        ...buildOpenGraphMediaTags("video", config.openGraph.videos, {
          defaultWidth: defaults.defaultOpenGraphVideoWidth,
          defaultHeight: defaults.defaultOpenGraphVideoHeight
        })
      );
    }
    if (config.openGraph.locale) {
      tagsToRender.push(`<meta property="og:locale" content="${config.openGraph.locale}" />`);
    }
    if (config.openGraph.site_name) {
      tagsToRender.push(`<meta property="og:site_name" content="${config.openGraph.site_name}" />`);
    }
  }
  if (config.canonical) {
    tagsToRender.push(`<link rel="canonical" href="${config.canonical}" />`);
  }
  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach((tag) => {
      tagsToRender.push(
        `<meta key="meta:${tag.keyOverride ?? tag.name ?? tag.property ?? tag.httpEquiv}" ${Object.keys(tag).map((key) => `${key}="${tag[key]}"`).join(" ")} />`
      );
    });
  }
  if (config.additionalLinkTags?.length) {
    config.additionalLinkTags.forEach((tag) => {
      tagsToRender.push(
        `<link key="link${tag.keyOverride ?? tag.href}${tag.rel}" ${Object.keys(tag).map((key) => `${key}="${tag[key]}"`).join(" ")} />`
      );
    });
  }
  return tagsToRender ? tagsToRender.join("\n") : "";
};

const $$Astro$D = createAstro("/home/dww510/betahero/site/node_modules/@astrolib/seo/src/AstroSeo.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$AstroSeo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$D, $$props, $$slots);
  Astro2.self = $$AstroSeo;
  const {
    title,
    noindex = false,
    nofollow,
    robotsProps,
    description,
    canonical,
    openGraph,
    facebook,
    twitter,
    additionalMetaTags,
    titleTemplate,
    defaultTitle,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(buildTags({
    title,
    noindex,
    nofollow,
    robotsProps,
    description,
    canonical,
    facebook,
    openGraph,
    additionalMetaTags,
    twitter,
    titleTemplate,
    defaultTitle,
    mobileAlternate,
    languageAlternates,
    additionalLinkTags
  }))}` })}
`;
});

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$C = createAstro("/home/dww510/betahero/site/node_modules/@astrolib/analytics/src/GoogleAnalytics.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$GoogleAnalytics = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$C, $$props, $$slots);
  Astro2.self = $$GoogleAnalytics;
  const { id = "GA_MEASUREMENT_ID", partytown = false } = Astro2.props;
  const attrs = partytown ? { type: "text/partytown" } : {};
  return renderTemplate(_a$1 || (_a$1 = __template$1(["\n<script async", "", "><\/script>\n\n<script", ">(function(){", '\n  window.dataLayer = window.dataLayer || [];\n  function gtag() {\n    window.dataLayer.push(arguments);\n  }\n  gtag("js", new Date());\n  gtag("config", id);\n})();<\/script>\n\n\n'])), addAttribute(`https://www.googletagmanager.com/gtag/js?id=${id}`, "src"), spreadAttributes(attrs), spreadAttributes(attrs), defineScriptVars({ id }));
});

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          format,
          width,
          fit,
          position,
          background,
          height: Math.round(width / aspectRatio)
        });
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const allFormats = await resolveFormats(params);
  const image = await getImage({
    src,
    width: Math.max(...widths),
    aspectRatio,
    fit,
    position,
    background,
    format: allFormats[allFormats.length - 1]
  });
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** */
const getProjectRootDir = () => {

	return path.join(__dirname, '../') ;
};

const __srcFolder = path.join(getProjectRootDir(), '/src');

/** */
const getRelativeUrlByFilePath = (filepath) => {
	if (filepath) {
		return filepath.replace(__srcFolder, '');
	}

	return null;
};

const defaultImageSrc = {"src":"/assets/default.c6e14b88.png","width":2400,"height":1256,"format":"png"};

const _default = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: defaultImageSrc
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$B = createAstro("/home/dww510/betahero/site/src/components/atoms/Fonts.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Fonts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$B, $$props, $$slots);
  Astro2.self = $$Fonts;
  return renderTemplate`<!-- Or Google Fonts -->`;
});

const $$Astro$A = createAstro("/home/dww510/betahero/site/src/components/atoms/ExtraMetaTags.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$ExtraMetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$ExtraMetaTags;
  return renderTemplate`<link rel="shortcut icon"${addAttribute(`${SITE.basePathname}favicon.ico`, "href")}>
<link rel="icon" type="image/svg+xml"${addAttribute(`${SITE.basePathname}favicon.svg`, "href")}>
<link rel="mask-icon"${addAttribute(`${SITE.basePathname}favicon.svg`, "href")} color="#8D46E7">
`;
});

const $$Astro$z = createAstro("/home/dww510/betahero/site/src/components/core/MetaTags.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$MetaTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$MetaTags;
  const { src: defaultImage } = await getImage({
    src: defaultImageSrc,
    width: 1200,
    height: 628
  });
  const {
    title = SITE.name,
    description = "",
    image: _image = defaultImage,
    canonical,
    noindex = false,
    nofollow = false,
    ogTitle = title,
    ogType = "website"
  } = Astro2.props;
  const image = typeof _image === "string" ? new URL(_image, Astro2.site) : _image && typeof _image["src"] !== "undefined" ? new URL(getRelativeUrlByFilePath(_image.src), Astro2.site) : null;
  return renderTemplate`<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

${renderComponent($$result, "AstroSeo", $$AstroSeo, { "title": title, "description": description, "canonical": canonical, "noindex": noindex, "nofollow": nofollow, "openGraph": {
    url: canonical,
    title: ogTitle,
    description,
    type: ogType,
    images: image ? [
      {
        url: image.toString(),
        alt: ogTitle
      }
    ] : void 0
  }, "twitter": {
    cardType: image ? "summary_large_image" : void 0
  } })}

${renderComponent($$result, "Fonts", $$Fonts, {})}

<!-- Google Site Verification -->
${renderTemplate`<meta name="google-site-verification"${addAttribute(SITE.googleSiteVerificationId, "content")}>`}

<!-- Google Analytics -->
${SITE.googleAnalyticsId }

${renderComponent($$result, "ExtraMetaTags", $$ExtraMetaTags, {})}
`;
});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$y = createAstro("/home/dww510/betahero/site/src/components/core/BasicScripts.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$BasicScripts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$BasicScripts;
  return renderTemplate(_a || (_a = __template([`<script>
	// Set "light" theme as default
	// if (!localStorage.theme) {
	//   localStorage.theme = "light";
	// }

	if (
		localStorage.theme === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}

	function attachEvent(selector, event, fn) {
		const matches = document.querySelectorAll(selector);
		if (matches && matches.length) {
			matches.forEach((elem) => {
				elem.addEventListener(event, () => fn(elem), false);
			});
		}
	}

	window.onload = function () {
		attachEvent('[data-aw-toggle-menu]', 'click', function (elem) {
			elem.classList.toggle('expanded');
			document.body.classList.toggle('overflow-hidden');
			document.getElementById('menu')?.classList.toggle('hidden');
		});

		attachEvent('[data-aw-toggle-color-scheme]', 'click', function () {
			document.documentElement.classList.toggle('dark');
			localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
		});
	};
	window.onpageshow = function () {
		const elem = document.querySelector('[data-aw-toggle-menu]');
		if (elem) {
			elem.classList.remove('expanded');
		}
		document.body.classList.remove('overflow-hidden');
		document.getElementById('menu')?.classList.add('hidden');
	};
<\/script>
`])));
});

const $$Astro$x = createAstro("/home/dww510/betahero/site/src/layouts/BaseLayout.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { meta = {} } = Astro2.props;
  return renderTemplate`<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]">
	<head>
		${renderComponent($$result, "MetaTags", $$MetaTags, { ...meta })}
	${renderHead($$result)}</head>

	<body class="antialiased text-gray-900 dark:text-slate-300 tracking-tight bg-white dark:bg-slate-900">
		${renderSlot($$result, $$slots["default"])}
		${renderComponent($$result, "BasicScripts", $$BasicScripts, {})}
		
	</body>
</html>`;
});

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get$1(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load$2(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get = mod.default;
    } catch (e) {
    }
    if (typeof get === "undefined") {
      get = get$1.bind(null, pack);
    }
    const contents = await get(name);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$w = createAstro("/home/dww510/betahero/site/node_modules/astro-icon/lib/Icon.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load$2(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
});

const AstroIcon = Symbol("AstroIcon");
function trackSprite(result, name) {
  if (typeof result[AstroIcon] !== "undefined") {
    result[AstroIcon]["sprites"].add(name);
  } else {
    result[AstroIcon] = {
      sprites: /* @__PURE__ */ new Set([name])
    };
  }
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(result) {
  if (typeof result[AstroIcon] !== "undefined") {
    return Array.from(result[AstroIcon]["sprites"]);
  }
  const pathname = result._metadata.pathname;
  if (!warned.has(pathname)) {
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(pathname);
  }
  return [];
}

const $$Astro$v = createAstro("/home/dww510/betahero/site/node_modules/astro-icon/lib/Spritesheet.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites($$result);
  const icons = await Promise.all(names.map((name) => {
    return load$2(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`display: none; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
});

const $$Astro$u = createAstro("/home/dww510/betahero/site/node_modules/astro-icon/lib/SpriteProvider.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
});

const $$Astro$t = createAstro("/home/dww510/betahero/site/node_modules/astro-icon/lib/Sprite.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite($$result, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
});

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$s = createAstro("/home/dww510/betahero/site/src/components/atoms/Logo.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$Logo;
  return renderTemplate`${maybeRenderHead($$result)}<span class="self-center ml-2 text-2xl font-extrabold text-gray-900 whitespace-nowrap dark:text-white">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;display:inline-block;" viewBox="0 0 320 320" width="28px" height="28px"><defs><clipPath id="_clipPath_vwc0tqWSfJWK5lZ6F3ANf67uBR1tTfN0"><rect width="320" height="320"></rect></clipPath></defs><linearGradient id="_lgradient_3" x1="0.7737494112105511" y1="1.0573126614987078" x2="0.3551934287438362" y2="0.17647418619209887" gradientTransform="matrix(283.067,0,0,-309.6,18.133,314.664)" gradientUnits="userSpaceOnUse"><stop offset="1.25%" stop-opacity="1" style="stop-color:rgb(0,0,255)"></stop><stop offset="97.08333333333333%" stop-opacity="1" style="stop-color:rgb(4,99,242)"></stop></linearGradient><path d=" M 147.467 314.664 L 147.467 314.531 L 144.4 314.531 L 144.4 314.397 L 141.867 314.397 L 141.867 314.264 L 140.4 314.264 L 140.4 314.131 L 139.067 314.131 L 139.067 313.997 L 137.6 313.997 L 137.6 313.864 L 136.267 313.864 L 136.267 313.731 L 134.8 313.731 L 134.8 313.597 L 133.467 313.597 L 133.467 313.464 L 132.4 313.464 L 132.4 313.331 L 131.6 313.331 L 131.6 313.197 L 130.667 313.197 L 130.667 313.064 L 129.867 313.064 L 129.867 312.931 L 129.067 312.931 L 129.067 312.797 L 128.133 312.797 L 128.133 312.664 L 127.333 312.664 L 127.333 312.531 L 126.4 312.531 L 126.4 312.397 L 125.6 312.397 L 125.6 312.264 L 124.8 312.264 L 124.8 312.131 L 123.867 312.131 L 123.867 311.997 L 123.333 311.997 L 123.333 311.864 L 122.667 311.864 L 122.667 311.731 L 122.133 311.731 L 122.133 311.597 L 121.467 311.597 L 121.467 311.464 L 120.933 311.464 L 120.933 311.331 L 120.267 311.331 L 120.267 311.197 L 119.733 311.197 L 119.733 311.064 L 119.067 311.064 L 119.067 310.931 L 118.4 310.931 L 118.4 310.797 L 117.867 310.797 L 117.867 310.664 L 117.2 310.664 L 117.2 310.531 L 116.667 310.531 L 116.667 310.397 L 116 310.397 L 116 310.264 L 115.467 310.264 L 115.467 310.131 L 114.933 310.131 L 114.933 309.997 L 114.4 309.997 L 114.4 309.864 L 114 309.864 L 114 309.731 L 113.467 309.731 L 113.467 309.597 L 112.933 309.597 L 112.933 309.464 L 112.533 309.464 L 112.533 309.331 L 112 309.331 L 112 309.197 L 111.6 309.197 L 111.6 309.064 L 111.067 309.064 L 111.067 308.931 L 110.667 308.931 L 110.667 308.797 L 110.133 308.797 L 110.133 308.664 L 109.733 308.664 L 109.733 308.531 L 109.2 308.531 L 109.2 308.397 L 108.8 308.397 L 108.8 308.264 L 108.267 308.264 L 108.267 308.131 L 107.867 308.131 L 107.867 307.997 L 107.333 307.997 L 107.333 307.864 L 106.933 307.864 L 106.933 307.731 L 106.4 307.731 L 106.4 307.597 L 106 307.597 L 106 307.464 L 105.6 307.464 L 105.6 307.331 L 105.333 307.331 L 105.333 307.197 L 104.933 307.197 L 104.933 307.064 L 104.533 307.064 L 104.533 306.931 L 104.133 306.931 L 104.133 306.797 L 103.733 306.797 L 103.733 306.664 L 103.333 306.664 L 103.333 306.531 L 102.933 306.531 L 102.933 306.397 L 102.667 306.397 L 102.667 306.264 L 102.267 306.264 L 102.267 306.131 L 101.867 306.131 L 101.867 305.997 L 101.467 305.997 L 101.467 305.864 L 101.067 305.864 L 101.067 305.731 L 100.667 305.731 L 100.667 305.597 L 100.267 305.597 L 100.267 305.464 L 100 305.464 L 100 305.331 L 99.6 305.331 L 99.6 305.197 L 99.2 305.197 L 99.2 305.064 L 98.8 305.064 L 98.8 304.931 L 98.4 304.931 L 98.4 304.797 L 98 304.797 L 98 304.664 L 97.733 304.664 L 97.733 304.531 L 97.467 304.531 L 97.467 304.397 L 97.067 304.397 L 97.067 304.264 L 96.8 304.264 L 96.8 304.131 L 96.4 304.131 L 96.4 303.997 L 96.133 303.997 L 96.133 303.864 L 95.867 303.864 L 95.867 303.731 L 95.467 303.731 L 95.467 303.597 L 95.2 303.597 L 95.2 303.464 L 94.933 303.464 L 94.933 303.331 L 94.533 303.331 L 94.533 303.197 L 94.267 303.197 L 94.267 303.064 L 93.867 303.064 L 93.867 302.931 L 93.6 302.931 L 93.6 302.797 L 93.333 302.797 L 93.333 302.664 L 92.933 302.664 L 92.933 302.531 L 92.667 302.531 L 92.667 302.397 L 92.267 302.397 L 92.267 302.264 L 92 302.264 L 92 302.131 L 91.733 302.131 L 91.733 301.997 L 91.333 301.997 L 91.333 301.864 L 91.067 301.864 L 91.067 301.731 L 90.8 301.731 L 90.8 301.597 L 90.4 301.597 L 90.4 301.464 L 90.133 301.464 L 90.133 301.331 L 89.867 301.331 L 89.867 301.197 L 89.6 301.197 L 89.6 301.064 L 89.333 301.064 L 89.333 300.931 L 88.933 300.931 L 88.933 300.797 L 88.667 300.797 L 88.667 300.664 L 88.4 300.664 L 88.4 300.531 L 88.133 300.531 L 88.133 300.397 L 87.867 300.397 L 87.867 300.264 L 87.6 300.264 L 87.6 300.131 L 87.333 300.131 L 87.333 299.997 L 87.067 299.997 L 87.067 299.864 L 86.8 299.864 L 86.8 299.731 L 86.533 299.731 L 86.533 299.597 L 86.267 299.597 L 86.267 299.464 L 86 299.464 L 86 299.331 L 85.733 299.331 L 85.733 299.197 L 85.333 299.197 L 85.333 299.064 L 85.067 299.064 L 85.067 298.931 L 84.8 298.931 L 84.8 298.797 L 84.533 298.797 L 84.533 298.664 L 84.267 298.664 L 84.267 298.531 L 84 298.531 L 84 298.397 L 83.733 298.397 L 83.733 298.264 L 83.467 298.264 L 83.467 298.131 L 83.333 298.131 L 83.333 297.997 L 83.067 297.997 L 83.067 297.864 L 82.8 297.864 L 82.8 297.731 L 82.533 297.731 L 82.533 297.597 L 82.267 297.597 L 82.267 297.464 L 82 297.464 L 82 297.331 L 81.733 297.331 L 81.733 297.197 L 81.467 297.197 L 81.467 297.064 L 81.333 297.064 L 81.333 296.931 L 81.067 296.931 L 81.067 296.797 L 80.8 296.797 L 80.8 296.664 L 80.533 296.664 L 80.533 296.531 L 80.267 296.531 L 80.267 296.397 L 80.133 296.397 L 80.133 296.264 L 79.867 296.264 L 79.867 296.131 L 79.6 296.131 L 79.6 295.997 L 79.333 295.997 L 79.333 295.864 L 79.2 295.864 L 79.2 295.731 L 78.933 295.731 L 78.933 295.597 L 78.667 295.597 L 78.667 295.464 L 78.533 295.464 L 78.533 295.331 L 78.267 295.331 L 78.267 295.197 L 78 295.197 L 78 295.064 L 77.733 295.064 L 77.733 294.931 L 77.6 294.931 L 77.6 294.797 L 77.333 294.797 L 77.333 294.664 L 77.067 294.664 L 77.067 294.531 L 76.933 294.531 L 76.933 294.397 L 76.667 294.397 L 76.667 294.264 L 76.4 294.264 L 76.4 294.131 L 76.133 294.131 L 76.133 293.997 L 76 293.997 L 76 293.864 L 75.733 293.864 L 75.733 293.731 L 75.467 293.731 L 75.467 293.597 L 75.333 293.597 L 75.333 293.464 L 75.067 293.464 L 75.067 293.331 L 74.933 293.331 L 74.933 293.197 L 74.667 293.197 L 74.667 293.064 L 74.533 293.064 L 74.533 292.931 L 74.267 292.931 L 74.267 292.797 L 74 292.797 L 74 292.664 L 73.867 292.664 L 73.867 292.531 L 73.6 292.531 L 73.6 292.397 L 73.467 292.397 L 73.467 292.264 L 73.2 292.264 L 73.2 292.131 L 73.067 292.131 L 73.067 291.997 L 72.8 291.997 L 72.8 291.864 L 72.667 291.864 L 72.667 291.731 L 72.4 291.731 L 72.4 291.597 L 72.267 291.597 L 72.267 291.464 L 72 291.464 L 72 291.331 L 71.733 291.331 L 71.733 291.197 L 71.6 291.197 L 71.6 291.064 L 71.333 291.064 L 71.333 290.931 L 71.2 290.931 L 71.2 290.797 L 70.933 290.797 L 70.933 290.664 L 70.8 290.664 L 70.8 290.531 L 70.533 290.531 L 70.533 290.397 L 70.4 290.397 L 70.4 290.264 L 70.133 290.264 L 70.133 290.131 L 69.867 290.131 L 69.867 289.997 L 69.733 289.997 L 69.733 289.864 L 69.467 289.864 L 69.467 289.731 L 69.333 289.731 L 69.333 289.597 L 69.067 289.597 L 69.067 289.464 L 68.933 289.464 L 68.933 289.331 L 68.8 289.331 L 68.8 289.197 L 68.533 289.197 L 68.533 289.064 L 68.4 289.064 L 68.4 288.931 L 68.267 288.931 L 68.267 288.797 L 68 288.797 L 68 288.664 L 67.867 288.664 L 67.867 288.531 L 67.6 288.531 L 67.6 288.397 L 67.467 288.397 L 67.467 288.264 L 67.333 288.264 L 67.333 288.131 L 67.067 288.131 L 67.067 287.997 L 66.933 287.997 L 66.933 287.864 L 66.8 287.864 L 66.8 287.731 L 66.533 287.731 L 66.533 287.597 L 66.4 287.597 L 66.4 287.464 L 66.133 287.464 L 66.133 287.331 L 66 287.331 L 66 287.197 L 65.867 287.197 L 65.867 287.064 L 65.6 287.064 L 65.6 286.931 L 65.467 286.931 L 65.467 286.797 L 65.333 286.797 L 65.333 286.664 L 65.067 286.664 L 65.067 286.531 L 64.933 286.531 L 64.933 286.397 L 64.667 286.397 L 64.667 286.264 L 64.533 286.264 L 64.533 286.131 L 64.4 286.131 L 64.4 285.997 L 64.133 285.997 L 64.133 285.864 L 64 285.864 L 64 285.731 L 63.867 285.731 L 63.867 285.597 L 63.6 285.597 L 63.6 285.464 L 63.467 285.464 L 63.467 285.331 L 63.333 285.331 L 63.333 285.197 L 63.067 285.197 L 63.067 285.064 L 62.933 285.064 L 62.933 284.931 L 62.8 284.931 L 62.8 284.797 L 62.667 284.797 L 62.667 284.664 L 62.4 284.664 L 62.4 284.531 L 62.267 284.531 L 62.267 284.397 L 62.133 284.397 L 62.133 284.264 L 62 284.264 L 62 284.131 L 61.867 284.131 L 61.867 283.997 L 61.6 283.997 L 61.6 283.864 L 61.467 283.864 L 61.467 283.731 L 61.333 283.731 L 61.333 283.597 L 61.2 283.597 L 61.2 283.464 L 60.933 283.464 L 60.933 283.331 L 60.8 283.331 L 60.8 283.197 L 60.667 283.197 L 60.667 283.064 L 60.533 283.064 L 60.533 282.931 L 60.4 282.931 L 60.4 282.797 L 60.133 282.797 L 60.133 282.664 L 60 282.664 L 60 282.531 L 59.867 282.531 L 59.867 282.397 L 59.733 282.397 L 59.733 282.264 L 59.6 282.264 L 59.6 282.131 L 59.333 282.131 L 59.333 281.997 L 59.2 281.997 L 59.2 281.864 L 59.067 281.864 L 59.067 281.731 L 58.933 281.731 L 58.933 281.597 L 58.667 281.597 L 58.667 281.464 L 58.533 281.464 L 58.533 281.331 L 58.4 281.331 L 58.4 281.197 L 58.267 281.197 L 58.267 281.064 L 58.133 281.064 L 58.133 280.931 L 57.867 280.931 L 57.867 280.797 L 57.733 280.797 L 57.733 280.664 L 57.6 280.664 L 57.6 280.531 L 57.467 280.531 L 57.467 280.397 L 57.333 280.397 L 57.333 280.264 L 57.2 280.264 L 57.2 280.131 L 57.067 280.131 L 57.067 279.997 L 56.8 279.997 L 56.8 279.864 L 56.667 279.864 L 56.667 279.731 L 56.533 279.731 L 56.533 279.597 L 56.4 279.597 L 56.4 279.464 L 56.267 279.464 L 56.267 279.331 L 56.133 279.331 L 56.133 279.197 L 56 279.197 L 56 279.064 L 55.867 279.064 L 55.867 278.931 L 55.733 278.931 L 55.733 278.797 L 55.6 278.797 L 55.6 278.664 L 55.467 278.664 L 55.467 278.531 L 55.333 278.531 L 55.333 278.397 L 55.2 278.397 L 55.2 278.264 L 54.933 278.264 L 54.933 278.131 L 54.8 278.131 L 54.8 277.997 L 54.667 277.997 L 54.667 277.864 L 54.533 277.864 L 54.533 277.731 L 54.4 277.731 L 54.4 277.597 L 54.267 277.597 L 54.267 277.464 L 54.133 277.464 L 54.133 277.331 L 54 277.331 L 54 277.197 L 53.867 277.197 L 53.867 277.064 L 53.733 277.064 L 53.733 276.931 L 53.6 276.931 L 53.6 276.797 L 53.467 276.797 L 53.467 276.664 L 53.333 276.664 L 53.333 276.531 L 53.067 276.531 L 53.067 276.397 L 52.933 276.397 L 52.933 276.264 L 52.8 276.264 L 52.8 276.131 L 52.667 276.131 L 52.667 275.997 L 52.533 275.997 L 52.533 275.864 L 52.4 275.864 L 52.4 275.731 L 52.267 275.731 L 52.267 275.597 L 52.133 275.597 L 52.133 275.464 L 52 275.464 L 52 275.331 L 51.867 275.331 L 51.867 275.197 L 51.733 275.197 L 51.733 275.064 L 51.6 275.064 L 51.6 274.931 L 51.467 274.931 L 51.467 274.797 L 51.333 274.797 L 51.333 274.664 L 51.2 274.664 L 51.2 274.531 L 51.067 274.531 L 51.067 274.397 L 50.933 274.397 L 50.933 274.264 L 50.8 274.264 L 50.8 274.131 L 50.667 274.131 L 50.667 273.997 L 50.533 273.997 L 50.533 273.864 L 50.4 273.864 L 50.4 273.597 L 50.267 273.597 L 50.267 273.464 L 50.133 273.464 L 50.133 273.331 L 50 273.331 L 50 273.197 L 49.867 273.197 L 49.867 273.064 L 49.733 273.064 L 49.733 272.931 L 49.6 272.931 L 49.6 272.797 L 49.467 272.797 L 49.467 272.664 L 49.333 272.664 L 49.333 272.531 L 49.2 272.531 L 49.2 272.397 L 49.067 272.397 L 49.067 272.264 L 48.933 272.264 L 48.933 272.131 L 48.8 272.131 L 48.8 271.997 L 48.667 271.997 L 48.667 271.864 L 48.533 271.864 L 48.533 271.731 L 48.4 271.731 L 48.4 271.597 L 48.267 271.597 L 48.267 271.464 L 48.133 271.464 L 48.133 271.331 L 48 271.331 L 48 271.197 L 47.867 271.197 L 47.867 271.064 L 47.733 271.064 L 47.733 270.797 L 47.6 270.797 L 47.6 270.664 L 47.467 270.664 L 47.467 270.531 L 47.333 270.531 L 47.333 270.397 L 47.2 270.397 L 47.2 270.264 L 47.067 270.264 L 47.067 270.131 L 46.933 270.131 L 46.933 269.997 L 46.8 269.997 L 46.8 269.864 L 46.667 269.864 L 46.667 269.731 L 46.533 269.731 L 46.533 269.464 L 46.4 269.464 L 46.4 269.331 L 46.267 269.331 L 46.267 269.197 L 46.133 269.197 L 46.133 269.064 L 46 269.064 L 46 268.931 L 45.867 268.931 L 45.867 268.664 L 45.733 268.664 L 45.733 268.531 L 45.6 268.531 L 45.6 268.397 L 45.467 268.397 L 45.467 268.264 L 45.333 268.264 L 45.333 268.131 L 45.2 268.131 L 45.2 267.864 L 45.067 267.864 L 45.067 267.731 L 44.933 267.731 L 44.933 267.597 L 44.8 267.597 L 44.8 267.464 L 44.667 267.464 L 44.667 267.331 L 44.533 267.331 L 44.533 267.064 L 44.4 267.064 L 44.4 266.931 L 44.267 266.931 L 44.267 266.797 L 44.133 266.797 L 44.133 266.664 L 44 266.664 L 44 266.531 L 43.867 266.531 L 43.867 266.264 L 43.733 266.264 L 43.733 266.131 L 43.6 266.131 L 43.6 265.997 L 43.467 265.997 L 43.467 265.864 L 43.333 265.864 L 43.333 265.731 L 43.2 265.731 L 43.2 265.597 L 43.067 265.597 L 43.067 265.331 L 42.933 265.331 L 42.933 265.197 L 42.8 265.197 L 42.8 265.064 L 42.667 265.064 L 42.667 264.931 L 42.533 264.931 L 42.533 264.797 L 42.4 264.797 L 42.4 264.531 L 42.267 264.531 L 42.267 264.397 L 42.133 264.397 L 42.133 264.264 L 42 264.264 L 42 263.997 L 41.867 263.997 L 41.867 263.864 L 41.733 263.864 L 41.733 263.731 L 41.6 263.731 L 41.6 263.464 L 41.467 263.464 L 41.467 263.331 L 41.333 263.331 L 41.333 263.197 L 41.2 263.197 L 41.2 262.931 L 41.067 262.931 L 41.067 262.797 L 40.933 262.797 L 40.933 262.664 L 40.8 262.664 L 40.8 262.397 L 40.667 262.397 L 40.667 262.264 L 40.533 262.264 L 40.533 262.131 L 40.4 262.131 L 40.4 261.864 L 40.267 261.864 L 40.267 261.731 L 40.133 261.731 L 40.133 261.597 L 40 261.597 L 40 261.331 L 39.867 261.331 L 39.867 261.197 L 39.733 261.197 L 39.733 261.064 L 39.6 261.064 L 39.6 260.797 L 39.467 260.797 L 39.467 260.664 L 39.333 260.664 L 39.333 260.531 L 39.2 260.531 L 39.2 260.264 L 39.067 260.264 L 39.067 260.131 L 38.933 260.131 L 38.933 259.864 L 38.8 259.864 L 38.8 259.731 L 38.667 259.731 L 38.667 259.464 L 38.533 259.464 L 38.533 259.331 L 38.4 259.331 L 38.4 259.064 L 38.267 259.064 L 38.267 258.931 L 38.133 258.931 L 38.133 258.664 L 38 258.664 L 38 258.531 L 37.867 258.531 L 37.867 258.264 L 37.733 258.264 L 37.733 258.131 L 37.6 258.131 L 37.6 257.864 L 37.467 257.864 L 37.467 257.731 L 37.333 257.731 L 37.333 257.597 L 37.2 257.597 L 37.2 257.331 L 37.067 257.331 L 37.067 257.064 L 36.933 257.064 L 36.933 256.931 L 36.8 256.931 L 36.8 256.664 L 36.667 256.664 L 36.667 256.531 L 36.533 256.531 L 36.533 256.264 L 36.4 256.264 L 36.4 255.997 L 36.267 255.997 L 36.267 255.864 L 36.133 255.864 L 36.133 255.597 L 36 255.597 L 36 255.331 L 35.867 255.331 L 35.867 255.197 L 35.733 255.197 L 35.733 254.931 L 35.6 254.931 L 35.6 254.664 L 35.467 254.664 L 35.467 254.531 L 35.333 254.531 L 35.333 254.264 L 35.2 254.264 L 35.2 253.997 L 35.067 253.997 L 35.067 253.864 L 34.933 253.864 L 34.933 253.597 L 34.8 253.597 L 34.8 253.331 L 34.667 253.331 L 34.667 253.197 L 34.533 253.197 L 34.533 252.931 L 34.4 252.931 L 34.4 252.797 L 34.267 252.797 L 34.267 252.531 L 34.133 252.531 L 34.133 252.264 L 34 252.264 L 34 251.997 L 33.867 251.997 L 33.867 251.731 L 33.733 251.731 L 33.733 251.464 L 33.6 251.464 L 33.6 251.197 L 33.467 251.197 L 33.467 251.064 L 33.333 251.064 L 33.333 250.797 L 33.2 250.797 L 33.2 250.531 L 33.067 250.531 L 33.067 250.264 L 32.933 250.264 L 32.933 249.997 L 32.8 249.997 L 32.8 249.731 L 32.667 249.731 L 32.667 249.464 L 32.533 249.464 L 32.533 249.197 L 32.4 249.197 L 32.4 248.931 L 32.267 248.931 L 32.267 248.797 L 32.133 248.797 L 32.133 248.531 L 32 248.531 L 32 248.264 L 31.867 248.264 L 31.867 247.997 L 31.733 247.997 L 31.733 247.731 L 31.6 247.731 L 31.6 247.464 L 31.467 247.464 L 31.467 247.197 L 31.333 247.197 L 31.333 246.931 L 31.2 246.931 L 31.2 246.797 L 31.067 246.797 L 31.067 246.531 L 30.933 246.531 L 30.933 246.264 L 30.8 246.264 L 30.8 245.997 L 30.667 245.997 L 30.667 245.731 L 30.533 245.731 L 30.533 245.331 L 30.4 245.331 L 30.4 245.064 L 30.267 245.064 L 30.267 244.797 L 30.133 244.797 L 30.133 244.397 L 30 244.397 L 30 244.131 L 29.867 244.131 L 29.867 243.864 L 29.733 243.864 L 29.733 243.597 L 29.6 243.597 L 29.6 243.197 L 29.467 243.197 L 29.467 242.931 L 29.333 242.931 L 29.333 242.664 L 29.2 242.664 L 29.2 242.397 L 29.067 242.397 L 29.067 241.997 L 28.933 241.997 L 28.933 241.731 L 28.8 241.731 L 28.8 241.464 L 28.667 241.464 L 28.667 241.197 L 28.533 241.197 L 28.533 240.797 L 28.4 240.797 L 28.4 240.531 L 28.267 240.531 L 28.267 240.264 L 28.133 240.264 L 28.133 239.864 L 28 239.864 L 28 239.597 L 27.867 239.597 L 27.867 239.331 L 27.733 239.331 L 27.733 238.931 L 27.6 238.931 L 27.6 238.531 L 27.467 238.531 L 27.467 238.264 L 27.333 238.264 L 27.333 237.864 L 27.2 237.864 L 27.2 237.464 L 27.067 237.464 L 27.067 237.064 L 26.933 237.064 L 26.933 236.664 L 26.8 236.664 L 26.8 236.397 L 26.667 236.397 L 26.667 235.997 L 26.533 235.997 L 26.533 235.597 L 26.4 235.597 L 26.4 235.197 L 26.267 235.197 L 26.267 234.797 L 26.133 234.797 L 26.133 234.397 L 26 234.397 L 26 234.131 L 25.867 234.131 L 25.867 233.731 L 25.733 233.731 L 25.733 233.331 L 25.6 233.331 L 25.6 232.931 L 25.467 232.931 L 25.467 232.531 L 25.333 232.531 L 25.333 232.131 L 25.2 232.131 L 25.2 231.731 L 25.067 231.731 L 25.067 231.197 L 24.933 231.197 L 24.933 230.664 L 24.8 230.664 L 24.8 230.264 L 24.667 230.264 L 24.667 229.731 L 24.533 229.731 L 24.533 229.197 L 24.4 229.197 L 24.4 228.797 L 24.267 228.797 L 24.267 228.264 L 24.133 228.264 L 24.133 227.731 L 24 227.731 L 24 227.331 L 23.867 227.331 L 23.867 226.797 L 23.733 226.797 L 23.733 226.264 L 23.6 226.264 L 23.6 225.864 L 23.467 225.864 L 23.467 225.331 L 23.333 225.331 L 23.333 224.664 L 23.2 224.664 L 23.2 223.997 L 23.067 223.997 L 23.067 223.331 L 22.933 223.331 L 22.933 222.664 L 22.8 222.664 L 22.8 221.864 L 22.667 221.864 L 22.667 221.197 L 22.533 221.197 L 22.533 220.531 L 22.4 220.531 L 22.4 219.864 L 22.267 219.864 L 22.267 219.064 L 22.133 219.064 L 22.133 218.397 L 22 218.397 L 22 217.731 L 21.867 217.731 L 21.867 216.531 L 21.733 216.531 L 21.733 215.331 L 21.6 215.331 L 21.6 214.131 L 21.467 214.131 L 21.467 212.931 L 21.333 212.931 L 21.333 211.864 L 21.2 211.864 L 21.2 210.664 L 21.067 210.664 L 21.067 208.531 L 20.933 208.531 L 20.933 205.597 L 20.8 205.597 L 20.8 199.331 L 20.933 199.331 L 20.933 196.264 L 21.067 196.264 L 21.067 194.531 L 21.2 194.531 L 21.2 193.197 L 21.333 193.197 L 21.333 191.864 L 21.467 191.864 L 21.467 190.531 L 21.6 190.531 L 21.6 189.197 L 21.733 189.197 L 21.733 188.264 L 21.867 188.264 L 21.867 187.464 L 22 187.464 L 22 186.664 L 22.133 186.664 L 22.133 185.731 L 22.267 185.731 L 22.267 184.931 L 22.4 184.931 L 22.4 184.131 L 22.533 184.131 L 22.533 183.331 L 22.667 183.331 L 22.667 182.531 L 22.8 182.531 L 22.8 181.864 L 22.933 181.864 L 22.933 181.197 L 23.067 181.197 L 23.067 180.664 L 23.2 180.664 L 23.2 180.131 L 23.333 180.131 L 23.333 179.464 L 23.467 179.464 L 23.467 178.931 L 23.6 178.931 L 23.6 178.397 L 23.733 178.397 L 23.733 177.731 L 23.867 177.731 L 23.867 177.197 L 24 177.197 L 24 176.664 L 24.133 176.664 L 24.133 175.997 L 24.267 175.997 L 24.267 175.464 L 24.4 175.464 L 24.4 174.931 L 24.533 174.931 L 24.533 174.531 L 24.667 174.531 L 24.667 173.997 L 24.8 173.997 L 24.8 173.597 L 24.933 173.597 L 24.933 173.197 L 25.067 173.197 L 25.067 172.664 L 25.2 172.664 L 25.2 172.264 L 25.333 172.264 L 25.333 171.731 L 25.467 171.731 L 25.467 171.331 L 25.6 171.331 L 25.6 170.931 L 25.733 170.931 L 25.733 170.397 L 25.867 170.397 L 25.867 169.997 L 26 169.997 L 26 169.597 L 26.133 169.597 L 26.133 169.064 L 26.267 169.064 L 26.267 168.664 L 26.4 168.664 L 26.4 168.131 L 26.533 168.131 L 26.533 167.864 L 26.667 167.864 L 26.667 167.464 L 26.8 167.464 L 26.8 167.064 L 26.933 167.064 L 26.933 166.664 L 27.067 166.664 L 27.067 166.397 L 27.2 166.397 L 27.2 165.997 L 27.333 165.997 L 27.333 165.597 L 27.467 165.597 L 27.467 165.197 L 27.6 165.197 L 27.6 164.931 L 27.733 164.931 L 27.733 164.531 L 27.867 164.531 L 27.867 164.131 L 28 164.131 L 28 163.731 L 28.133 163.731 L 28.133 163.464 L 28.267 163.464 L 28.267 163.064 L 28.4 163.064 L 28.4 162.664 L 28.533 162.664 L 28.533 162.264 L 28.667 162.264 L 28.667 161.997 L 28.8 161.997 L 28.8 161.597 L 28.933 161.597 L 28.933 161.197 L 29.067 161.197 L 29.067 160.797 L 29.2 160.797 L 29.2 160.531 L 29.333 160.531 L 29.333 160.264 L 29.467 160.264 L 29.467 159.864 L 29.6 159.864 L 29.6 159.597 L 29.733 159.597 L 29.733 159.331 L 29.867 159.331 L 29.867 158.931 L 30 158.931 L 30 158.664 L 30.133 158.664 L 30.133 158.397 L 30.267 158.397 L 30.267 158.131 L 30.4 158.131 L 30.4 157.731 L 30.533 157.731 L 30.533 157.464 L 30.667 157.464 L 30.667 157.197 L 30.8 157.197 L 30.8 156.797 L 30.933 156.797 L 30.933 156.531 L 31.067 156.531 L 31.067 156.264 L 31.2 156.264 L 31.2 155.864 L 31.333 155.864 L 31.333 155.597 L 31.467 155.597 L 31.467 155.331 L 31.6 155.331 L 31.6 154.931 L 31.733 154.931 L 31.733 154.664 L 31.867 154.664 L 31.867 154.397 L 32 154.397 L 32 153.997 L 32.133 153.997 L 32.133 153.731 L 32.267 153.731 L 32.267 153.464 L 32.4 153.464 L 32.4 153.197 L 32.533 153.197 L 32.533 152.931 L 32.667 152.931 L 32.667 152.664 L 32.8 152.664 L 32.8 152.397 L 32.933 152.397 L 32.933 152.131 L 33.067 152.131 L 33.067 151.864 L 33.2 151.864 L 33.2 151.597 L 33.333 151.597 L 33.333 151.331 L 33.467 151.331 L 33.467 151.064 L 33.6 151.064 L 33.6 150.664 L 33.733 150.664 L 33.733 150.397 L 33.867 150.397 L 33.867 150.131 L 34 150.131 L 34 149.864 L 34.133 149.864 L 34.133 149.597 L 34.267 149.597 L 34.267 149.331 L 34.4 149.331 L 34.4 149.064 L 34.533 149.064 L 34.533 148.797 L 34.667 148.797 L 34.667 148.531 L 34.8 148.531 L 34.8 148.264 L 34.933 148.264 L 34.933 147.997 L 35.067 147.997 L 35.067 147.731 L 35.2 147.731 L 35.2 147.464 L 35.333 147.464 L 35.333 147.331 L 35.467 147.331 L 35.467 147.064 L 35.6 147.064 L 35.6 146.797 L 35.733 146.797 L 35.733 146.531 L 35.867 146.531 L 35.867 146.264 L 36 146.264 L 36 145.997 L 36.133 145.997 L 36.133 145.731 L 36.267 145.731 L 36.267 145.464 L 36.4 145.464 L 36.4 145.331 L 36.533 145.331 L 36.533 145.064 L 36.667 145.064 L 36.667 144.797 L 36.8 144.797 L 36.8 144.531 L 36.933 144.531 L 36.933 144.264 L 37.067 144.264 L 37.067 144.131 L 37.2 144.131 L 37.2 143.864 L 37.333 143.864 L 37.333 143.597 L 37.467 143.597 L 37.467 143.331 L 37.6 143.331 L 37.6 143.197 L 37.733 143.197 L 37.733 142.931 L 37.867 142.931 L 37.867 142.664 L 38 142.664 L 38 142.397 L 38.133 142.397 L 38.133 142.264 L 38.267 142.264 L 38.267 141.997 L 38.4 141.997 L 38.4 141.731 L 38.533 141.731 L 38.533 141.464 L 38.667 141.464 L 38.667 141.331 L 38.8 141.331 L 38.8 141.064 L 38.933 141.064 L 38.933 140.797 L 39.067 140.797 L 39.067 140.664 L 39.2 140.664 L 39.2 140.397 L 39.333 140.397 L 39.333 140.131 L 39.467 140.131 L 39.467 139.997 L 39.6 139.997 L 39.6 139.731 L 39.733 139.731 L 39.733 139.464 L 39.867 139.464 L 39.867 139.331 L 40 139.331 L 40 139.064 L 40.133 139.064 L 40.133 138.797 L 40.267 138.797 L 40.267 138.664 L 40.4 138.664 L 40.4 138.397 L 40.533 138.397 L 40.533 138.131 L 40.667 138.131 L 40.667 137.997 L 40.8 137.997 L 40.8 137.731 L 40.933 137.731 L 40.933 137.464 L 41.067 137.464 L 41.067 137.331 L 41.2 137.331 L 41.2 137.064 L 41.333 137.064 L 41.333 136.797 L 41.467 136.797 L 41.467 136.664 L 41.6 136.664 L 41.6 136.397 L 41.733 136.397 L 41.733 136.264 L 41.867 136.264 L 41.867 135.997 L 42 135.997 L 42 135.864 L 42.133 135.864 L 42.133 135.597 L 42.267 135.597 L 42.267 135.464 L 42.4 135.464 L 42.4 135.197 L 42.533 135.197 L 42.533 135.064 L 42.667 135.064 L 42.667 134.797 L 42.8 134.797 L 42.8 134.664 L 42.933 134.664 L 42.933 134.397 L 43.067 134.397 L 43.067 134.264 L 43.2 134.264 L 43.2 133.997 L 43.333 133.997 L 43.333 133.731 L 43.467 133.731 L 43.467 133.597 L 43.6 133.597 L 43.6 133.331 L 43.733 133.331 L 43.733 133.197 L 43.867 133.197 L 43.867 132.931 L 44 132.931 L 44 132.797 L 44.133 132.797 L 44.133 132.531 L 44.267 132.531 L 44.267 132.397 L 44.4 132.397 L 44.4 132.131 L 44.533 132.131 L 44.533 131.997 L 44.667 131.997 L 44.667 131.731 L 44.8 131.731 L 44.8 131.597 L 44.933 131.597 L 44.933 131.331 L 45.067 131.331 L 45.067 131.197 L 45.2 131.197 L 45.2 131.064 L 45.333 131.064 L 45.333 130.797 L 45.467 130.797 L 45.467 130.664 L 45.6 130.664 L 45.6 130.397 L 45.733 130.397 L 45.733 130.264 L 45.867 130.264 L 45.867 130.131 L 46 130.131 L 46 129.864 L 46.133 129.864 L 46.133 129.731 L 46.267 129.731 L 46.267 129.464 L 46.4 129.464 L 46.4 129.331 L 46.533 129.331 L 46.533 129.064 L 46.667 129.064 L 46.667 128.931 L 46.8 128.931 L 46.8 128.797 L 46.933 128.797 L 46.933 128.531 L 47.067 128.531 L 47.067 128.397 L 47.2 128.397 L 47.2 128.131 L 47.333 128.131 L 47.333 127.997 L 47.467 127.997 L 47.467 127.864 L 47.6 127.864 L 47.6 127.597 L 47.733 127.597 L 47.733 127.464 L 47.867 127.464 L 47.867 127.197 L 48 127.197 L 48 127.064 L 48.133 127.064 L 48.133 126.931 L 48.267 126.931 L 48.267 126.797 L 48.4 126.797 L 48.4 126.531 L 48.533 126.531 L 48.533 126.397 L 48.667 126.397 L 48.667 126.264 L 48.8 126.264 L 48.8 125.997 L 48.933 125.997 L 48.933 125.864 L 49.067 125.864 L 49.067 125.731 L 49.2 125.731 L 49.2 125.464 L 49.333 125.464 L 49.333 125.331 L 49.467 125.331 L 49.467 125.197 L 49.6 125.197 L 49.6 124.931 L 49.733 124.931 L 49.733 124.797 L 49.867 124.797 L 49.867 124.664 L 50 124.664 L 50 124.397 L 50.133 124.397 L 50.133 124.264 L 50.267 124.264 L 50.267 124.131 L 50.4 124.131 L 50.4 123.864 L 50.533 123.864 L 50.533 123.731 L 50.667 123.731 L 50.667 123.597 L 50.8 123.597 L 50.8 123.331 L 50.933 123.331 L 50.933 123.197 L 51.067 123.197 L 51.067 123.064 L 51.2 123.064 L 51.2 122.931 L 51.333 122.931 L 51.333 122.797 L 51.467 122.797 L 51.467 122.531 L 51.6 122.531 L 51.6 122.397 L 51.733 122.397 L 51.733 122.264 L 51.867 122.264 L 51.867 122.131 L 52 122.131 L 52 121.864 L 52.133 121.864 L 52.133 121.731 L 52.267 121.731 L 52.267 121.597 L 52.4 121.597 L 52.4 121.464 L 52.533 121.464 L 52.533 121.197 L 52.667 121.197 L 52.667 121.064 L 52.8 121.064 L 52.8 120.931 L 52.933 120.931 L 52.933 120.797 L 53.067 120.797 L 53.067 120.664 L 53.2 120.664 L 53.2 120.397 L 53.333 120.397 L 53.333 120.264 L 53.467 120.264 L 53.467 120.131 L 53.6 120.131 L 53.6 119.997 L 53.733 119.997 L 53.733 119.731 L 53.867 119.731 L 53.867 119.597 L 54 119.597 L 54 119.464 L 54.133 119.464 L 54.133 119.331 L 54.267 119.331 L 54.267 119.197 L 54.4 119.197 L 54.4 118.931 L 54.533 118.931 L 54.533 118.797 L 54.667 118.797 L 54.667 118.664 L 54.8 118.664 L 54.8 118.531 L 54.933 118.531 L 54.933 118.397 L 55.067 118.397 L 55.067 118.264 L 55.2 118.264 L 55.2 118.131 L 55.333 118.131 L 55.333 117.864 L 55.467 117.864 L 55.467 117.731 L 55.6 117.731 L 55.6 117.597 L 55.733 117.597 L 55.733 117.464 L 55.867 117.464 L 55.867 117.331 L 56 117.331 L 56 117.197 L 56.133 117.197 L 56.133 117.064 L 56.267 117.064 L 56.267 116.797 L 56.4 116.797 L 56.4 116.664 L 56.533 116.664 L 56.533 116.531 L 56.667 116.531 L 56.667 116.397 L 56.8 116.397 L 56.8 116.264 L 56.933 116.264 L 56.933 116.131 L 57.067 116.131 L 57.067 115.997 L 57.2 115.997 L 57.2 115.731 L 57.333 115.731 L 57.333 115.597 L 57.467 115.597 L 57.467 115.464 L 57.6 115.464 L 57.6 115.331 L 57.733 115.331 L 57.733 115.197 L 57.867 115.197 L 57.867 115.064 L 58 115.064 L 58 114.931 L 58.133 114.931 L 58.133 114.797 L 58.267 114.797 L 58.267 114.664 L 58.4 114.664 L 58.4 114.397 L 58.533 114.397 L 58.533 114.264 L 58.667 114.264 L 58.667 114.131 L 58.8 114.131 L 58.8 113.997 L 58.933 113.997 L 58.933 113.864 L 59.067 113.864 L 59.067 113.731 L 59.2 113.731 L 59.2 113.597 L 59.333 113.597 L 59.333 113.464 L 59.467 113.464 L 59.467 113.331 L 59.6 113.331 L 59.6 113.197 L 59.733 113.197 L 59.733 113.064 L 59.867 113.064 L 59.867 112.931 L 60 112.931 L 60 112.797 L 60.133 112.797 L 60.133 112.664 L 60.267 112.664 L 60.267 112.531 L 60.4 112.531 L 60.4 112.264 L 60.533 112.264 L 60.533 112.131 L 60.667 112.131 L 60.667 111.997 L 60.8 111.997 L 60.8 111.864 L 60.933 111.864 L 60.933 111.731 L 61.067 111.731 L 61.067 111.597 L 61.2 111.597 L 61.2 111.464 L 61.333 111.464 L 61.333 111.331 L 61.467 111.331 L 61.467 111.197 L 61.6 111.197 L 61.6 111.064 L 61.733 111.064 L 61.733 110.931 L 61.867 110.931 L 61.867 110.797 L 62 110.797 L 62 110.664 L 62.133 110.664 L 62.133 110.531 L 62.267 110.531 L 62.267 110.397 L 62.4 110.397 L 62.4 110.264 L 62.533 110.264 L 62.533 110.131 L 62.667 110.131 L 62.667 109.997 L 62.8 109.997 L 62.8 109.864 L 62.933 109.864 L 62.933 109.731 L 63.067 109.731 L 63.067 109.597 L 63.2 109.597 L 63.2 109.464 L 63.333 109.464 L 63.333 109.331 L 63.467 109.331 L 63.467 109.197 L 63.6 109.197 L 63.6 109.064 L 63.733 109.064 L 63.733 108.931 L 63.867 108.931 L 63.867 108.797 L 64 108.797 L 64 108.664 L 64.133 108.664 L 64.133 108.531 L 64.267 108.531 L 64.267 108.397 L 64.4 108.397 L 64.4 108.264 L 64.533 108.264 L 64.533 108.131 L 64.667 108.131 L 64.667 107.997 L 64.8 107.997 L 64.8 107.864 L 64.933 107.864 L 64.933 107.731 L 65.067 107.731 L 65.067 107.597 L 65.2 107.597 L 65.2 107.464 L 65.333 107.464 L 65.333 107.331 L 65.467 107.331 L 65.467 107.197 L 65.6 107.197 L 65.6 107.064 L 65.867 107.064 L 65.867 106.931 L 66 106.931 L 66 106.797 L 66.133 106.797 L 66.133 106.664 L 66.267 106.664 L 66.267 106.531 L 66.4 106.531 L 66.4 106.397 L 66.533 106.397 L 66.533 106.264 L 66.667 106.264 L 66.667 106.131 L 66.8 106.131 L 66.8 105.997 L 66.933 105.997 L 66.933 105.864 L 67.067 105.864 L 67.067 105.731 L 67.2 105.731 L 67.2 105.597 L 67.333 105.597 L 67.333 105.464 L 67.467 105.464 L 67.467 105.331 L 67.6 105.331 L 67.6 105.197 L 67.867 105.197 L 67.867 105.064 L 68 105.064 L 68 104.931 L 68.133 104.931 L 68.133 104.797 L 68.267 104.797 L 68.267 104.664 L 68.4 104.664 L 68.4 104.531 L 68.533 104.531 L 68.533 104.397 L 68.667 104.397 L 68.667 104.264 L 68.8 104.264 L 68.8 104.131 L 68.933 104.131 L 68.933 103.997 L 69.067 103.997 L 69.067 103.864 L 69.333 103.864 L 69.333 103.731 L 69.467 103.731 L 69.467 103.597 L 69.6 103.597 L 69.6 103.464 L 69.733 103.464 L 69.733 103.331 L 69.867 103.331 L 69.867 103.197 L 70 103.197 L 70 103.064 L 70.133 103.064 L 70.133 102.931 L 70.4 102.931 L 70.4 102.797 L 70.533 102.797 L 70.533 102.664 L 70.667 102.664 L 70.667 102.531 L 70.8 102.531 L 70.8 102.397 L 70.933 102.397 L 70.933 102.264 L 71.067 102.264 L 71.067 102.131 L 71.2 102.131 L 71.2 101.997 L 71.467 101.997 L 71.467 101.864 L 71.6 101.864 L 71.6 101.731 L 71.733 101.731 L 71.733 101.597 L 71.867 101.597 L 71.867 101.464 L 72 101.464 L 72 101.331 L 72.133 101.331 L 72.133 101.197 L 72.267 101.197 L 72.267 101.064 L 72.533 101.064 L 72.533 100.931 L 72.667 100.931 L 72.667 100.797 L 72.8 100.797 L 72.8 100.664 L 72.933 100.664 L 72.933 100.531 L 73.2 100.531 L 73.2 100.397 L 73.333 100.397 L 73.333 100.264 L 73.467 100.264 L 73.467 100.131 L 73.6 100.131 L 73.6 99.997 L 73.733 99.997 L 73.733 99.864 L 74 99.864 L 74 99.731 L 74.133 99.731 L 74.133 99.597 L 74.267 99.597 L 74.267 99.464 L 74.4 99.464 L 74.4 99.331 L 74.667 99.331 L 74.667 99.197 L 74.8 99.197 L 74.8 99.064 L 74.933 99.064 L 74.933 98.931 L 75.067 98.931 L 75.067 98.797 L 75.333 98.797 L 75.333 98.664 L 75.467 98.664 L 75.467 98.531 L 75.6 98.531 L 75.6 98.397 L 75.733 98.397 L 75.733 98.264 L 75.867 98.264 L 75.867 98.131 L 76.133 98.131 L 76.133 97.997 L 76.267 97.997 L 76.267 97.864 L 76.4 97.864 L 76.4 97.731 L 76.667 97.731 L 76.667 97.597 L 76.8 97.597 L 76.8 97.464 L 76.933 97.464 L 76.933 97.331 L 77.067 97.331 L 77.067 97.197 L 77.333 97.197 L 77.333 97.064 L 77.467 97.064 L 77.467 96.931 L 77.6 96.931 L 77.6 96.797 L 77.867 96.797 L 77.867 96.664 L 78 96.664 L 78 96.531 L 78.133 96.531 L 78.133 96.397 L 78.4 96.397 L 78.4 96.264 L 78.533 96.264 L 78.533 96.131 L 78.667 96.131 L 78.667 95.997 L 78.933 95.997 L 78.933 95.864 L 79.067 95.864 L 79.067 95.731 L 79.2 95.731 L 79.2 95.597 L 79.467 95.597 L 79.467 95.464 L 79.6 95.464 L 79.6 95.331 L 79.733 95.331 L 79.733 95.197 L 79.867 95.197 L 79.867 95.064 L 80.133 95.064 L 80.133 94.931 L 80.267 94.931 L 80.267 94.797 L 80.533 94.797 L 80.533 94.664 L 80.667 94.664 L 80.667 94.531 L 80.8 94.531 L 80.8 94.397 L 81.067 94.397 L 81.067 94.264 L 81.2 94.264 L 81.2 94.131 L 81.467 94.131 L 81.467 93.997 L 81.6 93.997 L 81.6 93.864 L 81.733 93.864 L 81.733 93.731 L 82 93.731 L 82 93.597 L 82.133 93.597 L 82.133 93.464 L 82.4 93.464 L 82.4 93.331 L 82.533 93.331 L 82.533 93.197 L 82.8 93.197 L 82.8 93.064 L 82.933 93.064 L 82.933 92.931 L 83.067 92.931 L 83.067 92.797 L 83.333 92.797 L 83.333 92.664 L 83.467 92.664 L 83.467 92.531 L 83.733 92.531 L 83.733 92.397 L 83.867 92.397 L 83.867 92.264 L 84 92.264 L 84 92.131 L 84.267 92.131 L 84.267 91.997 L 84.4 91.997 L 84.4 91.864 L 84.667 91.864 L 84.667 91.731 L 84.8 91.731 L 84.8 91.597 L 85.067 91.597 L 85.067 91.464 L 85.333 91.464 L 85.333 91.331 L 85.467 91.331 L 85.467 91.197 L 85.733 91.197 L 85.733 91.064 L 85.867 91.064 L 85.867 90.931 L 86.133 90.931 L 86.133 90.797 L 86.267 90.797 L 86.267 90.664 L 86.533 90.664 L 86.533 90.531 L 86.667 90.531 L 86.667 90.397 L 86.933 90.397 L 86.933 90.264 L 87.067 90.264 L 87.067 90.131 L 87.333 90.131 L 87.333 89.997 L 87.467 89.997 L 87.467 89.864 L 87.733 89.864 L 87.733 89.731 L 87.867 89.731 L 87.867 89.597 L 88.133 89.597 L 88.133 89.464 L 88.267 89.464 L 88.267 89.331 L 88.533 89.331 L 88.533 89.197 L 88.8 89.197 L 88.8 89.064 L 88.933 89.064 L 88.933 88.931 L 89.2 88.931 L 89.2 88.797 L 89.333 88.797 L 89.333 88.664 L 89.6 88.664 L 89.6 88.531 L 89.867 88.531 L 89.867 88.397 L 90 88.397 L 90 88.264 L 90.267 88.264 L 90.267 88.131 L 90.4 88.131 L 90.4 87.997 L 90.667 87.997 L 90.667 87.864 L 90.933 87.864 L 90.933 87.731 L 91.067 87.731 L 91.067 87.597 L 91.333 87.597 L 91.333 87.464 L 91.6 87.464 L 91.6 87.331 L 91.733 87.331 L 91.733 87.197 L 92 87.197 L 92 87.064 L 92.267 87.064 L 92.267 86.931 L 92.4 86.931 L 92.4 86.797 L 92.667 86.797 L 92.667 86.664 L 92.933 86.664 L 92.933 86.531 L 93.067 86.531 L 93.067 86.397 L 93.333 86.397 L 93.333 86.264 L 93.6 86.264 L 93.6 86.131 L 93.867 86.131 L 93.867 85.997 L 94.133 85.997 L 94.133 85.864 L 94.267 85.864 L 94.267 85.731 L 94.533 85.731 L 94.533 85.597 L 94.8 85.597 L 94.8 85.464 L 95.067 85.464 L 95.067 85.331 L 95.333 85.331 L 95.333 85.197 L 95.467 85.197 L 95.467 85.064 L 95.733 85.064 L 95.733 84.931 L 96 84.931 L 96 84.797 L 96.267 84.797 L 96.267 84.664 L 96.4 84.664 L 96.4 84.531 L 96.667 84.531 L 96.667 84.397 L 96.933 84.397 L 96.933 84.264 L 97.2 84.264 L 97.2 84.131 L 97.467 84.131 L 97.467 83.997 L 97.733 83.997 L 97.733 83.864 L 98 83.864 L 98 83.731 L 98.267 83.731 L 98.267 83.597 L 98.533 83.597 L 98.533 83.464 L 98.8 83.464 L 98.8 83.331 L 99.067 83.331 L 99.067 83.197 L 99.333 83.197 L 99.333 83.064 L 99.6 83.064 L 99.6 82.931 L 99.733 82.931 L 99.733 82.797 L 100 82.797 L 100 82.664 L 100.267 82.664 L 100.267 82.531 L 100.533 82.531 L 100.533 82.397 L 100.8 82.397 L 100.8 82.264 L 101.067 82.264 L 101.067 82.131 L 101.333 82.131 L 101.333 81.997 L 101.6 81.997 L 101.6 81.864 L 101.867 81.864 L 101.867 81.731 L 102.133 81.731 L 102.133 81.597 L 102.4 81.597 L 102.4 81.464 L 102.8 81.464 L 102.8 81.331 L 103.067 81.331 L 103.067 81.197 L 103.333 81.197 L 103.333 81.064 L 103.6 81.064 L 103.6 80.931 L 103.867 80.931 L 103.867 80.797 L 104.133 80.797 L 104.133 80.664 L 104.533 80.664 L 104.533 80.531 L 104.8 80.531 L 104.8 80.397 L 105.067 80.397 L 105.067 80.264 L 105.333 80.264 L 105.333 80.131 L 105.6 80.131 L 105.6 79.997 L 105.867 79.997 L 105.867 79.864 L 106.133 79.864 L 106.133 79.731 L 106.533 79.731 L 106.533 79.597 L 106.8 79.597 L 106.8 79.464 L 107.067 79.464 L 107.067 79.331 L 107.467 79.331 L 107.467 79.197 L 107.733 79.197 L 107.733 79.064 L 108.133 79.064 L 108.133 78.931 L 108.4 78.931 L 108.4 78.797 L 108.667 78.797 L 108.667 78.664 L 109.067 78.664 L 109.067 78.531 L 109.333 78.531 L 109.333 78.397 L 109.733 78.397 L 109.733 78.264 L 110 78.264 L 110 78.131 L 110.4 78.131 L 110.4 77.997 L 110.667 77.997 L 110.667 77.864 L 110.933 77.864 L 110.933 77.731 L 111.333 77.731 L 111.333 77.597 L 111.6 77.597 L 111.6 77.464 L 112 77.464 L 112 77.331 L 112.4 77.331 L 112.4 77.197 L 112.8 77.197 L 112.8 77.064 L 113.067 77.064 L 113.067 76.931 L 113.467 76.931 L 113.467 76.797 L 113.867 76.797 L 113.867 76.664 L 114.267 76.664 L 114.267 76.531 L 114.533 76.531 L 114.533 76.397 L 114.933 76.397 L 114.933 76.264 L 115.333 76.264 L 115.333 76.131 L 115.6 76.131 L 115.6 75.997 L 116 75.997 L 116 75.864 L 116.4 75.864 L 116.4 75.731 L 116.8 75.731 L 116.8 75.597 L 117.2 75.597 L 117.2 75.464 L 117.6 75.464 L 117.6 75.331 L 118.133 75.331 L 118.133 75.197 L 118.533 75.197 L 118.533 75.064 L 118.933 75.064 L 118.933 74.931 L 119.333 74.931 L 119.333 74.797 L 119.733 74.797 L 119.733 74.664 L 120.133 74.664 L 120.133 74.531 L 120.667 74.531 L 120.667 74.397 L 121.067 74.397 L 121.067 74.264 L 121.467 74.264 L 121.467 74.131 L 122 74.131 L 122 73.997 L 122.533 73.997 L 122.533 73.864 L 122.933 73.864 L 122.933 73.731 L 123.467 73.731 L 123.467 73.597 L 124 73.597 L 124 73.464 L 124.533 73.464 L 124.533 73.331 L 124.933 73.331 L 124.933 73.197 L 125.467 73.197 L 125.467 73.064 L 126 73.064 L 126 72.931 L 126.533 72.931 L 126.533 72.797 L 127.2 72.797 L 127.2 72.664 L 127.733 72.664 L 127.733 72.531 L 128.4 72.531 L 128.4 72.397 L 128.933 72.397 L 128.933 72.264 L 129.6 72.264 L 129.6 72.131 L 130.133 72.131 L 130.133 71.997 L 130.8 71.997 L 130.8 71.864 L 131.467 71.864 L 131.467 71.731 L 132.267 71.731 L 132.267 71.597 L 133.067 71.597 L 133.067 71.464 L 133.867 71.464 L 133.867 71.331 L 134.667 71.331 L 134.667 71.197 L 135.333 71.197 L 135.333 71.064 L 136.4 71.064 L 136.4 70.931 L 137.467 70.931 L 137.467 70.797 L 138.533 70.797 L 138.533 70.664 L 139.6 70.664 L 139.6 70.531 L 141.067 70.531 L 141.067 70.397 L 142.933 70.397 L 142.933 70.264 L 145.067 70.264 L 145.067 70.131 L 151.467 70.131 L 151.467 70.264 L 154.133 70.264 L 154.133 70.397 L 155.6 70.397 L 155.6 70.531 L 157.067 70.531 L 157.067 70.664 L 158.133 70.664 L 158.133 70.797 L 158.933 70.797 L 158.933 70.931 L 159.867 70.931 L 159.867 71.064 L 160.667 71.064 L 160.667 71.197 L 161.467 71.197 L 161.467 71.331 L 162.133 71.331 L 162.133 71.464 L 162.8 71.464 L 162.8 71.597 L 163.467 71.597 L 163.467 71.731 L 164 71.731 L 164 71.864 L 164.667 71.864 L 164.667 71.997 L 165.067 71.997 L 165.067 72.131 L 165.6 72.131 L 165.6 72.264 L 166.133 72.264 L 166.133 72.397 L 166.667 72.397 L 166.667 72.531 L 167.067 72.531 L 167.067 72.664 L 167.467 72.664 L 167.467 72.797 L 167.867 72.797 L 167.867 72.931 L 168.4 72.931 L 168.4 73.064 L 168.8 73.064 L 168.8 73.197 L 169.2 73.197 L 169.2 73.331 L 169.467 73.331 L 169.467 73.464 L 169.867 73.464 L 169.867 73.597 L 170.267 73.597 L 170.267 73.731 L 170.533 73.731 L 170.533 73.864 L 170.933 73.864 L 170.933 73.997 L 171.333 73.997 L 171.333 74.131 L 171.6 74.131 L 171.6 74.264 L 172 74.264 L 172 74.397 L 172.4 74.397 L 172.4 74.531 L 172.667 74.531 L 172.667 74.664 L 172.933 74.664 L 172.933 74.797 L 173.333 74.797 L 173.333 74.931 L 173.6 74.931 L 173.6 75.064 L 173.867 75.064 L 173.867 75.197 L 174.133 75.197 L 174.133 75.331 L 174.4 75.331 L 174.4 75.464 L 174.8 75.464 L 174.8 75.597 L 175.067 75.597 L 175.067 75.731 L 175.333 75.731 L 175.333 75.864 L 175.6 75.864 L 175.6 75.997 L 175.867 75.997 L 175.867 76.131 L 176.133 76.131 L 176.133 76.264 L 176.4 76.264 L 176.4 76.397 L 176.667 76.397 L 176.667 76.531 L 176.933 76.531 L 176.933 76.664 L 177.067 76.664 L 177.067 76.797 L 177.333 76.797 L 177.333 76.931 L 177.6 76.931 L 177.6 77.064 L 177.867 77.064 L 177.867 77.197 L 178.133 77.197 L 178.133 77.331 L 178.4 77.331 L 178.4 77.464 L 178.533 77.464 L 178.533 77.597 L 178.8 77.597 L 178.8 77.731 L 179.067 77.731 L 179.067 77.864 L 179.333 77.864 L 179.333 77.997 L 179.467 77.997 L 179.467 78.131 L 179.733 78.131 L 179.733 78.264 L 179.867 78.264 L 179.867 78.397 L 180.133 78.397 L 180.133 78.531 L 180.267 78.531 L 180.267 78.664 L 180.533 78.664 L 180.533 78.797 L 180.667 78.797 L 180.667 78.931 L 180.933 78.931 L 180.933 79.064 L 181.067 79.064 L 181.067 79.197 L 181.333 79.197 L 181.333 79.331 L 181.6 79.331 L 181.6 79.464 L 181.733 79.464 L 181.733 79.597 L 182 79.597 L 182 79.731 L 182.133 79.731 L 182.133 79.864 L 182.267 79.864 L 182.267 79.997 L 182.533 79.997 L 182.533 80.131 L 182.667 80.131 L 182.667 80.264 L 182.8 80.264 L 182.8 80.397 L 183.067 80.397 L 183.067 80.531 L 183.2 80.531 L 183.2 80.664 L 183.333 80.664 L 183.333 80.797 L 183.6 80.797 L 183.6 80.931 L 183.733 80.931 L 183.733 81.064 L 183.867 81.064 L 183.867 81.197 L 184.133 81.197 L 184.133 81.331 L 184.267 81.331 L 184.267 81.464 L 184.4 81.464 L 184.4 81.597 L 184.667 81.597 L 184.667 81.731 L 184.8 81.731 L 184.8 81.864 L 184.933 81.864 L 184.933 81.997 L 185.067 81.997 L 185.067 82.131 L 185.333 82.131 L 185.333 82.264 L 185.467 82.264 L 185.467 82.397 L 185.6 82.397 L 185.6 82.531 L 185.733 82.531 L 185.733 82.664 L 185.867 82.664 L 185.867 82.797 L 186 82.797 L 186 82.931 L 186.133 82.931 L 186.133 83.064 L 186.267 83.064 L 186.267 83.197 L 186.4 83.197 L 186.4 83.331 L 186.667 83.331 L 186.667 83.464 L 186.8 83.464 L 186.8 83.597 L 186.933 83.597 L 186.933 83.731 L 187.067 83.731 L 187.067 83.864 L 187.2 83.864 L 187.2 83.997 L 187.333 83.997 L 187.333 84.131 L 187.467 84.131 L 187.467 84.264 L 187.6 84.264 L 187.6 84.397 L 187.733 84.397 L 187.733 84.531 L 187.867 84.531 L 187.867 84.664 L 188 84.664 L 188 84.797 L 188.133 84.797 L 188.133 84.931 L 188.267 84.931 L 188.267 85.064 L 188.4 85.064 L 188.4 85.197 L 188.533 85.197 L 188.533 85.331 L 188.667 85.331 L 188.667 85.464 L 188.8 85.464 L 188.8 85.597 L 188.933 85.597 L 188.933 85.731 L 189.067 85.731 L 189.067 85.864 L 189.2 85.864 L 189.2 85.997 L 189.333 85.997 L 189.333 86.131 L 189.467 86.131 L 189.467 86.264 L 189.6 86.264 L 189.6 86.397 L 189.733 86.397 L 189.733 86.531 L 189.867 86.531 L 189.867 86.664 L 190 86.664 L 190 86.797 L 190.133 86.797 L 190.133 87.064 L 190.267 87.064 L 190.267 87.197 L 190.4 87.197 L 190.4 87.331 L 190.533 87.331 L 190.533 87.464 L 190.667 87.464 L 190.667 87.597 L 190.8 87.597 L 190.8 87.864 L 190.933 87.864 L 190.933 87.997 L 191.067 87.997 L 191.067 88.131 L 191.2 88.131 L 191.2 88.264 L 191.333 88.264 L 191.333 88.531 L 191.467 88.531 L 191.467 88.664 L 191.6 88.664 L 191.6 88.931 L 191.733 88.931 L 191.733 89.064 L 191.867 89.064 L 191.867 89.197 L 192 89.197 L 192 89.464 L 192.133 89.464 L 192.133 89.597 L 192.267 89.597 L 192.267 89.731 L 192.4 89.731 L 192.4 89.997 L 192.533 89.997 L 192.533 90.131 L 192.667 90.131 L 192.667 90.264 L 192.8 90.264 L 192.8 90.531 L 192.933 90.531 L 192.933 90.664 L 193.067 90.664 L 193.067 90.931 L 193.2 90.931 L 193.2 91.064 L 193.333 91.064 L 193.333 91.331 L 193.467 91.331 L 193.467 91.597 L 193.6 91.597 L 193.6 91.731 L 193.733 91.731 L 193.733 91.997 L 193.867 91.997 L 193.867 92.264 L 194 92.264 L 194 92.397 L 194.133 92.397 L 194.133 92.664 L 194.267 92.664 L 194.267 92.931 L 194.4 92.931 L 194.4 93.064 L 194.533 93.064 L 194.533 93.331 L 194.667 93.331 L 194.667 93.597 L 194.8 93.597 L 194.8 93.731 L 194.933 93.731 L 194.933 93.997 L 195.067 93.997 L 195.067 94.264 L 195.2 94.264 L 195.2 94.397 L 195.333 94.397 L 195.333 94.664 L 195.467 94.664 L 195.467 94.931 L 195.6 94.931 L 195.6 95.197 L 195.733 95.197 L 195.733 95.597 L 195.867 95.597 L 195.867 95.864 L 196 95.864 L 196 96.131 L 196.133 96.131 L 196.133 96.397 L 196.267 96.397 L 196.267 96.797 L 196.4 96.797 L 196.4 97.064 L 196.533 97.064 L 196.533 97.331 L 196.667 97.331 L 196.667 97.597 L 196.8 97.597 L 196.8 97.997 L 196.933 97.997 L 196.933 98.264 L 197.067 98.264 L 197.067 98.531 L 197.2 98.531 L 197.2 98.797 L 197.333 98.797 L 197.333 99.197 L 197.467 99.197 L 197.467 99.597 L 197.6 99.597 L 197.6 99.997 L 197.733 99.997 L 197.733 100.397 L 197.867 100.397 L 197.867 100.931 L 198 100.931 L 198 101.331 L 198.133 101.331 L 198.133 101.731 L 198.267 101.731 L 198.267 102.131 L 198.4 102.131 L 198.4 102.531 L 198.533 102.531 L 198.533 103.197 L 198.667 103.197 L 198.667 103.731 L 198.8 103.731 L 198.8 104.264 L 198.933 104.264 L 198.933 104.931 L 199.067 104.931 L 199.067 105.731 L 199.2 105.731 L 199.2 106.531 L 199.333 106.531 L 199.333 107.331 L 199.467 107.331 L 199.467 108.264 L 199.6 108.264 L 199.6 110.664 L 199.733 110.664 L 199.733 115.064 L 199.6 115.064 L 199.6 116.931 L 199.467 116.931 L 199.467 118.531 L 199.333 118.531 L 199.333 119.331 L 199.2 119.331 L 199.2 119.997 L 199.067 119.997 L 199.067 120.797 L 198.933 120.797 L 198.933 121.597 L 198.8 121.597 L 198.8 122.397 L 198.667 122.397 L 198.667 122.931 L 198.533 122.931 L 198.533 123.331 L 198.4 123.331 L 198.4 123.864 L 198.267 123.864 L 198.267 124.397 L 198.133 124.397 L 198.133 124.931 L 198 124.931 L 198 125.331 L 197.867 125.331 L 197.867 125.731 L 197.733 125.731 L 197.733 126.131 L 197.6 126.131 L 197.6 126.531 L 197.467 126.531 L 197.467 126.797 L 197.333 126.797 L 197.333 127.197 L 197.2 127.197 L 197.2 127.597 L 197.067 127.597 L 197.067 127.997 L 196.933 127.997 L 196.933 128.397 L 196.8 128.397 L 196.8 128.797 L 196.667 128.797 L 196.667 129.064 L 196.533 129.064 L 196.533 129.331 L 196.4 129.331 L 196.4 129.597 L 196.267 129.597 L 196.267 129.997 L 196.133 129.997 L 196.133 130.264 L 196 130.264 L 196 130.531 L 195.867 130.531 L 195.867 130.797 L 195.733 130.797 L 195.733 131.197 L 195.6 131.197 L 195.6 131.464 L 195.467 131.464 L 195.467 131.731 L 195.333 131.731 L 195.333 132.131 L 195.2 132.131 L 195.2 132.397 L 195.067 132.397 L 195.067 132.664 L 194.933 132.664 L 194.933 132.931 L 194.8 132.931 L 194.8 133.331 L 194.667 133.331 L 194.667 133.597 L 194.533 133.597 L 194.533 133.864 L 194.4 133.864 L 194.4 134.131 L 194.267 134.131 L 194.267 134.264 L 194.133 134.264 L 194.133 134.531 L 194 134.531 L 194 134.797 L 193.867 134.797 L 193.867 135.064 L 193.733 135.064 L 193.733 135.197 L 193.6 135.197 L 193.6 135.464 L 193.467 135.464 L 193.467 135.731 L 193.333 135.731 L 193.333 135.997 L 193.2 135.997 L 193.2 136.264 L 193.067 136.264 L 193.067 136.397 L 192.933 136.397 L 192.933 136.664 L 192.8 136.664 L 192.8 136.931 L 192.667 136.931 L 192.667 137.197 L 192.533 137.197 L 192.533 137.464 L 192.4 137.464 L 192.4 137.597 L 192.267 137.597 L 192.267 137.864 L 192.133 137.864 L 192.133 138.131 L 192 138.131 L 192 138.397 L 191.867 138.397 L 191.867 138.531 L 191.733 138.531 L 191.733 138.797 L 191.6 138.797 L 191.6 139.064 L 191.467 139.064 L 191.467 139.197 L 191.333 139.197 L 191.333 139.464 L 191.2 139.464 L 191.2 139.597 L 191.067 139.597 L 191.067 139.864 L 190.933 139.864 L 190.933 139.997 L 190.8 139.997 L 190.8 140.264 L 190.667 140.264 L 190.667 140.397 L 190.533 140.397 L 190.533 140.664 L 190.4 140.664 L 190.4 140.797 L 190.267 140.797 L 190.267 141.064 L 190.133 141.064 L 190.133 141.197 L 190 141.197 L 190 141.464 L 189.867 141.464 L 189.867 141.597 L 189.733 141.597 L 189.733 141.864 L 189.6 141.864 L 189.6 141.997 L 189.467 141.997 L 189.467 142.264 L 189.333 142.264 L 189.333 142.531 L 189.2 142.531 L 189.2 142.664 L 189.067 142.664 L 189.067 142.931 L 188.933 142.931 L 188.933 143.064 L 188.8 143.064 L 188.8 143.197 L 188.667 143.197 L 188.667 143.464 L 188.533 143.464 L 188.533 143.597 L 188.4 143.597 L 188.4 143.731 L 188.267 143.731 L 188.267 143.997 L 188.133 143.997 L 188.133 144.131 L 188.4 144.131 L 188.4 144.264 L 188.667 144.264 L 188.667 144.397 L 188.933 144.397 L 188.933 144.531 L 189.333 144.531 L 189.333 144.664 L 189.6 144.664 L 189.6 144.797 L 189.867 144.797 L 189.867 144.931 L 190.133 144.931 L 190.133 145.064 L 190.4 145.064 L 190.4 145.197 L 190.667 145.197 L 190.667 145.331 L 190.933 145.331 L 190.933 145.464 L 191.2 145.464 L 191.2 145.597 L 191.6 145.597 L 191.6 145.731 L 191.867 145.731 L 191.867 145.864 L 192.133 145.864 L 192.133 145.997 L 192.4 145.997 L 192.4 146.131 L 192.667 146.131 L 192.667 146.264 L 192.933 146.264 L 192.933 146.397 L 193.2 146.397 L 193.2 146.531 L 193.467 146.531 L 193.467 146.664 L 193.733 146.664 L 193.733 146.797 L 194 146.797 L 194 146.931 L 194.267 146.931 L 194.267 147.064 L 194.4 147.064 L 194.4 147.197 L 194.667 147.197 L 194.667 147.331 L 194.933 147.331 L 194.933 147.464 L 195.067 147.464 L 195.067 147.597 L 195.333 147.597 L 195.333 147.731 L 195.6 147.731 L 195.6 147.864 L 195.733 147.864 L 195.733 147.997 L 196 147.997 L 196 148.131 L 196.267 148.131 L 196.267 148.264 L 196.4 148.264 L 196.4 148.397 L 196.667 148.397 L 196.667 148.531 L 196.933 148.531 L 196.933 148.664 L 197.2 148.664 L 197.2 148.797 L 197.333 148.797 L 197.333 148.931 L 197.6 148.931 L 197.6 149.064 L 197.867 149.064 L 197.867 149.197 L 198 149.197 L 198 149.331 L 198.267 149.331 L 198.267 149.464 L 198.533 149.464 L 198.533 149.597 L 198.667 149.597 L 198.667 149.731 L 198.933 149.731 L 198.933 149.864 L 199.2 149.864 L 199.2 149.997 L 199.333 149.997 L 199.333 150.131 L 199.6 150.131 L 199.6 150.264 L 199.733 150.264 L 199.733 150.397 L 199.867 150.397 L 199.867 150.531 L 200.133 150.531 L 200.133 150.664 L 200.267 150.664 L 200.267 150.797 L 200.4 150.797 L 200.4 150.931 L 200.667 150.931 L 200.667 151.064 L 200.8 151.064 L 200.8 151.197 L 201.067 151.197 L 201.067 151.331 L 201.2 151.331 L 201.2 151.464 L 201.333 151.464 L 201.333 151.597 L 201.6 151.597 L 201.6 151.731 L 201.733 151.731 L 201.733 151.864 L 201.867 151.864 L 201.867 151.997 L 202.133 151.997 L 202.133 152.131 L 202.267 152.131 L 202.267 152.264 L 202.4 152.264 L 202.4 152.397 L 202.667 152.397 L 202.667 152.531 L 202.8 152.531 L 202.8 152.664 L 202.933 152.664 L 202.933 152.797 L 203.2 152.797 L 203.2 152.931 L 203.333 152.931 L 203.333 153.064 L 203.467 153.064 L 203.467 153.197 L 203.733 153.197 L 203.733 153.331 L 203.867 153.331 L 203.867 153.464 L 204 153.464 L 204 153.597 L 204.267 153.597 L 204.267 153.731 L 204.4 153.731 L 204.4 153.864 L 204.533 153.864 L 204.533 153.997 L 204.667 153.997 L 204.667 154.131 L 204.8 154.131 L 204.8 154.264 L 204.933 154.264 L 204.933 154.397 L 205.067 154.397 L 205.067 154.531 L 205.2 154.531 L 205.2 154.664 L 205.467 154.664 L 205.467 154.797 L 205.6 154.797 L 205.6 154.931 L 205.733 154.931 L 205.733 155.064 L 205.867 155.064 L 205.867 155.197 L 206 155.197 L 206 155.331 L 206.133 155.331 L 206.133 155.464 L 206.267 155.464 L 206.267 155.597 L 206.4 155.597 L 206.4 155.731 L 206.667 155.731 L 206.667 155.864 L 206.8 155.864 L 206.8 155.997 L 206.933 155.997 L 206.933 156.131 L 207.067 156.131 L 207.067 156.264 L 207.2 156.264 L 207.2 156.397 L 207.333 156.397 L 207.333 156.531 L 207.467 156.531 L 207.467 156.664 L 207.6 156.664 L 207.6 156.797 L 207.733 156.797 L 207.733 156.931 L 207.867 156.931 L 207.867 157.064 L 208 157.064 L 208 157.197 L 208.133 157.197 L 208.133 157.331 L 208.267 157.331 L 208.267 157.464 L 208.4 157.464 L 208.4 157.597 L 208.533 157.597 L 208.533 157.731 L 208.667 157.731 L 208.667 157.864 L 208.8 157.864 L 208.8 157.997 L 208.933 157.997 L 208.933 158.131 L 209.067 158.131 L 209.067 158.264 L 209.2 158.264 L 209.2 158.397 L 209.333 158.397 L 209.333 158.531 L 209.467 158.531 L 209.467 158.797 L 209.6 158.797 L 209.6 158.931 L 209.733 158.931 L 209.733 159.064 L 209.867 159.064 L 209.867 159.197 L 210 159.197 L 210 159.331 L 210.133 159.331 L 210.133 159.464 L 210.267 159.464 L 210.267 159.597 L 210.4 159.597 L 210.4 159.731 L 210.533 159.731 L 210.533 159.864 L 210.667 159.864 L 210.667 160.131 L 210.8 160.131 L 210.8 160.264 L 210.933 160.264 L 210.933 160.397 L 211.067 160.397 L 211.067 160.531 L 211.2 160.531 L 211.2 160.797 L 211.333 160.797 L 211.333 160.931 L 211.467 160.931 L 211.467 161.064 L 211.6 161.064 L 211.6 161.197 L 211.733 161.197 L 211.733 161.331 L 211.867 161.331 L 211.867 161.597 L 212 161.597 L 212 161.731 L 212.133 161.731 L 212.133 161.864 L 212.267 161.864 L 212.267 161.997 L 212.4 161.997 L 212.4 162.264 L 212.533 162.264 L 212.533 162.397 L 212.667 162.397 L 212.667 162.531 L 212.8 162.531 L 212.8 162.797 L 212.933 162.797 L 212.933 162.931 L 213.067 162.931 L 213.067 163.064 L 213.2 163.064 L 213.2 163.331 L 213.333 163.331 L 213.333 163.464 L 213.467 163.464 L 213.467 163.731 L 213.6 163.731 L 213.6 163.864 L 213.733 163.864 L 213.733 163.997 L 213.867 163.997 L 213.867 164.264 L 214 164.264 L 214 164.397 L 214.133 164.397 L 214.133 164.664 L 214.267 164.664 L 214.267 164.797 L 214.4 164.797 L 214.4 165.064 L 214.533 165.064 L 214.533 165.197 L 214.667 165.197 L 214.667 165.464 L 214.8 165.464 L 214.8 165.597 L 214.933 165.597 L 214.933 165.864 L 215.067 165.864 L 215.067 166.131 L 215.2 166.131 L 215.2 166.264 L 215.333 166.264 L 215.333 166.531 L 215.467 166.531 L 215.467 166.664 L 215.6 166.664 L 215.6 166.931 L 215.733 166.931 L 215.733 167.197 L 215.867 167.197 L 215.867 167.331 L 216 167.331 L 216 167.597 L 216.133 167.597 L 216.133 167.864 L 216.267 167.864 L 216.267 167.997 L 216.4 167.997 L 216.4 168.264 L 216.533 168.264 L 216.533 168.531 L 216.667 168.531 L 216.667 168.797 L 216.8 168.797 L 216.8 169.064 L 216.933 169.064 L 216.933 169.331 L 217.067 169.331 L 217.067 169.597 L 217.2 169.597 L 217.2 169.864 L 217.333 169.864 L 217.333 169.997 L 217.467 169.997 L 217.467 170.264 L 217.6 170.264 L 217.6 170.531 L 217.733 170.531 L 217.733 170.931 L 217.867 170.931 L 217.867 171.197 L 218 171.197 L 218 171.464 L 218.133 171.464 L 218.133 171.731 L 218.267 171.731 L 218.267 171.997 L 218.4 171.997 L 218.4 172.397 L 218.533 172.397 L 218.533 172.664 L 218.667 172.664 L 218.667 172.931 L 218.8 172.931 L 218.8 173.197 L 218.933 173.197 L 218.933 173.597 L 219.067 173.597 L 219.067 173.864 L 219.2 173.864 L 219.2 174.264 L 219.333 174.264 L 219.333 174.664 L 219.467 174.664 L 219.467 174.931 L 219.6 174.931 L 219.6 175.331 L 219.733 175.331 L 219.733 175.731 L 219.867 175.731 L 219.867 175.997 L 220 175.997 L 220 176.397 L 220.133 176.397 L 220.133 176.797 L 220.267 176.797 L 220.267 177.197 L 220.4 177.197 L 220.4 177.597 L 220.533 177.597 L 220.533 177.997 L 220.667 177.997 L 220.667 178.531 L 220.8 178.531 L 220.8 178.931 L 220.933 178.931 L 220.933 179.464 L 221.067 179.464 L 221.067 179.864 L 221.2 179.864 L 221.2 180.397 L 221.333 180.397 L 221.333 181.064 L 221.467 181.064 L 221.467 181.731 L 221.6 181.731 L 221.6 182.397 L 221.733 182.397 L 221.733 183.064 L 221.867 183.064 L 221.867 183.731 L 222 183.731 L 222 184.397 L 222.133 184.397 L 222.133 185.464 L 222.267 185.464 L 222.267 186.664 L 222.4 186.664 L 222.4 187.864 L 222.533 187.864 L 222.533 189.064 L 222.667 189.064 L 222.667 194.397 L 222.8 194.397 L 222.8 195.997 L 222.667 195.997 L 222.667 197.731 L 222.533 197.731 L 222.533 199.597 L 222.4 199.597 L 222.4 200.797 L 222.267 200.797 L 222.267 201.731 L 222.133 201.731 L 222.133 202.664 L 222 202.664 L 222 203.331 L 221.867 203.331 L 221.867 203.997 L 221.733 203.997 L 221.733 204.664 L 221.6 204.664 L 221.6 205.331 L 221.467 205.331 L 221.467 205.997 L 221.333 205.997 L 221.333 206.397 L 221.2 206.397 L 221.2 206.931 L 221.067 206.931 L 221.067 207.464 L 220.933 207.464 L 220.933 207.997 L 220.8 207.997 L 220.8 208.397 L 220.667 208.397 L 220.667 208.931 L 220.533 208.931 L 220.533 209.464 L 220.4 209.464 L 220.4 209.997 L 220.267 209.997 L 220.267 210.397 L 220.133 210.397 L 220.133 210.797 L 220 210.797 L 220 211.197 L 219.867 211.197 L 219.867 211.464 L 219.733 211.464 L 219.733 211.864 L 219.6 211.864 L 219.6 212.264 L 219.467 212.264 L 219.467 212.664 L 219.333 212.664 L 219.333 213.064 L 219.2 213.064 L 219.2 213.464 L 219.067 213.464 L 219.067 213.731 L 218.933 213.731 L 218.933 214.131 L 218.8 214.131 L 218.8 214.531 L 218.667 214.531 L 218.667 214.797 L 218.533 214.797 L 218.533 215.064 L 218.4 215.064 L 218.4 215.464 L 218.267 215.464 L 218.267 215.731 L 218.133 215.731 L 218.133 215.997 L 218 215.997 L 218 216.264 L 217.867 216.264 L 217.867 216.664 L 217.733 216.664 L 217.733 216.931 L 217.6 216.931 L 217.6 217.197 L 217.467 217.197 L 217.467 217.464 L 217.333 217.464 L 217.333 217.864 L 217.2 217.864 L 217.2 218.131 L 217.067 218.131 L 217.067 218.397 L 216.933 218.397 L 216.933 218.664 L 216.8 218.664 L 216.8 218.931 L 216.667 218.931 L 216.667 219.197 L 216.533 219.197 L 216.533 219.331 L 216.4 219.331 L 216.4 219.597 L 216.267 219.597 L 216.267 219.864 L 216.133 219.864 L 216.133 220.131 L 216 220.131 L 216 220.397 L 215.867 220.397 L 215.867 220.664 L 215.733 220.664 L 215.733 220.797 L 215.6 220.797 L 215.6 221.064 L 215.467 221.064 L 215.467 221.331 L 215.333 221.331 L 215.333 221.597 L 215.2 221.597 L 215.2 221.864 L 215.067 221.864 L 215.067 222.131 L 214.933 222.131 L 214.933 222.264 L 214.8 222.264 L 214.8 222.531 L 214.667 222.531 L 214.667 222.664 L 214.533 222.664 L 214.533 222.931 L 214.4 222.931 L 214.4 223.197 L 214.267 223.197 L 214.267 223.331 L 214.133 223.331 L 214.133 223.597 L 214 223.597 L 214 223.731 L 213.867 223.731 L 213.867 223.997 L 213.733 223.997 L 213.733 224.131 L 213.6 224.131 L 213.6 224.397 L 213.467 224.397 L 213.467 224.531 L 213.333 224.531 L 213.333 224.797 L 213.2 224.797 L 213.2 224.931 L 213.067 224.931 L 213.067 225.197 L 212.933 225.197 L 212.933 225.331 L 212.8 225.331 L 212.8 225.597 L 212.667 225.597 L 212.667 225.731 L 212.533 225.731 L 212.533 225.997 L 212.4 225.997 L 212.4 226.131 L 212.267 226.131 L 212.267 226.264 L 212.133 226.264 L 212.133 226.531 L 212 226.531 L 212 226.664 L 211.867 226.664 L 211.867 226.797 L 211.733 226.797 L 211.733 226.931 L 211.6 226.931 L 211.6 227.197 L 211.467 227.197 L 211.467 227.331 L 211.333 227.331 L 211.333 227.464 L 211.2 227.464 L 211.2 227.597 L 211.067 227.597 L 211.067 227.864 L 210.933 227.864 L 210.933 227.997 L 210.8 227.997 L 210.8 228.131 L 210.667 228.131 L 210.667 228.397 L 210.533 228.397 L 210.533 228.531 L 210.4 228.531 L 210.4 228.664 L 210.267 228.664 L 210.267 228.797 L 210.133 228.797 L 210.133 229.064 L 210 229.064 L 210 229.197 L 209.867 229.197 L 209.867 229.331 L 209.733 229.331 L 209.733 229.464 L 209.6 229.464 L 209.6 229.597 L 209.467 229.597 L 209.467 229.731 L 209.333 229.731 L 209.333 229.864 L 209.2 229.864 L 209.2 229.997 L 209.067 229.997 L 209.067 230.264 L 208.933 230.264 L 208.933 230.397 L 208.8 230.397 L 208.8 230.531 L 208.667 230.531 L 208.667 230.664 L 208.533 230.664 L 208.533 230.797 L 208.4 230.797 L 208.4 230.931 L 208.267 230.931 L 208.267 231.064 L 208.133 231.064 L 208.133 231.197 L 208 231.197 L 208 231.331 L 207.867 231.331 L 207.867 231.464 L 207.733 231.464 L 207.733 231.597 L 207.6 231.597 L 207.6 231.731 L 207.467 231.731 L 207.467 231.864 L 207.333 231.864 L 207.333 231.997 L 207.2 231.997 L 207.2 232.131 L 207.067 232.131 L 207.067 232.264 L 206.933 232.264 L 206.933 232.397 L 206.8 232.397 L 206.8 232.531 L 206.667 232.531 L 206.667 232.664 L 206.533 232.664 L 206.533 232.797 L 206.4 232.797 L 206.4 232.931 L 206.267 232.931 L 206.267 233.064 L 206.133 233.064 L 206.133 233.197 L 206 233.197 L 206 233.331 L 205.733 233.331 L 205.733 233.464 L 205.6 233.464 L 205.6 233.597 L 205.467 233.597 L 205.467 233.731 L 205.333 233.731 L 205.333 233.864 L 205.2 233.864 L 205.2 233.997 L 205.067 233.997 L 205.067 234.131 L 204.933 234.131 L 204.933 234.264 L 204.8 234.264 L 204.8 234.397 L 204.533 234.397 L 204.533 234.531 L 204.4 234.531 L 204.4 234.664 L 204.267 234.664 L 204.267 234.797 L 204.133 234.797 L 204.133 234.931 L 204 234.931 L 204 235.064 L 203.867 235.064 L 203.867 235.197 L 203.6 235.197 L 203.6 235.331 L 203.467 235.331 L 203.467 235.464 L 203.333 235.464 L 203.333 235.597 L 203.2 235.597 L 203.2 235.731 L 202.933 235.731 L 202.933 235.864 L 202.8 235.864 L 202.8 235.997 L 202.667 235.997 L 202.667 236.131 L 202.4 236.131 L 202.4 236.264 L 202.267 236.264 L 202.267 236.397 L 202.133 236.397 L 202.133 236.531 L 202 236.531 L 202 236.664 L 201.733 236.664 L 201.733 236.797 L 201.6 236.797 L 201.6 236.931 L 201.467 236.931 L 201.467 237.064 L 201.333 237.064 L 201.333 237.197 L 201.067 237.197 L 201.067 237.331 L 200.933 237.331 L 200.933 237.464 L 200.8 237.464 L 200.8 237.597 L 200.533 237.597 L 200.533 237.731 L 200.4 237.731 L 200.4 237.864 L 200.267 237.864 L 200.267 237.997 L 200 237.997 L 200 238.131 L 199.867 238.131 L 199.867 238.264 L 199.6 238.264 L 199.6 238.397 L 199.467 238.397 L 199.467 238.531 L 199.2 238.531 L 199.2 238.664 L 199.067 238.664 L 199.067 238.797 L 198.8 238.797 L 198.8 238.931 L 198.667 238.931 L 198.667 239.064 L 198.4 239.064 L 198.4 239.197 L 198.267 239.197 L 198.267 239.331 L 198 239.331 L 198 239.464 L 197.867 239.464 L 197.867 239.597 L 197.733 239.597 L 197.733 239.731 L 197.467 239.731 L 197.467 239.864 L 197.333 239.864 L 197.333 239.997 L 197.067 239.997 L 197.067 240.131 L 196.933 240.131 L 196.933 240.264 L 196.667 240.264 L 196.667 240.397 L 196.4 240.397 L 196.4 240.531 L 196.267 240.531 L 196.267 240.664 L 196 240.664 L 196 240.797 L 195.733 240.797 L 195.733 240.931 L 195.6 240.931 L 195.6 241.064 L 195.333 241.064 L 195.333 241.197 L 195.067 241.197 L 195.067 241.331 L 194.933 241.331 L 194.933 241.464 L 194.667 241.464 L 194.667 241.597 L 194.4 241.597 L 194.4 241.731 L 194.267 241.731 L 194.267 241.864 L 194 241.864 L 194 241.997 L 193.733 241.997 L 193.733 242.131 L 193.6 242.131 L 193.6 242.264 L 193.333 242.264 L 193.333 242.397 L 193.067 242.397 L 193.067 242.531 L 192.8 242.531 L 192.8 242.664 L 192.533 242.664 L 192.533 242.797 L 192.267 242.797 L 192.267 242.931 L 192.133 242.931 L 192.133 243.064 L 191.867 243.064 L 191.867 243.197 L 191.6 243.197 L 191.6 243.331 L 191.333 243.331 L 191.333 243.464 L 191.067 243.464 L 191.067 243.597 L 190.8 243.597 L 190.8 243.731 L 190.533 243.731 L 190.533 243.864 L 190.267 243.864 L 190.267 243.997 L 190 243.997 L 190 244.131 L 189.733 244.131 L 189.733 244.264 L 189.467 244.264 L 189.467 244.397 L 189.067 244.397 L 189.067 244.531 L 188.8 244.531 L 188.8 244.664 L 188.533 244.664 L 188.533 244.797 L 188.267 244.797 L 188.267 244.931 L 188 244.931 L 188 245.064 L 187.733 245.064 L 187.733 245.197 L 187.333 245.197 L 187.333 245.331 L 187.067 245.331 L 187.067 245.464 L 186.8 245.464 L 186.8 245.597 L 186.533 245.597 L 186.533 245.731 L 186.267 245.731 L 186.267 245.864 L 185.867 245.864 L 185.867 245.997 L 185.6 245.997 L 185.6 246.131 L 185.2 246.131 L 185.2 246.264 L 184.933 246.264 L 184.933 246.397 L 184.533 246.397 L 184.533 246.531 L 184.267 246.531 L 184.267 246.664 L 183.867 246.664 L 183.867 246.797 L 183.6 246.797 L 183.6 246.931 L 183.2 246.931 L 183.2 247.064 L 182.933 247.064 L 182.933 247.197 L 182.533 247.197 L 182.533 247.331 L 182.133 247.331 L 182.133 247.464 L 181.733 247.464 L 181.733 247.597 L 181.467 247.597 L 181.467 247.731 L 181.067 247.731 L 181.067 247.864 L 180.667 247.864 L 180.667 247.997 L 180.267 247.997 L 180.267 248.131 L 179.867 248.131 L 179.867 248.264 L 179.6 248.264 L 179.6 248.397 L 179.2 248.397 L 179.2 248.531 L 178.667 248.531 L 178.667 248.664 L 178.267 248.664 L 178.267 248.797 L 177.867 248.797 L 177.867 248.931 L 177.467 248.931 L 177.467 249.064 L 176.933 249.064 L 176.933 249.197 L 176.533 249.197 L 176.533 249.331 L 176.133 249.331 L 176.133 249.464 L 175.733 249.464 L 175.733 249.597 L 175.2 249.597 L 175.2 249.731 L 174.667 249.731 L 174.667 249.864 L 174.133 249.864 L 174.133 249.997 L 173.6 249.997 L 173.6 250.131 L 173.2 250.131 L 173.2 250.264 L 172.667 250.264 L 172.667 250.397 L 172.133 250.397 L 172.133 250.531 L 171.6 250.531 L 171.6 250.664 L 171.067 250.664 L 171.067 250.797 L 170.4 250.797 L 170.4 250.931 L 169.733 250.931 L 169.733 251.064 L 169.2 251.064 L 169.2 251.197 L 168.533 251.197 L 168.533 251.331 L 168 251.331 L 168 251.464 L 167.333 251.464 L 167.333 251.597 L 166.533 251.597 L 166.533 251.731 L 165.733 251.731 L 165.733 251.864 L 165.067 251.864 L 165.067 251.997 L 164.267 251.997 L 164.267 252.131 L 163.467 252.131 L 163.467 252.264 L 162.533 252.264 L 162.533 252.397 L 161.467 252.397 L 161.467 252.531 L 160.533 252.531 L 160.533 252.664 L 159.6 252.664 L 159.6 252.797 L 158.267 252.797 L 158.267 252.931 L 156.8 252.931 L 156.8 253.064 L 155.467 253.064 L 155.467 253.197 L 153.333 253.197 L 153.333 253.331 L 150.933 253.331 L 150.933 253.464 L 142.133 253.464 L 142.133 253.331 L 139.733 253.331 L 139.733 253.197 L 137.467 253.197 L 137.467 253.064 L 136.133 253.064 L 136.133 252.931 L 134.667 252.931 L 134.667 252.797 L 133.333 252.797 L 133.333 252.664 L 132.267 252.664 L 132.267 252.531 L 131.2 252.531 L 131.2 252.397 L 130.133 252.397 L 130.133 252.264 L 129.2 252.264 L 129.2 252.131 L 128.4 252.131 L 128.4 251.997 L 127.467 251.997 L 127.467 251.864 L 126.667 251.864 L 126.667 251.731 L 126 251.731 L 126 251.597 L 125.2 251.597 L 125.2 251.464 L 124.4 251.464 L 124.4 251.331 L 123.733 251.331 L 123.733 251.197 L 123.067 251.197 L 123.067 251.064 L 122.4 251.064 L 122.4 250.931 L 121.867 250.931 L 121.867 250.797 L 121.2 250.797 L 121.2 250.664 L 120.533 250.664 L 120.533 250.531 L 119.867 250.531 L 119.867 250.397 L 119.333 250.397 L 119.333 250.264 L 118.8 250.264 L 118.8 250.131 L 118.267 250.131 L 118.267 249.997 L 117.733 249.997 L 117.733 249.864 L 117.2 249.864 L 117.2 249.731 L 116.667 249.731 L 116.667 249.597 L 116.133 249.597 L 116.133 249.464 L 115.467 249.464 L 115.467 249.331 L 115.067 249.331 L 115.067 249.197 L 114.533 249.197 L 114.533 249.064 L 114.133 249.064 L 114.133 248.931 L 113.6 248.931 L 113.6 248.797 L 113.2 248.797 L 113.2 248.664 L 112.667 248.664 L 112.667 248.531 L 112.267 248.531 L 112.267 248.397 L 111.733 248.397 L 111.733 248.264 L 111.333 248.264 L 111.333 248.131 L 110.933 248.131 L 110.933 247.997 L 110.533 247.997 L 110.533 247.864 L 110.133 247.864 L 110.133 247.731 L 109.733 247.731 L 109.733 247.597 L 109.333 247.597 L 109.333 247.464 L 108.8 247.464 L 108.8 247.331 L 108.4 247.331 L 108.4 247.197 L 108 247.197 L 108 247.064 L 107.6 247.064 L 107.6 246.931 L 107.2 246.931 L 107.2 246.797 L 106.8 246.797 L 106.8 246.664 L 106.533 246.664 L 106.533 246.531 L 106.133 246.531 L 106.133 246.397 L 105.733 246.397 L 105.733 246.264 L 105.333 246.264 L 105.333 246.131 L 105.067 246.131 L 105.067 245.997 L 104.667 245.997 L 104.667 245.864 L 104.267 245.864 L 104.267 245.731 L 103.867 245.731 L 103.867 245.597 L 103.6 245.597 L 103.6 245.464 L 103.2 245.464 L 103.2 245.331 L 102.8 245.331 L 102.8 245.197 L 102.533 245.197 L 102.533 245.064 L 102.133 245.064 L 102.133 244.931 L 101.867 244.931 L 101.867 244.797 L 101.467 244.797 L 101.467 244.664 L 101.2 244.664 L 101.2 244.531 L 100.933 244.531 L 100.933 244.397 L 100.533 244.397 L 100.533 244.264 L 100.267 244.264 L 100.267 244.131 L 99.867 244.131 L 99.867 243.997 L 99.6 243.997 L 99.6 243.864 L 99.2 243.864 L 99.2 243.731 L 98.933 243.731 L 98.933 243.597 L 98.667 243.597 L 98.667 243.464 L 98.267 243.464 L 98.267 243.331 L 98 243.331 L 98 243.197 L 97.733 243.197 L 97.733 243.064 L 97.467 243.064 L 97.467 242.931 L 97.067 242.931 L 97.067 242.797 L 96.8 242.797 L 96.8 242.664 L 96.533 242.664 L 96.533 242.531 L 96.267 242.531 L 96.267 242.397 L 96 242.397 L 96 242.264 L 95.6 242.264 L 95.6 242.131 L 95.333 242.131 L 95.333 241.997 L 95.067 241.997 L 95.067 241.864 L 94.8 241.864 L 94.8 241.731 L 94.533 241.731 L 94.533 241.597 L 94.133 241.597 L 94.133 241.464 L 93.867 241.464 L 93.867 241.331 L 93.6 241.331 L 93.6 241.197 L 93.333 241.197 L 93.333 241.064 L 93.067 241.064 L 93.067 240.931 L 92.8 240.931 L 92.8 240.797 L 92.533 240.797 L 92.533 240.664 L 92.267 240.664 L 92.267 240.531 L 92 240.531 L 92 240.397 L 91.733 240.397 L 91.733 240.264 L 91.467 240.264 L 91.467 240.131 L 91.2 240.131 L 91.2 239.997 L 90.933 239.997 L 90.933 239.864 L 90.667 239.864 L 90.667 239.731 L 90.533 239.731 L 90.533 239.597 L 90.267 239.597 L 90.267 239.464 L 90 239.464 L 90 239.331 L 89.733 239.331 L 89.733 239.197 L 89.467 239.197 L 89.467 239.064 L 89.2 239.064 L 89.2 238.931 L 88.933 238.931 L 88.933 238.797 L 88.667 238.797 L 88.667 238.664 L 88.533 238.664 L 88.533 238.531 L 88.267 238.531 L 88.267 238.397 L 88 238.397 L 88 238.264 L 87.733 238.264 L 87.733 238.131 L 87.467 238.131 L 87.467 237.997 L 87.333 237.997 L 87.333 237.864 L 87.067 237.864 L 87.067 237.731 L 86.8 237.731 L 86.8 237.597 L 86.533 237.597 L 86.533 237.464 L 86.267 237.464 L 86.267 237.331 L 86 237.331 L 86 237.197 L 85.867 237.197 L 85.867 237.064 L 85.6 237.064 L 85.6 236.931 L 85.333 236.931 L 85.333 236.797 L 85.2 236.797 L 85.2 236.664 L 84.933 236.664 L 84.933 236.531 L 84.667 236.531 L 84.667 236.397 L 84.533 236.397 L 84.533 236.264 L 84.267 236.264 L 84.267 236.131 L 84 236.131 L 84 235.997 L 83.867 235.997 L 83.867 235.864 L 83.6 235.864 L 83.6 235.731 L 83.333 235.731 L 83.333 235.597 L 83.2 235.597 L 83.2 235.464 L 82.933 235.464 L 82.933 235.331 L 82.667 235.331 L 82.667 235.197 L 82.533 235.197 L 82.533 235.064 L 82.267 235.064 L 82.267 234.931 L 82 234.931 L 82 234.797 L 81.867 234.797 L 81.867 234.664 L 81.6 234.664 L 81.6 234.531 L 81.333 234.531 L 81.333 234.397 L 81.2 234.397 L 81.2 234.264 L 80.933 234.264 L 80.933 234.131 L 80.8 234.131 L 80.8 233.997 L 80.533 233.997 L 80.533 233.864 L 80.4 233.864 L 80.4 233.731 L 80.133 233.731 L 80.133 233.597 L 80 233.597 L 80 233.464 L 79.733 233.464 L 79.733 233.331 L 79.6 233.331 L 79.6 233.197 L 79.333 233.197 L 79.333 233.064 L 79.2 233.064 L 79.2 232.931 L 78.933 232.931 L 78.933 232.797 L 78.8 232.797 L 78.8 232.664 L 78.533 232.664 L 78.533 232.531 L 78.4 232.531 L 78.4 232.397 L 78.133 232.397 L 78.133 232.264 L 77.867 232.264 L 77.867 232.131 L 77.733 232.131 L 77.733 231.997 L 77.467 231.997 L 77.467 231.864 L 77.333 231.864 L 77.333 231.731 L 77.067 231.731 L 77.067 231.597 L 76.933 231.597 L 76.933 231.464 L 76.8 231.464 L 76.8 231.331 L 76.533 231.331 L 76.533 231.197 L 76.4 231.197 L 76.4 231.064 L 76.133 231.064 L 76.133 230.931 L 76 230.931 L 76 230.797 L 75.867 230.797 L 75.867 230.664 L 75.6 230.664 L 75.6 230.531 L 75.467 230.531 L 75.467 230.397 L 75.2 230.397 L 75.2 230.264 L 75.067 230.264 L 75.067 230.131 L 74.933 230.131 L 74.933 229.997 L 74.667 229.997 L 74.667 229.864 L 74.533 229.864 L 74.533 229.731 L 74.267 229.731 L 74.267 229.597 L 74.133 229.597 L 74.133 229.464 L 74 229.464 L 74 229.331 L 73.733 229.331 L 73.733 229.197 L 73.6 229.197 L 73.6 229.064 L 73.333 229.064 L 73.333 228.931 L 73.2 228.931 L 73.2 228.797 L 73.067 228.797 L 73.067 228.664 L 72.8 228.664 L 72.8 228.531 L 72.667 228.531 L 72.667 228.397 L 72.533 228.397 L 72.533 228.264 L 72.4 228.264 L 72.4 228.131 L 72.133 228.131 L 72.133 227.997 L 72 227.997 L 72 227.864 L 71.867 227.864 L 71.867 227.731 L 71.6 227.731 L 71.6 227.597 L 71.467 227.597 L 71.467 227.464 L 71.333 227.464 L 71.333 227.331 L 71.2 227.331 L 71.2 227.197 L 70.933 227.197 L 70.933 227.064 L 70.8 227.064 L 70.8 226.931 L 70.667 226.931 L 70.667 226.797 L 70.4 226.797 L 70.4 226.664 L 70.267 226.664 L 70.267 226.531 L 70.133 226.531 L 70.133 226.397 L 70 226.397 L 70 226.264 L 69.733 226.264 L 69.733 226.131 L 69.6 226.131 L 69.6 225.997 L 69.467 225.997 L 69.467 225.864 L 69.2 225.864 L 69.2 225.731 L 69.067 225.731 L 69.067 225.597 L 68.933 225.597 L 68.933 225.464 L 68.8 225.464 L 68.8 225.331 L 68.667 225.331 L 68.667 225.197 L 68.4 225.197 L 68.4 225.064 L 68.267 225.064 L 68.267 224.931 L 68.133 224.931 L 68.133 224.797 L 68 224.797 L 68 224.664 L 67.867 224.664 L 67.867 224.531 L 67.6 224.531 L 67.6 224.397 L 67.467 224.397 L 67.467 224.264 L 67.333 224.264 L 67.333 224.131 L 67.2 224.131 L 67.2 223.997 L 67.067 223.997 L 67.067 223.864 L 66.8 223.864 L 66.8 223.731 L 66.667 223.731 L 66.667 223.597 L 66.533 223.597 L 66.533 223.464 L 66.4 223.464 L 66.4 223.331 L 66.267 223.331 L 66.267 223.197 L 66 223.197 L 66 223.064 L 65.867 223.064 L 65.867 222.931 L 65.733 222.931 L 65.733 222.797 L 65.6 222.797 L 65.6 222.664 L 65.467 222.664 L 65.467 222.531 L 65.2 222.531 L 65.2 222.397 L 65.067 222.397 L 65.067 222.264 L 64.933 222.264 L 64.933 222.131 L 64.8 222.131 L 64.8 221.997 L 64.667 221.997 L 64.667 221.864 L 64.533 221.864 L 64.533 221.731 L 64.4 221.731 L 64.4 221.597 L 64.267 221.597 L 64.267 221.464 L 64.133 221.464 L 64.133 221.331 L 63.867 221.331 L 63.867 221.197 L 63.733 221.197 L 63.733 221.064 L 63.6 221.064 L 63.6 220.931 L 63.467 220.931 L 63.467 220.797 L 63.333 220.797 L 63.333 220.664 L 63.2 220.664 L 63.2 220.531 L 63.067 220.531 L 63.067 220.397 L 62.933 220.397 L 62.933 220.264 L 62.667 220.264 L 62.667 220.131 L 62.533 220.131 L 62.533 219.997 L 62.4 219.997 L 62.4 219.864 L 62.267 219.864 L 62.267 219.731 L 62.133 219.731 L 62.133 219.597 L 62 219.597 L 62 219.464 L 61.867 219.464 L 61.867 219.331 L 61.733 219.331 L 61.733 219.197 L 61.6 219.197 L 61.6 219.064 L 61.467 219.064 L 61.467 218.931 L 61.333 218.931 L 61.333 218.797 L 61.2 218.797 L 61.2 218.264 L 61.067 218.264 L 61.067 217.731 L 60.933 217.731 L 60.933 217.197 L 60.8 217.197 L 60.8 216.531 L 60.667 216.531 L 60.667 215.997 L 60.533 215.997 L 60.533 215.331 L 60.4 215.331 L 60.4 214.797 L 60.267 214.797 L 60.267 213.997 L 60.133 213.997 L 60.133 213.197 L 60 213.197 L 60 212.397 L 59.867 212.397 L 59.867 211.597 L 59.733 211.597 L 59.733 210.797 L 59.6 210.797 L 59.6 209.464 L 59.467 209.464 L 59.467 208.131 L 59.333 208.131 L 59.333 206.797 L 59.2 206.797 L 59.2 198.931 L 59.333 198.931 L 59.333 196.797 L 59.467 196.797 L 59.467 195.731 L 59.6 195.731 L 59.6 194.664 L 59.733 194.664 L 59.733 193.731 L 59.867 193.731 L 59.867 192.664 L 60 192.664 L 60 191.597 L 60.133 191.597 L 60.133 190.931 L 60.267 190.931 L 60.267 190.264 L 60.4 190.264 L 60.4 189.597 L 60.533 189.597 L 60.533 188.931 L 60.667 188.931 L 60.667 188.397 L 60.8 188.397 L 60.8 187.731 L 60.933 187.731 L 60.933 187.064 L 61.067 187.064 L 61.067 186.531 L 61.2 186.531 L 61.2 185.864 L 61.333 185.864 L 61.333 185.331 L 61.467 185.331 L 61.467 184.797 L 61.6 184.797 L 61.6 184.397 L 61.733 184.397 L 61.733 183.864 L 61.867 183.864 L 61.867 183.331 L 62 183.331 L 62 182.931 L 62.133 182.931 L 62.133 182.397 L 62.267 182.397 L 62.267 181.997 L 62.4 181.997 L 62.4 181.464 L 62.533 181.464 L 62.533 181.064 L 62.667 181.064 L 62.667 180.664 L 62.8 180.664 L 62.8 180.264 L 62.933 180.264 L 62.933 179.864 L 63.067 179.864 L 63.067 179.731 L 63.2 179.731 L 63.2 179.997 L 63.333 179.997 L 63.333 180.131 L 63.467 180.131 L 63.467 180.264 L 63.6 180.264 L 63.6 180.531 L 63.733 180.531 L 63.733 180.664 L 63.867 180.664 L 63.867 180.931 L 64 180.931 L 64 181.064 L 64.133 181.064 L 64.133 181.331 L 64.267 181.331 L 64.267 181.464 L 64.4 181.464 L 64.4 181.597 L 64.533 181.597 L 64.533 181.864 L 64.667 181.864 L 64.667 181.997 L 64.8 181.997 L 64.8 182.131 L 64.933 182.131 L 64.933 182.397 L 65.067 182.397 L 65.067 182.531 L 65.2 182.531 L 65.2 182.797 L 65.333 182.797 L 65.333 182.931 L 65.467 182.931 L 65.467 183.064 L 65.6 183.064 L 65.6 183.331 L 65.733 183.331 L 65.733 183.464 L 65.867 183.464 L 65.867 183.597 L 66 183.597 L 66 183.864 L 66.133 183.864 L 66.133 183.997 L 66.267 183.997 L 66.267 184.264 L 66.4 184.264 L 66.4 184.397 L 66.533 184.397 L 66.533 184.531 L 66.667 184.531 L 66.667 184.664 L 66.8 184.664 L 66.8 184.931 L 66.933 184.931 L 66.933 185.064 L 67.067 185.064 L 67.067 185.197 L 67.2 185.197 L 67.2 185.331 L 67.333 185.331 L 67.333 185.597 L 67.467 185.597 L 67.467 185.731 L 67.6 185.731 L 67.6 185.864 L 67.733 185.864 L 67.733 186.131 L 67.867 186.131 L 67.867 186.264 L 68 186.264 L 68 186.397 L 68.133 186.397 L 68.133 186.531 L 68.267 186.531 L 68.267 186.797 L 68.4 186.797 L 68.4 186.931 L 68.533 186.931 L 68.533 187.064 L 68.667 187.064 L 68.667 187.331 L 68.8 187.331 L 68.8 187.464 L 68.933 187.464 L 68.933 187.597 L 69.067 187.597 L 69.067 187.731 L 69.2 187.731 L 69.2 187.997 L 69.333 187.997 L 69.333 188.131 L 69.467 188.131 L 69.467 188.264 L 69.6 188.264 L 69.6 188.397 L 69.733 188.397 L 69.733 188.664 L 69.867 188.664 L 69.867 188.797 L 70 188.797 L 70 188.931 L 70.133 188.931 L 70.133 189.064 L 70.267 189.064 L 70.267 189.197 L 70.4 189.197 L 70.4 189.331 L 70.533 189.331 L 70.533 189.597 L 70.667 189.597 L 70.667 189.731 L 70.8 189.731 L 70.8 189.864 L 70.933 189.864 L 70.933 189.997 L 71.067 189.997 L 71.067 190.131 L 71.2 190.131 L 71.2 190.264 L 71.333 190.264 L 71.333 190.531 L 71.467 190.531 L 71.467 190.664 L 71.6 190.664 L 71.6 190.797 L 71.733 190.797 L 71.733 190.931 L 71.867 190.931 L 71.867 191.064 L 72 191.064 L 72 191.197 L 72.133 191.197 L 72.133 191.464 L 72.267 191.464 L 72.267 191.597 L 72.4 191.597 L 72.4 191.731 L 72.533 191.731 L 72.533 191.864 L 72.667 191.864 L 72.667 191.997 L 72.8 191.997 L 72.8 192.131 L 72.933 192.131 L 72.933 192.264 L 73.067 192.264 L 73.067 192.531 L 73.2 192.531 L 73.2 192.664 L 73.333 192.664 L 73.333 192.797 L 73.467 192.797 L 73.467 192.931 L 73.6 192.931 L 73.6 193.064 L 73.733 193.064 L 73.733 193.197 L 73.867 193.197 L 73.867 193.331 L 74 193.331 L 74 193.464 L 74.133 193.464 L 74.133 193.597 L 74.267 193.597 L 74.267 193.731 L 74.4 193.731 L 74.4 193.864 L 74.533 193.864 L 74.533 193.997 L 74.667 193.997 L 74.667 194.131 L 74.8 194.131 L 74.8 194.397 L 74.933 194.397 L 74.933 194.531 L 75.067 194.531 L 75.067 194.664 L 75.2 194.664 L 75.2 194.797 L 75.333 194.797 L 75.333 194.931 L 75.467 194.931 L 75.467 195.064 L 75.6 195.064 L 75.6 195.197 L 75.733 195.197 L 75.733 195.331 L 75.867 195.331 L 75.867 195.464 L 76 195.464 L 76 195.597 L 76.133 195.597 L 76.133 195.731 L 76.267 195.731 L 76.267 195.864 L 76.4 195.864 L 76.4 195.997 L 76.533 195.997 L 76.533 196.131 L 76.667 196.131 L 76.667 196.264 L 76.8 196.264 L 76.8 196.397 L 76.933 196.397 L 76.933 196.531 L 77.067 196.531 L 77.067 196.664 L 77.2 196.664 L 77.2 196.797 L 77.333 196.797 L 77.333 196.931 L 77.467 196.931 L 77.467 197.064 L 77.6 197.064 L 77.6 197.197 L 77.733 197.197 L 77.733 197.331 L 77.867 197.331 L 77.867 197.464 L 78 197.464 L 78 197.597 L 78.133 197.597 L 78.133 197.731 L 78.267 197.731 L 78.267 197.864 L 78.4 197.864 L 78.4 197.997 L 78.533 197.997 L 78.533 198.131 L 78.667 198.131 L 78.667 198.264 L 78.8 198.264 L 78.8 198.397 L 78.933 198.397 L 78.933 198.531 L 79.067 198.531 L 79.067 198.664 L 79.333 198.664 L 79.333 198.797 L 79.467 198.797 L 79.467 198.931 L 79.6 198.931 L 79.6 199.064 L 79.733 199.064 L 79.733 199.197 L 79.867 199.197 L 79.867 199.331 L 80 199.331 L 80 199.464 L 80.133 199.464 L 80.133 199.597 L 80.267 199.597 L 80.267 199.731 L 80.4 199.731 L 80.4 199.864 L 80.533 199.864 L 80.533 199.997 L 80.667 199.997 L 80.667 200.131 L 80.933 200.131 L 80.933 200.264 L 81.067 200.264 L 81.067 200.397 L 81.2 200.397 L 81.2 200.531 L 81.333 200.531 L 81.333 200.664 L 81.467 200.664 L 81.467 200.797 L 81.6 200.797 L 81.6 200.931 L 81.733 200.931 L 81.733 201.064 L 81.867 201.064 L 81.867 201.197 L 82 201.197 L 82 201.331 L 82.133 201.331 L 82.133 201.464 L 82.4 201.464 L 82.4 201.597 L 82.533 201.597 L 82.533 201.731 L 82.667 201.731 L 82.667 201.864 L 82.8 201.864 L 82.8 201.997 L 82.933 201.997 L 82.933 202.131 L 83.067 202.131 L 83.067 202.264 L 83.2 202.264 L 83.2 202.397 L 83.467 202.397 L 83.467 202.531 L 83.6 202.531 L 83.6 202.664 L 83.733 202.664 L 83.733 202.797 L 83.867 202.797 L 83.867 202.931 L 84.133 202.931 L 84.133 203.064 L 84.267 203.064 L 84.267 203.197 L 84.4 203.197 L 84.4 203.331 L 84.533 203.331 L 84.533 203.464 L 84.8 203.464 L 84.8 203.597 L 84.933 203.597 L 84.933 203.731 L 85.067 203.731 L 85.067 203.864 L 85.2 203.864 L 85.2 203.997 L 85.467 203.997 L 85.467 204.131 L 85.6 204.131 L 85.6 204.264 L 85.733 204.264 L 85.733 204.397 L 85.867 204.397 L 85.867 204.531 L 86.133 204.531 L 86.133 204.664 L 86.267 204.664 L 86.267 204.797 L 86.4 204.797 L 86.4 204.931 L 86.533 204.931 L 86.533 205.064 L 86.8 205.064 L 86.8 205.197 L 86.933 205.197 L 86.933 205.331 L 87.067 205.331 L 87.067 205.464 L 87.2 205.464 L 87.2 205.597 L 87.467 205.597 L 87.467 205.731 L 87.6 205.731 L 87.6 205.864 L 87.733 205.864 L 87.733 205.997 L 87.867 205.997 L 87.867 206.131 L 88.133 206.131 L 88.133 206.264 L 88.267 206.264 L 88.267 206.397 L 88.4 206.397 L 88.4 206.531 L 88.533 206.531 L 88.533 206.664 L 88.8 206.664 L 88.8 206.797 L 88.933 206.797 L 88.933 206.931 L 89.067 206.931 L 89.067 207.064 L 89.2 207.064 L 89.2 207.197 L 89.467 207.197 L 89.467 207.331 L 89.6 207.331 L 89.6 207.464 L 89.733 207.464 L 89.733 207.597 L 90 207.597 L 90 207.731 L 90.133 207.731 L 90.133 207.864 L 90.4 207.864 L 90.4 207.997 L 90.533 207.997 L 90.533 208.131 L 90.8 208.131 L 90.8 208.264 L 90.933 208.264 L 90.933 208.397 L 91.2 208.397 L 91.2 208.531 L 91.333 208.531 L 91.333 208.664 L 91.6 208.664 L 91.6 208.797 L 91.733 208.797 L 91.733 208.931 L 92 208.931 L 92 209.064 L 92.133 209.064 L 92.133 209.197 L 92.4 209.197 L 92.4 209.331 L 92.533 209.331 L 92.533 209.464 L 92.8 209.464 L 92.8 209.597 L 92.933 209.597 L 92.933 209.731 L 93.2 209.731 L 93.2 209.864 L 93.333 209.864 L 93.333 209.997 L 93.6 209.997 L 93.6 210.131 L 93.733 210.131 L 93.733 210.264 L 94 210.264 L 94 210.397 L 94.133 210.397 L 94.133 210.531 L 94.267 210.531 L 94.267 210.664 L 94.533 210.664 L 94.533 210.797 L 94.667 210.797 L 94.667 210.931 L 94.933 210.931 L 94.933 211.064 L 95.067 211.064 L 95.067 211.197 L 95.333 211.197 L 95.333 211.331 L 95.467 211.331 L 95.467 211.464 L 95.733 211.464 L 95.733 211.597 L 95.867 211.597 L 95.867 211.731 L 96.133 211.731 L 96.133 211.864 L 96.267 211.864 L 96.267 211.997 L 96.533 211.997 L 96.533 212.131 L 96.667 212.131 L 96.667 212.264 L 96.933 212.264 L 96.933 212.397 L 97.2 212.397 L 97.2 212.531 L 97.467 212.531 L 97.467 212.664 L 97.6 212.664 L 97.6 212.797 L 97.867 212.797 L 97.867 212.931 L 98.133 212.931 L 98.133 213.064 L 98.4 213.064 L 98.4 213.197 L 98.667 213.197 L 98.667 213.331 L 98.8 213.331 L 98.8 213.464 L 99.067 213.464 L 99.067 213.597 L 99.333 213.597 L 99.333 213.731 L 99.6 213.731 L 99.6 213.864 L 99.867 213.864 L 99.867 213.997 L 100 213.997 L 100 214.131 L 100.267 214.131 L 100.267 214.264 L 100.533 214.264 L 100.533 214.397 L 100.8 214.397 L 100.8 214.531 L 100.933 214.531 L 100.933 214.664 L 101.2 214.664 L 101.2 214.797 L 101.467 214.797 L 101.467 214.931 L 101.733 214.931 L 101.733 215.064 L 102 215.064 L 102 215.197 L 102.133 215.197 L 102.133 215.331 L 102.4 215.331 L 102.4 215.464 L 102.667 215.464 L 102.667 215.597 L 102.933 215.597 L 102.933 215.731 L 103.2 215.731 L 103.2 215.864 L 103.333 215.864 L 103.333 215.997 L 103.6 215.997 L 103.6 216.131 L 103.867 216.131 L 103.867 216.264 L 104.133 216.264 L 104.133 216.397 L 104.4 216.397 L 104.4 216.531 L 104.8 216.531 L 104.8 216.664 L 105.067 216.664 L 105.067 216.797 L 105.333 216.797 L 105.333 216.931 L 105.6 216.931 L 105.6 217.064 L 105.867 217.064 L 105.867 217.197 L 106.133 217.197 L 106.133 217.331 L 106.533 217.331 L 106.533 217.464 L 106.8 217.464 L 106.8 217.597 L 107.067 217.597 L 107.067 217.731 L 107.333 217.731 L 107.333 217.864 L 107.6 217.864 L 107.6 217.997 L 108 217.997 L 108 218.131 L 108.267 218.131 L 108.267 218.264 L 108.533 218.264 L 108.533 218.397 L 108.8 218.397 L 108.8 218.531 L 109.067 218.531 L 109.067 218.664 L 109.333 218.664 L 109.333 218.797 L 109.733 218.797 L 109.733 218.931 L 110 218.931 L 110 219.064 L 110.267 219.064 L 110.267 219.197 L 110.533 219.197 L 110.533 219.331 L 110.8 219.331 L 110.8 219.464 L 111.2 219.464 L 111.2 219.597 L 111.6 219.597 L 111.6 219.731 L 111.867 219.731 L 111.867 219.864 L 112.267 219.864 L 112.267 219.997 L 112.667 219.997 L 112.667 220.131 L 112.933 220.131 L 112.933 220.264 L 113.333 220.264 L 113.333 220.397 L 113.733 220.397 L 113.733 220.531 L 114.133 220.531 L 114.133 220.664 L 114.4 220.664 L 114.4 220.797 L 114.8 220.797 L 114.8 220.931 L 115.2 220.931 L 115.2 221.064 L 115.6 221.064 L 115.6 221.197 L 115.867 221.197 L 115.867 221.331 L 116.267 221.331 L 116.267 221.464 L 116.667 221.464 L 116.667 221.597 L 117.067 221.597 L 117.067 221.731 L 117.333 221.731 L 117.333 221.864 L 117.733 221.864 L 117.733 221.997 L 118.133 221.997 L 118.133 222.131 L 118.533 222.131 L 118.533 222.264 L 119.067 222.264 L 119.067 222.397 L 119.467 222.397 L 119.467 222.531 L 120 222.531 L 120 222.664 L 120.533 222.664 L 120.533 222.797 L 120.933 222.797 L 120.933 222.931 L 121.467 222.931 L 121.467 223.064 L 121.867 223.064 L 121.867 223.197 L 122.4 223.197 L 122.4 223.331 L 122.8 223.331 L 122.8 223.464 L 123.333 223.464 L 123.333 223.597 L 123.867 223.597 L 123.867 223.731 L 124.267 223.731 L 124.267 223.864 L 124.8 223.864 L 124.8 223.997 L 125.2 223.997 L 125.2 224.131 L 125.867 224.131 L 125.867 224.264 L 126.533 224.264 L 126.533 224.397 L 127.067 224.397 L 127.067 224.531 L 127.733 224.531 L 127.733 224.664 L 128.4 224.664 L 128.4 224.797 L 129.067 224.797 L 129.067 224.931 L 129.6 224.931 L 129.6 225.064 L 130.267 225.064 L 130.267 225.197 L 131.067 225.197 L 131.067 225.331 L 131.867 225.331 L 131.867 225.464 L 132.667 225.464 L 132.667 225.597 L 133.6 225.597 L 133.6 225.731 L 134.533 225.731 L 134.533 225.864 L 135.867 225.864 L 135.867 225.997 L 137.067 225.997 L 137.067 226.131 L 138.4 226.131 L 138.4 226.264 L 140 226.264 L 140 226.397 L 143.2 226.397 L 143.2 226.531 L 149.733 226.531 L 149.733 226.397 L 152.8 226.397 L 152.8 226.264 L 154 226.264 L 154 226.131 L 155.333 226.131 L 155.333 225.997 L 156.533 225.997 L 156.533 225.864 L 157.733 225.864 L 157.733 225.731 L 158.8 225.731 L 158.8 225.597 L 159.467 225.597 L 159.467 225.464 L 160.267 225.464 L 160.267 225.331 L 160.933 225.331 L 160.933 225.197 L 161.6 225.197 L 161.6 225.064 L 162.267 225.064 L 162.267 224.931 L 163.067 224.931 L 163.067 224.797 L 163.733 224.797 L 163.733 224.664 L 164.4 224.664 L 164.4 224.531 L 164.933 224.531 L 164.933 224.397 L 165.467 224.397 L 165.467 224.264 L 165.867 224.264 L 165.867 224.131 L 166.4 224.131 L 166.4 223.997 L 166.8 223.997 L 166.8 223.864 L 167.333 223.864 L 167.333 223.731 L 167.867 223.731 L 167.867 223.597 L 168.267 223.597 L 168.267 223.464 L 168.8 223.464 L 168.8 223.331 L 169.2 223.331 L 169.2 223.197 L 169.733 223.197 L 169.733 223.064 L 170.133 223.064 L 170.133 222.931 L 170.533 222.931 L 170.533 222.797 L 170.933 222.797 L 170.933 222.664 L 171.2 222.664 L 171.2 222.531 L 171.6 222.531 L 171.6 222.397 L 172 222.397 L 172 222.264 L 172.267 222.264 L 172.267 222.131 L 172.667 222.131 L 172.667 221.997 L 173.067 221.997 L 173.067 221.864 L 173.333 221.864 L 173.333 221.731 L 173.733 221.731 L 173.733 221.597 L 174.133 221.597 L 174.133 221.464 L 174.4 221.464 L 174.4 221.331 L 174.8 221.331 L 174.8 221.197 L 175.2 221.197 L 175.2 221.064 L 175.467 221.064 L 175.467 220.931 L 175.733 220.931 L 175.733 220.797 L 176 220.797 L 176 220.664 L 176.267 220.664 L 176.267 220.531 L 176.667 220.531 L 176.667 220.397 L 176.933 220.397 L 176.933 220.264 L 177.2 220.264 L 177.2 220.131 L 177.467 220.131 L 177.467 219.997 L 177.733 219.997 L 177.733 219.864 L 178 219.864 L 178 219.731 L 178.267 219.731 L 178.267 219.597 L 178.667 219.597 L 178.667 219.464 L 178.933 219.464 L 178.933 219.331 L 179.067 219.331 L 179.067 219.197 L 179.333 219.197 L 179.333 219.064 L 179.6 219.064 L 179.6 218.931 L 179.867 218.931 L 179.867 218.797 L 180.133 218.797 L 180.133 218.664 L 180.4 218.664 L 180.4 218.531 L 180.533 218.531 L 180.533 218.397 L 180.8 218.397 L 180.8 218.264 L 181.067 218.264 L 181.067 218.131 L 181.2 218.131 L 181.2 217.997 L 181.467 217.997 L 181.467 217.864 L 181.733 217.864 L 181.733 217.731 L 181.867 217.731 L 181.867 217.597 L 182.133 217.597 L 182.133 217.464 L 182.4 217.464 L 182.4 217.331 L 182.533 217.331 L 182.533 217.197 L 182.8 217.197 L 182.8 217.064 L 183.067 217.064 L 183.067 216.931 L 183.2 216.931 L 183.2 216.797 L 183.333 216.797 L 183.333 216.664 L 183.6 216.664 L 183.6 216.531 L 183.733 216.531 L 183.733 216.397 L 184 216.397 L 184 216.264 L 184.133 216.264 L 184.133 216.131 L 184.267 216.131 L 184.267 215.997 L 184.533 215.997 L 184.533 215.864 L 184.667 215.864 L 184.667 215.731 L 184.933 215.731 L 184.933 215.597 L 185.067 215.597 L 185.067 215.464 L 185.2 215.464 L 185.2 215.331 L 185.467 215.331 L 185.467 215.197 L 185.6 215.197 L 185.6 215.064 L 185.733 215.064 L 185.733 214.931 L 186 214.931 L 186 214.797 L 186.133 214.797 L 186.133 214.664 L 186.267 214.664 L 186.267 214.531 L 186.4 214.531 L 186.4 214.397 L 186.533 214.397 L 186.533 214.264 L 186.667 214.264 L 186.667 214.131 L 186.8 214.131 L 186.8 213.997 L 187.067 213.997 L 187.067 213.864 L 187.2 213.864 L 187.2 213.731 L 187.333 213.731 L 187.333 213.597 L 187.467 213.597 L 187.467 213.464 L 187.6 213.464 L 187.6 213.331 L 187.733 213.331 L 187.733 213.197 L 187.867 213.197 L 187.867 213.064 L 188 213.064 L 188 212.931 L 188.133 212.931 L 188.133 212.797 L 188.4 212.797 L 188.4 212.664 L 188.533 212.664 L 188.533 212.397 L 188.667 212.397 L 188.667 212.264 L 188.8 212.264 L 188.8 212.131 L 188.933 212.131 L 188.933 211.997 L 189.067 211.997 L 189.067 211.864 L 189.2 211.864 L 189.2 211.731 L 189.333 211.731 L 189.333 211.464 L 189.467 211.464 L 189.467 211.331 L 189.6 211.331 L 189.6 211.197 L 189.733 211.197 L 189.733 211.064 L 189.867 211.064 L 189.867 210.931 L 190 210.931 L 190 210.797 L 190.133 210.797 L 190.133 210.664 L 190.267 210.664 L 190.267 210.397 L 190.4 210.397 L 190.4 210.264 L 190.533 210.264 L 190.533 210.131 L 190.667 210.131 L 190.667 209.864 L 190.8 209.864 L 190.8 209.731 L 190.933 209.731 L 190.933 209.464 L 191.067 209.464 L 191.067 209.331 L 191.2 209.331 L 191.2 209.064 L 191.333 209.064 L 191.333 208.931 L 191.467 208.931 L 191.467 208.664 L 191.6 208.664 L 191.6 208.531 L 191.733 208.531 L 191.733 208.264 L 191.867 208.264 L 191.867 208.131 L 192 208.131 L 192 207.864 L 192.133 207.864 L 192.133 207.597 L 192.267 207.597 L 192.267 207.464 L 192.4 207.464 L 192.4 207.197 L 192.533 207.197 L 192.533 206.931 L 192.667 206.931 L 192.667 206.664 L 192.8 206.664 L 192.8 206.264 L 192.933 206.264 L 192.933 205.997 L 193.067 205.997 L 193.067 205.731 L 193.2 205.731 L 193.2 205.464 L 193.333 205.464 L 193.333 205.197 L 193.467 205.197 L 193.467 204.931 L 193.6 204.931 L 193.6 204.664 L 193.733 204.664 L 193.733 204.264 L 193.867 204.264 L 193.867 203.864 L 194 203.864 L 194 203.464 L 194.133 203.464 L 194.133 203.064 L 194.267 203.064 L 194.267 202.531 L 194.4 202.531 L 194.4 202.131 L 194.533 202.131 L 194.533 201.731 L 194.667 201.731 L 194.667 201.331 L 194.8 201.331 L 194.8 200.797 L 194.933 200.797 L 194.933 200.131 L 195.067 200.131 L 195.067 199.597 L 195.2 199.597 L 195.2 198.931 L 195.333 198.931 L 195.333 198.264 L 195.467 198.264 L 195.467 197.331 L 195.6 197.331 L 195.6 195.997 L 195.733 195.997 L 195.733 192.264 L 195.6 192.264 L 195.6 190.264 L 195.467 190.264 L 195.467 189.731 L 195.333 189.731 L 195.333 189.064 L 195.2 189.064 L 195.2 188.397 L 195.067 188.397 L 195.067 187.864 L 194.933 187.864 L 194.933 187.197 L 194.8 187.197 L 194.8 186.664 L 194.667 186.664 L 194.667 186.264 L 194.533 186.264 L 194.533 185.997 L 194.4 185.997 L 194.4 185.597 L 194.267 185.597 L 194.267 185.197 L 194.133 185.197 L 194.133 184.797 L 194 184.797 L 194 184.531 L 193.867 184.531 L 193.867 184.131 L 193.733 184.131 L 193.733 183.731 L 193.6 183.731 L 193.6 183.464 L 193.467 183.464 L 193.467 183.197 L 193.333 183.197 L 193.333 182.931 L 193.2 182.931 L 193.2 182.664 L 193.067 182.664 L 193.067 182.397 L 192.933 182.397 L 192.933 182.131 L 192.8 182.131 L 192.8 181.864 L 192.667 181.864 L 192.667 181.597 L 192.533 181.597 L 192.533 181.331 L 192.4 181.331 L 192.4 181.064 L 192.267 181.064 L 192.267 180.797 L 192.133 180.797 L 192.133 180.531 L 192 180.531 L 192 180.397 L 191.867 180.397 L 191.867 180.131 L 191.733 180.131 L 191.733 179.997 L 191.6 179.997 L 191.6 179.731 L 191.467 179.731 L 191.467 179.597 L 191.333 179.597 L 191.333 179.331 L 191.2 179.331 L 191.2 179.064 L 191.067 179.064 L 191.067 178.931 L 190.933 178.931 L 190.933 178.664 L 190.8 178.664 L 190.8 178.531 L 190.667 178.531 L 190.667 178.264 L 190.533 178.264 L 190.533 178.131 L 190.4 178.131 L 190.4 177.864 L 190.267 177.864 L 190.267 177.731 L 190.133 177.731 L 190.133 177.464 L 190 177.464 L 190 177.331 L 189.867 177.331 L 189.867 177.197 L 189.733 177.197 L 189.733 177.064 L 189.6 177.064 L 189.6 176.797 L 189.467 176.797 L 189.467 176.664 L 189.333 176.664 L 189.333 176.531 L 189.2 176.531 L 189.2 176.397 L 189.067 176.397 L 189.067 176.264 L 188.933 176.264 L 188.933 175.997 L 188.8 175.997 L 188.8 175.864 L 188.667 175.864 L 188.667 175.731 L 188.533 175.731 L 188.533 175.597 L 188.4 175.597 L 188.4 175.331 L 188.267 175.331 L 188.267 175.197 L 188.133 175.197 L 188.133 175.064 L 188 175.064 L 188 174.931 L 187.867 174.931 L 187.867 174.797 L 187.733 174.797 L 187.733 174.531 L 187.6 174.531 L 187.6 174.397 L 187.467 174.397 L 187.467 174.264 L 187.333 174.264 L 187.333 174.131 L 187.2 174.131 L 187.2 173.997 L 187.067 173.997 L 187.067 173.864 L 186.933 173.864 L 186.933 173.731 L 186.8 173.731 L 186.8 173.597 L 186.667 173.597 L 186.667 173.464 L 186.533 173.464 L 186.533 173.331 L 186.4 173.331 L 186.4 173.197 L 186.267 173.197 L 186.267 173.064 L 186.133 173.064 L 186.133 172.931 L 186 172.931 L 186 172.797 L 185.867 172.797 L 185.867 172.664 L 185.733 172.664 L 185.733 172.531 L 185.6 172.531 L 185.6 172.397 L 185.467 172.397 L 185.467 172.264 L 185.333 172.264 L 185.333 172.131 L 185.2 172.131 L 185.2 171.997 L 185.067 171.997 L 185.067 171.864 L 184.933 171.864 L 184.933 171.731 L 184.8 171.731 L 184.8 171.597 L 184.667 171.597 L 184.667 171.464 L 184.4 171.464 L 184.4 171.331 L 184.267 171.331 L 184.267 171.197 L 184.133 171.197 L 184.133 171.064 L 184 171.064 L 184 170.931 L 183.867 170.931 L 183.867 170.797 L 183.733 170.797 L 183.733 170.664 L 183.6 170.664 L 183.6 170.531 L 183.467 170.531 L 183.467 170.397 L 183.2 170.397 L 183.2 170.264 L 183.067 170.264 L 183.067 170.131 L 182.933 170.131 L 182.933 169.997 L 182.8 169.997 L 182.8 169.864 L 182.667 169.864 L 182.667 169.731 L 182.533 169.731 L 182.533 169.597 L 182.267 169.597 L 182.267 169.464 L 182.133 169.464 L 182.133 169.331 L 182 169.331 L 182 169.197 L 181.867 169.197 L 181.867 169.064 L 181.6 169.064 L 181.6 168.931 L 181.467 168.931 L 181.467 168.797 L 181.333 168.797 L 181.333 168.664 L 181.067 168.664 L 181.067 168.531 L 180.933 168.531 L 180.933 168.397 L 180.8 168.397 L 180.8 168.264 L 180.667 168.264 L 180.667 168.131 L 180.4 168.131 L 180.4 167.997 L 180.267 167.997 L 180.267 167.864 L 180.133 167.864 L 180.133 167.731 L 179.867 167.731 L 179.867 167.597 L 179.733 167.597 L 179.733 167.464 L 179.6 167.464 L 179.6 167.331 L 179.333 167.331 L 179.333 167.197 L 179.2 167.197 L 179.2 167.064 L 178.933 167.064 L 178.933 166.931 L 178.8 166.931 L 178.8 166.797 L 178.667 166.797 L 178.667 166.664 L 178.4 166.664 L 178.4 166.531 L 178.267 166.531 L 178.267 166.397 L 178 166.397 L 178 166.264 L 177.867 166.264 L 177.867 166.131 L 177.6 166.131 L 177.6 165.997 L 177.467 165.997 L 177.467 165.864 L 177.2 165.864 L 177.2 165.731 L 177.067 165.731 L 177.067 165.597 L 176.8 165.597 L 176.8 165.464 L 176.667 165.464 L 176.667 165.331 L 176.4 165.331 L 176.4 165.197 L 176.267 165.197 L 176.267 165.064 L 176 165.064 L 176 164.931 L 175.733 164.931 L 175.733 164.797 L 175.6 164.797 L 175.6 164.664 L 175.333 164.664 L 175.333 164.531 L 175.2 164.531 L 175.2 164.397 L 174.933 164.397 L 174.933 164.264 L 174.667 164.264 L 174.667 164.131 L 174.533 164.131 L 174.533 163.997 L 174.267 163.997 L 174.267 163.864 L 174 163.864 L 174 163.731 L 173.867 163.731 L 173.867 163.597 L 173.6 163.597 L 173.6 163.464 L 173.333 163.464 L 173.333 163.331 L 173.2 163.331 L 173.2 163.197 L 172.933 163.197 L 172.933 163.064 L 172.667 163.064 L 172.667 162.931 L 172.4 162.931 L 172.4 162.797 L 172.133 162.797 L 172.133 162.664 L 172 162.664 L 172 162.531 L 171.733 162.531 L 171.733 162.397 L 171.467 162.397 L 171.467 162.264 L 171.2 162.264 L 171.2 162.131 L 170.933 162.131 L 170.933 161.997 L 170.667 161.997 L 170.667 161.864 L 170.533 161.864 L 170.533 161.731 L 170.267 161.731 L 170.267 161.597 L 170 161.597 L 170 161.464 L 169.733 161.464 L 169.733 161.331 L 169.467 161.331 L 169.467 161.197 L 169.2 161.197 L 169.2 161.064 L 168.933 161.064 L 168.933 160.931 L 168.667 160.931 L 168.667 160.797 L 168.4 160.797 L 168.4 160.664 L 168.133 160.664 L 168.133 160.531 L 167.733 160.531 L 167.733 160.397 L 167.467 160.397 L 167.467 160.264 L 167.2 160.264 L 167.2 160.131 L 166.933 160.131 L 166.933 159.997 L 166.667 159.997 L 166.667 159.864 L 166.4 159.864 L 166.4 159.731 L 166.133 159.731 L 166.133 159.597 L 165.733 159.597 L 165.733 159.464 L 165.467 159.464 L 165.467 159.331 L 165.2 159.331 L 165.2 159.197 L 164.933 159.197 L 164.933 159.064 L 164.533 159.064 L 164.533 158.931 L 164.267 158.931 L 164.267 158.797 L 164 158.797 L 164 158.664 L 163.733 158.664 L 163.733 158.531 L 163.333 158.531 L 163.333 158.397 L 163.067 158.397 L 163.067 158.264 L 162.667 158.264 L 162.667 158.131 L 162.4 158.131 L 162.4 157.997 L 162 157.997 L 162 157.864 L 161.733 157.864 L 161.733 157.731 L 161.333 157.731 L 161.333 157.597 L 161.067 157.597 L 161.067 157.464 L 160.667 157.464 L 160.667 157.331 L 160.267 157.331 L 160.267 157.197 L 160 157.197 L 160 157.064 L 159.6 157.064 L 159.6 156.931 L 159.333 156.931 L 159.333 156.797 L 159.067 156.797 L 159.067 156.664 L 158.8 156.664 L 158.8 156.531 L 158.4 156.531 L 158.4 156.397 L 158.133 156.397 L 158.133 156.264 L 157.867 156.264 L 157.867 156.131 L 157.733 156.131 L 157.733 155.997 L 157.467 155.997 L 157.467 155.864 L 157.2 155.864 L 157.2 155.731 L 157.067 155.731 L 157.067 155.597 L 156.8 155.597 L 156.8 155.464 L 156.667 155.464 L 156.667 155.331 L 156.533 155.331 L 156.533 155.197 L 156.267 155.197 L 156.267 155.064 L 156.133 155.064 L 156.133 154.931 L 156 154.931 L 156 154.797 L 155.867 154.797 L 155.867 154.531 L 155.733 154.531 L 155.733 154.397 L 155.6 154.397 L 155.6 154.264 L 155.467 154.264 L 155.467 153.864 L 155.333 153.864 L 155.333 153.597 L 155.2 153.597 L 155.2 152.397 L 155.333 152.397 L 155.333 151.864 L 155.467 151.864 L 155.467 151.597 L 155.6 151.597 L 155.6 151.331 L 155.733 151.331 L 155.733 151.064 L 155.867 151.064 L 155.867 150.797 L 156 150.797 L 156 150.531 L 156.133 150.531 L 156.133 150.397 L 156.267 150.397 L 156.267 150.131 L 156.4 150.131 L 156.4 149.997 L 156.533 149.997 L 156.533 149.731 L 156.667 149.731 L 156.667 149.597 L 156.8 149.597 L 156.8 149.464 L 156.933 149.464 L 156.933 149.197 L 157.067 149.197 L 157.067 149.064 L 157.2 149.064 L 157.2 148.931 L 157.333 148.931 L 157.333 148.797 L 157.467 148.797 L 157.467 148.531 L 157.6 148.531 L 157.6 148.397 L 157.733 148.397 L 157.733 148.264 L 157.867 148.264 L 157.867 148.131 L 158 148.131 L 158 147.997 L 158.133 147.997 L 158.133 147.731 L 158.267 147.731 L 158.267 147.597 L 158.4 147.597 L 158.4 147.464 L 158.533 147.464 L 158.533 147.331 L 158.667 147.331 L 158.667 147.197 L 158.8 147.197 L 158.8 146.931 L 158.933 146.931 L 158.933 146.797 L 159.067 146.797 L 159.067 146.664 L 159.2 146.664 L 159.2 146.531 L 159.333 146.531 L 159.333 146.397 L 159.467 146.397 L 159.467 146.131 L 159.6 146.131 L 159.6 145.997 L 159.733 145.997 L 159.733 145.864 L 159.867 145.864 L 159.867 145.731 L 160 145.731 L 160 145.464 L 160.133 145.464 L 160.133 145.331 L 160.267 145.331 L 160.267 145.197 L 160.4 145.197 L 160.4 144.931 L 160.533 144.931 L 160.533 144.797 L 160.667 144.797 L 160.667 144.664 L 160.8 144.664 L 160.8 144.397 L 160.933 144.397 L 160.933 144.264 L 161.067 144.264 L 161.067 144.131 L 161.2 144.131 L 161.2 143.864 L 161.333 143.864 L 161.333 143.731 L 161.467 143.731 L 161.467 143.597 L 161.6 143.597 L 161.6 143.331 L 161.733 143.331 L 161.733 143.197 L 161.867 143.197 L 161.867 143.064 L 162 143.064 L 162 142.797 L 162.133 142.797 L 162.133 142.664 L 162.267 142.664 L 162.267 142.397 L 162.4 142.397 L 162.4 142.264 L 162.533 142.264 L 162.533 142.131 L 162.667 142.131 L 162.667 141.864 L 162.8 141.864 L 162.8 141.731 L 162.933 141.731 L 162.933 141.464 L 163.067 141.464 L 163.067 141.331 L 163.2 141.331 L 163.2 141.197 L 163.333 141.197 L 163.333 140.931 L 163.467 140.931 L 163.467 140.797 L 163.6 140.797 L 163.6 140.531 L 163.733 140.531 L 163.733 140.397 L 163.867 140.397 L 163.867 140.131 L 164 140.131 L 164 139.997 L 164.133 139.997 L 164.133 139.731 L 164.267 139.731 L 164.267 139.597 L 164.4 139.597 L 164.4 139.331 L 164.533 139.331 L 164.533 139.064 L 164.667 139.064 L 164.667 138.931 L 164.8 138.931 L 164.8 138.664 L 164.933 138.664 L 164.933 138.531 L 165.067 138.531 L 165.067 138.264 L 165.2 138.264 L 165.2 138.131 L 165.333 138.131 L 165.333 137.864 L 165.467 137.864 L 165.467 137.597 L 165.6 137.597 L 165.6 137.464 L 165.733 137.464 L 165.733 137.197 L 165.867 137.197 L 165.867 137.064 L 166 137.064 L 166 136.797 L 166.133 136.797 L 166.133 136.531 L 166.267 136.531 L 166.267 136.397 L 166.4 136.397 L 166.4 136.131 L 166.533 136.131 L 166.533 135.864 L 166.667 135.864 L 166.667 135.731 L 166.8 135.731 L 166.8 135.464 L 166.933 135.464 L 166.933 135.197 L 167.067 135.197 L 167.067 134.931 L 167.2 134.931 L 167.2 134.664 L 167.333 134.664 L 167.333 134.531 L 167.467 134.531 L 167.467 134.264 L 167.6 134.264 L 167.6 133.997 L 167.733 133.997 L 167.733 133.731 L 167.867 133.731 L 167.867 133.464 L 168 133.464 L 168 133.331 L 168.133 133.331 L 168.133 133.064 L 168.267 133.064 L 168.267 132.797 L 168.4 132.797 L 168.4 132.531 L 168.533 132.531 L 168.533 132.264 L 168.667 132.264 L 168.667 131.997 L 168.8 131.997 L 168.8 131.731 L 168.933 131.731 L 168.933 131.464 L 169.067 131.464 L 169.067 131.197 L 169.2 131.197 L 169.2 130.931 L 169.333 130.931 L 169.333 130.664 L 169.467 130.664 L 169.467 130.397 L 169.6 130.397 L 169.6 130.131 L 169.733 130.131 L 169.733 129.864 L 169.867 129.864 L 169.867 129.464 L 170 129.464 L 170 129.197 L 170.133 129.197 L 170.133 128.797 L 170.267 128.797 L 170.267 128.531 L 170.4 128.531 L 170.4 128.264 L 170.533 128.264 L 170.533 127.864 L 170.667 127.864 L 170.667 127.597 L 170.8 127.597 L 170.8 127.331 L 170.933 127.331 L 170.933 126.931 L 171.067 126.931 L 171.067 126.664 L 171.2 126.664 L 171.2 126.264 L 171.333 126.264 L 171.333 125.864 L 171.467 125.864 L 171.467 125.464 L 171.6 125.464 L 171.6 125.064 L 171.733 125.064 L 171.733 124.664 L 171.867 124.664 L 171.867 124.264 L 172 124.264 L 172 123.997 L 172.133 123.997 L 172.133 123.464 L 172.267 123.464 L 172.267 122.931 L 172.4 122.931 L 172.4 122.397 L 172.533 122.397 L 172.533 121.997 L 172.667 121.997 L 172.667 121.464 L 172.8 121.464 L 172.8 120.931 L 172.933 120.931 L 172.933 120.131 L 173.067 120.131 L 173.067 119.331 L 173.2 119.331 L 173.2 118.531 L 173.333 118.531 L 173.333 117.464 L 173.467 117.464 L 173.467 113.597 L 173.333 113.597 L 173.333 112.264 L 173.2 112.264 L 173.2 111.731 L 173.067 111.731 L 173.067 111.197 L 172.933 111.197 L 172.933 110.664 L 172.8 110.664 L 172.8 110.131 L 172.667 110.131 L 172.667 109.597 L 172.533 109.597 L 172.533 109.331 L 172.4 109.331 L 172.4 109.064 L 172.267 109.064 L 172.267 108.664 L 172.133 108.664 L 172.133 108.397 L 172 108.397 L 172 108.131 L 171.867 108.131 L 171.867 107.864 L 171.733 107.864 L 171.733 107.597 L 171.6 107.597 L 171.6 107.197 L 171.467 107.197 L 171.467 107.064 L 171.333 107.064 L 171.333 106.797 L 171.2 106.797 L 171.2 106.664 L 171.067 106.664 L 171.067 106.397 L 170.933 106.397 L 170.933 106.264 L 170.8 106.264 L 170.8 105.997 L 170.667 105.997 L 170.667 105.864 L 170.533 105.864 L 170.533 105.597 L 170.4 105.597 L 170.4 105.464 L 170.267 105.464 L 170.267 105.197 L 170.133 105.197 L 170.133 105.064 L 170 105.064 L 170 104.931 L 169.867 104.931 L 169.867 104.797 L 169.733 104.797 L 169.733 104.664 L 169.6 104.664 L 169.6 104.531 L 169.467 104.531 L 169.467 104.264 L 169.333 104.264 L 169.333 104.131 L 169.2 104.131 L 169.2 103.997 L 169.067 103.997 L 169.067 103.864 L 168.933 103.864 L 168.933 103.731 L 168.667 103.731 L 168.667 103.597 L 168.533 103.597 L 168.533 103.464 L 168.4 103.464 L 168.4 103.331 L 168.267 103.331 L 168.267 103.197 L 168.133 103.197 L 168.133 103.064 L 168 103.064 L 168 102.931 L 167.867 102.931 L 167.867 102.797 L 167.733 102.797 L 167.733 102.664 L 167.6 102.664 L 167.6 102.531 L 167.333 102.531 L 167.333 102.397 L 167.2 102.397 L 167.2 102.264 L 166.933 102.264 L 166.933 102.131 L 166.8 102.131 L 166.8 101.997 L 166.667 101.997 L 166.667 101.864 L 166.4 101.864 L 166.4 101.731 L 166.267 101.731 L 166.267 101.597 L 166 101.597 L 166 101.464 L 165.867 101.464 L 165.867 101.331 L 165.6 101.331 L 165.6 101.197 L 165.467 101.197 L 165.467 101.064 L 165.2 101.064 L 165.2 100.931 L 165.067 100.931 L 165.067 100.797 L 164.933 100.797 L 164.933 100.664 L 164.667 100.664 L 164.667 100.531 L 164.267 100.531 L 164.267 100.397 L 164 100.397 L 164 100.264 L 163.733 100.264 L 163.733 100.131 L 163.467 100.131 L 163.467 99.997 L 163.2 99.997 L 163.2 99.864 L 162.933 99.864 L 162.933 99.731 L 162.667 99.731 L 162.667 99.597 L 162.4 99.597 L 162.4 99.464 L 162.133 99.464 L 162.133 99.331 L 161.867 99.331 L 161.867 99.197 L 161.467 99.197 L 161.467 99.064 L 161.2 99.064 L 161.2 98.931 L 160.8 98.931 L 160.8 98.797 L 160.4 98.797 L 160.4 98.664 L 160 98.664 L 160 98.531 L 159.6 98.531 L 159.6 98.397 L 159.2 98.397 L 159.2 98.264 L 158.667 98.264 L 158.667 98.131 L 158.133 98.131 L 158.133 97.997 L 157.6 97.997 L 157.6 97.864 L 156.933 97.864 L 156.933 97.731 L 156.267 97.731 L 156.267 97.597 L 155.6 97.597 L 155.6 97.464 L 154.667 97.464 L 154.667 97.331 L 153.733 97.331 L 153.733 97.197 L 152.4 97.197 L 152.4 97.064 L 150.533 97.064 L 150.533 96.931 L 146.133 96.931 L 146.133 97.064 L 143.867 97.064 L 143.867 97.197 L 142.533 97.197 L 142.533 97.331 L 141.2 97.331 L 141.2 97.464 L 140.267 97.464 L 140.267 97.597 L 139.333 97.597 L 139.333 97.731 L 138.533 97.731 L 138.533 97.864 L 137.733 97.864 L 137.733 97.997 L 137.067 97.997 L 137.067 98.131 L 136.4 98.131 L 136.4 98.264 L 135.733 98.264 L 135.733 98.397 L 135.067 98.397 L 135.067 98.531 L 134.4 98.531 L 134.4 98.664 L 133.867 98.664 L 133.867 98.797 L 133.333 98.797 L 133.333 98.931 L 132.8 98.931 L 132.8 99.064 L 132.267 99.064 L 132.267 99.197 L 131.6 99.197 L 131.6 99.331 L 131.067 99.331 L 131.067 99.464 L 130.667 99.464 L 130.667 99.597 L 130.267 99.597 L 130.267 99.731 L 129.733 99.731 L 129.733 99.864 L 129.333 99.864 L 129.333 99.997 L 128.8 99.997 L 128.8 100.131 L 128.4 100.131 L 128.4 100.264 L 127.867 100.264 L 127.867 100.397 L 127.467 100.397 L 127.467 100.531 L 127.067 100.531 L 127.067 100.664 L 126.667 100.664 L 126.667 100.797 L 126.267 100.797 L 126.267 100.931 L 125.867 100.931 L 125.867 101.064 L 125.467 101.064 L 125.467 101.197 L 125.067 101.197 L 125.067 101.331 L 124.667 101.331 L 124.667 101.464 L 124.267 101.464 L 124.267 101.597 L 124 101.597 L 124 101.731 L 123.6 101.731 L 123.6 101.864 L 123.2 101.864 L 123.2 101.997 L 122.933 101.997 L 122.933 102.131 L 122.533 102.131 L 122.533 102.264 L 122.133 102.264 L 122.133 102.397 L 121.867 102.397 L 121.867 102.531 L 121.467 102.531 L 121.467 102.664 L 121.2 102.664 L 121.2 102.797 L 120.8 102.797 L 120.8 102.931 L 120.4 102.931 L 120.4 103.064 L 120.133 103.064 L 120.133 103.197 L 119.867 103.197 L 119.867 103.331 L 119.467 103.331 L 119.467 103.464 L 119.2 103.464 L 119.2 103.597 L 118.933 103.597 L 118.933 103.731 L 118.533 103.731 L 118.533 103.864 L 118.267 103.864 L 118.267 103.997 L 118 103.997 L 118 104.131 L 117.6 104.131 L 117.6 104.264 L 117.333 104.264 L 117.333 104.397 L 117.067 104.397 L 117.067 104.531 L 116.667 104.531 L 116.667 104.664 L 116.4 104.664 L 116.4 104.797 L 116.133 104.797 L 116.133 104.931 L 115.867 104.931 L 115.867 105.064 L 115.6 105.064 L 115.6 105.197 L 115.333 105.197 L 115.333 105.331 L 115.067 105.331 L 115.067 105.464 L 114.8 105.464 L 114.8 105.597 L 114.4 105.597 L 114.4 105.731 L 114.133 105.731 L 114.133 105.864 L 113.867 105.864 L 113.867 105.997 L 113.6 105.997 L 113.6 106.131 L 113.333 106.131 L 113.333 106.264 L 113.067 106.264 L 113.067 106.397 L 112.8 106.397 L 112.8 106.531 L 112.533 106.531 L 112.533 106.664 L 112.267 106.664 L 112.267 106.797 L 112 106.797 L 112 106.931 L 111.733 106.931 L 111.733 107.064 L 111.467 107.064 L 111.467 107.197 L 111.2 107.197 L 111.2 107.331 L 111.067 107.331 L 111.067 107.464 L 110.8 107.464 L 110.8 107.597 L 110.533 107.597 L 110.533 107.731 L 110.267 107.731 L 110.267 107.864 L 110 107.864 L 110 107.997 L 109.733 107.997 L 109.733 108.131 L 109.467 108.131 L 109.467 108.264 L 109.2 108.264 L 109.2 108.397 L 108.933 108.397 L 108.933 108.531 L 108.8 108.531 L 108.8 108.664 L 108.533 108.664 L 108.533 108.797 L 108.267 108.797 L 108.267 108.931 L 108 108.931 L 108 109.064 L 107.733 109.064 L 107.733 109.197 L 107.6 109.197 L 107.6 109.331 L 107.333 109.331 L 107.333 109.464 L 107.067 109.464 L 107.067 109.597 L 106.8 109.597 L 106.8 109.731 L 106.533 109.731 L 106.533 109.864 L 106.4 109.864 L 106.4 109.997 L 106.133 109.997 L 106.133 110.131 L 105.867 110.131 L 105.867 110.264 L 105.733 110.264 L 105.733 110.397 L 105.467 110.397 L 105.467 110.531 L 105.2 110.531 L 105.2 110.664 L 105.067 110.664 L 105.067 110.797 L 104.8 110.797 L 104.8 110.931 L 104.533 110.931 L 104.533 111.064 L 104.4 111.064 L 104.4 111.197 L 104.133 111.197 L 104.133 111.331 L 103.867 111.331 L 103.867 111.464 L 103.733 111.464 L 103.733 111.597 L 103.467 111.597 L 103.467 111.731 L 103.333 111.731 L 103.333 111.864 L 103.067 111.864 L 103.067 111.997 L 102.933 111.997 L 102.933 112.131 L 102.667 112.131 L 102.667 112.264 L 102.533 112.264 L 102.533 112.397 L 102.267 112.397 L 102.267 112.531 L 102.133 112.531 L 102.133 112.664 L 101.867 112.664 L 101.867 112.797 L 101.733 112.797 L 101.733 112.931 L 101.467 112.931 L 101.467 113.064 L 101.333 113.064 L 101.333 113.197 L 101.067 113.197 L 101.067 113.331 L 100.933 113.331 L 100.933 113.464 L 100.667 113.464 L 100.667 113.597 L 100.533 113.597 L 100.533 113.731 L 100.267 113.731 L 100.267 113.864 L 100.133 113.864 L 100.133 113.997 L 99.867 113.997 L 99.867 114.131 L 99.733 114.131 L 99.733 114.264 L 99.467 114.264 L 99.467 114.397 L 99.2 114.397 L 99.2 114.531 L 99.067 114.531 L 99.067 114.664 L 98.933 114.664 L 98.933 114.797 L 98.667 114.797 L 98.667 114.931 L 98.533 114.931 L 98.533 115.064 L 98.4 115.064 L 98.4 115.197 L 98.133 115.197 L 98.133 115.331 L 98 115.331 L 98 115.464 L 97.867 115.464 L 97.867 115.597 L 97.6 115.597 L 97.6 115.731 L 97.467 115.731 L 97.467 115.864 L 97.333 115.864 L 97.333 115.997 L 97.067 115.997 L 97.067 116.131 L 96.933 116.131 L 96.933 116.264 L 96.8 116.264 L 96.8 116.397 L 96.533 116.397 L 96.533 116.531 L 96.4 116.531 L 96.4 116.664 L 96.133 116.664 L 96.133 116.797 L 96 116.797 L 96 116.931 L 95.867 116.931 L 95.867 117.064 L 95.6 117.064 L 95.6 117.197 L 95.467 117.197 L 95.467 117.331 L 95.333 117.331 L 95.333 117.464 L 95.067 117.464 L 95.067 117.597 L 94.933 117.597 L 94.933 117.731 L 94.8 117.731 L 94.8 117.864 L 94.533 117.864 L 94.533 117.997 L 94.4 117.997 L 94.4 118.131 L 94.267 118.131 L 94.267 118.264 L 94 118.264 L 94 118.397 L 93.867 118.397 L 93.867 118.531 L 93.733 118.531 L 93.733 118.664 L 93.467 118.664 L 93.467 118.797 L 93.333 118.797 L 93.333 118.931 L 93.067 118.931 L 93.067 119.064 L 92.933 119.064 L 92.933 119.197 L 92.8 119.197 L 92.8 119.331 L 92.667 119.331 L 92.667 119.464 L 92.4 119.464 L 92.4 119.597 L 92.267 119.597 L 92.267 119.731 L 92.133 119.731 L 92.133 119.864 L 92 119.864 L 92 119.997 L 91.867 119.997 L 91.867 120.131 L 91.733 120.131 L 91.733 120.264 L 91.467 120.264 L 91.467 120.397 L 91.333 120.397 L 91.333 120.531 L 91.2 120.531 L 91.2 120.664 L 91.067 120.664 L 91.067 120.797 L 90.933 120.797 L 90.933 120.931 L 90.667 120.931 L 90.667 121.064 L 90.533 121.064 L 90.533 121.197 L 90.4 121.197 L 90.4 121.331 L 90.267 121.331 L 90.267 121.464 L 90.133 121.464 L 90.133 121.597 L 90 121.597 L 90 121.731 L 89.733 121.731 L 89.733 121.864 L 89.6 121.864 L 89.6 121.997 L 89.467 121.997 L 89.467 122.131 L 89.333 122.131 L 89.333 122.264 L 89.2 122.264 L 89.2 122.397 L 89.067 122.397 L 89.067 122.531 L 88.8 122.531 L 88.8 122.664 L 88.667 122.664 L 88.667 122.797 L 88.533 122.797 L 88.533 122.931 L 88.4 122.931 L 88.4 123.064 L 88.267 123.064 L 88.267 123.197 L 88 123.197 L 88 123.331 L 87.867 123.331 L 87.867 123.464 L 87.733 123.464 L 87.733 123.597 L 87.6 123.597 L 87.6 123.731 L 87.467 123.731 L 87.467 123.864 L 87.333 123.864 L 87.333 123.997 L 87.067 123.997 L 87.067 124.131 L 86.933 124.131 L 86.933 124.264 L 86.8 124.264 L 86.8 124.397 L 86.667 124.397 L 86.667 124.531 L 86.533 124.531 L 86.533 124.664 L 86.4 124.664 L 86.4 124.797 L 86.267 124.797 L 86.267 124.931 L 86.133 124.931 L 86.133 125.064 L 86 125.064 L 86 125.197 L 85.867 125.197 L 85.867 125.331 L 85.733 125.331 L 85.733 125.464 L 85.467 125.464 L 85.467 125.597 L 85.333 125.597 L 85.333 125.731 L 85.2 125.731 L 85.2 125.864 L 85.067 125.864 L 85.067 125.997 L 84.933 125.997 L 84.933 126.131 L 84.8 126.131 L 84.8 126.264 L 84.667 126.264 L 84.667 126.397 L 84.533 126.397 L 84.533 126.531 L 84.4 126.531 L 84.4 126.664 L 84.267 126.664 L 84.267 126.797 L 84.133 126.797 L 84.133 126.931 L 84 126.931 L 84 127.064 L 83.867 127.064 L 83.867 127.197 L 83.733 127.197 L 83.733 127.331 L 83.6 127.331 L 83.6 127.464 L 83.467 127.464 L 83.467 127.597 L 83.333 127.597 L 83.333 127.731 L 83.2 127.731 L 83.2 127.864 L 83.067 127.864 L 83.067 127.997 L 82.933 127.997 L 82.933 128.131 L 82.8 128.131 L 82.8 128.264 L 82.667 128.264 L 82.667 128.397 L 82.533 128.397 L 82.533 128.531 L 82.4 128.531 L 82.4 128.664 L 82.267 128.664 L 82.267 128.797 L 82.133 128.797 L 82.133 128.931 L 82 128.931 L 82 129.064 L 81.867 129.064 L 81.867 129.197 L 81.733 129.197 L 81.733 129.331 L 81.6 129.331 L 81.6 129.464 L 81.467 129.464 L 81.467 129.597 L 81.2 129.597 L 81.2 129.731 L 81.067 129.731 L 81.067 129.864 L 80.933 129.864 L 80.933 129.997 L 80.8 129.997 L 80.8 130.131 L 80.667 130.131 L 80.667 130.264 L 80.533 130.264 L 80.533 130.397 L 80.4 130.397 L 80.4 130.664 L 80.267 130.664 L 80.267 130.797 L 80.133 130.797 L 80.133 130.931 L 80 130.931 L 80 131.064 L 79.867 131.064 L 79.867 131.197 L 79.733 131.197 L 79.733 131.331 L 79.6 131.331 L 79.6 131.464 L 79.467 131.464 L 79.467 131.597 L 79.333 131.597 L 79.333 131.731 L 79.2 131.731 L 79.2 131.864 L 79.067 131.864 L 79.067 132.131 L 78.933 132.131 L 78.933 132.264 L 78.8 132.264 L 78.8 132.397 L 78.667 132.397 L 78.667 132.531 L 78.533 132.531 L 78.533 132.664 L 78.4 132.664 L 78.4 132.797 L 78.267 132.797 L 78.267 132.931 L 78.133 132.931 L 78.133 133.064 L 78 133.064 L 78 133.197 L 77.867 133.197 L 77.867 133.464 L 77.733 133.464 L 77.733 133.597 L 77.6 133.597 L 77.6 133.731 L 77.467 133.731 L 77.467 133.864 L 77.333 133.864 L 77.333 133.997 L 77.2 133.997 L 77.2 134.131 L 77.067 134.131 L 77.067 134.264 L 76.933 134.264 L 76.933 134.397 L 76.8 134.397 L 76.8 134.531 L 76.667 134.531 L 76.667 134.797 L 76.533 134.797 L 76.533 134.931 L 76.4 134.931 L 76.4 135.064 L 76.267 135.064 L 76.267 135.197 L 76.133 135.197 L 76.133 135.331 L 76 135.331 L 76 135.464 L 75.867 135.464 L 75.867 135.597 L 75.733 135.597 L 75.733 135.731 L 75.6 135.731 L 75.6 135.864 L 75.467 135.864 L 75.467 136.131 L 75.333 136.131 L 75.333 136.264 L 75.2 136.264 L 75.2 136.397 L 75.067 136.397 L 75.067 136.531 L 74.933 136.531 L 74.933 136.664 L 74.8 136.664 L 74.8 136.797 L 74.667 136.797 L 74.667 136.931 L 74.533 136.931 L 74.533 137.197 L 74.4 137.197 L 74.4 137.331 L 74.267 137.331 L 74.267 137.464 L 74.133 137.464 L 74.133 137.731 L 74 137.731 L 74 137.864 L 73.867 137.864 L 73.867 137.997 L 73.733 137.997 L 73.733 138.131 L 73.6 138.131 L 73.6 138.397 L 73.467 138.397 L 73.467 138.531 L 73.333 138.531 L 73.333 138.664 L 73.2 138.664 L 73.2 138.797 L 73.067 138.797 L 73.067 139.064 L 72.933 139.064 L 72.933 139.197 L 72.8 139.197 L 72.8 139.331 L 72.667 139.331 L 72.667 139.597 L 72.533 139.597 L 72.533 139.731 L 72.4 139.731 L 72.4 139.864 L 72.267 139.864 L 72.267 139.997 L 72.133 139.997 L 72.133 140.264 L 72 140.264 L 72 140.397 L 71.867 140.397 L 71.867 140.531 L 71.733 140.531 L 71.733 140.797 L 71.6 140.797 L 71.6 140.931 L 71.467 140.931 L 71.467 141.064 L 71.333 141.064 L 71.333 141.197 L 71.2 141.197 L 71.2 141.464 L 71.067 141.464 L 71.067 141.597 L 70.933 141.597 L 70.933 141.731 L 70.8 141.731 L 70.8 141.864 L 70.667 141.864 L 70.667 142.131 L 70.533 142.131 L 70.533 142.264 L 70.4 142.264 L 70.4 142.397 L 70.267 142.397 L 70.267 142.664 L 70.133 142.664 L 70.133 142.797 L 70 142.797 L 70 142.931 L 69.867 142.931 L 69.867 143.064 L 69.733 143.064 L 69.733 143.331 L 69.6 143.331 L 69.6 143.464 L 69.467 143.464 L 69.467 143.597 L 69.333 143.597 L 69.333 143.864 L 69.2 143.864 L 69.2 143.997 L 69.067 143.997 L 69.067 144.264 L 68.933 144.264 L 68.933 144.397 L 68.8 144.397 L 68.8 144.664 L 68.667 144.664 L 68.667 144.797 L 68.533 144.797 L 68.533 144.931 L 68.4 144.931 L 68.4 145.197 L 68.267 145.197 L 68.267 145.331 L 68.133 145.331 L 68.133 145.597 L 68 145.597 L 68 145.731 L 67.867 145.731 L 67.867 145.997 L 67.733 145.997 L 67.733 146.131 L 67.6 146.131 L 67.6 146.397 L 67.467 146.397 L 67.467 146.531 L 67.333 146.531 L 67.333 146.797 L 67.2 146.797 L 67.2 146.931 L 67.067 146.931 L 67.067 147.197 L 66.933 147.197 L 66.933 147.331 L 66.8 147.331 L 66.8 147.597 L 66.667 147.597 L 66.667 147.731 L 66.533 147.731 L 66.533 147.997 L 66.4 147.997 L 66.4 148.131 L 66.267 148.131 L 66.267 148.397 L 66.133 148.397 L 66.133 148.531 L 66 148.531 L 66 148.797 L 65.867 148.797 L 65.867 148.931 L 65.733 148.931 L 65.733 149.064 L 65.6 149.064 L 65.6 149.331 L 65.467 149.331 L 65.467 149.464 L 65.333 149.464 L 65.333 149.731 L 65.2 149.731 L 65.2 149.864 L 65.067 149.864 L 65.067 150.131 L 64.933 150.131 L 64.933 150.264 L 64.8 150.264 L 64.8 150.531 L 64.667 150.531 L 64.667 150.664 L 64.533 150.664 L 64.533 150.931 L 64.4 150.931 L 64.4 151.064 L 64.267 151.064 L 64.267 151.331 L 64.133 151.331 L 64.133 151.464 L 64 151.464 L 64 151.731 L 63.867 151.731 L 63.867 151.997 L 63.733 151.997 L 63.733 152.264 L 63.6 152.264 L 63.6 152.397 L 63.467 152.397 L 63.467 152.664 L 63.333 152.664 L 63.333 152.931 L 63.2 152.931 L 63.2 153.064 L 63.067 153.064 L 63.067 153.331 L 62.933 153.331 L 62.933 153.597 L 62.8 153.597 L 62.8 153.731 L 62.667 153.731 L 62.667 153.997 L 62.533 153.997 L 62.533 154.264 L 62.4 154.264 L 62.4 154.397 L 62.267 154.397 L 62.267 154.664 L 62.133 154.664 L 62.133 154.931 L 62 154.931 L 62 155.064 L 61.867 155.064 L 61.867 155.331 L 61.733 155.331 L 61.733 155.597 L 61.6 155.597 L 61.6 155.731 L 61.467 155.731 L 61.467 155.997 L 61.333 155.997 L 61.333 156.264 L 61.2 156.264 L 61.2 156.531 L 61.067 156.531 L 61.067 156.664 L 60.933 156.664 L 60.933 156.931 L 60.8 156.931 L 60.8 157.197 L 60.667 157.197 L 60.667 157.331 L 60.533 157.331 L 60.533 157.597 L 60.4 157.597 L 60.4 157.864 L 60.267 157.864 L 60.267 158.131 L 60.133 158.131 L 60.133 158.397 L 60 158.397 L 60 158.664 L 59.867 158.664 L 59.867 158.931 L 59.733 158.931 L 59.733 159.064 L 59.6 159.064 L 59.6 159.331 L 59.467 159.331 L 59.467 159.597 L 59.333 159.597 L 59.333 159.864 L 59.2 159.864 L 59.2 160.131 L 59.067 160.131 L 59.067 160.397 L 58.933 160.397 L 58.933 160.664 L 58.8 160.664 L 58.8 160.931 L 58.667 160.931 L 58.667 161.197 L 58.533 161.197 L 58.533 161.464 L 58.4 161.464 L 58.4 161.731 L 58.267 161.731 L 58.267 161.997 L 58.133 161.997 L 58.133 162.264 L 58 162.264 L 58 162.531 L 57.867 162.531 L 57.867 162.797 L 57.733 162.797 L 57.733 163.064 L 57.6 163.064 L 57.6 163.331 L 57.467 163.331 L 57.467 163.597 L 57.333 163.597 L 57.333 163.864 L 57.2 163.864 L 57.2 164.131 L 57.067 164.131 L 57.067 164.397 L 56.933 164.397 L 56.933 164.664 L 56.8 164.664 L 56.8 164.931 L 56.667 164.931 L 56.667 165.197 L 56.533 165.197 L 56.533 165.597 L 56.4 165.597 L 56.4 165.864 L 56.267 165.864 L 56.267 166.131 L 56.133 166.131 L 56.133 166.531 L 56 166.531 L 56 166.797 L 55.867 166.797 L 55.867 167.064 L 55.733 167.064 L 55.733 167.464 L 55.6 167.464 L 55.6 167.731 L 55.467 167.731 L 55.467 167.997 L 55.333 167.997 L 55.333 168.264 L 55.2 168.264 L 55.2 168.664 L 55.067 168.664 L 55.067 168.931 L 54.933 168.931 L 54.933 169.197 L 54.8 169.197 L 54.8 169.597 L 54.667 169.597 L 54.667 169.864 L 54.533 169.864 L 54.533 170.131 L 54.4 170.131 L 54.4 170.531 L 54.267 170.531 L 54.267 170.797 L 54.133 170.797 L 54.133 171.197 L 54 171.197 L 54 171.464 L 53.867 171.464 L 53.867 171.864 L 53.733 171.864 L 53.733 172.264 L 53.6 172.264 L 53.6 172.664 L 53.467 172.664 L 53.467 172.931 L 53.333 172.931 L 53.333 173.331 L 53.2 173.331 L 53.2 173.731 L 53.067 173.731 L 53.067 173.997 L 52.933 173.997 L 52.933 174.397 L 52.8 174.397 L 52.8 174.797 L 52.667 174.797 L 52.667 175.197 L 52.533 175.197 L 52.533 175.464 L 52.4 175.464 L 52.4 175.864 L 52.267 175.864 L 52.267 176.264 L 52.133 176.264 L 52.133 176.664 L 52 176.664 L 52 177.064 L 51.867 177.064 L 51.867 177.597 L 51.733 177.597 L 51.733 177.997 L 51.6 177.997 L 51.6 178.397 L 51.467 178.397 L 51.467 178.931 L 51.333 178.931 L 51.333 179.331 L 51.2 179.331 L 51.2 179.731 L 51.067 179.731 L 51.067 180.131 L 50.933 180.131 L 50.933 180.664 L 50.8 180.664 L 50.8 181.064 L 50.667 181.064 L 50.667 181.464 L 50.533 181.464 L 50.533 181.997 L 50.4 181.997 L 50.4 182.664 L 50.267 182.664 L 50.267 183.197 L 50.133 183.197 L 50.133 183.731 L 50 183.731 L 50 184.264 L 49.867 184.264 L 49.867 184.797 L 49.733 184.797 L 49.733 185.464 L 49.6 185.464 L 49.6 185.997 L 49.467 185.997 L 49.467 186.531 L 49.333 186.531 L 49.333 187.197 L 49.2 187.197 L 49.2 187.864 L 49.067 187.864 L 49.067 188.664 L 48.933 188.664 L 48.933 189.464 L 48.8 189.464 L 48.8 190.264 L 48.667 190.264 L 48.667 191.064 L 48.533 191.064 L 48.533 191.731 L 48.4 191.731 L 48.4 192.797 L 48.267 192.797 L 48.267 193.997 L 48.133 193.997 L 48.133 195.331 L 48 195.331 L 48 196.531 L 47.867 196.531 L 47.867 198.264 L 47.733 198.264 L 47.733 200.797 L 47.6 200.797 L 47.6 204.131 L 47.733 204.131 L 47.733 206.797 L 47.867 206.797 L 47.867 208.664 L 48 208.664 L 48 209.731 L 48.133 209.731 L 48.133 210.931 L 48.267 210.931 L 48.267 212.131 L 48.4 212.131 L 48.4 213.197 L 48.533 213.197 L 48.533 213.997 L 48.667 213.997 L 48.667 214.797 L 48.8 214.797 L 48.8 215.464 L 48.933 215.464 L 48.933 216.131 L 49.067 216.131 L 49.067 216.797 L 49.2 216.797 L 49.2 217.464 L 49.333 217.464 L 49.333 218.131 L 49.467 218.131 L 49.467 218.797 L 49.6 218.797 L 49.6 219.331 L 49.733 219.331 L 49.733 219.864 L 49.867 219.864 L 49.867 220.397 L 50 220.397 L 50 220.797 L 50.133 220.797 L 50.133 221.331 L 50.267 221.331 L 50.267 221.731 L 50.4 221.731 L 50.4 222.264 L 50.533 222.264 L 50.533 222.797 L 50.667 222.797 L 50.667 223.197 L 50.8 223.197 L 50.8 223.731 L 50.933 223.731 L 50.933 224.264 L 51.067 224.264 L 51.067 224.531 L 51.2 224.531 L 51.2 224.931 L 51.333 224.931 L 51.333 225.331 L 51.467 225.331 L 51.467 225.731 L 51.6 225.731 L 51.6 226.131 L 51.733 226.131 L 51.733 226.397 L 51.867 226.397 L 51.867 226.797 L 52 226.797 L 52 227.197 L 52.133 227.197 L 52.133 227.597 L 52.267 227.597 L 52.267 227.997 L 52.4 227.997 L 52.4 228.264 L 52.533 228.264 L 52.533 228.664 L 52.667 228.664 L 52.667 229.064 L 52.8 229.064 L 52.8 229.464 L 52.933 229.464 L 52.933 229.731 L 53.067 229.731 L 53.067 229.997 L 53.2 229.997 L 53.2 230.264 L 53.333 230.264 L 53.333 230.664 L 53.467 230.664 L 53.467 230.931 L 53.6 230.931 L 53.6 231.197 L 53.733 231.197 L 53.733 231.464 L 53.867 231.464 L 53.867 231.864 L 54 231.864 L 54 232.131 L 54.133 232.131 L 54.133 232.397 L 54.267 232.397 L 54.267 232.664 L 54.4 232.664 L 54.4 233.064 L 54.533 233.064 L 54.533 233.331 L 54.667 233.331 L 54.667 233.597 L 54.8 233.597 L 54.8 233.864 L 54.933 233.864 L 54.933 234.264 L 55.067 234.264 L 55.067 234.397 L 55.2 234.397 L 55.2 234.664 L 55.333 234.664 L 55.333 234.931 L 55.467 234.931 L 55.467 235.197 L 55.6 235.197 L 55.6 235.464 L 55.733 235.464 L 55.733 235.731 L 55.867 235.731 L 55.867 235.997 L 56 235.997 L 56 236.264 L 56.133 236.264 L 56.133 236.397 L 56.267 236.397 L 56.267 236.664 L 56.4 236.664 L 56.4 236.931 L 56.533 236.931 L 56.533 237.197 L 56.667 237.197 L 56.667 237.464 L 56.8 237.464 L 56.8 237.731 L 56.933 237.731 L 56.933 237.997 L 57.067 237.997 L 57.067 238.131 L 57.2 238.131 L 57.2 238.397 L 57.333 238.397 L 57.333 238.664 L 57.467 238.664 L 57.467 238.931 L 57.6 238.931 L 57.6 239.197 L 57.733 239.197 L 57.733 239.331 L 57.867 239.331 L 57.867 239.597 L 58 239.597 L 58 239.864 L 58.133 239.864 L 58.133 239.997 L 58.267 239.997 L 58.267 240.264 L 58.4 240.264 L 58.4 240.531 L 58.533 240.531 L 58.533 240.664 L 58.667 240.664 L 58.667 240.931 L 58.8 240.931 L 58.8 241.064 L 58.933 241.064 L 58.933 241.331 L 59.067 241.331 L 59.067 241.597 L 59.2 241.597 L 59.2 241.731 L 59.333 241.731 L 59.333 241.997 L 59.467 241.997 L 59.467 242.264 L 59.6 242.264 L 59.6 242.397 L 59.733 242.397 L 59.733 242.664 L 59.867 242.664 L 59.867 242.797 L 60 242.797 L 60 243.064 L 60.133 243.064 L 60.133 243.197 L 60.267 243.197 L 60.267 243.464 L 60.4 243.464 L 60.4 243.597 L 60.533 243.597 L 60.533 243.864 L 60.667 243.864 L 60.667 243.997 L 60.8 243.997 L 60.8 244.264 L 60.933 244.264 L 60.933 244.397 L 61.067 244.397 L 61.067 244.531 L 61.2 244.531 L 61.2 244.797 L 61.333 244.797 L 61.333 244.931 L 61.467 244.931 L 61.467 245.197 L 61.6 245.197 L 61.6 245.331 L 61.733 245.331 L 61.733 245.464 L 61.867 245.464 L 61.867 245.731 L 62 245.731 L 62 245.864 L 62.133 245.864 L 62.133 245.997 L 62.267 245.997 L 62.267 246.264 L 62.4 246.264 L 62.4 246.397 L 62.533 246.397 L 62.533 246.531 L 62.667 246.531 L 62.667 246.797 L 62.8 246.797 L 62.8 246.931 L 62.933 246.931 L 62.933 247.064 L 63.067 247.064 L 63.067 247.331 L 63.2 247.331 L 63.2 247.464 L 63.333 247.464 L 63.333 247.597 L 63.467 247.597 L 63.467 247.864 L 63.6 247.864 L 63.6 247.997 L 63.733 247.997 L 63.733 248.131 L 63.867 248.131 L 63.867 248.264 L 64 248.264 L 64 248.531 L 64.133 248.531 L 64.133 248.664 L 64.267 248.664 L 64.267 248.797 L 64.4 248.797 L 64.4 248.931 L 64.533 248.931 L 64.533 249.064 L 64.667 249.064 L 64.667 249.331 L 64.8 249.331 L 64.8 249.464 L 64.933 249.464 L 64.933 249.597 L 65.067 249.597 L 65.067 249.731 L 65.2 249.731 L 65.2 249.864 L 65.333 249.864 L 65.333 250.131 L 65.467 250.131 L 65.467 250.264 L 65.6 250.264 L 65.6 250.397 L 65.733 250.397 L 65.733 250.531 L 65.867 250.531 L 65.867 250.664 L 66 250.664 L 66 250.931 L 66.133 250.931 L 66.133 251.064 L 66.267 251.064 L 66.267 251.197 L 66.4 251.197 L 66.4 251.331 L 66.533 251.331 L 66.533 251.464 L 66.667 251.464 L 66.667 251.731 L 66.8 251.731 L 66.8 251.864 L 66.933 251.864 L 66.933 251.997 L 67.067 251.997 L 67.067 252.131 L 67.2 252.131 L 67.2 252.264 L 67.333 252.264 L 67.333 252.531 L 67.467 252.531 L 67.467 252.664 L 67.6 252.664 L 67.6 252.797 L 67.733 252.797 L 67.733 252.931 L 67.867 252.931 L 67.867 253.064 L 68 253.064 L 68 253.197 L 68.133 253.197 L 68.133 253.331 L 68.267 253.331 L 68.267 253.464 L 68.4 253.464 L 68.4 253.597 L 68.533 253.597 L 68.533 253.731 L 68.667 253.731 L 68.667 253.864 L 68.8 253.864 L 68.8 253.997 L 68.933 253.997 L 68.933 254.131 L 69.067 254.131 L 69.067 254.264 L 69.2 254.264 L 69.2 254.397 L 69.333 254.397 L 69.333 254.531 L 69.467 254.531 L 69.467 254.664 L 69.6 254.664 L 69.6 254.797 L 69.733 254.797 L 69.733 254.931 L 69.867 254.931 L 69.867 255.064 L 70 255.064 L 70 255.331 L 70.133 255.331 L 70.133 255.464 L 70.267 255.464 L 70.267 255.597 L 70.4 255.597 L 70.4 255.731 L 70.533 255.731 L 70.533 255.864 L 70.667 255.864 L 70.667 255.997 L 70.8 255.997 L 70.8 256.131 L 70.933 256.131 L 70.933 256.264 L 71.067 256.264 L 71.067 256.397 L 71.2 256.397 L 71.2 256.531 L 71.333 256.531 L 71.333 256.664 L 71.467 256.664 L 71.467 256.797 L 71.6 256.797 L 71.6 256.931 L 71.733 256.931 L 71.733 257.064 L 71.867 257.064 L 71.867 257.197 L 72 257.197 L 72 257.331 L 72.267 257.331 L 72.267 257.464 L 72.4 257.464 L 72.4 257.597 L 72.533 257.597 L 72.533 257.731 L 72.667 257.731 L 72.667 257.864 L 72.8 257.864 L 72.8 257.997 L 72.933 257.997 L 72.933 258.131 L 73.067 258.131 L 73.067 258.264 L 73.2 258.264 L 73.2 258.397 L 73.333 258.397 L 73.333 258.531 L 73.467 258.531 L 73.467 258.664 L 73.6 258.664 L 73.6 258.797 L 73.733 258.797 L 73.733 258.931 L 73.867 258.931 L 73.867 259.064 L 74.133 259.064 L 74.133 259.197 L 74.267 259.197 L 74.267 259.331 L 74.4 259.331 L 74.4 259.464 L 74.533 259.464 L 74.533 259.597 L 74.667 259.597 L 74.667 259.731 L 74.8 259.731 L 74.8 259.864 L 74.933 259.864 L 74.933 259.997 L 75.067 259.997 L 75.067 260.131 L 75.2 260.131 L 75.2 260.264 L 75.333 260.264 L 75.333 260.397 L 75.467 260.397 L 75.467 260.531 L 75.733 260.531 L 75.733 260.664 L 75.867 260.664 L 75.867 260.797 L 76 260.797 L 76 260.931 L 76.133 260.931 L 76.133 261.064 L 76.267 261.064 L 76.267 261.197 L 76.533 261.197 L 76.533 261.331 L 76.667 261.331 L 76.667 261.464 L 76.8 261.464 L 76.8 261.597 L 76.933 261.597 L 76.933 261.731 L 77.2 261.731 L 77.2 261.864 L 77.333 261.864 L 77.333 261.997 L 77.467 261.997 L 77.467 262.131 L 77.6 262.131 L 77.6 262.264 L 77.733 262.264 L 77.733 262.397 L 78 262.397 L 78 262.531 L 78.133 262.531 L 78.133 262.664 L 78.267 262.664 L 78.267 262.797 L 78.4 262.797 L 78.4 262.931 L 78.667 262.931 L 78.667 263.064 L 78.8 263.064 L 78.8 263.197 L 78.933 263.197 L 78.933 263.331 L 79.067 263.331 L 79.067 263.464 L 79.2 263.464 L 79.2 263.597 L 79.467 263.597 L 79.467 263.731 L 79.6 263.731 L 79.6 263.864 L 79.733 263.864 L 79.733 263.997 L 79.867 263.997 L 79.867 264.131 L 80.133 264.131 L 80.133 264.264 L 80.267 264.264 L 80.267 264.397 L 80.4 264.397 L 80.4 264.531 L 80.667 264.531 L 80.667 264.664 L 80.8 264.664 L 80.8 264.797 L 80.933 264.797 L 80.933 264.931 L 81.2 264.931 L 81.2 265.064 L 81.333 265.064 L 81.333 265.197 L 81.6 265.197 L 81.6 265.331 L 81.733 265.331 L 81.733 265.464 L 81.867 265.464 L 81.867 265.597 L 82.133 265.597 L 82.133 265.731 L 82.267 265.731 L 82.267 265.864 L 82.4 265.864 L 82.4 265.997 L 82.667 265.997 L 82.667 266.131 L 82.8 266.131 L 82.8 266.264 L 83.067 266.264 L 83.067 266.397 L 83.2 266.397 L 83.2 266.531 L 83.333 266.531 L 83.333 266.664 L 83.6 266.664 L 83.6 266.797 L 83.733 266.797 L 83.733 266.931 L 83.867 266.931 L 83.867 267.064 L 84.133 267.064 L 84.133 267.197 L 84.267 267.197 L 84.267 267.331 L 84.533 267.331 L 84.533 267.464 L 84.667 267.464 L 84.667 267.597 L 84.933 267.597 L 84.933 267.731 L 85.067 267.731 L 85.067 267.864 L 85.333 267.864 L 85.333 267.997 L 85.467 267.997 L 85.467 268.131 L 85.733 268.131 L 85.733 268.264 L 85.867 268.264 L 85.867 268.397 L 86.133 268.397 L 86.133 268.531 L 86.267 268.531 L 86.267 268.664 L 86.533 268.664 L 86.533 268.797 L 86.8 268.797 L 86.8 268.931 L 86.933 268.931 L 86.933 269.064 L 87.2 269.064 L 87.2 269.197 L 87.333 269.197 L 87.333 269.331 L 87.6 269.331 L 87.6 269.464 L 87.733 269.464 L 87.733 269.597 L 88 269.597 L 88 269.731 L 88.133 269.731 L 88.133 269.864 L 88.4 269.864 L 88.4 269.997 L 88.533 269.997 L 88.533 270.131 L 88.8 270.131 L 88.8 270.264 L 89.067 270.264 L 89.067 270.397 L 89.2 270.397 L 89.2 270.531 L 89.467 270.531 L 89.467 270.664 L 89.6 270.664 L 89.6 270.797 L 89.867 270.797 L 89.867 270.931 L 90.133 270.931 L 90.133 271.064 L 90.267 271.064 L 90.267 271.197 L 90.533 271.197 L 90.533 271.331 L 90.8 271.331 L 90.8 271.464 L 91.067 271.464 L 91.067 271.597 L 91.2 271.597 L 91.2 271.731 L 91.467 271.731 L 91.467 271.864 L 91.733 271.864 L 91.733 271.997 L 92 271.997 L 92 272.131 L 92.133 272.131 L 92.133 272.264 L 92.4 272.264 L 92.4 272.397 L 92.667 272.397 L 92.667 272.531 L 92.8 272.531 L 92.8 272.664 L 93.067 272.664 L 93.067 272.797 L 93.333 272.797 L 93.333 272.931 L 93.6 272.931 L 93.6 273.064 L 93.733 273.064 L 93.733 273.197 L 94 273.197 L 94 273.331 L 94.267 273.331 L 94.267 273.464 L 94.533 273.464 L 94.533 273.597 L 94.8 273.597 L 94.8 273.731 L 95.067 273.731 L 95.067 273.864 L 95.333 273.864 L 95.333 273.997 L 95.6 273.997 L 95.6 274.131 L 95.733 274.131 L 95.733 274.264 L 96 274.264 L 96 274.397 L 96.267 274.397 L 96.267 274.531 L 96.533 274.531 L 96.533 274.664 L 96.8 274.664 L 96.8 274.797 L 97.067 274.797 L 97.067 274.931 L 97.333 274.931 L 97.333 275.064 L 97.6 275.064 L 97.6 275.197 L 98 275.197 L 98 275.331 L 98.267 275.331 L 98.267 275.464 L 98.533 275.464 L 98.533 275.597 L 98.8 275.597 L 98.8 275.731 L 99.067 275.731 L 99.067 275.864 L 99.333 275.864 L 99.333 275.997 L 99.6 275.997 L 99.6 276.131 L 99.867 276.131 L 99.867 276.264 L 100.133 276.264 L 100.133 276.397 L 100.4 276.397 L 100.4 276.531 L 100.667 276.531 L 100.667 276.664 L 100.933 276.664 L 100.933 276.797 L 101.2 276.797 L 101.2 276.931 L 101.6 276.931 L 101.6 277.064 L 101.867 277.064 L 101.867 277.197 L 102.267 277.197 L 102.267 277.331 L 102.533 277.331 L 102.533 277.464 L 102.8 277.464 L 102.8 277.597 L 103.2 277.597 L 103.2 277.731 L 103.467 277.731 L 103.467 277.864 L 103.867 277.864 L 103.867 277.997 L 104.133 277.997 L 104.133 278.131 L 104.4 278.131 L 104.4 278.264 L 104.8 278.264 L 104.8 278.397 L 105.067 278.397 L 105.067 278.531 L 105.333 278.531 L 105.333 278.664 L 105.733 278.664 L 105.733 278.797 L 106 278.797 L 106 278.931 L 106.4 278.931 L 106.4 279.064 L 106.667 279.064 L 106.667 279.197 L 106.933 279.197 L 106.933 279.331 L 107.333 279.331 L 107.333 279.464 L 107.6 279.464 L 107.6 279.597 L 108 279.597 L 108 279.731 L 108.267 279.731 L 108.267 279.864 L 108.667 279.864 L 108.667 279.997 L 109.067 279.997 L 109.067 280.131 L 109.467 280.131 L 109.467 280.264 L 109.867 280.264 L 109.867 280.397 L 110.267 280.397 L 110.267 280.531 L 110.667 280.531 L 110.667 280.664 L 111.067 280.664 L 111.067 280.797 L 111.333 280.797 L 111.333 280.931 L 111.733 280.931 L 111.733 281.064 L 112.133 281.064 L 112.133 281.197 L 112.533 281.197 L 112.533 281.331 L 112.933 281.331 L 112.933 281.464 L 113.333 281.464 L 113.333 281.597 L 113.733 281.597 L 113.733 281.731 L 114 281.731 L 114 281.864 L 114.4 281.864 L 114.4 281.997 L 114.8 281.997 L 114.8 282.131 L 115.333 282.131 L 115.333 282.264 L 115.733 282.264 L 115.733 282.397 L 116.267 282.397 L 116.267 282.531 L 116.667 282.531 L 116.667 282.664 L 117.2 282.664 L 117.2 282.797 L 117.6 282.797 L 117.6 282.931 L 118.133 282.931 L 118.133 283.064 L 118.667 283.064 L 118.667 283.197 L 119.067 283.197 L 119.067 283.331 L 119.6 283.331 L 119.6 283.464 L 120 283.464 L 120 283.597 L 120.533 283.597 L 120.533 283.731 L 120.933 283.731 L 120.933 283.864 L 121.467 283.864 L 121.467 283.997 L 121.867 283.997 L 121.867 284.131 L 122.533 284.131 L 122.533 284.264 L 123.2 284.264 L 123.2 284.397 L 123.733 284.397 L 123.733 284.531 L 124.4 284.531 L 124.4 284.664 L 124.933 284.664 L 124.933 284.797 L 125.6 284.797 L 125.6 284.931 L 126.267 284.931 L 126.267 285.064 L 126.8 285.064 L 126.8 285.197 L 127.467 285.197 L 127.467 285.331 L 128 285.331 L 128 285.464 L 128.667 285.464 L 128.667 285.597 L 129.333 285.597 L 129.333 285.731 L 130.133 285.731 L 130.133 285.864 L 131.067 285.864 L 131.067 285.997 L 131.867 285.997 L 131.867 286.131 L 132.8 286.131 L 132.8 286.264 L 133.6 286.264 L 133.6 286.397 L 134.4 286.397 L 134.4 286.531 L 135.333 286.531 L 135.333 286.664 L 136.133 286.664 L 136.133 286.797 L 137.333 286.797 L 137.333 286.931 L 138.8 286.931 L 138.8 287.064 L 140.133 287.064 L 140.133 287.197 L 141.6 287.197 L 141.6 287.331 L 142.933 287.331 L 142.933 287.464 L 144.8 287.464 L 144.8 287.597 L 147.733 287.597 L 147.733 287.731 L 156 287.731 L 156 287.597 L 158.933 287.597 L 158.933 287.464 L 160.667 287.464 L 160.667 287.331 L 162.4 287.331 L 162.4 287.197 L 164.133 287.197 L 164.133 287.064 L 165.333 287.064 L 165.333 286.931 L 166.4 286.931 L 166.4 286.797 L 167.333 286.797 L 167.333 286.664 L 168.4 286.664 L 168.4 286.531 L 169.467 286.531 L 169.467 286.397 L 170.533 286.397 L 170.533 286.264 L 171.333 286.264 L 171.333 286.131 L 172 286.131 L 172 285.997 L 172.8 285.997 L 172.8 285.864 L 173.6 285.864 L 173.6 285.731 L 174.267 285.731 L 174.267 285.597 L 175.067 285.597 L 175.067 285.464 L 175.733 285.464 L 175.733 285.331 L 176.533 285.331 L 176.533 285.197 L 177.2 285.197 L 177.2 285.064 L 177.733 285.064 L 177.733 284.931 L 178.267 284.931 L 178.267 284.797 L 178.8 284.797 L 178.8 284.664 L 179.467 284.664 L 179.467 284.531 L 180 284.531 L 180 284.397 L 180.533 284.397 L 180.533 284.264 L 181.2 284.264 L 181.2 284.131 L 181.733 284.131 L 181.733 283.997 L 182.267 283.997 L 182.267 283.864 L 182.8 283.864 L 182.8 283.731 L 183.333 283.731 L 183.333 283.597 L 183.733 283.597 L 183.733 283.464 L 184.267 283.464 L 184.267 283.331 L 184.667 283.331 L 184.667 283.197 L 185.2 283.197 L 185.2 283.064 L 185.6 283.064 L 185.6 282.931 L 186.133 282.931 L 186.133 282.797 L 186.533 282.797 L 186.533 282.664 L 187.067 282.664 L 187.067 282.531 L 187.467 282.531 L 187.467 282.397 L 188 282.397 L 188 282.264 L 188.4 282.264 L 188.4 282.131 L 188.8 282.131 L 188.8 281.997 L 189.2 281.997 L 189.2 281.864 L 189.6 281.864 L 189.6 281.731 L 190 281.731 L 190 281.597 L 190.4 281.597 L 190.4 281.464 L 190.8 281.464 L 190.8 281.331 L 191.2 281.331 L 191.2 281.197 L 191.6 281.197 L 191.6 281.064 L 192 281.064 L 192 280.931 L 192.4 280.931 L 192.4 280.797 L 192.667 280.797 L 192.667 280.664 L 193.067 280.664 L 193.067 280.531 L 193.467 280.531 L 193.467 280.397 L 193.867 280.397 L 193.867 280.264 L 194.267 280.264 L 194.267 280.131 L 194.667 280.131 L 194.667 279.997 L 194.933 279.997 L 194.933 279.864 L 195.333 279.864 L 195.333 279.731 L 195.6 279.731 L 195.6 279.597 L 196 279.597 L 196 279.464 L 196.267 279.464 L 196.267 279.331 L 196.667 279.331 L 196.667 279.197 L 196.933 279.197 L 196.933 279.064 L 197.333 279.064 L 197.333 278.931 L 197.6 278.931 L 197.6 278.797 L 198 278.797 L 198 278.664 L 198.267 278.664 L 198.267 278.531 L 198.667 278.531 L 198.667 278.397 L 198.933 278.397 L 198.933 278.264 L 199.333 278.264 L 199.333 278.131 L 199.6 278.131 L 199.6 277.997 L 200 277.997 L 200 277.864 L 200.267 277.864 L 200.267 277.731 L 200.533 277.731 L 200.533 277.597 L 200.8 277.597 L 200.8 277.464 L 201.067 277.464 L 201.067 277.331 L 201.333 277.331 L 201.333 277.197 L 201.733 277.197 L 201.733 277.064 L 202 277.064 L 202 276.931 L 202.267 276.931 L 202.267 276.797 L 202.533 276.797 L 202.533 276.664 L 202.8 276.664 L 202.8 276.531 L 203.067 276.531 L 203.067 276.397 L 203.467 276.397 L 203.467 276.264 L 203.733 276.264 L 203.733 276.131 L 204 276.131 L 204 275.997 L 204.267 275.997 L 204.267 275.864 L 204.533 275.864 L 204.533 275.731 L 204.8 275.731 L 204.8 275.597 L 205.2 275.597 L 205.2 275.464 L 205.467 275.464 L 205.467 275.331 L 205.733 275.331 L 205.733 275.197 L 205.867 275.197 L 205.867 275.064 L 206.133 275.064 L 206.133 274.931 L 206.4 274.931 L 206.4 274.797 L 206.667 274.797 L 206.667 274.664 L 206.933 274.664 L 206.933 274.531 L 207.2 274.531 L 207.2 274.397 L 207.467 274.397 L 207.467 274.264 L 207.733 274.264 L 207.733 274.131 L 208 274.131 L 208 273.997 L 208.267 273.997 L 208.267 273.864 L 208.4 273.864 L 208.4 273.731 L 208.667 273.731 L 208.667 273.597 L 208.933 273.597 L 208.933 273.464 L 209.2 273.464 L 209.2 273.331 L 209.467 273.331 L 209.467 273.197 L 209.733 273.197 L 209.733 273.064 L 210 273.064 L 210 272.931 L 210.267 272.931 L 210.267 272.797 L 210.533 272.797 L 210.533 272.664 L 210.8 272.664 L 210.8 272.531 L 210.933 272.531 L 210.933 272.397 L 211.2 272.397 L 211.2 272.264 L 211.467 272.264 L 211.467 272.131 L 211.6 272.131 L 211.6 271.997 L 211.867 271.997 L 211.867 271.864 L 212.133 271.864 L 212.133 271.731 L 212.267 271.731 L 212.267 271.597 L 212.533 271.597 L 212.533 271.464 L 212.8 271.464 L 212.8 271.331 L 212.933 271.331 L 212.933 271.197 L 213.2 271.197 L 213.2 271.064 L 213.467 271.064 L 213.467 270.931 L 213.733 270.931 L 213.733 270.797 L 213.867 270.797 L 213.867 270.664 L 214.133 270.664 L 214.133 270.531 L 214.4 270.531 L 214.4 270.397 L 214.533 270.397 L 214.533 270.264 L 214.8 270.264 L 214.8 270.131 L 215.067 270.131 L 215.067 269.997 L 215.2 269.997 L 215.2 269.864 L 215.467 269.864 L 215.467 269.731 L 215.733 269.731 L 215.733 269.597 L 215.867 269.597 L 215.867 269.464 L 216.133 269.464 L 216.133 269.331 L 216.267 269.331 L 216.267 269.197 L 216.533 269.197 L 216.533 269.064 L 216.667 269.064 L 216.667 268.931 L 216.933 268.931 L 216.933 268.797 L 217.067 268.797 L 217.067 268.664 L 217.333 268.664 L 217.333 268.531 L 217.467 268.531 L 217.467 268.397 L 217.733 268.397 L 217.733 268.264 L 217.867 268.264 L 217.867 268.131 L 218.133 268.131 L 218.133 267.997 L 218.267 267.997 L 218.267 267.864 L 218.533 267.864 L 218.533 267.731 L 218.667 267.731 L 218.667 267.597 L 218.933 267.597 L 218.933 267.464 L 219.067 267.464 L 219.067 267.331 L 219.333 267.331 L 219.333 267.197 L 219.6 267.197 L 219.6 267.064 L 219.733 267.064 L 219.733 266.931 L 220 266.931 L 220 266.797 L 220.133 266.797 L 220.133 266.664 L 220.4 266.664 L 220.4 266.531 L 220.533 266.531 L 220.533 266.397 L 220.8 266.397 L 220.8 266.264 L 220.933 266.264 L 220.933 266.131 L 221.067 266.131 L 221.067 265.997 L 221.333 265.997 L 221.333 265.864 L 221.467 265.864 L 221.467 265.731 L 221.6 265.731 L 221.6 265.597 L 221.867 265.597 L 221.867 265.464 L 222 265.464 L 222 265.331 L 222.133 265.331 L 222.133 265.197 L 222.4 265.197 L 222.4 265.064 L 222.533 265.064 L 222.533 264.931 L 222.667 264.931 L 222.667 264.797 L 222.933 264.797 L 222.933 264.664 L 223.067 264.664 L 223.067 264.531 L 223.333 264.531 L 223.333 264.397 L 223.467 264.397 L 223.467 264.264 L 223.6 264.264 L 223.6 264.131 L 223.867 264.131 L 223.867 263.997 L 224 263.997 L 224 263.864 L 224.133 263.864 L 224.133 263.731 L 224.4 263.731 L 224.4 263.597 L 224.533 263.597 L 224.533 263.464 L 224.667 263.464 L 224.667 263.331 L 224.933 263.331 L 224.933 263.197 L 225.067 263.197 L 225.067 263.064 L 225.333 263.064 L 225.333 262.931 L 225.467 262.931 L 225.467 262.797 L 225.6 262.797 L 225.6 262.664 L 225.733 262.664 L 225.733 262.531 L 226 262.531 L 226 262.397 L 226.133 262.397 L 226.133 262.264 L 226.267 262.264 L 226.267 262.131 L 226.4 262.131 L 226.4 261.997 L 226.533 261.997 L 226.533 261.864 L 226.8 261.864 L 226.8 261.731 L 226.933 261.731 L 226.933 261.597 L 227.067 261.597 L 227.067 261.464 L 227.2 261.464 L 227.2 261.331 L 227.467 261.331 L 227.467 261.197 L 227.6 261.197 L 227.6 261.064 L 227.733 261.064 L 227.733 260.931 L 227.867 260.931 L 227.867 260.797 L 228.133 260.797 L 228.133 260.664 L 228.267 260.664 L 228.267 260.531 L 228.4 260.531 L 228.4 260.397 L 228.533 260.397 L 228.533 260.264 L 228.667 260.264 L 228.667 260.131 L 228.933 260.131 L 228.933 259.997 L 229.067 259.997 L 229.067 259.864 L 229.2 259.864 L 229.2 259.731 L 229.333 259.731 L 229.333 259.597 L 229.6 259.597 L 229.6 259.464 L 229.733 259.464 L 229.733 259.331 L 229.867 259.331 L 229.867 259.197 L 230 259.197 L 230 259.064 L 230.133 259.064 L 230.133 258.931 L 230.267 258.931 L 230.267 258.797 L 230.533 258.797 L 230.533 258.664 L 230.667 258.664 L 230.667 258.531 L 230.8 258.531 L 230.8 258.397 L 230.933 258.397 L 230.933 258.264 L 231.067 258.264 L 231.067 258.131 L 231.2 258.131 L 231.2 257.997 L 231.333 257.997 L 231.333 257.864 L 231.467 257.864 L 231.467 257.731 L 231.6 257.731 L 231.6 257.597 L 231.867 257.597 L 231.867 257.464 L 232 257.464 L 232 257.331 L 232.133 257.331 L 232.133 257.197 L 232.267 257.197 L 232.267 257.064 L 232.4 257.064 L 232.4 256.931 L 232.533 256.931 L 232.533 256.797 L 232.667 256.797 L 232.667 256.664 L 232.8 256.664 L 232.8 256.531 L 232.933 256.531 L 232.933 256.397 L 233.2 256.397 L 233.2 256.264 L 233.333 256.264 L 233.333 256.131 L 233.467 256.131 L 233.467 255.997 L 233.6 255.997 L 233.6 255.864 L 233.733 255.864 L 233.733 255.731 L 233.867 255.731 L 233.867 255.597 L 234 255.597 L 234 255.464 L 234.133 255.464 L 234.133 255.331 L 234.267 255.331 L 234.267 255.197 L 234.4 255.197 L 234.4 255.064 L 234.667 255.064 L 234.667 254.931 L 234.8 254.931 L 234.8 254.797 L 234.933 254.797 L 234.933 254.664 L 235.067 254.664 L 235.067 254.531 L 235.2 254.531 L 235.2 254.397 L 235.333 254.397 L 235.333 254.264 L 235.467 254.264 L 235.467 254.131 L 235.6 254.131 L 235.6 253.997 L 235.733 253.997 L 235.733 253.864 L 235.867 253.864 L 235.867 253.731 L 236 253.731 L 236 253.597 L 236.133 253.597 L 236.133 253.464 L 236.267 253.464 L 236.267 253.331 L 236.4 253.331 L 236.4 253.197 L 236.533 253.197 L 236.533 253.064 L 236.667 253.064 L 236.667 252.931 L 236.8 252.931 L 236.8 252.797 L 236.933 252.797 L 236.933 252.664 L 237.067 252.664 L 237.067 252.531 L 237.2 252.531 L 237.2 252.397 L 237.333 252.397 L 237.333 252.264 L 237.467 252.264 L 237.467 252.131 L 237.6 252.131 L 237.6 251.997 L 237.733 251.997 L 237.733 251.864 L 237.867 251.864 L 237.867 251.731 L 238 251.731 L 238 251.597 L 238.133 251.597 L 238.133 251.464 L 238.267 251.464 L 238.267 251.331 L 238.4 251.331 L 238.4 251.197 L 238.533 251.197 L 238.533 251.064 L 238.667 251.064 L 238.667 250.931 L 238.8 250.931 L 238.8 250.797 L 238.933 250.797 L 238.933 250.664 L 239.067 250.664 L 239.067 250.531 L 239.2 250.531 L 239.2 250.397 L 239.333 250.397 L 239.333 250.131 L 239.467 250.131 L 239.467 249.997 L 239.6 249.997 L 239.6 249.864 L 239.733 249.864 L 239.733 249.731 L 239.867 249.731 L 239.867 249.597 L 240 249.597 L 240 249.464 L 240.133 249.464 L 240.133 249.331 L 240.267 249.331 L 240.267 249.197 L 240.4 249.197 L 240.4 249.064 L 240.533 249.064 L 240.533 248.931 L 240.667 248.931 L 240.667 248.664 L 240.8 248.664 L 240.8 248.531 L 240.933 248.531 L 240.933 248.397 L 241.067 248.397 L 241.067 248.264 L 241.2 248.264 L 241.2 248.131 L 241.333 248.131 L 241.333 247.997 L 241.467 247.997 L 241.467 247.864 L 241.6 247.864 L 241.6 247.731 L 241.733 247.731 L 241.733 247.597 L 241.867 247.597 L 241.867 247.464 L 242 247.464 L 242 247.197 L 242.133 247.197 L 242.133 247.064 L 242.267 247.064 L 242.267 246.931 L 242.4 246.931 L 242.4 246.797 L 242.533 246.797 L 242.533 246.664 L 242.667 246.664 L 242.667 246.531 L 242.8 246.531 L 242.8 246.397 L 242.933 246.397 L 242.933 246.131 L 243.067 246.131 L 243.067 245.997 L 243.2 245.997 L 243.2 245.864 L 243.333 245.864 L 243.333 245.731 L 243.467 245.731 L 243.467 245.597 L 243.6 245.597 L 243.6 245.331 L 243.733 245.331 L 243.733 245.197 L 243.867 245.197 L 243.867 245.064 L 244 245.064 L 244 244.931 L 244.133 244.931 L 244.133 244.797 L 244.267 244.797 L 244.267 244.531 L 244.4 244.531 L 244.4 244.397 L 244.533 244.397 L 244.533 244.264 L 244.667 244.264 L 244.667 244.131 L 244.8 244.131 L 244.8 243.997 L 244.933 243.997 L 244.933 243.731 L 245.067 243.731 L 245.067 243.597 L 245.2 243.597 L 245.2 243.464 L 245.333 243.464 L 245.333 243.331 L 245.467 243.331 L 245.467 243.064 L 245.6 243.064 L 245.6 242.931 L 245.733 242.931 L 245.733 242.797 L 245.867 242.797 L 245.867 242.664 L 246 242.664 L 246 242.531 L 246.133 242.531 L 246.133 242.264 L 246.267 242.264 L 246.267 242.131 L 246.4 242.131 L 246.4 241.997 L 246.533 241.997 L 246.533 241.864 L 246.667 241.864 L 246.667 241.597 L 246.8 241.597 L 246.8 241.464 L 246.933 241.464 L 246.933 241.331 L 247.067 241.331 L 247.067 241.064 L 247.2 241.064 L 247.2 240.931 L 247.333 240.931 L 247.333 240.797 L 247.467 240.797 L 247.467 240.531 L 247.6 240.531 L 247.6 240.397 L 247.733 240.397 L 247.733 240.264 L 247.867 240.264 L 247.867 239.997 L 248 239.997 L 248 239.864 L 248.133 239.864 L 248.133 239.731 L 248.267 239.731 L 248.267 239.464 L 248.4 239.464 L 248.4 239.331 L 248.533 239.331 L 248.533 239.197 L 248.667 239.197 L 248.667 238.931 L 248.8 238.931 L 248.8 238.797 L 248.933 238.797 L 248.933 238.664 L 249.067 238.664 L 249.067 238.397 L 249.2 238.397 L 249.2 238.264 L 249.333 238.264 L 249.333 238.131 L 249.467 238.131 L 249.467 237.864 L 249.6 237.864 L 249.6 237.731 L 249.733 237.731 L 249.733 237.597 L 249.867 237.597 L 249.867 237.331 L 250 237.331 L 250 237.197 L 250.133 237.197 L 250.133 237.064 L 250.267 237.064 L 250.267 236.797 L 250.4 236.797 L 250.4 236.664 L 250.533 236.664 L 250.533 236.397 L 250.667 236.397 L 250.667 236.264 L 250.8 236.264 L 250.8 235.997 L 250.933 235.997 L 250.933 235.864 L 251.067 235.864 L 251.067 235.597 L 251.2 235.597 L 251.2 235.464 L 251.333 235.464 L 251.333 235.197 L 251.467 235.197 L 251.467 235.064 L 251.6 235.064 L 251.6 234.797 L 251.733 234.797 L 251.733 234.664 L 251.867 234.664 L 251.867 234.397 L 252 234.397 L 252 234.264 L 252.133 234.264 L 252.133 233.997 L 252.267 233.997 L 252.267 233.864 L 252.4 233.864 L 252.4 233.597 L 252.533 233.597 L 252.533 233.464 L 252.667 233.464 L 252.667 233.331 L 252.8 233.331 L 252.8 233.064 L 252.933 233.064 L 252.933 232.931 L 253.067 232.931 L 253.067 232.664 L 253.2 232.664 L 253.2 232.531 L 253.333 232.531 L 253.333 232.264 L 253.467 232.264 L 253.467 232.131 L 253.6 232.131 L 253.6 231.864 L 253.733 231.864 L 253.733 231.597 L 253.867 231.597 L 253.867 231.464 L 254 231.464 L 254 231.197 L 254.133 231.197 L 254.133 230.931 L 254.267 230.931 L 254.267 230.797 L 254.4 230.797 L 254.4 230.531 L 254.533 230.531 L 254.533 230.264 L 254.667 230.264 L 254.667 230.131 L 254.8 230.131 L 254.8 229.864 L 254.933 229.864 L 254.933 229.731 L 255.067 229.731 L 255.067 229.464 L 255.2 229.464 L 255.2 229.197 L 255.333 229.197 L 255.333 229.064 L 255.467 229.064 L 255.467 228.797 L 255.6 228.797 L 255.6 228.531 L 255.733 228.531 L 255.733 228.397 L 255.867 228.397 L 255.867 228.131 L 256 228.131 L 256 227.864 L 256.133 227.864 L 256.133 227.731 L 256.267 227.731 L 256.267 227.464 L 256.4 227.464 L 256.4 227.197 L 256.533 227.197 L 256.533 227.064 L 256.667 227.064 L 256.667 226.797 L 256.8 226.797 L 256.8 226.531 L 256.933 226.531 L 256.933 226.264 L 257.067 226.264 L 257.067 226.131 L 257.2 226.131 L 257.2 225.864 L 257.333 225.864 L 257.333 225.597 L 257.467 225.597 L 257.467 225.331 L 257.6 225.331 L 257.6 225.064 L 257.733 225.064 L 257.733 224.797 L 257.867 224.797 L 257.867 224.664 L 258 224.664 L 258 224.397 L 258.133 224.397 L 258.133 224.131 L 258.267 224.131 L 258.267 223.864 L 258.4 223.864 L 258.4 223.597 L 258.533 223.597 L 258.533 223.331 L 258.667 223.331 L 258.667 223.197 L 258.8 223.197 L 258.8 222.931 L 258.933 222.931 L 258.933 222.664 L 259.067 222.664 L 259.067 222.397 L 259.2 222.397 L 259.2 222.131 L 259.333 222.131 L 259.333 221.864 L 259.467 221.864 L 259.467 221.597 L 259.6 221.597 L 259.6 221.464 L 259.733 221.464 L 259.733 221.064 L 259.867 221.064 L 259.867 220.797 L 260 220.797 L 260 220.531 L 260.133 220.531 L 260.133 220.264 L 260.267 220.264 L 260.267 219.997 L 260.4 219.997 L 260.4 219.731 L 260.533 219.731 L 260.533 219.464 L 260.667 219.464 L 260.667 219.197 L 260.8 219.197 L 260.8 218.931 L 260.933 218.931 L 260.933 218.664 L 261.067 218.664 L 261.067 218.397 L 261.2 218.397 L 261.2 218.131 L 261.333 218.131 L 261.333 217.864 L 261.467 217.864 L 261.467 217.597 L 261.6 217.597 L 261.6 217.331 L 261.733 217.331 L 261.733 216.931 L 261.867 216.931 L 261.867 216.664 L 262 216.664 L 262 216.397 L 262.133 216.397 L 262.133 216.131 L 262.267 216.131 L 262.267 215.864 L 262.4 215.864 L 262.4 215.597 L 262.533 215.597 L 262.533 215.197 L 262.667 215.197 L 262.667 214.931 L 262.8 214.931 L 262.8 214.664 L 262.933 214.664 L 262.933 214.264 L 263.067 214.264 L 263.067 213.997 L 263.2 213.997 L 263.2 213.731 L 263.333 213.731 L 263.333 213.331 L 263.467 213.331 L 263.467 213.064 L 263.6 213.064 L 263.6 212.797 L 263.733 212.797 L 263.733 212.397 L 263.867 212.397 L 263.867 212.131 L 264 212.131 L 264 211.864 L 264.133 211.864 L 264.133 211.464 L 264.267 211.464 L 264.267 211.197 L 264.4 211.197 L 264.4 210.797 L 264.533 210.797 L 264.533 210.531 L 264.667 210.531 L 264.667 210.264 L 264.8 210.264 L 264.8 209.864 L 264.933 209.864 L 264.933 209.464 L 265.067 209.464 L 265.067 209.197 L 265.2 209.197 L 265.2 208.797 L 265.333 208.797 L 265.333 208.397 L 265.467 208.397 L 265.467 208.131 L 265.6 208.131 L 265.6 207.731 L 265.733 207.731 L 265.733 207.331 L 265.867 207.331 L 265.867 206.931 L 266 206.931 L 266 206.664 L 266.133 206.664 L 266.133 206.264 L 266.267 206.264 L 266.267 205.864 L 266.4 205.864 L 266.4 205.597 L 266.533 205.597 L 266.533 205.197 L 266.667 205.197 L 266.667 204.797 L 266.8 204.797 L 266.8 204.531 L 266.933 204.531 L 266.933 204.131 L 267.067 204.131 L 267.067 203.597 L 267.2 203.597 L 267.2 203.197 L 267.333 203.197 L 267.333 202.797 L 267.467 202.797 L 267.467 202.397 L 267.6 202.397 L 267.6 201.997 L 267.733 201.997 L 267.733 201.597 L 267.867 201.597 L 267.867 201.064 L 268 201.064 L 268 200.664 L 268.133 200.664 L 268.133 200.264 L 268.267 200.264 L 268.267 199.864 L 268.4 199.864 L 268.4 199.464 L 268.533 199.464 L 268.533 199.064 L 268.667 199.064 L 268.667 198.664 L 268.8 198.664 L 268.8 198.131 L 268.933 198.131 L 268.933 197.597 L 269.067 197.597 L 269.067 197.197 L 269.2 197.197 L 269.2 196.664 L 269.333 196.664 L 269.333 196.131 L 269.467 196.131 L 269.467 195.597 L 269.6 195.597 L 269.6 195.197 L 269.733 195.197 L 269.733 194.664 L 269.867 194.664 L 269.867 194.131 L 270 194.131 L 270 193.597 L 270.133 193.597 L 270.133 193.064 L 270.267 193.064 L 270.267 192.664 L 270.4 192.664 L 270.4 192.131 L 270.533 192.131 L 270.533 191.464 L 270.667 191.464 L 270.667 190.931 L 270.8 190.931 L 270.8 190.264 L 270.933 190.264 L 270.933 189.597 L 271.067 189.597 L 271.067 189.064 L 271.2 189.064 L 271.2 188.397 L 271.333 188.397 L 271.333 187.731 L 271.467 187.731 L 271.467 187.197 L 271.6 187.197 L 271.6 186.531 L 271.733 186.531 L 271.733 185.864 L 271.867 185.864 L 271.867 185.064 L 272 185.064 L 272 184.264 L 272.133 184.264 L 272.133 183.464 L 272.267 183.464 L 272.267 182.664 L 272.4 182.664 L 272.4 181.864 L 272.533 181.864 L 272.533 181.064 L 272.667 181.064 L 272.667 180.264 L 272.8 180.264 L 272.8 179.464 L 272.933 179.464 L 272.933 178.397 L 273.067 178.397 L 273.067 177.197 L 273.2 177.197 L 273.2 176.131 L 273.333 176.131 L 273.333 174.931 L 273.467 174.931 L 273.467 173.864 L 273.6 173.864 L 273.6 172.531 L 273.733 172.531 L 273.733 170.664 L 273.867 170.664 L 273.867 168.797 L 274 168.797 L 274 166.931 L 274.133 166.931 L 274.133 163.197 L 274.267 163.197 L 274.267 156.397 L 274.133 156.397 L 274.133 152.664 L 274 152.664 L 274 150.797 L 273.867 150.797 L 273.867 148.797 L 273.733 148.797 L 273.733 146.931 L 273.6 146.931 L 273.6 145.597 L 273.467 145.597 L 273.467 144.531 L 273.333 144.531 L 273.333 143.331 L 273.2 143.331 L 273.2 142.264 L 273.067 142.264 L 273.067 141.064 L 272.933 141.064 L 272.933 139.997 L 272.8 139.997 L 272.8 139.197 L 272.667 139.197 L 272.667 138.397 L 272.533 138.397 L 272.533 137.464 L 272.4 137.464 L 272.4 136.664 L 272.267 136.664 L 272.267 135.864 L 272.133 135.864 L 272.133 135.064 L 272 135.064 L 272 134.264 L 271.867 134.264 L 271.867 133.464 L 271.733 133.464 L 271.733 132.931 L 271.6 132.931 L 271.6 132.264 L 271.467 132.264 L 271.467 131.597 L 271.333 131.597 L 271.333 131.064 L 271.2 131.064 L 271.2 130.397 L 271.067 130.397 L 271.067 129.731 L 270.933 129.731 L 270.933 129.064 L 270.8 129.064 L 270.8 128.531 L 270.667 128.531 L 270.667 127.864 L 270.533 127.864 L 270.533 127.197 L 270.4 127.197 L 270.4 126.797 L 270.267 126.797 L 270.267 126.264 L 270.133 126.264 L 270.133 125.731 L 270 125.731 L 270 125.197 L 269.867 125.197 L 269.867 124.664 L 269.733 124.664 L 269.733 124.264 L 269.6 124.264 L 269.6 123.731 L 269.467 123.731 L 269.467 123.197 L 269.333 123.197 L 269.333 122.664 L 269.2 122.664 L 269.2 122.131 L 269.067 122.131 L 269.067 121.731 L 268.933 121.731 L 268.933 121.197 L 268.8 121.197 L 268.8 120.797 L 268.667 120.797 L 268.667 120.264 L 268.533 120.264 L 268.533 119.864 L 268.4 119.864 L 268.4 119.464 L 268.267 119.464 L 268.267 119.064 L 268.133 119.064 L 268.133 118.664 L 268 118.664 L 268 118.131 L 267.867 118.131 L 267.867 117.731 L 267.733 117.731 L 267.733 117.331 L 267.6 117.331 L 267.6 116.931 L 267.467 116.931 L 267.467 116.531 L 267.333 116.531 L 267.333 115.997 L 267.2 115.997 L 267.2 115.597 L 267.067 115.597 L 267.067 115.197 L 266.933 115.197 L 266.933 114.797 L 266.8 114.797 L 266.8 114.531 L 266.667 114.531 L 266.667 114.131 L 266.533 114.131 L 266.533 113.731 L 266.4 113.731 L 266.4 113.331 L 266.267 113.331 L 266.267 113.064 L 266.133 113.064 L 266.133 112.664 L 266 112.664 L 266 112.264 L 265.867 112.264 L 265.867 111.864 L 265.733 111.864 L 265.733 111.597 L 265.6 111.597 L 265.6 111.197 L 265.467 111.197 L 265.467 110.797 L 265.333 110.797 L 265.333 110.531 L 265.2 110.531 L 265.2 110.131 L 265.067 110.131 L 265.067 109.731 L 264.933 109.731 L 264.933 109.331 L 264.8 109.331 L 264.8 109.064 L 264.667 109.064 L 264.667 108.797 L 264.533 108.797 L 264.533 108.397 L 264.4 108.397 L 264.4 108.131 L 264.267 108.131 L 264.267 107.731 L 264.133 107.731 L 264.133 107.464 L 264 107.464 L 264 107.197 L 263.867 107.197 L 263.867 106.797 L 263.733 106.797 L 263.733 106.531 L 263.6 106.531 L 263.6 106.264 L 263.467 106.264 L 263.467 105.864 L 263.333 105.864 L 263.333 105.597 L 263.2 105.597 L 263.2 105.197 L 263.067 105.197 L 263.067 104.931 L 262.933 104.931 L 262.933 104.664 L 262.8 104.664 L 262.8 104.264 L 262.667 104.264 L 262.667 103.997 L 262.533 103.997 L 262.533 103.731 L 262.4 103.731 L 262.4 103.331 L 262.267 103.331 L 262.267 103.064 L 262.133 103.064 L 262.133 102.797 L 262 102.797 L 262 102.531 L 261.867 102.531 L 261.867 102.264 L 261.733 102.264 L 261.733 101.997 L 261.6 101.997 L 261.6 101.731 L 261.467 101.731 L 261.467 101.464 L 261.333 101.464 L 261.333 101.197 L 261.2 101.197 L 261.2 100.931 L 261.067 100.931 L 261.067 100.531 L 260.933 100.531 L 260.933 100.264 L 260.8 100.264 L 260.8 99.997 L 260.667 99.997 L 260.667 99.731 L 260.533 99.731 L 260.533 99.464 L 260.4 99.464 L 260.4 99.197 L 260.267 99.197 L 260.267 98.931 L 260.133 98.931 L 260.133 98.664 L 260 98.664 L 260 98.397 L 259.867 98.397 L 259.867 98.131 L 259.733 98.131 L 259.733 97.864 L 259.6 97.864 L 259.6 97.597 L 259.467 97.597 L 259.467 97.331 L 259.333 97.331 L 259.333 97.064 L 259.2 97.064 L 259.2 96.797 L 259.067 96.797 L 259.067 96.531 L 258.933 96.531 L 258.933 96.397 L 258.8 96.397 L 258.8 96.131 L 258.667 96.131 L 258.667 95.864 L 258.533 95.864 L 258.533 95.597 L 258.4 95.597 L 258.4 95.331 L 258.267 95.331 L 258.267 95.064 L 258.133 95.064 L 258.133 94.797 L 258 94.797 L 258 94.664 L 257.867 94.664 L 257.867 94.397 L 257.733 94.397 L 257.733 94.131 L 257.6 94.131 L 257.6 93.864 L 257.467 93.864 L 257.467 93.597 L 257.333 93.597 L 257.333 93.331 L 257.2 93.331 L 257.2 93.064 L 257.067 93.064 L 257.067 92.931 L 256.933 92.931 L 256.933 92.664 L 256.8 92.664 L 256.8 92.397 L 256.667 92.397 L 256.667 92.131 L 256.533 92.131 L 256.533 91.997 L 256.4 91.997 L 256.4 91.731 L 256.267 91.731 L 256.267 91.464 L 256.133 91.464 L 256.133 91.331 L 256 91.331 L 256 91.064 L 255.867 91.064 L 255.867 90.797 L 255.733 90.797 L 255.733 90.664 L 255.6 90.664 L 255.6 90.397 L 255.467 90.397 L 255.467 90.131 L 255.333 90.131 L 255.333 89.997 L 255.2 89.997 L 255.2 89.731 L 255.067 89.731 L 255.067 89.464 L 254.933 89.464 L 254.933 89.331 L 254.8 89.331 L 254.8 89.064 L 254.667 89.064 L 254.667 88.797 L 254.533 88.797 L 254.533 88.664 L 254.4 88.664 L 254.4 88.397 L 254.267 88.397 L 254.267 88.264 L 254.133 88.264 L 254.133 87.997 L 254 87.997 L 254 87.731 L 253.867 87.731 L 253.867 87.597 L 253.733 87.597 L 253.733 87.331 L 253.6 87.331 L 253.6 87.064 L 253.467 87.064 L 253.467 86.931 L 253.333 86.931 L 253.333 86.664 L 253.2 86.664 L 253.2 86.531 L 253.067 86.531 L 253.067 86.264 L 252.933 86.264 L 252.933 86.131 L 252.8 86.131 L 252.8 85.864 L 252.667 85.864 L 252.667 85.731 L 252.533 85.731 L 252.533 85.464 L 252.4 85.464 L 252.4 85.331 L 252.267 85.331 L 252.267 85.197 L 252.133 85.197 L 252.133 84.931 L 252 84.931 L 252 84.797 L 251.867 84.797 L 251.867 84.531 L 251.733 84.531 L 251.733 84.397 L 251.6 84.397 L 251.6 84.131 L 251.467 84.131 L 251.467 83.997 L 251.333 83.997 L 251.333 83.731 L 251.2 83.731 L 251.2 83.597 L 251.067 83.597 L 251.067 83.331 L 250.933 83.331 L 250.933 83.197 L 250.8 83.197 L 250.8 82.931 L 250.667 82.931 L 250.667 82.797 L 250.533 82.797 L 250.533 82.531 L 250.4 82.531 L 250.4 82.397 L 250.267 82.397 L 250.267 82.131 L 250.133 82.131 L 250.133 81.997 L 250 81.997 L 250 81.864 L 249.867 81.864 L 249.867 81.597 L 249.733 81.597 L 249.733 81.464 L 249.6 81.464 L 249.6 81.331 L 249.467 81.331 L 249.467 81.064 L 249.333 81.064 L 249.333 80.931 L 249.2 80.931 L 249.2 80.797 L 249.067 80.797 L 249.067 80.531 L 248.933 80.531 L 248.933 80.397 L 248.8 80.397 L 248.8 80.131 L 248.667 80.131 L 248.667 79.997 L 248.533 79.997 L 248.533 79.864 L 248.4 79.864 L 248.4 79.597 L 248.267 79.597 L 248.267 79.464 L 248.133 79.464 L 248.133 79.331 L 248 79.331 L 248 79.064 L 247.867 79.064 L 247.867 78.931 L 247.733 78.931 L 247.733 78.797 L 247.6 78.797 L 247.6 78.531 L 247.467 78.531 L 247.467 78.397 L 247.333 78.397 L 247.333 78.264 L 247.2 78.264 L 247.2 77.997 L 247.067 77.997 L 247.067 77.864 L 246.933 77.864 L 246.933 77.731 L 246.8 77.731 L 246.8 77.464 L 246.667 77.464 L 246.667 77.331 L 246.533 77.331 L 246.533 77.197 L 246.4 77.197 L 246.4 77.064 L 246.267 77.064 L 246.267 76.797 L 246.133 76.797 L 246.133 76.664 L 246 76.664 L 246 76.531 L 245.867 76.531 L 245.867 76.397 L 245.733 76.397 L 245.733 76.264 L 245.6 76.264 L 245.6 75.997 L 245.467 75.997 L 245.467 75.864 L 245.333 75.864 L 245.333 75.731 L 245.2 75.731 L 245.2 75.597 L 245.067 75.597 L 245.067 75.464 L 244.933 75.464 L 244.933 75.197 L 244.8 75.197 L 244.8 75.064 L 244.667 75.064 L 244.667 74.931 L 244.533 74.931 L 244.533 74.797 L 244.4 74.797 L 244.4 74.531 L 244.267 74.531 L 244.267 74.397 L 244.133 74.397 L 244.133 74.264 L 244 74.264 L 244 74.131 L 243.867 74.131 L 243.867 73.997 L 243.733 73.997 L 243.733 73.731 L 243.6 73.731 L 243.6 73.597 L 243.467 73.597 L 243.467 73.464 L 243.333 73.464 L 243.333 73.331 L 243.2 73.331 L 243.2 73.197 L 243.067 73.197 L 243.067 72.931 L 242.933 72.931 L 242.933 72.797 L 242.8 72.797 L 242.8 72.664 L 242.667 72.664 L 242.667 72.531 L 242.533 72.531 L 242.533 72.397 L 242.4 72.397 L 242.4 72.264 L 242.267 72.264 L 242.267 71.997 L 242.133 71.997 L 242.133 71.864 L 242 71.864 L 242 71.731 L 241.867 71.731 L 241.867 71.597 L 241.733 71.597 L 241.733 71.464 L 241.6 71.464 L 241.6 71.331 L 241.467 71.331 L 241.467 71.197 L 241.333 71.197 L 241.333 71.064 L 241.2 71.064 L 241.2 70.931 L 241.067 70.931 L 241.067 70.664 L 240.933 70.664 L 240.933 70.531 L 240.8 70.531 L 240.8 70.397 L 240.667 70.397 L 240.667 70.264 L 240.533 70.264 L 240.533 70.131 L 240.4 70.131 L 240.4 69.997 L 240.267 69.997 L 240.267 69.864 L 240.133 69.864 L 240.133 69.731 L 240 69.731 L 240 69.597 L 239.867 69.597 L 239.867 69.331 L 239.733 69.331 L 239.733 69.197 L 239.6 69.197 L 239.6 69.064 L 239.467 69.064 L 239.467 68.931 L 239.333 68.931 L 239.333 68.797 L 239.2 68.797 L 239.2 68.664 L 239.067 68.664 L 239.067 68.531 L 238.933 68.531 L 238.933 68.397 L 238.8 68.397 L 238.8 68.264 L 238.667 68.264 L 238.667 68.131 L 238.533 68.131 L 238.533 67.997 L 238.4 67.997 L 238.4 67.864 L 238.267 67.864 L 238.267 67.731 L 238.133 67.731 L 238.133 67.597 L 238 67.597 L 238 67.464 L 237.867 67.464 L 237.867 67.331 L 237.733 67.331 L 237.733 67.197 L 237.6 67.197 L 237.6 67.064 L 237.467 67.064 L 237.467 66.931 L 237.333 66.931 L 237.333 66.797 L 237.2 66.797 L 237.2 66.664 L 237.067 66.664 L 237.067 66.531 L 236.933 66.531 L 236.933 66.397 L 236.8 66.397 L 236.8 66.264 L 236.667 66.264 L 236.667 66.131 L 236.533 66.131 L 236.533 65.997 L 236.4 65.997 L 236.4 65.864 L 236.267 65.864 L 236.267 65.731 L 236.133 65.731 L 236.133 65.597 L 236 65.597 L 236 65.464 L 235.867 65.464 L 235.867 65.331 L 235.733 65.331 L 235.733 65.197 L 235.6 65.197 L 235.6 65.064 L 235.467 65.064 L 235.467 64.931 L 235.333 64.931 L 235.333 64.797 L 235.2 64.797 L 235.2 64.664 L 235.067 64.664 L 235.067 64.531 L 234.933 64.531 L 234.933 64.397 L 234.8 64.397 L 234.8 64.264 L 234.667 64.264 L 234.667 64.131 L 234.533 64.131 L 234.533 63.997 L 234.267 63.997 L 234.267 63.864 L 234.133 63.864 L 234.133 63.731 L 234 63.731 L 234 63.597 L 233.867 63.597 L 233.867 63.464 L 233.733 63.464 L 233.733 63.331 L 233.6 63.331 L 233.6 63.197 L 233.467 63.197 L 233.467 63.064 L 233.333 63.064 L 233.333 62.931 L 233.2 62.931 L 233.2 62.797 L 232.933 62.797 L 232.933 62.664 L 232.8 62.664 L 232.8 62.531 L 232.667 62.531 L 232.667 62.397 L 232.533 62.397 L 232.533 62.264 L 232.4 62.264 L 232.4 62.131 L 232.267 62.131 L 232.267 61.997 L 232.133 61.997 L 232.133 61.864 L 232 61.864 L 232 61.731 L 231.867 61.731 L 231.867 61.597 L 231.6 61.597 L 231.6 61.464 L 231.467 61.464 L 231.467 61.331 L 231.333 61.331 L 231.333 61.197 L 231.2 61.197 L 231.2 61.064 L 231.067 61.064 L 231.067 60.931 L 230.933 60.931 L 230.933 60.797 L 230.8 60.797 L 230.8 60.664 L 230.667 60.664 L 230.667 60.531 L 230.533 60.531 L 230.533 60.397 L 230.267 60.397 L 230.267 60.264 L 230.133 60.264 L 230.133 60.131 L 230 60.131 L 230 59.997 L 229.867 59.997 L 229.867 59.864 L 229.733 59.864 L 229.733 59.731 L 229.467 59.731 L 229.467 59.597 L 229.333 59.597 L 229.333 59.464 L 229.2 59.464 L 229.2 59.331 L 229.067 59.331 L 229.067 59.197 L 228.8 59.197 L 228.8 59.064 L 228.667 59.064 L 228.667 58.931 L 228.533 58.931 L 228.533 58.797 L 228.4 58.797 L 228.4 58.664 L 228.133 58.664 L 228.133 58.531 L 228 58.531 L 228 58.397 L 227.867 58.397 L 227.867 58.264 L 227.733 58.264 L 227.733 58.131 L 227.6 58.131 L 227.6 57.997 L 227.333 57.997 L 227.333 57.864 L 227.2 57.864 L 227.2 57.731 L 227.067 57.731 L 227.067 57.597 L 226.933 57.597 L 226.933 57.464 L 226.667 57.464 L 226.667 57.331 L 226.533 57.331 L 226.533 57.197 L 226.4 57.197 L 226.4 57.064 L 226.267 57.064 L 226.267 56.931 L 226 56.931 L 226 56.797 L 225.867 56.797 L 225.867 56.664 L 225.733 56.664 L 225.733 56.531 L 225.6 56.531 L 225.6 56.397 L 225.333 56.397 L 225.333 56.264 L 225.2 56.264 L 225.2 56.131 L 225.067 56.131 L 225.067 55.997 L 224.8 55.997 L 224.8 55.864 L 224.667 55.864 L 224.667 55.731 L 224.4 55.731 L 224.4 55.597 L 224.267 55.597 L 224.267 55.464 L 224.133 55.464 L 224.133 55.331 L 223.867 55.331 L 223.867 55.197 L 223.733 55.197 L 223.733 55.064 L 223.6 55.064 L 223.6 54.931 L 223.333 54.931 L 223.333 54.797 L 223.2 54.797 L 223.2 54.664 L 223.067 54.664 L 223.067 54.531 L 222.8 54.531 L 222.8 54.397 L 222.667 54.397 L 222.667 54.264 L 222.4 54.264 L 222.4 54.131 L 222.267 54.131 L 222.267 53.997 L 222.133 53.997 L 222.133 53.864 L 221.867 53.864 L 221.867 53.731 L 221.733 53.731 L 221.733 53.597 L 221.6 53.597 L 221.6 53.464 L 221.333 53.464 L 221.333 53.331 L 221.2 53.331 L 221.2 53.197 L 221.067 53.197 L 221.067 53.064 L 220.8 53.064 L 220.8 52.931 L 220.667 52.931 L 220.667 52.797 L 220.4 52.797 L 220.4 52.664 L 220.267 52.664 L 220.267 52.531 L 220 52.531 L 220 52.397 L 219.733 52.397 L 219.733 52.264 L 219.6 52.264 L 219.6 52.131 L 219.333 52.131 L 219.333 51.997 L 219.2 51.997 L 219.2 51.864 L 218.933 51.864 L 218.933 51.731 L 218.8 51.731 L 218.8 51.597 L 218.533 51.597 L 218.533 51.464 L 218.4 51.464 L 218.4 51.331 L 218.133 51.331 L 218.133 51.197 L 218 51.197 L 218 51.064 L 217.733 51.064 L 217.733 50.931 L 217.6 50.931 L 217.6 50.797 L 217.333 50.797 L 217.333 50.664 L 217.2 50.664 L 217.2 50.531 L 216.933 50.531 L 216.933 50.397 L 216.8 50.397 L 216.8 50.264 L 216.533 50.264 L 216.533 50.131 L 216.4 50.131 L 216.4 49.997 L 216.133 49.997 L 216.133 49.864 L 215.867 49.864 L 215.867 49.731 L 215.733 49.731 L 215.733 49.597 L 215.467 49.597 L 215.467 49.464 L 215.2 49.464 L 215.2 49.331 L 215.067 49.331 L 215.067 49.197 L 214.8 49.197 L 214.8 49.064 L 214.533 49.064 L 214.533 48.931 L 214.4 48.931 L 214.4 48.797 L 214.133 48.797 L 214.133 48.664 L 213.867 48.664 L 213.867 48.531 L 213.733 48.531 L 213.733 48.397 L 213.467 48.397 L 213.467 48.264 L 213.2 48.264 L 213.2 48.131 L 212.933 48.131 L 212.933 47.997 L 212.8 47.997 L 212.8 47.864 L 212.533 47.864 L 212.533 47.731 L 212.267 47.731 L 212.267 47.597 L 212.133 47.597 L 212.133 47.464 L 211.867 47.464 L 211.867 47.331 L 211.6 47.331 L 211.6 47.197 L 211.467 47.197 L 211.467 47.064 L 211.2 47.064 L 211.2 46.931 L 210.933 46.931 L 210.933 46.797 L 210.667 46.797 L 210.667 46.664 L 210.4 46.664 L 210.4 46.531 L 210.133 46.531 L 210.133 46.397 L 209.867 46.397 L 209.867 46.264 L 209.733 46.264 L 209.733 46.131 L 209.467 46.131 L 209.467 45.997 L 209.2 45.997 L 209.2 45.864 L 208.933 45.864 L 208.933 45.731 L 208.667 45.731 L 208.667 45.597 L 208.4 45.597 L 208.4 45.464 L 208.133 45.464 L 208.133 45.331 L 207.867 45.331 L 207.867 45.197 L 207.6 45.197 L 207.6 45.064 L 207.333 45.064 L 207.333 44.931 L 207.067 44.931 L 207.067 44.797 L 206.8 44.797 L 206.8 44.664 L 206.667 44.664 L 206.667 44.531 L 206.4 44.531 L 206.4 44.397 L 206.133 44.397 L 206.133 44.264 L 205.867 44.264 L 205.867 44.131 L 205.6 44.131 L 205.6 43.997 L 205.333 43.997 L 205.333 43.864 L 204.933 43.864 L 204.933 43.731 L 204.667 43.731 L 204.667 43.597 L 204.4 43.597 L 204.4 43.464 L 204.133 43.464 L 204.133 43.331 L 203.867 43.331 L 203.867 43.197 L 203.467 43.197 L 203.467 43.064 L 203.2 43.064 L 203.2 42.931 L 202.933 42.931 L 202.933 42.797 L 202.667 42.797 L 202.667 42.664 L 202.4 42.664 L 202.4 42.531 L 202.133 42.531 L 202.133 42.397 L 201.733 42.397 L 201.733 42.264 L 201.467 42.264 L 201.467 42.131 L 201.2 42.131 L 201.2 41.997 L 200.933 41.997 L 200.933 41.864 L 200.667 41.864 L 200.667 41.731 L 200.267 41.731 L 200.267 41.597 L 200 41.597 L 200 41.464 L 199.6 41.464 L 199.6 41.331 L 199.333 41.331 L 199.333 41.197 L 198.933 41.197 L 198.933 41.064 L 198.667 41.064 L 198.667 40.931 L 198.267 40.931 L 198.267 40.797 L 198 40.797 L 198 40.664 L 197.6 40.664 L 197.6 40.531 L 197.333 40.531 L 197.333 40.397 L 196.933 40.397 L 196.933 40.264 L 196.667 40.264 L 196.667 40.131 L 196.267 40.131 L 196.267 39.997 L 196 39.997 L 196 39.864 L 195.6 39.864 L 195.6 39.731 L 195.333 39.731 L 195.333 39.597 L 194.933 39.597 L 194.933 39.464 L 194.667 39.464 L 194.667 39.331 L 194.267 39.331 L 194.267 39.197 L 193.867 39.197 L 193.867 39.064 L 193.467 39.064 L 193.467 38.931 L 193.067 38.931 L 193.067 38.797 L 192.667 38.797 L 192.667 38.664 L 192.267 38.664 L 192.267 38.531 L 191.867 38.531 L 191.867 38.397 L 191.467 38.397 L 191.467 38.264 L 191.067 38.264 L 191.067 38.131 L 190.667 38.131 L 190.667 37.997 L 190.4 37.997 L 190.4 37.864 L 190 37.864 L 190 37.731 L 189.6 37.731 L 189.6 37.597 L 189.2 37.597 L 189.2 37.464 L 188.667 37.464 L 188.667 37.331 L 188.267 37.331 L 188.267 37.197 L 187.733 37.197 L 187.733 37.064 L 187.333 37.064 L 187.333 36.931 L 186.8 36.931 L 186.8 36.797 L 186.4 36.797 L 186.4 36.664 L 185.867 36.664 L 185.867 36.531 L 185.467 36.531 L 185.467 36.397 L 184.933 36.397 L 184.933 36.264 L 184.533 36.264 L 184.533 36.131 L 184 36.131 L 184 35.997 L 183.6 35.997 L 183.6 35.864 L 183.067 35.864 L 183.067 35.731 L 182.533 35.731 L 182.533 35.597 L 181.867 35.597 L 181.867 35.464 L 181.333 35.464 L 181.333 35.331 L 180.8 35.331 L 180.8 35.197 L 180.133 35.197 L 180.133 35.064 L 179.6 35.064 L 179.6 34.931 L 179.067 34.931 L 179.067 34.797 L 178.4 34.797 L 178.4 34.664 L 177.867 34.664 L 177.867 34.531 L 177.333 34.531 L 177.333 34.397 L 176.533 34.397 L 176.533 34.264 L 175.733 34.264 L 175.733 34.131 L 175.067 34.131 L 175.067 33.997 L 174.267 33.997 L 174.267 33.864 L 173.467 33.864 L 173.467 33.731 L 172.8 33.731 L 172.8 33.597 L 172 33.597 L 172 33.464 L 171.333 33.464 L 171.333 33.331 L 170.267 33.331 L 170.267 33.197 L 169.2 33.197 L 169.2 33.064 L 168.133 33.064 L 168.133 32.931 L 167.067 32.931 L 167.067 32.797 L 166 32.797 L 166 32.664 L 164.933 32.664 L 164.933 32.531 L 163.333 32.531 L 163.333 32.397 L 161.467 32.397 L 161.467 32.264 L 159.733 32.264 L 159.733 32.131 L 157.333 32.131 L 157.333 31.997 L 147.467 31.997 L 147.467 32.131 L 144.667 32.131 L 144.667 32.264 L 143.333 32.264 L 143.333 32.397 L 141.867 32.397 L 141.867 32.531 L 140.533 32.531 L 140.533 32.664 L 139.2 32.664 L 139.2 32.797 L 137.867 32.797 L 137.867 32.931 L 136.933 32.931 L 136.933 33.064 L 136.133 33.064 L 136.133 33.197 L 135.333 33.197 L 135.333 33.331 L 134.533 33.331 L 134.533 33.464 L 133.6 33.464 L 133.6 33.597 L 132.8 33.597 L 132.8 33.731 L 132 33.731 L 132 33.864 L 131.2 33.864 L 131.2 33.997 L 130.533 33.997 L 130.533 34.131 L 129.867 34.131 L 129.867 34.264 L 129.333 34.264 L 129.333 34.397 L 128.667 34.397 L 128.667 34.531 L 128.133 34.531 L 128.133 34.664 L 127.6 34.664 L 127.6 34.797 L 126.933 34.797 L 126.933 34.931 L 126.4 34.931 L 126.4 35.064 L 125.867 35.064 L 125.867 35.197 L 125.2 35.197 L 125.2 35.331 L 124.667 35.331 L 124.667 35.464 L 124.133 35.464 L 124.133 35.597 L 123.6 35.597 L 123.6 35.731 L 123.067 35.731 L 123.067 35.864 L 122.667 35.864 L 122.667 35.997 L 122.267 35.997 L 122.267 36.131 L 121.733 36.131 L 121.733 36.264 L 121.333 36.264 L 121.333 36.397 L 120.8 36.397 L 120.8 36.531 L 120.4 36.531 L 120.4 36.664 L 120 36.664 L 120 36.797 L 119.467 36.797 L 119.467 36.931 L 119.067 36.931 L 119.067 37.064 L 118.667 37.064 L 118.667 37.197 L 118.133 37.197 L 118.133 37.331 L 117.733 37.331 L 117.733 37.464 L 117.2 37.464 L 117.2 37.597 L 116.933 37.597 L 116.933 37.731 L 116.533 37.731 L 116.533 37.864 L 116.133 37.864 L 116.133 37.997 L 115.733 37.997 L 115.733 38.131 L 115.467 38.131 L 115.467 38.264 L 115.067 38.264 L 115.067 38.397 L 114.667 38.397 L 114.667 38.531 L 114.267 38.531 L 114.267 38.664 L 114 38.664 L 114 38.797 L 113.6 38.797 L 113.6 38.931 L 113.2 38.931 L 113.2 39.064 L 112.8 39.064 L 112.8 39.197 L 112.533 39.197 L 112.533 39.331 L 112.133 39.331 L 112.133 39.464 L 111.733 39.464 L 111.733 39.597 L 111.467 39.597 L 111.467 39.731 L 111.067 39.731 L 111.067 39.864 L 110.667 39.864 L 110.667 39.997 L 110.4 39.997 L 110.4 40.131 L 110 40.131 L 110 40.264 L 109.733 40.264 L 109.733 40.397 L 109.467 40.397 L 109.467 40.531 L 109.2 40.531 L 109.2 40.664 L 108.8 40.664 L 108.8 40.797 L 108.533 40.797 L 108.533 40.931 L 108.267 40.931 L 108.267 41.064 L 107.867 41.064 L 107.867 41.197 L 107.6 41.197 L 107.6 41.331 L 107.333 41.331 L 107.333 41.464 L 107.067 41.464 L 107.067 41.597 L 106.667 41.597 L 106.667 41.731 L 106.4 41.731 L 106.4 41.864 L 106.133 41.864 L 106.133 41.997 L 105.733 41.997 L 105.733 42.131 L 105.467 42.131 L 105.467 42.264 L 105.2 42.264 L 105.2 42.397 L 104.933 42.397 L 104.933 42.531 L 104.533 42.531 L 104.533 42.664 L 104.267 42.664 L 104.267 42.797 L 104 42.797 L 104 42.931 L 103.733 42.931 L 103.733 43.064 L 103.467 43.064 L 103.467 43.197 L 103.2 43.197 L 103.2 43.331 L 102.933 43.331 L 102.933 43.464 L 102.667 43.464 L 102.667 43.597 L 102.4 43.597 L 102.4 43.731 L 102.133 43.731 L 102.133 43.864 L 101.867 43.864 L 101.867 43.997 L 101.6 43.997 L 101.6 44.131 L 101.333 44.131 L 101.333 44.264 L 101.067 44.264 L 101.067 44.397 L 100.8 44.397 L 100.8 44.531 L 100.533 44.531 L 100.533 44.664 L 100.267 44.664 L 100.267 44.797 L 100 44.797 L 100 44.931 L 99.733 44.931 L 99.733 45.064 L 99.467 45.064 L 99.467 45.197 L 99.333 45.197 L 99.333 45.331 L 99.067 45.331 L 99.067 45.464 L 98.8 45.464 L 98.8 45.597 L 98.533 45.597 L 98.533 45.731 L 98.267 45.731 L 98.267 45.864 L 98.133 45.864 L 98.133 45.997 L 97.867 45.997 L 97.867 46.131 L 97.6 46.131 L 97.6 46.264 L 97.333 46.264 L 97.333 46.397 L 97.067 46.397 L 97.067 46.531 L 96.8 46.531 L 96.8 46.664 L 96.667 46.664 L 96.667 46.797 L 96.4 46.797 L 96.4 46.931 L 96.133 46.931 L 96.133 47.064 L 96 47.064 L 96 47.197 L 95.733 47.197 L 95.733 47.331 L 95.467 47.331 L 95.467 47.464 L 95.333 47.464 L 95.333 47.597 L 95.067 47.597 L 95.067 47.731 L 94.8 47.731 L 94.8 47.864 L 94.667 47.864 L 94.667 47.997 L 94.4 47.997 L 94.4 48.131 L 94.133 48.131 L 94.133 48.264 L 94 48.264 L 94 48.397 L 93.733 48.397 L 93.733 48.531 L 93.467 48.531 L 93.467 48.664 L 93.333 48.664 L 93.333 48.797 L 93.067 48.797 L 93.067 48.931 L 92.8 48.931 L 92.8 49.064 L 92.667 49.064 L 92.667 49.197 L 92.4 49.197 L 92.4 49.331 L 92.133 49.331 L 92.133 49.464 L 92 49.464 L 92 49.597 L 91.733 49.597 L 91.733 49.731 L 91.6 49.731 L 91.6 49.864 L 91.333 49.864 L 91.333 49.997 L 91.2 49.997 L 91.2 50.131 L 90.933 50.131 L 90.933 50.264 L 90.8 50.264 L 90.8 50.397 L 90.533 50.397 L 90.533 50.531 L 90.4 50.531 L 90.4 50.664 L 90.133 50.664 L 90.133 50.797 L 90 50.797 L 90 50.931 L 89.733 50.931 L 89.733 51.064 L 89.6 51.064 L 89.6 51.197 L 89.333 51.197 L 89.333 51.331 L 89.2 51.331 L 89.2 51.464 L 89.067 51.464 L 89.067 51.597 L 88.8 51.597 L 88.8 51.731 L 88.667 51.731 L 88.667 51.864 L 88.4 51.864 L 88.4 51.997 L 88.267 51.997 L 88.267 52.131 L 88 52.131 L 88 52.264 L 87.867 52.264 L 87.867 52.397 L 87.6 52.397 L 87.6 52.531 L 87.467 52.531 L 87.467 52.664 L 87.2 52.664 L 87.2 52.797 L 87.067 52.797 L 87.067 52.931 L 86.8 52.931 L 86.8 53.064 L 86.667 53.064 L 86.667 53.197 L 86.4 53.197 L 86.4 53.331 L 86.267 53.331 L 86.267 53.464 L 86.133 53.464 L 86.133 53.597 L 86 53.597 L 86 53.731 L 85.733 53.731 L 85.733 53.864 L 85.6 53.864 L 85.6 53.997 L 85.467 53.997 L 85.467 54.131 L 85.2 54.131 L 85.2 54.264 L 85.067 54.264 L 85.067 54.397 L 84.933 54.397 L 84.933 54.531 L 84.667 54.531 L 84.667 54.664 L 84.533 54.664 L 84.533 54.797 L 84.4 54.797 L 84.4 54.931 L 84.133 54.931 L 84.133 55.064 L 84 55.064 L 84 55.197 L 83.867 55.197 L 83.867 55.331 L 83.6 55.331 L 83.6 55.464 L 83.467 55.464 L 83.467 55.597 L 83.333 55.597 L 83.333 55.731 L 83.067 55.731 L 83.067 55.864 L 82.933 55.864 L 82.933 55.997 L 82.8 55.997 L 82.8 56.131 L 82.667 56.131 L 82.667 56.264 L 82.4 56.264 L 82.4 56.397 L 82.267 56.397 L 82.267 56.531 L 82.133 56.531 L 82.133 56.664 L 81.867 56.664 L 81.867 56.797 L 81.733 56.797 L 81.733 56.931 L 81.6 56.931 L 81.6 57.064 L 81.333 57.064 L 81.333 57.197 L 81.2 57.197 L 81.2 57.331 L 81.067 57.331 L 81.067 57.464 L 80.933 57.464 L 80.933 57.597 L 80.8 57.597 L 80.8 57.731 L 80.667 57.731 L 80.667 57.864 L 80.4 57.864 L 80.4 57.997 L 80.267 57.997 L 80.267 58.131 L 80.133 58.131 L 80.133 58.264 L 80 58.264 L 80 58.397 L 79.867 58.397 L 79.867 58.531 L 79.733 58.531 L 79.733 58.664 L 79.6 58.664 L 79.6 58.797 L 79.333 58.797 L 79.333 58.931 L 79.2 58.931 L 79.2 59.064 L 79.067 59.064 L 79.067 59.197 L 78.933 59.197 L 78.933 59.331 L 78.8 59.331 L 78.8 59.464 L 78.667 59.464 L 78.667 59.597 L 78.4 59.597 L 78.4 59.731 L 78.267 59.731 L 78.267 59.864 L 78.133 59.864 L 78.133 59.997 L 78 59.997 L 78 60.131 L 77.867 60.131 L 77.867 60.264 L 77.733 60.264 L 77.733 60.397 L 77.467 60.397 L 77.467 60.531 L 77.333 60.531 L 77.333 60.664 L 77.2 60.664 L 77.2 60.797 L 77.067 60.797 L 77.067 60.931 L 76.933 60.931 L 76.933 61.064 L 76.8 61.064 L 76.8 61.197 L 76.533 61.197 L 76.533 61.331 L 76.4 61.331 L 76.4 61.464 L 76.267 61.464 L 76.267 61.597 L 76.133 61.597 L 76.133 61.731 L 76 61.731 L 76 61.864 L 75.867 61.864 L 75.867 61.997 L 75.733 61.997 L 75.733 62.131 L 75.6 62.131 L 75.6 62.264 L 75.467 62.264 L 75.467 62.397 L 75.333 62.397 L 75.333 62.531 L 75.2 62.531 L 75.2 62.664 L 75.067 62.664 L 75.067 62.797 L 74.933 62.797 L 74.933 62.931 L 74.8 62.931 L 74.8 63.064 L 74.667 63.064 L 74.667 63.197 L 74.533 63.197 L 74.533 63.331 L 74.4 63.331 L 74.4 63.464 L 74.267 63.464 L 74.267 63.597 L 74.133 63.597 L 74.133 63.731 L 74 63.731 L 74 63.864 L 73.867 63.864 L 73.867 63.997 L 73.733 63.997 L 73.733 64.131 L 73.6 64.131 L 73.6 64.264 L 73.467 64.264 L 73.467 64.397 L 73.333 64.397 L 73.333 64.531 L 73.2 64.531 L 73.2 64.664 L 73.067 64.664 L 73.067 64.797 L 72.933 64.797 L 72.933 64.931 L 72.8 64.931 L 72.8 65.064 L 72.667 65.064 L 72.667 65.197 L 72.533 65.197 L 72.533 65.331 L 72.4 65.331 L 72.4 65.464 L 72.267 65.464 L 72.267 65.597 L 72.133 65.597 L 72.133 65.731 L 71.867 65.731 L 71.867 65.864 L 71.733 65.864 L 71.733 65.997 L 71.6 65.997 L 71.6 66.264 L 71.467 66.264 L 71.467 66.397 L 71.333 66.397 L 71.333 66.531 L 71.2 66.531 L 71.2 66.664 L 71.067 66.664 L 71.067 66.797 L 70.933 66.797 L 70.933 66.931 L 70.8 66.931 L 70.8 67.064 L 70.667 67.064 L 70.667 67.197 L 70.533 67.197 L 70.533 67.331 L 70.4 67.331 L 70.4 67.597 L 70.267 67.597 L 70.267 67.731 L 70.133 67.731 L 70.133 67.864 L 70 67.864 L 70 67.997 L 69.867 67.997 L 69.867 68.131 L 69.733 68.131 L 69.733 68.264 L 69.6 68.264 L 69.6 68.397 L 69.467 68.397 L 69.467 68.531 L 69.333 68.531 L 69.333 68.664 L 69.2 68.664 L 69.2 68.797 L 69.067 68.797 L 69.067 69.064 L 68.933 69.064 L 68.933 69.197 L 68.8 69.197 L 68.8 69.331 L 68.667 69.331 L 68.667 69.464 L 68.533 69.464 L 68.533 69.597 L 68.4 69.597 L 68.4 69.731 L 68.267 69.731 L 68.267 69.864 L 68.133 69.864 L 68.133 69.997 L 68 69.997 L 68 70.131 L 67.867 70.131 L 67.867 70.397 L 67.733 70.397 L 67.733 70.531 L 67.6 70.531 L 67.6 70.664 L 67.467 70.664 L 67.467 70.797 L 67.333 70.797 L 67.333 70.931 L 67.2 70.931 L 67.2 71.064 L 67.067 71.064 L 67.067 71.331 L 66.933 71.331 L 66.933 71.464 L 66.8 71.464 L 66.8 71.597 L 66.667 71.597 L 66.667 71.731 L 66.533 71.731 L 66.533 71.997 L 66.4 71.997 L 66.4 72.131 L 66.267 72.131 L 66.267 72.264 L 66.133 72.264 L 66.133 72.397 L 66 72.397 L 66 72.664 L 65.867 72.664 L 65.867 72.797 L 65.733 72.797 L 65.733 72.931 L 65.6 72.931 L 65.6 73.064 L 65.467 73.064 L 65.467 73.331 L 65.333 73.331 L 65.333 73.464 L 65.2 73.464 L 65.2 73.597 L 65.067 73.597 L 65.067 73.731 L 64.933 73.731 L 64.933 73.997 L 64.8 73.997 L 64.8 74.131 L 64.667 74.131 L 64.667 74.264 L 64.533 74.264 L 64.533 74.397 L 64.4 74.397 L 64.4 74.664 L 64.267 74.664 L 64.267 74.797 L 64.133 74.797 L 64.133 74.931 L 64 74.931 L 64 75.064 L 63.867 75.064 L 63.867 75.331 L 63.733 75.331 L 63.733 75.464 L 63.6 75.464 L 63.6 75.597 L 63.467 75.597 L 63.467 75.731 L 63.333 75.731 L 63.333 75.997 L 63.2 75.997 L 63.2 76.131 L 63.067 76.131 L 63.067 76.397 L 62.933 76.397 L 62.933 76.531 L 62.8 76.531 L 62.8 76.664 L 62.667 76.664 L 62.667 76.931 L 62.533 76.931 L 62.533 77.064 L 62.4 77.064 L 62.4 77.331 L 62.267 77.331 L 62.267 77.464 L 62.133 77.464 L 62.133 77.597 L 62 77.597 L 62 77.864 L 61.867 77.864 L 61.867 77.997 L 61.733 77.997 L 61.733 78.264 L 61.6 78.264 L 61.6 78.397 L 61.467 78.397 L 61.467 78.531 L 61.333 78.531 L 61.333 78.797 L 61.2 78.797 L 61.2 78.931 L 61.067 78.931 L 61.067 79.197 L 60.933 79.197 L 60.933 79.331 L 60.8 79.331 L 60.8 79.464 L 60.667 79.464 L 60.667 79.731 L 60.533 79.731 L 60.533 79.864 L 60.4 79.864 L 60.4 80.131 L 60.267 80.131 L 60.267 80.264 L 60.133 80.264 L 60.133 80.531 L 60 80.531 L 60 80.664 L 59.867 80.664 L 59.867 80.931 L 59.733 80.931 L 59.733 81.197 L 59.6 81.197 L 59.6 81.331 L 59.467 81.331 L 59.467 81.597 L 59.333 81.597 L 59.333 81.731 L 59.2 81.731 L 59.2 81.997 L 59.067 81.997 L 59.067 82.131 L 58.933 82.131 L 58.933 82.397 L 58.8 82.397 L 58.8 82.531 L 58.667 82.531 L 58.667 82.797 L 58.533 82.797 L 58.533 83.064 L 58.4 83.064 L 58.4 83.197 L 58.267 83.197 L 58.267 83.464 L 58.133 83.464 L 58.133 83.731 L 58 83.731 L 58 83.864 L 57.867 83.864 L 57.867 84.131 L 57.733 84.131 L 57.733 84.397 L 57.6 84.397 L 57.6 84.531 L 57.467 84.531 L 57.467 84.797 L 57.333 84.797 L 57.333 85.064 L 57.2 85.064 L 57.2 85.197 L 57.067 85.197 L 57.067 85.464 L 56.933 85.464 L 56.933 85.731 L 56.8 85.731 L 56.8 85.997 L 56.667 85.997 L 56.667 86.131 L 56.533 86.131 L 56.533 86.397 L 56.4 86.397 L 56.4 86.664 L 56.267 86.664 L 56.267 86.931 L 56.133 86.931 L 56.133 87.197 L 56 87.197 L 56 87.331 L 55.867 87.331 L 55.867 87.597 L 55.733 87.597 L 55.733 87.864 L 55.6 87.864 L 55.6 88.131 L 55.467 88.131 L 55.467 88.264 L 55.333 88.264 L 55.333 88.531 L 55.2 88.531 L 55.2 88.797 L 55.067 88.797 L 55.067 89.064 L 54.933 89.064 L 54.933 89.331 L 54.8 89.331 L 54.8 89.597 L 54.667 89.597 L 54.667 89.864 L 54.533 89.864 L 54.533 90.131 L 54.4 90.131 L 54.4 90.397 L 54.267 90.397 L 54.267 90.664 L 54.133 90.664 L 54.133 90.931 L 54 90.931 L 54 91.197 L 53.867 91.197 L 53.867 91.464 L 53.733 91.464 L 53.733 91.731 L 53.6 91.731 L 53.6 91.997 L 53.467 91.997 L 53.467 92.264 L 53.333 92.264 L 53.333 92.531 L 53.2 92.531 L 53.2 92.931 L 53.067 92.931 L 53.067 93.197 L 52.933 93.197 L 52.933 93.464 L 52.8 93.464 L 52.8 93.731 L 52.667 93.731 L 52.667 93.997 L 52.533 93.997 L 52.533 94.397 L 52.4 94.397 L 52.4 94.664 L 52.267 94.664 L 52.267 94.931 L 52.133 94.931 L 52.133 95.197 L 52 95.197 L 52 95.597 L 51.867 95.597 L 51.867 95.864 L 51.733 95.864 L 51.733 96.131 L 51.6 96.131 L 51.6 96.531 L 51.467 96.531 L 51.467 96.797 L 51.333 96.797 L 51.333 97.197 L 51.2 97.197 L 51.2 97.464 L 51.067 97.464 L 51.067 97.864 L 50.933 97.864 L 50.933 98.131 L 50.8 98.131 L 50.8 98.531 L 50.667 98.531 L 50.667 98.797 L 50.533 98.797 L 50.533 99.197 L 50.4 99.197 L 50.4 99.597 L 50.267 99.597 L 50.267 99.864 L 50.133 99.864 L 50.133 100.264 L 50 100.264 L 50 100.664 L 49.867 100.664 L 49.867 101.064 L 49.733 101.064 L 49.733 101.464 L 49.6 101.464 L 49.6 101.864 L 49.467 101.864 L 49.467 102.264 L 49.333 102.264 L 49.333 102.664 L 49.2 102.664 L 49.2 103.064 L 49.067 103.064 L 49.067 103.464 L 48.933 103.464 L 48.933 103.864 L 48.8 103.864 L 48.8 104.264 L 48.667 104.264 L 48.667 104.797 L 48.533 104.797 L 48.533 105.197 L 48.4 105.197 L 48.4 105.597 L 48.267 105.597 L 48.267 106.131 L 48.133 106.131 L 48.133 106.531 L 48 106.531 L 48 107.064 L 47.867 107.064 L 47.867 107.464 L 47.733 107.464 L 47.733 107.997 L 47.6 107.997 L 47.6 108.531 L 47.467 108.531 L 47.467 109.064 L 47.333 109.064 L 47.333 109.731 L 47.2 109.731 L 47.2 110.264 L 47.067 110.264 L 47.067 110.797 L 46.933 110.797 L 46.933 111.464 L 46.8 111.464 L 46.8 111.731 L 46.667 111.731 L 46.667 111.864 L 46.533 111.864 L 46.533 112.131 L 46.4 112.131 L 46.4 112.264 L 46.267 112.264 L 46.267 112.397 L 46.133 112.397 L 46.133 112.531 L 46 112.531 L 46 112.664 L 45.867 112.664 L 45.867 112.797 L 45.733 112.797 L 45.733 113.064 L 45.6 113.064 L 45.6 113.197 L 45.467 113.197 L 45.467 113.331 L 45.333 113.331 L 45.333 113.464 L 45.2 113.464 L 45.2 113.731 L 45.067 113.731 L 45.067 113.864 L 44.933 113.864 L 44.933 113.997 L 44.8 113.997 L 44.8 114.131 L 44.667 114.131 L 44.667 114.397 L 44.533 114.397 L 44.533 114.531 L 44.4 114.531 L 44.4 114.664 L 44.267 114.664 L 44.267 114.797 L 44.133 114.797 L 44.133 115.064 L 44 115.064 L 44 115.197 L 43.867 115.197 L 43.867 115.331 L 43.733 115.331 L 43.733 115.464 L 43.6 115.464 L 43.6 115.731 L 43.467 115.731 L 43.467 115.864 L 43.333 115.864 L 43.333 115.997 L 43.2 115.997 L 43.2 116.131 L 43.067 116.131 L 43.067 116.397 L 42.933 116.397 L 42.933 116.531 L 42.8 116.531 L 42.8 116.664 L 42.667 116.664 L 42.667 116.931 L 42.533 116.931 L 42.533 117.064 L 42.4 117.064 L 42.4 117.197 L 42.267 117.197 L 42.267 117.331 L 42.133 117.331 L 42.133 117.597 L 42 117.597 L 42 117.731 L 41.867 117.731 L 41.867 117.864 L 41.733 117.864 L 41.733 117.997 L 41.6 117.997 L 41.6 118.264 L 41.467 118.264 L 41.467 118.397 L 41.333 118.397 L 41.333 118.531 L 41.2 118.531 L 41.2 118.797 L 41.067 118.797 L 41.067 118.931 L 40.933 118.931 L 40.933 119.064 L 40.8 119.064 L 40.8 119.331 L 40.667 119.331 L 40.667 119.464 L 40.533 119.464 L 40.533 119.597 L 40.4 119.597 L 40.4 119.864 L 40.267 119.864 L 40.267 119.997 L 40.133 119.997 L 40.133 120.264 L 40 120.264 L 40 120.397 L 39.867 120.397 L 39.867 120.531 L 39.733 120.531 L 39.733 120.797 L 39.6 120.797 L 39.6 120.931 L 39.467 120.931 L 39.467 121.197 L 39.333 121.197 L 39.333 121.331 L 39.2 121.331 L 39.2 121.464 L 39.067 121.464 L 39.067 121.731 L 38.933 121.731 L 38.933 121.864 L 38.8 121.864 L 38.8 121.997 L 38.667 121.997 L 38.667 122.264 L 38.533 122.264 L 38.533 122.397 L 38.4 122.397 L 38.4 122.664 L 38.267 122.664 L 38.267 122.797 L 38.133 122.797 L 38.133 122.931 L 38 122.931 L 38 123.197 L 37.867 123.197 L 37.867 123.331 L 37.733 123.331 L 37.733 123.597 L 37.6 123.597 L 37.6 123.731 L 37.467 123.731 L 37.467 123.864 L 37.333 123.864 L 37.333 124.131 L 37.2 124.131 L 37.2 124.264 L 37.067 124.264 L 37.067 124.531 L 36.933 124.531 L 36.933 124.664 L 36.8 124.664 L 36.8 124.797 L 36.667 124.797 L 36.667 125.064 L 36.533 125.064 L 36.533 125.197 L 36.4 125.197 L 36.4 125.331 L 36.267 125.331 L 36.267 125.597 L 36.133 125.597 L 36.133 125.731 L 36 125.731 L 36 125.997 L 35.867 125.997 L 35.867 126.131 L 35.733 126.131 L 35.733 126.397 L 35.6 126.397 L 35.6 126.531 L 35.467 126.531 L 35.467 126.797 L 35.333 126.797 L 35.333 126.931 L 35.2 126.931 L 35.2 127.197 L 35.067 127.197 L 35.067 127.331 L 34.933 127.331 L 34.933 127.597 L 34.8 127.597 L 34.8 127.864 L 34.667 127.864 L 34.667 127.997 L 34.533 127.997 L 34.533 128.264 L 34.4 128.264 L 34.4 128.397 L 34.267 128.397 L 34.267 128.664 L 34.133 128.664 L 34.133 128.797 L 34 128.797 L 34 129.064 L 33.867 129.064 L 33.867 129.197 L 33.733 129.197 L 33.733 129.464 L 33.6 129.464 L 33.6 129.731 L 33.467 129.731 L 33.467 129.864 L 33.333 129.864 L 33.333 130.131 L 33.2 130.131 L 33.2 130.264 L 33.067 130.264 L 33.067 130.531 L 32.933 130.531 L 32.933 130.664 L 32.8 130.664 L 32.8 130.931 L 32.667 130.931 L 32.667 131.064 L 32.533 131.064 L 32.533 131.331 L 32.4 131.331 L 32.4 131.597 L 32.267 131.597 L 32.267 131.731 L 32.133 131.731 L 32.133 131.997 L 32 131.997 L 32 132.131 L 31.867 132.131 L 31.867 132.397 L 31.733 132.397 L 31.733 132.531 L 31.6 132.531 L 31.6 132.797 L 31.467 132.797 L 31.467 132.931 L 31.333 132.931 L 31.333 133.197 L 31.2 133.197 L 31.2 133.464 L 31.067 133.464 L 31.067 133.597 L 30.933 133.597 L 30.933 133.864 L 30.8 133.864 L 30.8 134.131 L 30.667 134.131 L 30.667 134.264 L 30.533 134.264 L 30.533 134.531 L 30.4 134.531 L 30.4 134.797 L 30.267 134.797 L 30.267 134.931 L 30.133 134.931 L 30.133 135.197 L 30 135.197 L 30 135.464 L 29.867 135.464 L 29.867 135.731 L 29.733 135.731 L 29.733 135.864 L 29.6 135.864 L 29.6 136.131 L 29.467 136.131 L 29.467 136.397 L 29.333 136.397 L 29.333 136.664 L 29.2 136.664 L 29.2 136.797 L 29.067 136.797 L 29.067 137.064 L 28.933 137.064 L 28.933 137.331 L 28.8 137.331 L 28.8 137.464 L 28.667 137.464 L 28.667 137.731 L 28.533 137.731 L 28.533 137.997 L 28.4 137.997 L 28.4 138.264 L 28.267 138.264 L 28.267 138.397 L 28.133 138.397 L 28.133 138.664 L 28 138.664 L 28 138.931 L 27.867 138.931 L 27.867 139.064 L 27.733 139.064 L 27.733 139.331 L 27.6 139.331 L 27.6 139.597 L 27.467 139.597 L 27.467 139.864 L 27.333 139.864 L 27.333 140.131 L 27.2 140.131 L 27.2 140.397 L 27.067 140.397 L 27.067 140.531 L 26.933 140.531 L 26.933 140.797 L 26.8 140.797 L 26.8 141.064 L 26.667 141.064 L 26.667 141.331 L 26.533 141.331 L 26.533 141.597 L 26.4 141.597 L 26.4 141.864 L 26.267 141.864 L 26.267 142.131 L 26.133 142.131 L 26.133 142.397 L 26 142.397 L 26 142.531 L 25.867 142.531 L 25.867 142.797 L 25.733 142.797 L 25.733 143.064 L 25.6 143.064 L 25.6 143.331 L 25.467 143.331 L 25.467 143.597 L 25.333 143.597 L 25.333 143.864 L 25.2 143.864 L 25.2 144.131 L 25.067 144.131 L 25.067 144.397 L 24.933 144.397 L 24.933 144.664 L 24.8 144.664 L 24.8 144.931 L 24.667 144.931 L 24.667 145.197 L 24.533 145.197 L 24.533 145.464 L 24.4 145.464 L 24.4 145.731 L 24.267 145.731 L 24.267 145.997 L 24.133 145.997 L 24.133 146.264 L 24 146.264 L 24 146.531 L 23.867 146.531 L 23.867 146.797 L 23.733 146.797 L 23.733 147.064 L 23.6 147.064 L 23.6 147.331 L 23.467 147.331 L 23.467 147.731 L 23.333 147.731 L 23.333 147.997 L 23.2 147.997 L 23.2 148.264 L 23.067 148.264 L 23.067 148.531 L 22.933 148.531 L 22.933 148.797 L 22.8 148.797 L 22.8 149.064 L 22.667 149.064 L 22.667 149.331 L 22.533 149.331 L 22.533 149.731 L 22.4 149.731 L 22.4 149.997 L 22.267 149.997 L 22.267 150.264 L 22.133 150.264 L 22.133 150.531 L 22 150.531 L 22 150.797 L 21.867 150.797 L 21.867 151.064 L 21.733 151.064 L 21.733 151.464 L 21.6 151.464 L 21.6 151.731 L 21.467 151.731 L 21.467 151.997 L 21.333 151.997 L 21.333 152.264 L 21.2 152.264 L 21.2 152.664 L 21.067 152.664 L 21.067 152.531 L 20.933 152.531 L 20.933 151.997 L 20.8 151.997 L 20.8 151.464 L 20.667 151.464 L 20.667 150.797 L 20.533 150.797 L 20.533 150.131 L 20.4 150.131 L 20.4 149.464 L 20.267 149.464 L 20.267 148.797 L 20.133 148.797 L 20.133 148.131 L 20 148.131 L 20 147.464 L 19.867 147.464 L 19.867 146.797 L 19.733 146.797 L 19.733 145.997 L 19.6 145.997 L 19.6 145.064 L 19.467 145.064 L 19.467 144.131 L 19.333 144.131 L 19.333 143.197 L 19.2 143.197 L 19.2 142.264 L 19.067 142.264 L 19.067 141.464 L 18.933 141.464 L 18.933 140.531 L 18.8 140.531 L 18.8 139.064 L 18.667 139.064 L 18.667 137.597 L 18.533 137.597 L 18.533 136.131 L 18.4 136.131 L 18.4 134.531 L 18.267 134.531 L 18.267 131.597 L 18.133 131.597 L 18.133 124.531 L 18.267 124.531 L 18.267 121.997 L 18.4 121.997 L 18.4 119.597 L 18.533 119.597 L 18.533 118.531 L 18.667 118.531 L 18.667 117.331 L 18.8 117.331 L 18.8 116.264 L 18.933 116.264 L 18.933 115.064 L 19.067 115.064 L 19.067 113.864 L 19.2 113.864 L 19.2 112.797 L 19.333 112.797 L 19.333 111.731 L 19.467 111.731 L 19.467 110.931 L 19.6 110.931 L 19.6 110.264 L 19.733 110.264 L 19.733 109.597 L 19.867 109.597 L 19.867 108.931 L 20 108.931 L 20 108.264 L 20.133 108.264 L 20.133 107.597 L 20.267 107.597 L 20.267 106.931 L 20.4 106.931 L 20.4 106.131 L 20.533 106.131 L 20.533 105.464 L 20.667 105.464 L 20.667 104.797 L 20.8 104.797 L 20.8 104.131 L 20.933 104.131 L 20.933 103.597 L 21.067 103.597 L 21.067 103.064 L 21.2 103.064 L 21.2 102.531 L 21.333 102.531 L 21.333 102.131 L 21.467 102.131 L 21.467 101.597 L 21.6 101.597 L 21.6 101.064 L 21.733 101.064 L 21.733 100.531 L 21.867 100.531 L 21.867 100.131 L 22 100.131 L 22 99.597 L 22.133 99.597 L 22.133 99.064 L 22.267 99.064 L 22.267 98.664 L 22.4 98.664 L 22.4 98.131 L 22.533 98.131 L 22.533 97.597 L 22.667 97.597 L 22.667 97.197 L 22.8 97.197 L 22.8 96.664 L 22.933 96.664 L 22.933 96.131 L 23.067 96.131 L 23.067 95.731 L 23.2 95.731 L 23.2 95.331 L 23.333 95.331 L 23.333 94.931 L 23.467 94.931 L 23.467 94.664 L 23.6 94.664 L 23.6 94.264 L 23.733 94.264 L 23.733 93.864 L 23.867 93.864 L 23.867 93.464 L 24 93.464 L 24 93.064 L 24.133 93.064 L 24.133 92.664 L 24.267 92.664 L 24.267 92.397 L 24.4 92.397 L 24.4 91.997 L 24.533 91.997 L 24.533 91.597 L 24.667 91.597 L 24.667 91.197 L 24.8 91.197 L 24.8 90.797 L 24.933 90.797 L 24.933 90.397 L 25.067 90.397 L 25.067 89.997 L 25.2 89.997 L 25.2 89.731 L 25.333 89.731 L 25.333 89.331 L 25.467 89.331 L 25.467 88.931 L 25.6 88.931 L 25.6 88.531 L 25.733 88.531 L 25.733 88.131 L 25.867 88.131 L 25.867 87.864 L 26 87.864 L 26 87.597 L 26.133 87.597 L 26.133 87.197 L 26.267 87.197 L 26.267 86.931 L 26.4 86.931 L 26.4 86.664 L 26.533 86.664 L 26.533 86.264 L 26.667 86.264 L 26.667 85.997 L 26.8 85.997 L 26.8 85.731 L 26.933 85.731 L 26.933 85.464 L 27.067 85.464 L 27.067 85.064 L 27.2 85.064 L 27.2 84.797 L 27.333 84.797 L 27.333 84.531 L 27.467 84.531 L 27.467 84.131 L 27.6 84.131 L 27.6 83.864 L 27.733 83.864 L 27.733 83.597 L 27.867 83.597 L 27.867 83.197 L 28 83.197 L 28 82.931 L 28.133 82.931 L 28.133 82.664 L 28.267 82.664 L 28.267 82.264 L 28.4 82.264 L 28.4 81.997 L 28.533 81.997 L 28.533 81.731 L 28.667 81.731 L 28.667 81.331 L 28.8 81.331 L 28.8 81.064 L 28.933 81.064 L 28.933 80.797 L 29.067 80.797 L 29.067 80.531 L 29.2 80.531 L 29.2 80.264 L 29.333 80.264 L 29.333 79.997 L 29.467 79.997 L 29.467 79.731 L 29.6 79.731 L 29.6 79.464 L 29.733 79.464 L 29.733 79.197 L 29.867 79.197 L 29.867 78.931 L 30 78.931 L 30 78.664 L 30.133 78.664 L 30.133 78.397 L 30.267 78.397 L 30.267 78.131 L 30.4 78.131 L 30.4 77.864 L 30.533 77.864 L 30.533 77.731 L 30.667 77.731 L 30.667 77.464 L 30.8 77.464 L 30.8 77.197 L 30.933 77.197 L 30.933 76.931 L 31.067 76.931 L 31.067 76.664 L 31.2 76.664 L 31.2 76.397 L 31.333 76.397 L 31.333 76.131 L 31.467 76.131 L 31.467 75.864 L 31.6 75.864 L 31.6 75.597 L 31.733 75.597 L 31.733 75.331 L 31.867 75.331 L 31.867 75.064 L 32 75.064 L 32 74.797 L 32.133 74.797 L 32.133 74.531 L 32.267 74.531 L 32.267 74.264 L 32.4 74.264 L 32.4 73.997 L 32.533 73.997 L 32.533 73.731 L 32.667 73.731 L 32.667 73.597 L 32.8 73.597 L 32.8 73.331 L 32.933 73.331 L 32.933 73.064 L 33.067 73.064 L 33.067 72.797 L 33.2 72.797 L 33.2 72.664 L 33.333 72.664 L 33.333 72.397 L 33.467 72.397 L 33.467 72.131 L 33.6 72.131 L 33.6 71.997 L 33.733 71.997 L 33.733 71.731 L 33.867 71.731 L 33.867 71.464 L 34 71.464 L 34 71.331 L 34.133 71.331 L 34.133 71.064 L 34.267 71.064 L 34.267 70.797 L 34.4 70.797 L 34.4 70.531 L 34.533 70.531 L 34.533 70.397 L 34.667 70.397 L 34.667 70.131 L 34.8 70.131 L 34.8 69.864 L 34.933 69.864 L 34.933 69.731 L 35.067 69.731 L 35.067 69.464 L 35.2 69.464 L 35.2 69.197 L 35.333 69.197 L 35.333 69.064 L 35.467 69.064 L 35.467 68.797 L 35.6 68.797 L 35.6 68.531 L 35.733 68.531 L 35.733 68.264 L 35.867 68.264 L 35.867 68.131 L 36 68.131 L 36 67.864 L 36.133 67.864 L 36.133 67.731 L 36.267 67.731 L 36.267 67.464 L 36.4 67.464 L 36.4 67.331 L 36.533 67.331 L 36.533 67.064 L 36.667 67.064 L 36.667 66.931 L 36.8 66.931 L 36.8 66.664 L 36.933 66.664 L 36.933 66.531 L 37.067 66.531 L 37.067 66.264 L 37.2 66.264 L 37.2 65.997 L 37.333 65.997 L 37.333 65.864 L 37.467 65.864 L 37.467 65.597 L 37.6 65.597 L 37.6 65.464 L 37.733 65.464 L 37.733 65.197 L 37.867 65.197 L 37.867 65.064 L 38 65.064 L 38 64.797 L 38.133 64.797 L 38.133 64.664 L 38.267 64.664 L 38.267 64.531 L 38.4 64.531 L 38.4 64.264 L 38.533 64.264 L 38.533 64.131 L 38.667 64.131 L 38.667 63.864 L 38.8 63.864 L 38.8 63.731 L 38.933 63.731 L 38.933 63.597 L 39.067 63.597 L 39.067 63.331 L 39.2 63.331 L 39.2 63.197 L 39.333 63.197 L 39.333 62.931 L 39.467 62.931 L 39.467 62.797 L 39.6 62.797 L 39.6 62.664 L 39.733 62.664 L 39.733 62.397 L 39.867 62.397 L 39.867 62.264 L 40 62.264 L 40 61.997 L 40.133 61.997 L 40.133 61.864 L 40.267 61.864 L 40.267 61.731 L 40.4 61.731 L 40.4 61.464 L 40.533 61.464 L 40.533 61.331 L 40.667 61.331 L 40.667 61.064 L 40.8 61.064 L 40.8 60.931 L 40.933 60.931 L 40.933 60.797 L 41.067 60.797 L 41.067 60.531 L 41.2 60.531 L 41.2 60.397 L 41.333 60.397 L 41.333 60.131 L 41.467 60.131 L 41.467 59.997 L 41.6 59.997 L 41.6 59.864 L 41.733 59.864 L 41.733 59.597 L 41.867 59.597 L 41.867 59.464 L 42 59.464 L 42 59.331 L 42.133 59.331 L 42.133 59.197 L 42.267 59.197 L 42.267 58.931 L 42.4 58.931 L 42.4 58.797 L 42.533 58.797 L 42.533 58.664 L 42.667 58.664 L 42.667 58.531 L 42.8 58.531 L 42.8 58.264 L 42.933 58.264 L 42.933 58.131 L 43.067 58.131 L 43.067 57.997 L 43.2 57.997 L 43.2 57.864 L 43.333 57.864 L 43.333 57.597 L 43.467 57.597 L 43.467 57.464 L 43.6 57.464 L 43.6 57.331 L 43.733 57.331 L 43.733 57.197 L 43.867 57.197 L 43.867 56.931 L 44 56.931 L 44 56.797 L 44.133 56.797 L 44.133 56.664 L 44.267 56.664 L 44.267 56.531 L 44.4 56.531 L 44.4 56.264 L 44.533 56.264 L 44.533 56.131 L 44.667 56.131 L 44.667 55.997 L 44.8 55.997 L 44.8 55.864 L 44.933 55.864 L 44.933 55.597 L 45.067 55.597 L 45.067 55.464 L 45.2 55.464 L 45.2 55.331 L 45.333 55.331 L 45.333 55.064 L 45.467 55.064 L 45.467 54.931 L 45.6 54.931 L 45.6 54.797 L 45.733 54.797 L 45.733 54.664 L 45.867 54.664 L 45.867 54.397 L 46 54.397 L 46 54.264 L 46.133 54.264 L 46.133 54.131 L 46.267 54.131 L 46.267 53.997 L 46.4 53.997 L 46.4 53.731 L 46.533 53.731 L 46.533 53.597 L 46.667 53.597 L 46.667 53.464 L 46.8 53.464 L 46.8 53.331 L 46.933 53.331 L 46.933 53.197 L 47.067 53.197 L 47.067 53.064 L 47.2 53.064 L 47.2 52.931 L 47.333 52.931 L 47.333 52.664 L 47.467 52.664 L 47.467 52.531 L 47.6 52.531 L 47.6 52.397 L 47.733 52.397 L 47.733 52.264 L 47.867 52.264 L 47.867 52.131 L 48 52.131 L 48 51.997 L 48.133 51.997 L 48.133 51.864 L 48.267 51.864 L 48.267 51.731 L 48.4 51.731 L 48.4 51.597 L 48.533 51.597 L 48.533 51.331 L 48.667 51.331 L 48.667 51.197 L 48.8 51.197 L 48.8 51.064 L 48.933 51.064 L 48.933 50.931 L 49.067 50.931 L 49.067 50.797 L 49.2 50.797 L 49.2 50.664 L 49.333 50.664 L 49.333 50.531 L 49.467 50.531 L 49.467 50.397 L 49.6 50.397 L 49.6 50.264 L 49.733 50.264 L 49.733 50.131 L 49.867 50.131 L 49.867 49.864 L 50 49.864 L 50 49.731 L 50.133 49.731 L 50.133 49.597 L 50.267 49.597 L 50.267 49.464 L 50.4 49.464 L 50.4 49.331 L 50.533 49.331 L 50.533 49.197 L 50.667 49.197 L 50.667 49.064 L 50.8 49.064 L 50.8 48.931 L 50.933 48.931 L 50.933 48.797 L 51.067 48.797 L 51.067 48.531 L 51.2 48.531 L 51.2 48.397 L 51.333 48.397 L 51.333 48.264 L 51.467 48.264 L 51.467 48.131 L 51.6 48.131 L 51.6 47.997 L 51.733 47.997 L 51.733 47.864 L 51.867 47.864 L 51.867 47.731 L 52 47.731 L 52 47.597 L 52.133 47.597 L 52.133 47.464 L 52.267 47.464 L 52.267 47.331 L 52.4 47.331 L 52.4 47.197 L 52.533 47.197 L 52.533 47.064 L 52.667 47.064 L 52.667 46.931 L 52.8 46.931 L 52.8 46.797 L 52.933 46.797 L 52.933 46.664 L 53.067 46.664 L 53.067 46.531 L 53.2 46.531 L 53.2 46.397 L 53.333 46.397 L 53.333 46.264 L 53.467 46.264 L 53.467 46.131 L 53.6 46.131 L 53.6 45.997 L 53.733 45.997 L 53.733 45.864 L 53.867 45.864 L 53.867 45.731 L 54 45.731 L 54 45.597 L 54.133 45.597 L 54.133 45.464 L 54.267 45.464 L 54.267 45.331 L 54.4 45.331 L 54.4 45.197 L 54.533 45.197 L 54.533 45.064 L 54.667 45.064 L 54.667 44.931 L 54.8 44.931 L 54.8 44.797 L 54.933 44.797 L 54.933 44.664 L 55.067 44.664 L 55.067 44.531 L 55.2 44.531 L 55.2 44.397 L 55.333 44.397 L 55.333 44.264 L 55.467 44.264 L 55.467 44.131 L 55.6 44.131 L 55.6 43.997 L 55.733 43.997 L 55.733 43.864 L 55.867 43.864 L 55.867 43.731 L 56 43.731 L 56 43.597 L 56.133 43.597 L 56.133 43.464 L 56.267 43.464 L 56.267 43.331 L 56.4 43.331 L 56.4 43.197 L 56.533 43.197 L 56.533 43.064 L 56.667 43.064 L 56.667 42.931 L 56.8 42.931 L 56.8 42.797 L 56.933 42.797 L 56.933 42.664 L 57.067 42.664 L 57.067 42.531 L 57.2 42.531 L 57.2 42.397 L 57.333 42.397 L 57.333 42.264 L 57.467 42.264 L 57.467 42.131 L 57.6 42.131 L 57.6 41.997 L 57.733 41.997 L 57.733 41.864 L 57.867 41.864 L 57.867 41.731 L 58 41.731 L 58 41.597 L 58.267 41.597 L 58.267 41.464 L 58.4 41.464 L 58.4 41.331 L 58.533 41.331 L 58.533 41.197 L 58.667 41.197 L 58.667 41.064 L 58.8 41.064 L 58.8 40.931 L 58.933 40.931 L 58.933 40.797 L 59.067 40.797 L 59.067 40.664 L 59.333 40.664 L 59.333 40.531 L 59.467 40.531 L 59.467 40.397 L 59.6 40.397 L 59.6 40.264 L 59.733 40.264 L 59.733 40.131 L 59.867 40.131 L 59.867 39.997 L 60 39.997 L 60 39.864 L 60.267 39.864 L 60.267 39.731 L 60.4 39.731 L 60.4 39.597 L 60.533 39.597 L 60.533 39.464 L 60.667 39.464 L 60.667 39.331 L 60.8 39.331 L 60.8 39.197 L 60.933 39.197 L 60.933 39.064 L 61.067 39.064 L 61.067 38.931 L 61.333 38.931 L 61.333 38.797 L 61.467 38.797 L 61.467 38.664 L 61.6 38.664 L 61.6 38.531 L 61.733 38.531 L 61.733 38.397 L 61.867 38.397 L 61.867 38.264 L 62 38.264 L 62 38.131 L 62.267 38.131 L 62.267 37.997 L 62.4 37.997 L 62.4 37.864 L 62.533 37.864 L 62.533 37.731 L 62.667 37.731 L 62.667 37.597 L 62.8 37.597 L 62.8 37.464 L 62.933 37.464 L 62.933 37.331 L 63.067 37.331 L 63.067 37.197 L 63.333 37.197 L 63.333 37.064 L 63.467 37.064 L 63.467 36.931 L 63.6 36.931 L 63.6 36.797 L 63.733 36.797 L 63.733 36.664 L 63.867 36.664 L 63.867 36.531 L 64 36.531 L 64 36.397 L 64.133 36.397 L 64.133 36.264 L 64.4 36.264 L 64.4 36.131 L 64.533 36.131 L 64.533 35.997 L 64.667 35.997 L 64.667 35.864 L 64.933 35.864 L 64.933 35.731 L 65.067 35.731 L 65.067 35.597 L 65.2 35.597 L 65.2 35.464 L 65.333 35.464 L 65.333 35.331 L 65.6 35.331 L 65.6 35.197 L 65.733 35.197 L 65.733 35.064 L 65.867 35.064 L 65.867 34.931 L 66.133 34.931 L 66.133 34.797 L 66.267 34.797 L 66.267 34.664 L 66.4 34.664 L 66.4 34.531 L 66.667 34.531 L 66.667 34.397 L 66.8 34.397 L 66.8 34.264 L 66.933 34.264 L 66.933 34.131 L 67.067 34.131 L 67.067 33.997 L 67.333 33.997 L 67.333 33.864 L 67.467 33.864 L 67.467 33.731 L 67.6 33.731 L 67.6 33.597 L 67.867 33.597 L 67.867 33.464 L 68 33.464 L 68 33.331 L 68.133 33.331 L 68.133 33.197 L 68.4 33.197 L 68.4 33.064 L 68.533 33.064 L 68.533 32.931 L 68.667 32.931 L 68.667 32.797 L 68.933 32.797 L 68.933 32.664 L 69.067 32.664 L 69.067 32.531 L 69.2 32.531 L 69.2 32.397 L 69.333 32.397 L 69.333 32.264 L 69.6 32.264 L 69.6 32.131 L 69.733 32.131 L 69.733 31.997 L 69.867 31.997 L 69.867 31.864 L 70.133 31.864 L 70.133 31.731 L 70.267 31.731 L 70.267 31.597 L 70.4 31.597 L 70.4 31.464 L 70.667 31.464 L 70.667 31.331 L 70.8 31.331 L 70.8 31.197 L 70.933 31.197 L 70.933 31.064 L 71.2 31.064 L 71.2 30.931 L 71.333 30.931 L 71.333 30.797 L 71.6 30.797 L 71.6 30.664 L 71.733 30.664 L 71.733 30.531 L 72 30.531 L 72 30.397 L 72.133 30.397 L 72.133 30.264 L 72.4 30.264 L 72.4 30.131 L 72.533 30.131 L 72.533 29.997 L 72.667 29.997 L 72.667 29.864 L 72.933 29.864 L 72.933 29.731 L 73.067 29.731 L 73.067 29.597 L 73.333 29.597 L 73.333 29.464 L 73.467 29.464 L 73.467 29.331 L 73.733 29.331 L 73.733 29.197 L 73.867 29.197 L 73.867 29.064 L 74.133 29.064 L 74.133 28.931 L 74.267 28.931 L 74.267 28.797 L 74.533 28.797 L 74.533 28.664 L 74.667 28.664 L 74.667 28.531 L 74.933 28.531 L 74.933 28.397 L 75.067 28.397 L 75.067 28.264 L 75.333 28.264 L 75.333 28.131 L 75.467 28.131 L 75.467 27.997 L 75.733 27.997 L 75.733 27.864 L 75.867 27.864 L 75.867 27.731 L 76.133 27.731 L 76.133 27.597 L 76.267 27.597 L 76.267 27.464 L 76.533 27.464 L 76.533 27.331 L 76.667 27.331 L 76.667 27.197 L 76.933 27.197 L 76.933 27.064 L 77.067 27.064 L 77.067 26.931 L 77.333 26.931 L 77.333 26.797 L 77.467 26.797 L 77.467 26.664 L 77.733 26.664 L 77.733 26.531 L 77.867 26.531 L 77.867 26.397 L 78.133 26.397 L 78.133 26.264 L 78.267 26.264 L 78.267 26.131 L 78.533 26.131 L 78.533 25.997 L 78.8 25.997 L 78.8 25.864 L 78.933 25.864 L 78.933 25.731 L 79.2 25.731 L 79.2 25.597 L 79.467 25.597 L 79.467 25.464 L 79.6 25.464 L 79.6 25.331 L 79.867 25.331 L 79.867 25.197 L 80.133 25.197 L 80.133 25.064 L 80.267 25.064 L 80.267 24.931 L 80.533 24.931 L 80.533 24.797 L 80.8 24.797 L 80.8 24.664 L 80.933 24.664 L 80.933 24.531 L 81.2 24.531 L 81.2 24.397 L 81.467 24.397 L 81.467 24.264 L 81.6 24.264 L 81.6 24.131 L 81.867 24.131 L 81.867 23.997 L 82.133 23.997 L 82.133 23.864 L 82.267 23.864 L 82.267 23.731 L 82.533 23.731 L 82.533 23.597 L 82.8 23.597 L 82.8 23.464 L 82.933 23.464 L 82.933 23.331 L 83.2 23.331 L 83.2 23.197 L 83.467 23.197 L 83.467 23.064 L 83.6 23.064 L 83.6 22.931 L 83.867 22.931 L 83.867 22.797 L 84.133 22.797 L 84.133 22.664 L 84.4 22.664 L 84.4 22.531 L 84.667 22.531 L 84.667 22.397 L 84.8 22.397 L 84.8 22.264 L 85.067 22.264 L 85.067 22.131 L 85.333 22.131 L 85.333 21.997 L 85.6 21.997 L 85.6 21.864 L 85.867 21.864 L 85.867 21.731 L 86.133 21.731 L 86.133 21.597 L 86.267 21.597 L 86.267 21.464 L 86.533 21.464 L 86.533 21.331 L 86.8 21.331 L 86.8 21.197 L 87.067 21.197 L 87.067 21.064 L 87.333 21.064 L 87.333 20.931 L 87.6 20.931 L 87.6 20.797 L 87.867 20.797 L 87.867 20.664 L 88.133 20.664 L 88.133 20.531 L 88.4 20.531 L 88.4 20.397 L 88.667 20.397 L 88.667 20.264 L 88.933 20.264 L 88.933 20.131 L 89.2 20.131 L 89.2 19.997 L 89.467 19.997 L 89.467 19.864 L 89.733 19.864 L 89.733 19.731 L 90 19.731 L 90 19.597 L 90.267 19.597 L 90.267 19.464 L 90.533 19.464 L 90.533 19.331 L 90.8 19.331 L 90.8 19.197 L 91.067 19.197 L 91.067 19.064 L 91.333 19.064 L 91.333 18.931 L 91.6 18.931 L 91.6 18.797 L 91.867 18.797 L 91.867 18.664 L 92.133 18.664 L 92.133 18.531 L 92.4 18.531 L 92.4 18.397 L 92.667 18.397 L 92.667 18.264 L 92.933 18.264 L 92.933 18.131 L 93.2 18.131 L 93.2 17.997 L 93.6 17.997 L 93.6 17.864 L 93.867 17.864 L 93.867 17.731 L 94.133 17.731 L 94.133 17.597 L 94.533 17.597 L 94.533 17.464 L 94.8 17.464 L 94.8 17.331 L 95.067 17.331 L 95.067 17.197 L 95.333 17.197 L 95.333 17.064 L 95.733 17.064 L 95.733 16.931 L 96 16.931 L 96 16.797 L 96.267 16.797 L 96.267 16.664 L 96.667 16.664 L 96.667 16.531 L 96.933 16.531 L 96.933 16.397 L 97.2 16.397 L 97.2 16.264 L 97.467 16.264 L 97.467 16.131 L 97.867 16.131 L 97.867 15.997 L 98.133 15.997 L 98.133 15.864 L 98.4 15.864 L 98.4 15.731 L 98.8 15.731 L 98.8 15.597 L 99.067 15.597 L 99.067 15.464 L 99.333 15.464 L 99.333 15.331 L 99.733 15.331 L 99.733 15.197 L 100 15.197 L 100 15.064 L 100.267 15.064 L 100.267 14.931 L 100.533 14.931 L 100.533 14.797 L 100.933 14.797 L 100.933 14.664 L 101.333 14.664 L 101.333 14.531 L 101.733 14.531 L 101.733 14.397 L 102 14.397 L 102 14.264 L 102.4 14.264 L 102.4 14.131 L 102.8 14.131 L 102.8 13.997 L 103.2 13.997 L 103.2 13.864 L 103.467 13.864 L 103.467 13.731 L 103.867 13.731 L 103.867 13.597 L 104.267 13.597 L 104.267 13.464 L 104.667 13.464 L 104.667 13.331 L 104.933 13.331 L 104.933 13.197 L 105.333 13.197 L 105.333 13.064 L 105.733 13.064 L 105.733 12.931 L 106 12.931 L 106 12.797 L 106.4 12.797 L 106.4 12.664 L 106.8 12.664 L 106.8 12.531 L 107.2 12.531 L 107.2 12.397 L 107.467 12.397 L 107.467 12.264 L 107.867 12.264 L 107.867 12.131 L 108.267 12.131 L 108.267 11.997 L 108.667 11.997 L 108.667 11.864 L 109.067 11.864 L 109.067 11.731 L 109.467 11.731 L 109.467 11.597 L 110 11.597 L 110 11.464 L 110.4 11.464 L 110.4 11.331 L 110.8 11.331 L 110.8 11.197 L 111.333 11.197 L 111.333 11.064 L 111.733 11.064 L 111.733 10.931 L 112.267 10.931 L 112.267 10.797 L 112.667 10.797 L 112.667 10.664 L 113.067 10.664 L 113.067 10.531 L 113.6 10.531 L 113.6 10.397 L 114 10.397 L 114 10.264 L 114.4 10.264 L 114.4 10.131 L 114.933 10.131 L 114.933 9.997 L 115.333 9.997 L 115.333 9.864 L 115.867 9.864 L 115.867 9.731 L 116.267 9.731 L 116.267 9.597 L 116.667 9.597 L 116.667 9.464 L 117.2 9.464 L 117.2 9.331 L 117.867 9.331 L 117.867 9.197 L 118.4 9.197 L 118.4 9.064 L 118.933 9.064 L 118.933 8.931 L 119.6 8.931 L 119.6 8.797 L 120.133 8.797 L 120.133 8.664 L 120.667 8.664 L 120.667 8.531 L 121.333 8.531 L 121.333 8.397 L 121.867 8.397 L 121.867 8.264 L 122.4 8.264 L 122.4 8.131 L 123.067 8.131 L 123.067 7.997 L 123.6 7.997 L 123.6 7.864 L 124.133 7.864 L 124.133 7.731 L 124.8 7.731 L 124.8 7.597 L 125.333 7.597 L 125.333 7.464 L 126.133 7.464 L 126.133 7.331 L 126.933 7.331 L 126.933 7.197 L 127.733 7.197 L 127.733 7.064 L 128.533 7.064 L 128.533 6.931 L 129.467 6.931 L 129.467 6.797 L 130.267 6.797 L 130.267 6.664 L 131.067 6.664 L 131.067 6.531 L 131.867 6.531 L 131.867 6.397 L 132.667 6.397 L 132.667 6.264 L 133.467 6.264 L 133.467 6.131 L 134.4 6.131 L 134.4 5.997 L 135.733 5.997 L 135.733 5.864 L 137.2 5.864 L 137.2 5.731 L 138.533 5.731 L 138.533 5.597 L 139.867 5.597 L 139.867 5.464 L 141.2 5.464 L 141.2 5.331 L 142.533 5.331 L 142.533 5.197 L 145.2 5.197 L 145.2 5.064 L 160 5.064 L 160 5.197 L 161.733 5.197 L 161.733 5.331 L 163.6 5.331 L 163.6 5.464 L 165.333 5.464 L 165.333 5.597 L 167.067 5.597 L 167.067 5.731 L 168.4 5.731 L 168.4 5.864 L 169.467 5.864 L 169.467 5.997 L 170.533 5.997 L 170.533 6.131 L 171.6 6.131 L 171.6 6.264 L 172.667 6.264 L 172.667 6.397 L 173.733 6.397 L 173.733 6.531 L 174.8 6.531 L 174.8 6.664 L 175.733 6.664 L 175.733 6.797 L 176.4 6.797 L 176.4 6.931 L 177.2 6.931 L 177.2 7.064 L 178 7.064 L 178 7.197 L 178.667 7.197 L 178.667 7.331 L 179.467 7.331 L 179.467 7.464 L 180.133 7.464 L 180.133 7.597 L 180.933 7.597 L 180.933 7.731 L 181.733 7.731 L 181.733 7.864 L 182.4 7.864 L 182.4 7.997 L 183.067 7.997 L 183.067 8.131 L 183.733 8.131 L 183.733 8.264 L 184.267 8.264 L 184.267 8.397 L 184.8 8.397 L 184.8 8.531 L 185.467 8.531 L 185.467 8.664 L 186 8.664 L 186 8.797 L 186.533 8.797 L 186.533 8.931 L 187.2 8.931 L 187.2 9.064 L 187.733 9.064 L 187.733 9.197 L 188.267 9.197 L 188.267 9.331 L 188.933 9.331 L 188.933 9.464 L 189.467 9.464 L 189.467 9.597 L 190 9.597 L 190 9.731 L 190.533 9.731 L 190.533 9.864 L 191.067 9.864 L 191.067 9.997 L 191.467 9.997 L 191.467 10.131 L 191.867 10.131 L 191.867 10.264 L 192.4 10.264 L 192.4 10.397 L 192.8 10.397 L 192.8 10.531 L 193.333 10.531 L 193.333 10.664 L 193.733 10.664 L 193.733 10.797 L 194.267 10.797 L 194.267 10.931 L 194.667 10.931 L 194.667 11.064 L 195.2 11.064 L 195.2 11.197 L 195.6 11.197 L 195.6 11.331 L 196.133 11.331 L 196.133 11.464 L 196.533 11.464 L 196.533 11.597 L 197.067 11.597 L 197.067 11.731 L 197.467 11.731 L 197.467 11.864 L 197.867 11.864 L 197.867 11.997 L 198.267 11.997 L 198.267 12.131 L 198.667 12.131 L 198.667 12.264 L 199.067 12.264 L 199.067 12.397 L 199.467 12.397 L 199.467 12.531 L 199.867 12.531 L 199.867 12.664 L 200.267 12.664 L 200.267 12.797 L 200.667 12.797 L 200.667 12.931 L 201.067 12.931 L 201.067 13.064 L 201.333 13.064 L 201.333 13.197 L 201.733 13.197 L 201.733 13.331 L 202.133 13.331 L 202.133 13.464 L 202.533 13.464 L 202.533 13.597 L 202.933 13.597 L 202.933 13.731 L 203.333 13.731 L 203.333 13.864 L 203.733 13.864 L 203.733 13.997 L 204.133 13.997 L 204.133 14.131 L 204.533 14.131 L 204.533 14.264 L 204.8 14.264 L 204.8 14.397 L 205.2 14.397 L 205.2 14.531 L 205.467 14.531 L 205.467 14.664 L 205.867 14.664 L 205.867 14.797 L 206.133 14.797 L 206.133 14.931 L 206.533 14.931 L 206.533 15.064 L 206.8 15.064 L 206.8 15.197 L 207.2 15.197 L 207.2 15.331 L 207.467 15.331 L 207.467 15.464 L 207.867 15.464 L 207.867 15.597 L 208.133 15.597 L 208.133 15.731 L 208.533 15.731 L 208.533 15.864 L 208.8 15.864 L 208.8 15.997 L 209.2 15.997 L 209.2 16.131 L 209.467 16.131 L 209.467 16.264 L 209.867 16.264 L 209.867 16.397 L 210.133 16.397 L 210.133 16.531 L 210.533 16.531 L 210.533 16.664 L 210.8 16.664 L 210.8 16.797 L 211.2 16.797 L 211.2 16.931 L 211.467 16.931 L 211.467 17.064 L 211.733 17.064 L 211.733 17.197 L 212 17.197 L 212 17.331 L 212.267 17.331 L 212.267 17.464 L 212.667 17.464 L 212.667 17.597 L 212.933 17.597 L 212.933 17.731 L 213.2 17.731 L 213.2 17.864 L 213.467 17.864 L 213.467 17.997 L 213.733 17.997 L 213.733 18.131 L 214 18.131 L 214 18.264 L 214.4 18.264 L 214.4 18.397 L 214.667 18.397 L 214.667 18.531 L 214.933 18.531 L 214.933 18.664 L 215.2 18.664 L 215.2 18.797 L 215.467 18.797 L 215.467 18.931 L 215.733 18.931 L 215.733 19.064 L 216.133 19.064 L 216.133 19.197 L 216.4 19.197 L 216.4 19.331 L 216.667 19.331 L 216.667 19.464 L 216.933 19.464 L 216.933 19.597 L 217.2 19.597 L 217.2 19.731 L 217.467 19.731 L 217.467 19.864 L 217.867 19.864 L 217.867 19.997 L 218.133 19.997 L 218.133 20.131 L 218.267 20.131 L 218.267 20.264 L 218.533 20.264 L 218.533 20.397 L 218.8 20.397 L 218.8 20.531 L 219.067 20.531 L 219.067 20.664 L 219.333 20.664 L 219.333 20.797 L 219.6 20.797 L 219.6 20.931 L 219.867 20.931 L 219.867 21.064 L 220.133 21.064 L 220.133 21.197 L 220.4 21.197 L 220.4 21.331 L 220.667 21.331 L 220.667 21.464 L 220.933 21.464 L 220.933 21.597 L 221.067 21.597 L 221.067 21.731 L 221.333 21.731 L 221.333 21.864 L 221.6 21.864 L 221.6 21.997 L 221.867 21.997 L 221.867 22.131 L 222.133 22.131 L 222.133 22.264 L 222.4 22.264 L 222.4 22.397 L 222.667 22.397 L 222.667 22.531 L 222.933 22.531 L 222.933 22.664 L 223.2 22.664 L 223.2 22.797 L 223.467 22.797 L 223.467 22.931 L 223.733 22.931 L 223.733 23.064 L 223.867 23.064 L 223.867 23.197 L 224.133 23.197 L 224.133 23.331 L 224.4 23.331 L 224.4 23.464 L 224.667 23.464 L 224.667 23.597 L 224.933 23.597 L 224.933 23.731 L 225.067 23.731 L 225.067 23.864 L 225.333 23.864 L 225.333 23.997 L 225.6 23.997 L 225.6 24.131 L 225.733 24.131 L 225.733 24.264 L 226 24.264 L 226 24.397 L 226.267 24.397 L 226.267 24.531 L 226.4 24.531 L 226.4 24.664 L 226.667 24.664 L 226.667 24.797 L 226.933 24.797 L 226.933 24.931 L 227.067 24.931 L 227.067 25.064 L 227.333 25.064 L 227.333 25.197 L 227.6 25.197 L 227.6 25.331 L 227.867 25.331 L 227.867 25.464 L 228 25.464 L 228 25.597 L 228.267 25.597 L 228.267 25.731 L 228.533 25.731 L 228.533 25.864 L 228.667 25.864 L 228.667 25.997 L 228.933 25.997 L 228.933 26.131 L 229.2 26.131 L 229.2 26.264 L 229.333 26.264 L 229.333 26.397 L 229.6 26.397 L 229.6 26.531 L 229.867 26.531 L 229.867 26.664 L 230.133 26.664 L 230.133 26.797 L 230.267 26.797 L 230.267 26.931 L 230.533 26.931 L 230.533 27.064 L 230.667 27.064 L 230.667 27.197 L 230.933 27.197 L 230.933 27.331 L 231.067 27.331 L 231.067 27.464 L 231.333 27.464 L 231.333 27.597 L 231.467 27.597 L 231.467 27.731 L 231.733 27.731 L 231.733 27.864 L 231.867 27.864 L 231.867 27.997 L 232.133 27.997 L 232.133 28.131 L 232.4 28.131 L 232.4 28.264 L 232.533 28.264 L 232.533 28.397 L 232.8 28.397 L 232.8 28.531 L 232.933 28.531 L 232.933 28.664 L 233.2 28.664 L 233.2 28.797 L 233.333 28.797 L 233.333 28.931 L 233.6 28.931 L 233.6 29.064 L 233.733 29.064 L 233.733 29.197 L 234 29.197 L 234 29.331 L 234.133 29.331 L 234.133 29.464 L 234.4 29.464 L 234.4 29.597 L 234.533 29.597 L 234.533 29.731 L 234.8 29.731 L 234.8 29.864 L 234.933 29.864 L 234.933 29.997 L 235.2 29.997 L 235.2 30.131 L 235.333 30.131 L 235.333 30.264 L 235.6 30.264 L 235.6 30.397 L 235.733 30.397 L 235.733 30.531 L 236 30.531 L 236 30.664 L 236.133 30.664 L 236.133 30.797 L 236.4 30.797 L 236.4 30.931 L 236.533 30.931 L 236.533 31.064 L 236.8 31.064 L 236.8 31.197 L 236.933 31.197 L 236.933 31.331 L 237.067 31.331 L 237.067 31.464 L 237.333 31.464 L 237.333 31.597 L 237.467 31.597 L 237.467 31.731 L 237.6 31.731 L 237.6 31.864 L 237.867 31.864 L 237.867 31.997 L 238 31.997 L 238 32.131 L 238.267 32.131 L 238.267 32.264 L 238.4 32.264 L 238.4 32.397 L 238.533 32.397 L 238.533 32.531 L 238.8 32.531 L 238.8 32.664 L 238.933 32.664 L 238.933 32.797 L 239.067 32.797 L 239.067 32.931 L 239.333 32.931 L 239.333 33.064 L 239.467 33.064 L 239.467 33.197 L 239.6 33.197 L 239.6 33.331 L 239.867 33.331 L 239.867 33.464 L 240 33.464 L 240 33.597 L 240.267 33.597 L 240.267 33.731 L 240.4 33.731 L 240.4 33.864 L 240.533 33.864 L 240.533 33.997 L 240.8 33.997 L 240.8 34.131 L 240.933 34.131 L 240.933 34.264 L 241.067 34.264 L 241.067 34.397 L 241.333 34.397 L 241.333 34.531 L 241.467 34.531 L 241.467 34.664 L 241.6 34.664 L 241.6 34.797 L 241.867 34.797 L 241.867 34.931 L 242 34.931 L 242 35.064 L 242.133 35.064 L 242.133 35.197 L 242.4 35.197 L 242.4 35.331 L 242.533 35.331 L 242.533 35.464 L 242.667 35.464 L 242.667 35.597 L 242.8 35.597 L 242.8 35.731 L 243.067 35.731 L 243.067 35.864 L 243.2 35.864 L 243.2 35.997 L 243.333 35.997 L 243.333 36.131 L 243.467 36.131 L 243.467 36.264 L 243.733 36.264 L 243.733 36.397 L 243.867 36.397 L 243.867 36.531 L 244 36.531 L 244 36.664 L 244.133 36.664 L 244.133 36.797 L 244.4 36.797 L 244.4 36.931 L 244.533 36.931 L 244.533 37.064 L 244.667 37.064 L 244.667 37.197 L 244.8 37.197 L 244.8 37.331 L 244.933 37.331 L 244.933 37.464 L 245.2 37.464 L 245.2 37.597 L 245.333 37.597 L 245.333 37.731 L 245.467 37.731 L 245.467 37.864 L 245.6 37.864 L 245.6 37.997 L 245.867 37.997 L 245.867 38.131 L 246 38.131 L 246 38.264 L 246.133 38.264 L 246.133 38.397 L 246.267 38.397 L 246.267 38.531 L 246.533 38.531 L 246.533 38.664 L 246.667 38.664 L 246.667 38.797 L 246.8 38.797 L 246.8 38.931 L 246.933 38.931 L 246.933 39.064 L 247.067 39.064 L 247.067 39.197 L 247.333 39.197 L 247.333 39.331 L 247.467 39.331 L 247.467 39.464 L 247.6 39.464 L 247.6 39.597 L 247.733 39.597 L 247.733 39.731 L 248 39.731 L 248 39.864 L 248.133 39.864 L 248.133 39.997 L 248.267 39.997 L 248.267 40.131 L 248.4 40.131 L 248.4 40.264 L 248.533 40.264 L 248.533 40.397 L 248.667 40.397 L 248.667 40.531 L 248.8 40.531 L 248.8 40.664 L 248.933 40.664 L 248.933 40.797 L 249.067 40.797 L 249.067 40.931 L 249.333 40.931 L 249.333 41.064 L 249.467 41.064 L 249.467 41.197 L 249.6 41.197 L 249.6 41.331 L 249.733 41.331 L 249.733 41.464 L 249.867 41.464 L 249.867 41.597 L 250 41.597 L 250 41.731 L 250.133 41.731 L 250.133 41.864 L 250.267 41.864 L 250.267 41.997 L 250.4 41.997 L 250.4 42.131 L 250.667 42.131 L 250.667 42.264 L 250.8 42.264 L 250.8 42.397 L 250.933 42.397 L 250.933 42.531 L 251.067 42.531 L 251.067 42.664 L 251.2 42.664 L 251.2 42.797 L 251.333 42.797 L 251.333 42.931 L 251.467 42.931 L 251.467 43.064 L 251.6 43.064 L 251.6 43.197 L 251.733 43.197 L 251.733 43.331 L 252 43.331 L 252 43.464 L 252.133 43.464 L 252.133 43.597 L 252.267 43.597 L 252.267 43.731 L 252.4 43.731 L 252.4 43.864 L 252.533 43.864 L 252.533 43.997 L 252.667 43.997 L 252.667 44.131 L 252.8 44.131 L 252.8 44.264 L 252.933 44.264 L 252.933 44.397 L 253.067 44.397 L 253.067 44.531 L 253.333 44.531 L 253.333 44.664 L 253.467 44.664 L 253.467 44.797 L 253.6 44.797 L 253.6 44.931 L 253.733 44.931 L 253.733 45.064 L 253.867 45.064 L 253.867 45.197 L 254 45.197 L 254 45.331 L 254.133 45.331 L 254.133 45.464 L 254.267 45.464 L 254.267 45.597 L 254.4 45.597 L 254.4 45.731 L 254.533 45.731 L 254.533 45.864 L 254.667 45.864 L 254.667 45.997 L 254.8 45.997 L 254.8 46.131 L 254.933 46.131 L 254.933 46.264 L 255.067 46.264 L 255.067 46.397 L 255.2 46.397 L 255.2 46.531 L 255.333 46.531 L 255.333 46.664 L 255.467 46.664 L 255.467 46.797 L 255.6 46.797 L 255.6 46.931 L 255.733 46.931 L 255.733 47.064 L 255.867 47.064 L 255.867 47.197 L 256 47.197 L 256 47.331 L 256.133 47.331 L 256.133 47.464 L 256.267 47.464 L 256.267 47.597 L 256.4 47.597 L 256.4 47.731 L 256.533 47.731 L 256.533 47.864 L 256.667 47.864 L 256.667 47.997 L 256.8 47.997 L 256.8 48.131 L 256.933 48.131 L 256.933 48.264 L 257.067 48.264 L 257.067 48.397 L 257.2 48.397 L 257.2 48.531 L 257.333 48.531 L 257.333 48.664 L 257.467 48.664 L 257.467 48.797 L 257.6 48.797 L 257.6 48.931 L 257.733 48.931 L 257.733 49.064 L 257.867 49.064 L 257.867 49.197 L 258 49.197 L 258 49.331 L 258.133 49.331 L 258.133 49.464 L 258.267 49.464 L 258.267 49.597 L 258.4 49.597 L 258.4 49.731 L 258.533 49.731 L 258.533 49.864 L 258.667 49.864 L 258.667 49.997 L 258.8 49.997 L 258.8 50.131 L 258.933 50.131 L 258.933 50.264 L 259.067 50.264 L 259.067 50.397 L 259.2 50.397 L 259.2 50.531 L 259.333 50.531 L 259.333 50.797 L 259.467 50.797 L 259.467 50.931 L 259.6 50.931 L 259.6 51.064 L 259.733 51.064 L 259.733 51.197 L 259.867 51.197 L 259.867 51.331 L 260 51.331 L 260 51.464 L 260.133 51.464 L 260.133 51.597 L 260.267 51.597 L 260.267 51.731 L 260.4 51.731 L 260.4 51.864 L 260.533 51.864 L 260.533 51.997 L 260.667 51.997 L 260.667 52.264 L 260.8 52.264 L 260.8 52.397 L 260.933 52.397 L 260.933 52.531 L 261.067 52.531 L 261.067 52.664 L 261.2 52.664 L 261.2 52.797 L 261.333 52.797 L 261.333 52.931 L 261.467 52.931 L 261.467 53.064 L 261.6 53.064 L 261.6 53.197 L 261.733 53.197 L 261.733 53.464 L 261.867 53.464 L 261.867 53.597 L 262 53.597 L 262 53.731 L 262.133 53.731 L 262.133 53.864 L 262.267 53.864 L 262.267 53.997 L 262.4 53.997 L 262.4 54.131 L 262.533 54.131 L 262.533 54.264 L 262.667 54.264 L 262.667 54.397 L 262.8 54.397 L 262.8 54.531 L 262.933 54.531 L 262.933 54.797 L 263.067 54.797 L 263.067 54.931 L 263.2 54.931 L 263.2 55.064 L 263.333 55.064 L 263.333 55.197 L 263.467 55.197 L 263.467 55.331 L 263.6 55.331 L 263.6 55.464 L 263.733 55.464 L 263.733 55.731 L 263.867 55.731 L 263.867 55.864 L 264 55.864 L 264 55.997 L 264.133 55.997 L 264.133 56.131 L 264.267 56.131 L 264.267 56.397 L 264.4 56.397 L 264.4 56.531 L 264.533 56.531 L 264.533 56.664 L 264.667 56.664 L 264.667 56.797 L 264.8 56.797 L 264.8 56.931 L 264.933 56.931 L 264.933 57.197 L 265.067 57.197 L 265.067 57.331 L 265.2 57.331 L 265.2 57.464 L 265.333 57.464 L 265.333 57.597 L 265.467 57.597 L 265.467 57.731 L 265.6 57.731 L 265.6 57.997 L 265.733 57.997 L 265.733 58.131 L 265.867 58.131 L 265.867 58.264 L 266 58.264 L 266 58.397 L 266.133 58.397 L 266.133 58.531 L 266.267 58.531 L 266.267 58.797 L 266.4 58.797 L 266.4 58.931 L 266.533 58.931 L 266.533 59.064 L 266.667 59.064 L 266.667 59.197 L 266.8 59.197 L 266.8 59.464 L 266.933 59.464 L 266.933 59.597 L 267.067 59.597 L 267.067 59.731 L 267.2 59.731 L 267.2 59.864 L 267.333 59.864 L 267.333 59.997 L 267.467 59.997 L 267.467 60.264 L 267.6 60.264 L 267.6 60.397 L 267.733 60.397 L 267.733 60.531 L 267.867 60.531 L 267.867 60.664 L 268 60.664 L 268 60.931 L 268.133 60.931 L 268.133 61.064 L 268.267 61.064 L 268.267 61.197 L 268.4 61.197 L 268.4 61.464 L 268.533 61.464 L 268.533 61.597 L 268.667 61.597 L 268.667 61.731 L 268.8 61.731 L 268.8 61.997 L 268.933 61.997 L 268.933 62.131 L 269.067 62.131 L 269.067 62.264 L 269.2 62.264 L 269.2 62.531 L 269.333 62.531 L 269.333 62.664 L 269.467 62.664 L 269.467 62.797 L 269.6 62.797 L 269.6 63.064 L 269.733 63.064 L 269.733 63.197 L 269.867 63.197 L 269.867 63.331 L 270 63.331 L 270 63.597 L 270.133 63.597 L 270.133 63.731 L 270.267 63.731 L 270.267 63.864 L 270.4 63.864 L 270.4 64.131 L 270.533 64.131 L 270.533 64.264 L 270.667 64.264 L 270.667 64.397 L 270.8 64.397 L 270.8 64.664 L 270.933 64.664 L 270.933 64.797 L 271.067 64.797 L 271.067 64.931 L 271.2 64.931 L 271.2 65.197 L 271.333 65.197 L 271.333 65.331 L 271.467 65.331 L 271.467 65.464 L 271.6 65.464 L 271.6 65.731 L 271.733 65.731 L 271.733 65.864 L 271.867 65.864 L 271.867 65.997 L 272 65.997 L 272 66.264 L 272.133 66.264 L 272.133 66.397 L 272.267 66.397 L 272.267 66.664 L 272.4 66.664 L 272.4 66.797 L 272.533 66.797 L 272.533 67.064 L 272.667 67.064 L 272.667 67.197 L 272.8 67.197 L 272.8 67.464 L 272.933 67.464 L 272.933 67.597 L 273.067 67.597 L 273.067 67.864 L 273.2 67.864 L 273.2 67.997 L 273.333 67.997 L 273.333 68.131 L 273.467 68.131 L 273.467 68.397 L 273.6 68.397 L 273.6 68.531 L 273.733 68.531 L 273.733 68.797 L 273.867 68.797 L 273.867 68.931 L 274 68.931 L 274 69.197 L 274.133 69.197 L 274.133 69.331 L 274.267 69.331 L 274.267 69.597 L 274.4 69.597 L 274.4 69.731 L 274.533 69.731 L 274.533 69.997 L 274.667 69.997 L 274.667 70.131 L 274.8 70.131 L 274.8 70.397 L 274.933 70.397 L 274.933 70.531 L 275.067 70.531 L 275.067 70.797 L 275.2 70.797 L 275.2 70.931 L 275.333 70.931 L 275.333 71.197 L 275.467 71.197 L 275.467 71.331 L 275.6 71.331 L 275.6 71.597 L 275.733 71.597 L 275.733 71.731 L 275.867 71.731 L 275.867 71.997 L 276 71.997 L 276 72.131 L 276.133 72.131 L 276.133 72.397 L 276.267 72.397 L 276.267 72.531 L 276.4 72.531 L 276.4 72.797 L 276.533 72.797 L 276.533 72.931 L 276.667 72.931 L 276.667 73.197 L 276.8 73.197 L 276.8 73.464 L 276.933 73.464 L 276.933 73.597 L 277.067 73.597 L 277.067 73.864 L 277.2 73.864 L 277.2 74.131 L 277.333 74.131 L 277.333 74.264 L 277.467 74.264 L 277.467 74.531 L 277.6 74.531 L 277.6 74.797 L 277.733 74.797 L 277.733 74.931 L 277.867 74.931 L 277.867 75.197 L 278 75.197 L 278 75.464 L 278.133 75.464 L 278.133 75.597 L 278.267 75.597 L 278.267 75.864 L 278.4 75.864 L 278.4 76.131 L 278.533 76.131 L 278.533 76.264 L 278.667 76.264 L 278.667 76.531 L 278.8 76.531 L 278.8 76.797 L 278.933 76.797 L 278.933 76.931 L 279.067 76.931 L 279.067 77.197 L 279.2 77.197 L 279.2 77.331 L 279.333 77.331 L 279.333 77.597 L 279.467 77.597 L 279.467 77.864 L 279.6 77.864 L 279.6 77.997 L 279.733 77.997 L 279.733 78.264 L 279.867 78.264 L 279.867 78.531 L 280 78.531 L 280 78.664 L 280.133 78.664 L 280.133 78.931 L 280.267 78.931 L 280.267 79.197 L 280.4 79.197 L 280.4 79.464 L 280.533 79.464 L 280.533 79.731 L 280.667 79.731 L 280.667 79.864 L 280.8 79.864 L 280.8 80.131 L 280.933 80.131 L 280.933 80.397 L 281.067 80.397 L 281.067 80.664 L 281.2 80.664 L 281.2 80.931 L 281.333 80.931 L 281.333 81.197 L 281.467 81.197 L 281.467 81.464 L 281.6 81.464 L 281.6 81.597 L 281.733 81.597 L 281.733 81.864 L 281.867 81.864 L 281.867 82.131 L 282 82.131 L 282 82.397 L 282.133 82.397 L 282.133 82.664 L 282.267 82.664 L 282.267 82.931 L 282.4 82.931 L 282.4 83.064 L 282.533 83.064 L 282.533 83.331 L 282.667 83.331 L 282.667 83.597 L 282.8 83.597 L 282.8 83.864 L 282.933 83.864 L 282.933 84.131 L 283.067 84.131 L 283.067 84.397 L 283.2 84.397 L 283.2 84.664 L 283.333 84.664 L 283.333 84.797 L 283.467 84.797 L 283.467 85.064 L 283.6 85.064 L 283.6 85.331 L 283.733 85.331 L 283.733 85.597 L 283.867 85.597 L 283.867 85.864 L 284 85.864 L 284 86.131 L 284.133 86.131 L 284.133 86.397 L 284.267 86.397 L 284.267 86.664 L 284.4 86.664 L 284.4 86.931 L 284.533 86.931 L 284.533 87.331 L 284.667 87.331 L 284.667 87.597 L 284.8 87.597 L 284.8 87.864 L 284.933 87.864 L 284.933 88.131 L 285.067 88.131 L 285.067 88.397 L 285.2 88.397 L 285.2 88.664 L 285.333 88.664 L 285.333 88.931 L 285.467 88.931 L 285.467 89.197 L 285.6 89.197 L 285.6 89.464 L 285.733 89.464 L 285.733 89.731 L 285.867 89.731 L 285.867 89.997 L 286 89.997 L 286 90.264 L 286.133 90.264 L 286.133 90.664 L 286.267 90.664 L 286.267 90.931 L 286.4 90.931 L 286.4 91.197 L 286.533 91.197 L 286.533 91.464 L 286.667 91.464 L 286.667 91.731 L 286.8 91.731 L 286.8 91.997 L 286.933 91.997 L 286.933 92.264 L 287.067 92.264 L 287.067 92.531 L 287.2 92.531 L 287.2 92.931 L 287.333 92.931 L 287.333 93.197 L 287.467 93.197 L 287.467 93.597 L 287.6 93.597 L 287.6 93.864 L 287.733 93.864 L 287.733 94.131 L 287.867 94.131 L 287.867 94.531 L 288 94.531 L 288 94.797 L 288.133 94.797 L 288.133 95.064 L 288.267 95.064 L 288.267 95.464 L 288.4 95.464 L 288.4 95.731 L 288.533 95.731 L 288.533 95.997 L 288.667 95.997 L 288.667 96.397 L 288.8 96.397 L 288.8 96.664 L 288.933 96.664 L 288.933 97.064 L 289.067 97.064 L 289.067 97.331 L 289.2 97.331 L 289.2 97.597 L 289.333 97.597 L 289.333 97.997 L 289.467 97.997 L 289.467 98.264 L 289.6 98.264 L 289.6 98.531 L 289.733 98.531 L 289.733 98.931 L 289.867 98.931 L 289.867 99.197 L 290 99.197 L 290 99.597 L 290.133 99.597 L 290.133 99.997 L 290.267 99.997 L 290.267 100.264 L 290.4 100.264 L 290.4 100.664 L 290.533 100.664 L 290.533 101.064 L 290.667 101.064 L 290.667 101.464 L 290.8 101.464 L 290.8 101.731 L 290.933 101.731 L 290.933 102.131 L 291.067 102.131 L 291.067 102.531 L 291.2 102.531 L 291.2 102.797 L 291.333 102.797 L 291.333 103.197 L 291.467 103.197 L 291.467 103.597 L 291.6 103.597 L 291.6 103.997 L 291.733 103.997 L 291.733 104.264 L 291.867 104.264 L 291.867 104.664 L 292 104.664 L 292 105.064 L 292.133 105.064 L 292.133 105.331 L 292.267 105.331 L 292.267 105.731 L 292.4 105.731 L 292.4 106.131 L 292.533 106.131 L 292.533 106.531 L 292.667 106.531 L 292.667 106.931 L 292.8 106.931 L 292.8 107.331 L 292.933 107.331 L 292.933 107.731 L 293.067 107.731 L 293.067 108.264 L 293.2 108.264 L 293.2 108.664 L 293.333 108.664 L 293.333 109.064 L 293.467 109.064 L 293.467 109.464 L 293.6 109.464 L 293.6 109.864 L 293.733 109.864 L 293.733 110.264 L 293.867 110.264 L 293.867 110.797 L 294 110.797 L 294 111.197 L 294.133 111.197 L 294.133 111.597 L 294.267 111.597 L 294.267 111.997 L 294.4 111.997 L 294.4 112.397 L 294.533 112.397 L 294.533 112.931 L 294.667 112.931 L 294.667 113.331 L 294.8 113.331 L 294.8 113.731 L 294.933 113.731 L 294.933 114.264 L 295.067 114.264 L 295.067 114.797 L 295.2 114.797 L 295.2 115.331 L 295.333 115.331 L 295.333 115.731 L 295.467 115.731 L 295.467 116.264 L 295.6 116.264 L 295.6 116.797 L 295.733 116.797 L 295.733 117.331 L 295.867 117.331 L 295.867 117.864 L 296 117.864 L 296 118.264 L 296.133 118.264 L 296.133 118.797 L 296.267 118.797 L 296.267 119.331 L 296.4 119.331 L 296.4 119.864 L 296.533 119.864 L 296.533 120.397 L 296.667 120.397 L 296.667 120.797 L 296.8 120.797 L 296.8 121.464 L 296.933 121.464 L 296.933 122.131 L 297.067 122.131 L 297.067 122.664 L 297.2 122.664 L 297.2 123.331 L 297.333 123.331 L 297.333 123.997 L 297.467 123.997 L 297.467 124.531 L 297.6 124.531 L 297.6 125.197 L 297.733 125.197 L 297.733 125.864 L 297.867 125.864 L 297.867 126.397 L 298 126.397 L 298 127.064 L 298.133 127.064 L 298.133 127.731 L 298.267 127.731 L 298.267 128.264 L 298.4 128.264 L 298.4 129.064 L 298.533 129.064 L 298.533 129.997 L 298.667 129.997 L 298.667 130.797 L 298.8 130.797 L 298.8 131.597 L 298.933 131.597 L 298.933 132.397 L 299.067 132.397 L 299.067 133.197 L 299.2 133.197 L 299.2 133.997 L 299.333 133.997 L 299.333 134.797 L 299.467 134.797 L 299.467 135.597 L 299.6 135.597 L 299.6 136.531 L 299.733 136.531 L 299.733 137.731 L 299.867 137.731 L 299.867 138.797 L 300 138.797 L 300 139.997 L 300.133 139.997 L 300.133 141.064 L 300.267 141.064 L 300.267 142.264 L 300.4 142.264 L 300.4 143.331 L 300.533 143.331 L 300.533 144.931 L 300.667 144.931 L 300.667 146.797 L 300.8 146.797 L 300.8 148.797 L 300.933 148.797 L 300.933 150.664 L 301.067 150.664 L 301.067 153.597 L 301.2 153.597 L 301.2 165.997 L 301.067 165.997 L 301.067 168.931 L 300.933 168.931 L 300.933 170.797 L 300.8 170.797 L 300.8 172.664 L 300.667 172.664 L 300.667 174.531 L 300.533 174.531 L 300.533 176.131 L 300.4 176.131 L 300.4 177.331 L 300.267 177.331 L 300.267 178.397 L 300.133 178.397 L 300.133 179.597 L 300 179.597 L 300 180.664 L 299.867 180.664 L 299.867 181.731 L 299.733 181.731 L 299.733 182.931 L 299.6 182.931 L 299.6 183.864 L 299.467 183.864 L 299.467 184.664 L 299.333 184.664 L 299.333 185.464 L 299.2 185.464 L 299.2 186.264 L 299.067 186.264 L 299.067 187.064 L 298.933 187.064 L 298.933 187.864 L 298.8 187.864 L 298.8 188.664 L 298.667 188.664 L 298.667 189.464 L 298.533 189.464 L 298.533 190.264 L 298.4 190.264 L 298.4 191.064 L 298.267 191.064 L 298.267 191.731 L 298.133 191.731 L 298.133 192.397 L 298 192.397 L 298 192.931 L 297.867 192.931 L 297.867 193.597 L 297.733 193.597 L 297.733 194.264 L 297.6 194.264 L 297.6 194.797 L 297.467 194.797 L 297.467 195.464 L 297.333 195.464 L 297.333 195.997 L 297.2 195.997 L 297.2 196.664 L 297.067 196.664 L 297.067 197.331 L 296.933 197.331 L 296.933 197.864 L 296.8 197.864 L 296.8 198.531 L 296.667 198.531 L 296.667 199.064 L 296.533 199.064 L 296.533 199.597 L 296.4 199.597 L 296.4 199.997 L 296.267 199.997 L 296.267 200.531 L 296.133 200.531 L 296.133 201.064 L 296 201.064 L 296 201.597 L 295.867 201.597 L 295.867 201.997 L 295.733 201.997 L 295.733 202.531 L 295.6 202.531 L 295.6 203.064 L 295.467 203.064 L 295.467 203.597 L 295.333 203.597 L 295.333 203.997 L 295.2 203.997 L 295.2 204.531 L 295.067 204.531 L 295.067 205.064 L 294.933 205.064 L 294.933 205.597 L 294.8 205.597 L 294.8 205.997 L 294.667 205.997 L 294.667 206.531 L 294.533 206.531 L 294.533 206.931 L 294.4 206.931 L 294.4 207.331 L 294.267 207.331 L 294.267 207.731 L 294.133 207.731 L 294.133 208.131 L 294 208.131 L 294 208.531 L 293.867 208.531 L 293.867 209.064 L 293.733 209.064 L 293.733 209.464 L 293.6 209.464 L 293.6 209.864 L 293.467 209.864 L 293.467 210.264 L 293.333 210.264 L 293.333 210.664 L 293.2 210.664 L 293.2 211.064 L 293.067 211.064 L 293.067 211.464 L 292.933 211.464 L 292.933 211.997 L 292.8 211.997 L 292.8 212.397 L 292.667 212.397 L 292.667 212.797 L 292.533 212.797 L 292.533 213.197 L 292.4 213.197 L 292.4 213.597 L 292.267 213.597 L 292.267 213.997 L 292.133 213.997 L 292.133 214.264 L 292 214.264 L 292 214.664 L 291.867 214.664 L 291.867 215.064 L 291.733 215.064 L 291.733 215.331 L 291.6 215.331 L 291.6 215.731 L 291.467 215.731 L 291.467 216.131 L 291.333 216.131 L 291.333 216.397 L 291.2 216.397 L 291.2 216.797 L 291.067 216.797 L 291.067 217.197 L 290.933 217.197 L 290.933 217.464 L 290.8 217.464 L 290.8 217.864 L 290.667 217.864 L 290.667 218.264 L 290.533 218.264 L 290.533 218.531 L 290.4 218.531 L 290.4 218.931 L 290.267 218.931 L 290.267 219.331 L 290.133 219.331 L 290.133 219.731 L 290 219.731 L 290 219.997 L 289.867 219.997 L 289.867 220.397 L 289.733 220.397 L 289.733 220.664 L 289.6 220.664 L 289.6 221.064 L 289.467 221.064 L 289.467 221.331 L 289.333 221.331 L 289.333 221.597 L 289.2 221.597 L 289.2 221.997 L 289.067 221.997 L 289.067 222.264 L 288.933 222.264 L 288.933 222.531 L 288.8 222.531 L 288.8 222.931 L 288.667 222.931 L 288.667 223.197 L 288.533 223.197 L 288.533 223.464 L 288.4 223.464 L 288.4 223.864 L 288.267 223.864 L 288.267 224.131 L 288.133 224.131 L 288.133 224.397 L 288 224.397 L 288 224.797 L 287.867 224.797 L 287.867 225.064 L 287.733 225.064 L 287.733 225.331 L 287.6 225.331 L 287.6 225.731 L 287.467 225.731 L 287.467 225.997 L 287.333 225.997 L 287.333 226.264 L 287.2 226.264 L 287.2 226.664 L 287.067 226.664 L 287.067 226.931 L 286.933 226.931 L 286.933 227.197 L 286.8 227.197 L 286.8 227.597 L 286.667 227.597 L 286.667 227.864 L 286.533 227.864 L 286.533 228.131 L 286.4 228.131 L 286.4 228.397 L 286.267 228.397 L 286.267 228.664 L 286.133 228.664 L 286.133 228.931 L 286 228.931 L 286 229.197 L 285.867 229.197 L 285.867 229.464 L 285.733 229.464 L 285.733 229.731 L 285.6 229.731 L 285.6 229.997 L 285.467 229.997 L 285.467 230.264 L 285.333 230.264 L 285.333 230.531 L 285.2 230.531 L 285.2 230.797 L 285.067 230.797 L 285.067 231.064 L 284.933 231.064 L 284.933 231.331 L 284.8 231.331 L 284.8 231.597 L 284.667 231.597 L 284.667 231.997 L 284.533 231.997 L 284.533 232.264 L 284.4 232.264 L 284.4 232.531 L 284.267 232.531 L 284.267 232.797 L 284.133 232.797 L 284.133 233.064 L 284 233.064 L 284 233.331 L 283.867 233.331 L 283.867 233.597 L 283.733 233.597 L 283.733 233.864 L 283.6 233.864 L 283.6 234.131 L 283.467 234.131 L 283.467 234.397 L 283.333 234.397 L 283.333 234.664 L 283.2 234.664 L 283.2 234.797 L 283.067 234.797 L 283.067 235.064 L 282.933 235.064 L 282.933 235.331 L 282.8 235.331 L 282.8 235.597 L 282.667 235.597 L 282.667 235.864 L 282.533 235.864 L 282.533 236.131 L 282.4 236.131 L 282.4 236.264 L 282.267 236.264 L 282.267 236.531 L 282.133 236.531 L 282.133 236.797 L 282 236.797 L 282 237.064 L 281.867 237.064 L 281.867 237.331 L 281.733 237.331 L 281.733 237.597 L 281.6 237.597 L 281.6 237.731 L 281.467 237.731 L 281.467 237.997 L 281.333 237.997 L 281.333 238.264 L 281.2 238.264 L 281.2 238.531 L 281.067 238.531 L 281.067 238.797 L 280.933 238.797 L 280.933 239.064 L 280.8 239.064 L 280.8 239.197 L 280.667 239.197 L 280.667 239.464 L 280.533 239.464 L 280.533 239.731 L 280.4 239.731 L 280.4 239.997 L 280.267 239.997 L 280.267 240.264 L 280.133 240.264 L 280.133 240.531 L 280 240.531 L 280 240.664 L 279.867 240.664 L 279.867 240.931 L 279.733 240.931 L 279.733 241.197 L 279.6 241.197 L 279.6 241.331 L 279.467 241.331 L 279.467 241.597 L 279.333 241.597 L 279.333 241.864 L 279.2 241.864 L 279.2 241.997 L 279.067 241.997 L 279.067 242.264 L 278.933 242.264 L 278.933 242.397 L 278.8 242.397 L 278.8 242.664 L 278.667 242.664 L 278.667 242.931 L 278.533 242.931 L 278.533 243.064 L 278.4 243.064 L 278.4 243.331 L 278.267 243.331 L 278.267 243.597 L 278.133 243.597 L 278.133 243.731 L 278 243.731 L 278 243.997 L 277.867 243.997 L 277.867 244.264 L 277.733 244.264 L 277.733 244.397 L 277.6 244.397 L 277.6 244.664 L 277.467 244.664 L 277.467 244.797 L 277.333 244.797 L 277.333 245.064 L 277.2 245.064 L 277.2 245.331 L 277.067 245.331 L 277.067 245.464 L 276.933 245.464 L 276.933 245.731 L 276.8 245.731 L 276.8 245.997 L 276.667 245.997 L 276.667 246.131 L 276.533 246.131 L 276.533 246.397 L 276.4 246.397 L 276.4 246.664 L 276.267 246.664 L 276.267 246.797 L 276.133 246.797 L 276.133 247.064 L 276 247.064 L 276 247.197 L 275.867 247.197 L 275.867 247.464 L 275.733 247.464 L 275.733 247.597 L 275.6 247.597 L 275.6 247.864 L 275.467 247.864 L 275.467 247.997 L 275.333 247.997 L 275.333 248.264 L 275.2 248.264 L 275.2 248.397 L 275.067 248.397 L 275.067 248.664 L 274.933 248.664 L 274.933 248.797 L 274.8 248.797 L 274.8 248.931 L 274.667 248.931 L 274.667 249.197 L 274.533 249.197 L 274.533 249.331 L 274.4 249.331 L 274.4 249.597 L 274.267 249.597 L 274.267 249.731 L 274.133 249.731 L 274.133 249.997 L 274 249.997 L 274 250.131 L 273.867 250.131 L 273.867 250.397 L 273.733 250.397 L 273.733 250.531 L 273.6 250.531 L 273.6 250.797 L 273.467 250.797 L 273.467 250.931 L 273.333 250.931 L 273.333 251.197 L 273.2 251.197 L 273.2 251.331 L 273.067 251.331 L 273.067 251.597 L 272.933 251.597 L 272.933 251.731 L 272.8 251.731 L 272.8 251.997 L 272.667 251.997 L 272.667 252.131 L 272.533 252.131 L 272.533 252.397 L 272.4 252.397 L 272.4 252.531 L 272.267 252.531 L 272.267 252.664 L 272.133 252.664 L 272.133 252.931 L 272 252.931 L 272 253.064 L 271.867 253.064 L 271.867 253.331 L 271.733 253.331 L 271.733 253.464 L 271.6 253.464 L 271.6 253.597 L 271.467 253.597 L 271.467 253.864 L 271.333 253.864 L 271.333 253.997 L 271.2 253.997 L 271.2 254.131 L 271.067 254.131 L 271.067 254.397 L 270.933 254.397 L 270.933 254.531 L 270.8 254.531 L 270.8 254.664 L 270.667 254.664 L 270.667 254.931 L 270.533 254.931 L 270.533 255.064 L 270.4 255.064 L 270.4 255.197 L 270.267 255.197 L 270.267 255.464 L 270.133 255.464 L 270.133 255.597 L 270 255.597 L 270 255.731 L 269.867 255.731 L 269.867 255.997 L 269.733 255.997 L 269.733 256.131 L 269.6 256.131 L 269.6 256.264 L 269.467 256.264 L 269.467 256.531 L 269.333 256.531 L 269.333 256.664 L 269.2 256.664 L 269.2 256.797 L 269.067 256.797 L 269.067 257.064 L 268.933 257.064 L 268.933 257.197 L 268.8 257.197 L 268.8 257.331 L 268.667 257.331 L 268.667 257.597 L 268.533 257.597 L 268.533 257.731 L 268.4 257.731 L 268.4 257.864 L 268.267 257.864 L 268.267 258.131 L 268.133 258.131 L 268.133 258.264 L 268 258.264 L 268 258.397 L 267.867 258.397 L 267.867 258.664 L 267.733 258.664 L 267.733 258.797 L 267.6 258.797 L 267.6 258.931 L 267.467 258.931 L 267.467 259.064 L 267.333 259.064 L 267.333 259.331 L 267.2 259.331 L 267.2 259.464 L 267.067 259.464 L 267.067 259.597 L 266.933 259.597 L 266.933 259.731 L 266.8 259.731 L 266.8 259.864 L 266.667 259.864 L 266.667 260.131 L 266.533 260.131 L 266.533 260.264 L 266.4 260.264 L 266.4 260.397 L 266.267 260.397 L 266.267 260.531 L 266.133 260.531 L 266.133 260.664 L 266 260.664 L 266 260.931 L 265.867 260.931 L 265.867 261.064 L 265.733 261.064 L 265.733 261.197 L 265.6 261.197 L 265.6 261.331 L 265.467 261.331 L 265.467 261.464 L 265.333 261.464 L 265.333 261.731 L 265.2 261.731 L 265.2 261.864 L 265.067 261.864 L 265.067 261.997 L 264.933 261.997 L 264.933 262.131 L 264.8 262.131 L 264.8 262.264 L 264.667 262.264 L 264.667 262.531 L 264.533 262.531 L 264.533 262.664 L 264.4 262.664 L 264.4 262.797 L 264.267 262.797 L 264.267 262.931 L 264.133 262.931 L 264.133 263.064 L 264 263.064 L 264 263.331 L 263.867 263.331 L 263.867 263.464 L 263.733 263.464 L 263.733 263.597 L 263.6 263.597 L 263.6 263.731 L 263.467 263.731 L 263.467 263.864 L 263.333 263.864 L 263.333 264.131 L 263.2 264.131 L 263.2 264.264 L 263.067 264.264 L 263.067 264.397 L 262.933 264.397 L 262.933 264.531 L 262.8 264.531 L 262.8 264.664 L 262.667 264.664 L 262.667 264.797 L 262.533 264.797 L 262.533 265.064 L 262.4 265.064 L 262.4 265.197 L 262.267 265.197 L 262.267 265.331 L 262.133 265.331 L 262.133 265.464 L 262 265.464 L 262 265.597 L 261.867 265.597 L 261.867 265.731 L 261.733 265.731 L 261.733 265.864 L 261.6 265.864 L 261.6 265.997 L 261.467 265.997 L 261.467 266.131 L 261.333 266.131 L 261.333 266.397 L 261.2 266.397 L 261.2 266.531 L 261.067 266.531 L 261.067 266.664 L 260.933 266.664 L 260.933 266.797 L 260.8 266.797 L 260.8 266.931 L 260.667 266.931 L 260.667 267.064 L 260.533 267.064 L 260.533 267.197 L 260.4 267.197 L 260.4 267.331 L 260.267 267.331 L 260.267 267.464 L 260.133 267.464 L 260.133 267.731 L 260 267.731 L 260 267.864 L 259.867 267.864 L 259.867 267.997 L 259.733 267.997 L 259.733 268.131 L 259.6 268.131 L 259.6 268.264 L 259.467 268.264 L 259.467 268.397 L 259.333 268.397 L 259.333 268.531 L 259.2 268.531 L 259.2 268.664 L 259.067 268.664 L 259.067 268.797 L 258.933 268.797 L 258.933 268.931 L 258.8 268.931 L 258.8 269.064 L 258.667 269.064 L 258.667 269.197 L 258.533 269.197 L 258.533 269.331 L 258.4 269.331 L 258.4 269.597 L 258.267 269.597 L 258.267 269.731 L 258.133 269.731 L 258.133 269.864 L 258 269.864 L 258 269.997 L 257.867 269.997 L 257.867 270.131 L 257.733 270.131 L 257.733 270.264 L 257.6 270.264 L 257.6 270.397 L 257.467 270.397 L 257.467 270.531 L 257.333 270.531 L 257.333 270.664 L 257.2 270.664 L 257.2 270.797 L 257.067 270.797 L 257.067 270.931 L 256.933 270.931 L 256.933 271.064 L 256.8 271.064 L 256.8 271.197 L 256.667 271.197 L 256.667 271.331 L 256.533 271.331 L 256.533 271.464 L 256.4 271.464 L 256.4 271.597 L 256.267 271.597 L 256.267 271.731 L 256.133 271.731 L 256.133 271.864 L 256 271.864 L 256 271.997 L 255.867 271.997 L 255.867 272.131 L 255.733 272.131 L 255.733 272.264 L 255.6 272.264 L 255.6 272.397 L 255.467 272.397 L 255.467 272.531 L 255.333 272.531 L 255.333 272.664 L 255.2 272.664 L 255.2 272.797 L 255.067 272.797 L 255.067 272.931 L 254.933 272.931 L 254.933 273.064 L 254.8 273.064 L 254.8 273.197 L 254.667 273.197 L 254.667 273.331 L 254.533 273.331 L 254.533 273.464 L 254.267 273.464 L 254.267 273.597 L 254.133 273.597 L 254.133 273.731 L 254 273.731 L 254 273.864 L 253.867 273.864 L 253.867 273.997 L 253.733 273.997 L 253.733 274.131 L 253.6 274.131 L 253.6 274.264 L 253.467 274.264 L 253.467 274.397 L 253.333 274.397 L 253.333 274.531 L 253.2 274.531 L 253.2 274.664 L 253.067 274.664 L 253.067 274.797 L 252.933 274.797 L 252.933 274.931 L 252.8 274.931 L 252.8 275.064 L 252.667 275.064 L 252.667 275.197 L 252.533 275.197 L 252.533 275.331 L 252.4 275.331 L 252.4 275.464 L 252.267 275.464 L 252.267 275.597 L 252.133 275.597 L 252.133 275.731 L 252 275.731 L 252 275.864 L 251.733 275.864 L 251.733 275.997 L 251.6 275.997 L 251.6 276.131 L 251.467 276.131 L 251.467 276.264 L 251.333 276.264 L 251.333 276.397 L 251.2 276.397 L 251.2 276.531 L 251.067 276.531 L 251.067 276.664 L 250.933 276.664 L 250.933 276.797 L 250.8 276.797 L 250.8 276.931 L 250.533 276.931 L 250.533 277.064 L 250.4 277.064 L 250.4 277.197 L 250.267 277.197 L 250.267 277.331 L 250.133 277.331 L 250.133 277.464 L 250 277.464 L 250 277.597 L 249.867 277.597 L 249.867 277.731 L 249.733 277.731 L 249.733 277.864 L 249.6 277.864 L 249.6 277.997 L 249.333 277.997 L 249.333 278.131 L 249.2 278.131 L 249.2 278.264 L 249.067 278.264 L 249.067 278.397 L 248.933 278.397 L 248.933 278.531 L 248.8 278.531 L 248.8 278.664 L 248.667 278.664 L 248.667 278.797 L 248.533 278.797 L 248.533 278.931 L 248.4 278.931 L 248.4 279.064 L 248.133 279.064 L 248.133 279.197 L 248 279.197 L 248 279.331 L 247.867 279.331 L 247.867 279.464 L 247.733 279.464 L 247.733 279.597 L 247.6 279.597 L 247.6 279.731 L 247.467 279.731 L 247.467 279.864 L 247.333 279.864 L 247.333 279.997 L 247.2 279.997 L 247.2 280.131 L 247.067 280.131 L 247.067 280.264 L 246.8 280.264 L 246.8 280.397 L 246.667 280.397 L 246.667 280.531 L 246.533 280.531 L 246.533 280.664 L 246.4 280.664 L 246.4 280.797 L 246.133 280.797 L 246.133 280.931 L 246 280.931 L 246 281.064 L 245.867 281.064 L 245.867 281.197 L 245.733 281.197 L 245.733 281.331 L 245.467 281.331 L 245.467 281.464 L 245.333 281.464 L 245.333 281.597 L 245.2 281.597 L 245.2 281.731 L 245.067 281.731 L 245.067 281.864 L 244.8 281.864 L 244.8 281.997 L 244.667 281.997 L 244.667 282.131 L 244.533 282.131 L 244.533 282.264 L 244.4 282.264 L 244.4 282.397 L 244.133 282.397 L 244.133 282.531 L 244 282.531 L 244 282.664 L 243.867 282.664 L 243.867 282.797 L 243.733 282.797 L 243.733 282.931 L 243.467 282.931 L 243.467 283.064 L 243.333 283.064 L 243.333 283.197 L 243.2 283.197 L 243.2 283.331 L 243.067 283.331 L 243.067 283.464 L 242.8 283.464 L 242.8 283.597 L 242.667 283.597 L 242.667 283.731 L 242.533 283.731 L 242.533 283.864 L 242.4 283.864 L 242.4 283.997 L 242.133 283.997 L 242.133 284.131 L 242 284.131 L 242 284.264 L 241.867 284.264 L 241.867 284.397 L 241.733 284.397 L 241.733 284.531 L 241.467 284.531 L 241.467 284.664 L 241.333 284.664 L 241.333 284.797 L 241.2 284.797 L 241.2 284.931 L 241.067 284.931 L 241.067 285.064 L 240.8 285.064 L 240.8 285.197 L 240.667 285.197 L 240.667 285.331 L 240.4 285.331 L 240.4 285.464 L 240.267 285.464 L 240.267 285.597 L 240.133 285.597 L 240.133 285.731 L 239.867 285.731 L 239.867 285.864 L 239.733 285.864 L 239.733 285.997 L 239.6 285.997 L 239.6 286.131 L 239.333 286.131 L 239.333 286.264 L 239.2 286.264 L 239.2 286.397 L 238.933 286.397 L 238.933 286.531 L 238.8 286.531 L 238.8 286.664 L 238.667 286.664 L 238.667 286.797 L 238.4 286.797 L 238.4 286.931 L 238.267 286.931 L 238.267 287.064 L 238 287.064 L 238 287.197 L 237.867 287.197 L 237.867 287.331 L 237.733 287.331 L 237.733 287.464 L 237.467 287.464 L 237.467 287.597 L 237.333 287.597 L 237.333 287.731 L 237.2 287.731 L 237.2 287.864 L 236.933 287.864 L 236.933 287.997 L 236.8 287.997 L 236.8 288.131 L 236.533 288.131 L 236.533 288.264 L 236.4 288.264 L 236.4 288.397 L 236.267 288.397 L 236.267 288.531 L 236 288.531 L 236 288.664 L 235.867 288.664 L 235.867 288.797 L 235.6 288.797 L 235.6 288.931 L 235.467 288.931 L 235.467 289.064 L 235.333 289.064 L 235.333 289.197 L 235.067 289.197 L 235.067 289.331 L 234.933 289.331 L 234.933 289.464 L 234.667 289.464 L 234.667 289.597 L 234.533 289.597 L 234.533 289.731 L 234.267 289.731 L 234.267 289.864 L 234.133 289.864 L 234.133 289.997 L 233.867 289.997 L 233.867 290.131 L 233.6 290.131 L 233.6 290.264 L 233.467 290.264 L 233.467 290.397 L 233.2 290.397 L 233.2 290.531 L 233.067 290.531 L 233.067 290.664 L 232.8 290.664 L 232.8 290.797 L 232.667 290.797 L 232.667 290.931 L 232.4 290.931 L 232.4 291.064 L 232.267 291.064 L 232.267 291.197 L 232 291.197 L 232 291.331 L 231.867 291.331 L 231.867 291.464 L 231.6 291.464 L 231.6 291.597 L 231.333 291.597 L 231.333 291.731 L 231.2 291.731 L 231.2 291.864 L 230.933 291.864 L 230.933 291.997 L 230.8 291.997 L 230.8 292.131 L 230.533 292.131 L 230.533 292.264 L 230.4 292.264 L 230.4 292.397 L 230.133 292.397 L 230.133 292.531 L 230 292.531 L 230 292.664 L 229.733 292.664 L 229.733 292.797 L 229.6 292.797 L 229.6 292.931 L 229.333 292.931 L 229.333 293.064 L 229.067 293.064 L 229.067 293.197 L 228.933 293.197 L 228.933 293.331 L 228.667 293.331 L 228.667 293.464 L 228.4 293.464 L 228.4 293.597 L 228.267 293.597 L 228.267 293.731 L 228 293.731 L 228 293.864 L 227.733 293.864 L 227.733 293.997 L 227.467 293.997 L 227.467 294.131 L 227.333 294.131 L 227.333 294.264 L 227.067 294.264 L 227.067 294.397 L 226.8 294.397 L 226.8 294.531 L 226.667 294.531 L 226.667 294.664 L 226.4 294.664 L 226.4 294.797 L 226.133 294.797 L 226.133 294.931 L 225.867 294.931 L 225.867 295.064 L 225.733 295.064 L 225.733 295.197 L 225.467 295.197 L 225.467 295.331 L 225.2 295.331 L 225.2 295.464 L 224.933 295.464 L 224.933 295.597 L 224.8 295.597 L 224.8 295.731 L 224.533 295.731 L 224.533 295.864 L 224.267 295.864 L 224.267 295.997 L 224.133 295.997 L 224.133 296.131 L 223.867 296.131 L 223.867 296.264 L 223.6 296.264 L 223.6 296.397 L 223.333 296.397 L 223.333 296.531 L 223.2 296.531 L 223.2 296.664 L 222.933 296.664 L 222.933 296.797 L 222.667 296.797 L 222.667 296.931 L 222.4 296.931 L 222.4 297.064 L 222.133 297.064 L 222.133 297.197 L 221.867 297.197 L 221.867 297.331 L 221.6 297.331 L 221.6 297.464 L 221.333 297.464 L 221.333 297.597 L 221.067 297.597 L 221.067 297.731 L 220.8 297.731 L 220.8 297.864 L 220.667 297.864 L 220.667 297.997 L 220.4 297.997 L 220.4 298.131 L 220.133 298.131 L 220.133 298.264 L 219.867 298.264 L 219.867 298.397 L 219.6 298.397 L 219.6 298.531 L 219.333 298.531 L 219.333 298.664 L 219.067 298.664 L 219.067 298.797 L 218.8 298.797 L 218.8 298.931 L 218.533 298.931 L 218.533 299.064 L 218.267 299.064 L 218.267 299.197 L 218 299.197 L 218 299.331 L 217.733 299.331 L 217.733 299.464 L 217.467 299.464 L 217.467 299.597 L 217.2 299.597 L 217.2 299.731 L 216.933 299.731 L 216.933 299.864 L 216.667 299.864 L 216.667 299.997 L 216.4 299.997 L 216.4 300.131 L 216.133 300.131 L 216.133 300.264 L 215.867 300.264 L 215.867 300.397 L 215.6 300.397 L 215.6 300.531 L 215.333 300.531 L 215.333 300.664 L 214.933 300.664 L 214.933 300.797 L 214.667 300.797 L 214.667 300.931 L 214.4 300.931 L 214.4 301.064 L 214.133 301.064 L 214.133 301.197 L 213.867 301.197 L 213.867 301.331 L 213.467 301.331 L 213.467 301.464 L 213.2 301.464 L 213.2 301.597 L 212.933 301.597 L 212.933 301.731 L 212.667 301.731 L 212.667 301.864 L 212.267 301.864 L 212.267 301.997 L 212 301.997 L 212 302.131 L 211.733 302.131 L 211.733 302.264 L 211.467 302.264 L 211.467 302.397 L 211.067 302.397 L 211.067 302.531 L 210.8 302.531 L 210.8 302.664 L 210.533 302.664 L 210.533 302.797 L 210.267 302.797 L 210.267 302.931 L 210 302.931 L 210 303.064 L 209.6 303.064 L 209.6 303.197 L 209.333 303.197 L 209.333 303.331 L 208.933 303.331 L 208.933 303.464 L 208.667 303.464 L 208.667 303.597 L 208.267 303.597 L 208.267 303.731 L 208 303.731 L 208 303.864 L 207.6 303.864 L 207.6 303.997 L 207.333 303.997 L 207.333 304.131 L 206.933 304.131 L 206.933 304.264 L 206.533 304.264 L 206.533 304.397 L 206.267 304.397 L 206.267 304.531 L 205.867 304.531 L 205.867 304.664 L 205.6 304.664 L 205.6 304.797 L 205.2 304.797 L 205.2 304.931 L 204.933 304.931 L 204.933 305.064 L 204.533 305.064 L 204.533 305.197 L 204.267 305.197 L 204.267 305.331 L 203.867 305.331 L 203.867 305.464 L 203.467 305.464 L 203.467 305.597 L 203.2 305.597 L 203.2 305.731 L 202.8 305.731 L 202.8 305.864 L 202.533 305.864 L 202.533 305.997 L 202.133 305.997 L 202.133 306.131 L 201.733 306.131 L 201.733 306.264 L 201.333 306.264 L 201.333 306.397 L 200.8 306.397 L 200.8 306.531 L 200.4 306.531 L 200.4 306.664 L 200 306.664 L 200 306.797 L 199.6 306.797 L 199.6 306.931 L 199.2 306.931 L 199.2 307.064 L 198.8 307.064 L 198.8 307.197 L 198.4 307.197 L 198.4 307.331 L 198 307.331 L 198 307.464 L 197.6 307.464 L 197.6 307.597 L 197.2 307.597 L 197.2 307.731 L 196.8 307.731 L 196.8 307.864 L 196.4 307.864 L 196.4 307.997 L 196 307.997 L 196 308.131 L 195.6 308.131 L 195.6 308.264 L 195.2 308.264 L 195.2 308.397 L 194.667 308.397 L 194.667 308.531 L 194.267 308.531 L 194.267 308.664 L 193.733 308.664 L 193.733 308.797 L 193.2 308.797 L 193.2 308.931 L 192.8 308.931 L 192.8 309.064 L 192.267 309.064 L 192.267 309.197 L 191.867 309.197 L 191.867 309.331 L 191.333 309.331 L 191.333 309.464 L 190.8 309.464 L 190.8 309.597 L 190.4 309.597 L 190.4 309.731 L 189.867 309.731 L 189.867 309.864 L 189.333 309.864 L 189.333 309.997 L 188.933 309.997 L 188.933 310.131 L 188.4 310.131 L 188.4 310.264 L 187.867 310.264 L 187.867 310.397 L 187.2 310.397 L 187.2 310.531 L 186.667 310.531 L 186.667 310.664 L 186 310.664 L 186 310.797 L 185.467 310.797 L 185.467 310.931 L 184.8 310.931 L 184.8 311.064 L 184.267 311.064 L 184.267 311.197 L 183.6 311.197 L 183.6 311.331 L 183.067 311.331 L 183.067 311.464 L 182.533 311.464 L 182.533 311.597 L 181.867 311.597 L 181.867 311.731 L 181.333 311.731 L 181.333 311.864 L 180.533 311.864 L 180.533 311.997 L 179.733 311.997 L 179.733 312.131 L 178.933 312.131 L 178.933 312.264 L 178.133 312.264 L 178.133 312.397 L 177.467 312.397 L 177.467 312.531 L 176.667 312.531 L 176.667 312.664 L 175.867 312.664 L 175.867 312.797 L 175.067 312.797 L 175.067 312.931 L 174.267 312.931 L 174.267 313.064 L 173.333 313.064 L 173.333 313.197 L 172.267 313.197 L 172.267 313.331 L 171.2 313.331 L 171.2 313.464 L 170.133 313.464 L 170.133 313.597 L 168.933 313.597 L 168.933 313.731 L 167.867 313.731 L 167.867 313.864 L 166.8 313.864 L 166.8 313.997 L 165.067 313.997 L 165.067 314.131 L 163.2 314.131 L 163.2 314.264 L 161.467 314.264 L 161.467 314.397 L 159.6 314.397 L 159.6 314.531 L 156 314.531 L 156 314.664" fill="url(#_lgradient_3)"></path><mask id="_mask_fnRGnsp6kmV6qt8c16QKcorQD0L0wt2K"><path d=" M 258.195 49.612 C 231.676 22.02 194.679 5 152.032 5 C 127.845 5 105.002 11.359 85.293 22.197 C 65.493 33.04 48.83 48.54 37.003 66.632 C 25.09 85.001 18.19 106.143 18.19 128.091 C 18.19 136.163 19.151 144.372 21.07 152.539 C 22.686 148.824 24.478 145.12 26.449 141.424 C 32.172 130.717 39.004 120.715 46.746 111.603 C 48.993 100.872 53.403 90.569 59.49 81.237 C 68.808 66.812 82.246 54.452 98.193 45.761 C 114.049 36.981 132.503 31.876 152.032 31.876 C 187.064 31.876 217.253 45.761 238.844 68.249 C 261.06 91.451 274.321 123.885 274.321 159.805 C 274.321 195.64 260.884 228.072 238.575 251.185 C 216.805 273.85 186.435 287.827 151.585 287.827 C 131.16 287.736 111.542 282.717 94.787 273.76 C 80.634 266.235 68.718 255.933 60.388 243.659 C 52.233 231.655 47.577 217.677 47.577 202.36 C 47.664 189.009 51.337 174.5 59.49 159.269 C 71.406 136.871 88.248 120.655 105.629 110.263 C 125.336 98.617 145.135 94.585 158.573 98.083 C 163.141 99.244 167.176 101.575 169.861 104.708 C 180.253 116.628 166.459 137.948 158.843 147.173 C 154.813 151.924 152.751 154.341 160.636 157.299 C 177.119 163.48 198.529 177.188 195.573 197.523 C 194.139 207.915 188.945 214.005 180.077 218.843 C 168.071 225.472 150.96 228.428 132.414 225.563 C 113.603 222.607 93.535 213.559 76.243 195.912 C 71.624 191.211 67.219 185.869 63.087 179.832 C 60.514 187.603 59.208 195.169 59.208 202.451 C 59.169 207.996 59.908 213.491 61.374 218.816 C 82.03 238.277 105.814 248.573 128.383 251.991 C 152.929 255.844 176.221 251.633 192.975 242.405 C 198.351 239.447 203.099 235.955 207.129 232.012 C 214.833 224.577 220.479 213.379 222.183 201.285 C 223.165 194.028 222.897 186.323 220.749 178.887 C 218.597 171.271 214.568 163.925 208.295 157.568 C 203.099 152.191 196.379 147.621 187.959 144.128 C 193.245 136.964 196.648 130.061 198.351 123.523 C 200.141 116.447 200.141 109.724 198.62 103.633 C 197.187 97.275 194.139 91.812 190.196 87.153 C 183.837 79.804 174.969 74.697 165.293 72.191 C 145.405 66.993 117.813 71.829 92.012 87.239 C 70.779 99.784 50.263 119.58 35.84 146.635 C 25.536 165.987 20.877 184.709 20.877 202.271 C 20.789 223.233 27.149 242.315 38.169 258.711 C 49.009 274.656 64.328 287.827 82.246 297.412 C 102.669 308.34 126.681 314.523 151.496 314.613 C 191.989 314.613 229.795 299.025 257.927 269.82 C 284.983 241.689 301.196 202.808 301.196 159.805 C 301.196 116.804 285.16 77.745 258.195 49.612 L 258.195 49.612 Z " fill="white" stroke="none"></path></mask><path d=" M 258.195 49.612 C 231.676 22.02 194.679 5 152.032 5 C 127.845 5 105.002 11.359 85.293 22.197 C 65.493 33.04 48.83 48.54 37.003 66.632 C 25.09 85.001 18.19 106.143 18.19 128.091 C 18.19 136.163 19.151 144.372 21.07 152.539 C 22.686 148.824 24.478 145.12 26.449 141.424 C 32.172 130.717 39.004 120.715 46.746 111.603 C 48.993 100.872 53.403 90.569 59.49 81.237 C 68.808 66.812 82.246 54.452 98.193 45.761 C 114.049 36.981 132.503 31.876 152.032 31.876 C 187.064 31.876 217.253 45.761 238.844 68.249 C 261.06 91.451 274.321 123.885 274.321 159.805 C 274.321 195.64 260.884 228.072 238.575 251.185 C 216.805 273.85 186.435 287.827 151.585 287.827 C 131.16 287.736 111.542 282.717 94.787 273.76 C 80.634 266.235 68.718 255.933 60.388 243.659 C 52.233 231.655 47.577 217.677 47.577 202.36 C 47.664 189.009 51.337 174.5 59.49 159.269 C 71.406 136.871 88.248 120.655 105.629 110.263 C 125.336 98.617 145.135 94.585 158.573 98.083 C 163.141 99.244 167.176 101.575 169.861 104.708 C 180.253 116.628 166.459 137.948 158.843 147.173 C 154.813 151.924 152.751 154.341 160.636 157.299 C 177.119 163.48 198.529 177.188 195.573 197.523 C 194.139 207.915 188.945 214.005 180.077 218.843 C 168.071 225.472 150.96 228.428 132.414 225.563 C 113.603 222.607 93.535 213.559 76.243 195.912 C 71.624 191.211 67.219 185.869 63.087 179.832 C 60.514 187.603 59.208 195.169 59.208 202.451 C 59.169 207.996 59.908 213.491 61.374 218.816 C 82.03 238.277 105.814 248.573 128.383 251.991 C 152.929 255.844 176.221 251.633 192.975 242.405 C 198.351 239.447 203.099 235.955 207.129 232.012 C 214.833 224.577 220.479 213.379 222.183 201.285 C 223.165 194.028 222.897 186.323 220.749 178.887 C 218.597 171.271 214.568 163.925 208.295 157.568 C 203.099 152.191 196.379 147.621 187.959 144.128 C 193.245 136.964 196.648 130.061 198.351 123.523 C 200.141 116.447 200.141 109.724 198.62 103.633 C 197.187 97.275 194.139 91.812 190.196 87.153 C 183.837 79.804 174.969 74.697 165.293 72.191 C 145.405 66.993 117.813 71.829 92.012 87.239 C 70.779 99.784 50.263 119.58 35.84 146.635 C 25.536 165.987 20.877 184.709 20.877 202.271 C 20.789 223.233 27.149 242.315 38.169 258.711 C 49.009 274.656 64.328 287.827 82.246 297.412 C 102.669 308.34 126.681 314.523 151.496 314.613 C 191.989 314.613 229.795 299.025 257.927 269.82 C 284.983 241.689 301.196 202.808 301.196 159.805 C 301.196 116.804 285.16 77.745 258.195 49.612 L 258.195 49.612 Z " fill="none"></path><path d=" M 258.195 49.612 C 231.676 22.02 194.679 5 152.032 5 C 127.845 5 105.002 11.359 85.293 22.197 C 65.493 33.04 48.83 48.54 37.003 66.632 C 25.09 85.001 18.19 106.143 18.19 128.091 C 18.19 136.163 19.151 144.372 21.07 152.539 C 22.686 148.824 24.478 145.12 26.449 141.424 C 32.172 130.717 39.004 120.715 46.746 111.603 C 48.993 100.872 53.403 90.569 59.49 81.237 C 68.808 66.812 82.246 54.452 98.193 45.761 C 114.049 36.981 132.503 31.876 152.032 31.876 C 187.064 31.876 217.253 45.761 238.844 68.249 C 261.06 91.451 274.321 123.885 274.321 159.805 C 274.321 195.64 260.884 228.072 238.575 251.185 C 216.805 273.85 186.435 287.827 151.585 287.827 C 131.16 287.736 111.542 282.717 94.787 273.76 C 80.634 266.235 68.718 255.933 60.388 243.659 C 52.233 231.655 47.577 217.677 47.577 202.36 C 47.664 189.009 51.337 174.5 59.49 159.269 C 71.406 136.871 88.248 120.655 105.629 110.263 C 125.336 98.617 145.135 94.585 158.573 98.083 C 163.141 99.244 167.176 101.575 169.861 104.708 C 180.253 116.628 166.459 137.948 158.843 147.173 C 154.813 151.924 152.751 154.341 160.636 157.299 C 177.119 163.48 198.529 177.188 195.573 197.523 C 194.139 207.915 188.945 214.005 180.077 218.843 C 168.071 225.472 150.96 228.428 132.414 225.563 C 113.603 222.607 93.535 213.559 76.243 195.912 C 71.624 191.211 67.219 185.869 63.087 179.832 C 60.514 187.603 59.208 195.169 59.208 202.451 C 59.169 207.996 59.908 213.491 61.374 218.816 C 82.03 238.277 105.814 248.573 128.383 251.991 C 152.929 255.844 176.221 251.633 192.975 242.405 C 198.351 239.447 203.099 235.955 207.129 232.012 C 214.833 224.577 220.479 213.379 222.183 201.285 C 223.165 194.028 222.897 186.323 220.749 178.887 C 218.597 171.271 214.568 163.925 208.295 157.568 C 203.099 152.191 196.379 147.621 187.959 144.128 C 193.245 136.964 196.648 130.061 198.351 123.523 C 200.141 116.447 200.141 109.724 198.62 103.633 C 197.187 97.275 194.139 91.812 190.196 87.153 C 183.837 79.804 174.969 74.697 165.293 72.191 C 145.405 66.993 117.813 71.829 92.012 87.239 C 70.779 99.784 50.263 119.58 35.84 146.635 C 25.536 165.987 20.877 184.709 20.877 202.271 C 20.789 223.233 27.149 242.315 38.169 258.711 C 49.009 274.656 64.328 287.827 82.246 297.412 C 102.669 308.34 126.681 314.523 151.496 314.613 C 191.989 314.613 229.795 299.025 257.927 269.82 C 284.983 241.689 301.196 202.808 301.196 159.805 C 301.196 116.804 285.16 77.745 258.195 49.612 L 258.195 49.612 Z " fill="none" mask="url(#_mask_fnRGnsp6kmV6qt8c16QKcorQD0L0wt2K)" vector-effect="non-scaling-stroke" stroke-width="4" stroke="rgb(4,99,242)" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"></path></svg> betahero</span>`;
});

const $$Astro$r = createAstro("/home/dww510/betahero/site/src/components/core/ToggleTheme.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$ToggleTheme = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$ToggleTheme;
  const {
    label = "Toggle between Dark and Light mode",
    class: className = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center",
    iconClass = "w-6 h-6",
    iconName = "tabler:sun"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-color-scheme>
	${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": iconClass })}
</button>`;
});

const $$Astro$q = createAstro("/home/dww510/betahero/site/src/components/core/ToggleMenu.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$ToggleMenu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$ToggleMenu;
  const {
    label = "Toggle Menu",
    class: className = "ml-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center transition",
    iconClass = "w-6 h-6",
    iconName = "tabler:menu"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-menu>
	${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": iconClass, "optimize": false })}
</button>`;
});

const $$Astro$p = createAstro("/home/dww510/betahero/site/src/components/widgets/Header.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="sticky top-0 z-40 flex-none mx-auto w-full bg-white md:bg-white/90 dark:bg-slate-900 dark:md:bg-slate-900/90 md:backdrop-blur-sm border-b dark:border-b-0">
	<div class="py-3 px-3 mx-auto w-full md:flex md:justify-between max-w-6xl md:px-4">
		<div class="flex justify-between">
			<a class="flex items-center"${addAttribute(getHomePermalink(), "href")}>
				${renderComponent($$result, "Logo", $$Logo, {})}
			</a>
			<div class="flex items-center md:hidden">
				${renderComponent($$result, "ToggleTheme", $$ToggleTheme, {})}
				${renderComponent($$result, "ToggleMenu", $$ToggleMenu, {})}
			</div>
		</div>
		<nav class="items-center w-full md:w-auto hidden md:flex text-gray-600 dark:text-slate-200 h-screen md:h-auto" aria-label="Main navigation" id="menu">
			<ul class="flex flex-col pt-8 md:pt-0 md:flex-row md:self-center collapse w-full md:w-auto collapsed text-xl md:text-base">
				<li>
					<a class="font-medium hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out"${addAttribute(getPermalink("useful-resources-to-create-websites", "post"), "href")}>Resources
					</a>
				</li>
				<li>
					<a class="font-medium hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out"${addAttribute(getBlogPermalink(), "href")}>Blog</a>
				</li>
				<li>
					<a class="font-medium hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out" href="#">Donate</a>
				</li>
				<li class="md:hidden">
					<a class="font-bold hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out" href="https://github.com/betahero-org/">Github
					</a>
				</li>
			</ul>
			<div class="md:self-center flex items-center mb-4 md:mb-0 ml-2">
				<div class="hidden items-center md:flex">
					${renderComponent($$result, "ToggleTheme", $$ToggleTheme, { "iconClass": "w-5 h-5" })}
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="RSS Feed" href="/rss.xml">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:rss", "class": "w-5 h-5" })}
					</a>
					<a href="https://github.com/betahero-org/" class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5" aria-label="BetaHero Github">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-github", "class": "w-5 h-5" })}
					</a>
				</div>
			</div>
		</nav>
	</div>
</header>`;
});

const $$Astro$o = createAstro("/home/dww510/betahero/site/src/components/widgets/Footer.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t border-gray-200 dark:border-slate-800">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<div class="md:flex md:items-center md:justify-between py-6 md:py-8">
			<ul class="flex mb-4 md:order-1 -ml-2 md:ml-4 md:mb-0">
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="twitter" href="https:/twitter.com/betahero_org/">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-twitter", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Instagram" href="https://instagram.com/bethero_org">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-instagram", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Facebook" href="https://facebook.com/betaheroes/">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-facebook", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="TikTok" href="https://tiktok.com/bethero_org/">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-tiktok", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Youtube" href="https://www.youtube.com/@betahero_org">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-youtube", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Discord" href="https://dsc.gg/betahero">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-discord", "class": "w-5 h-5" })}
					</a>
				</li>
				<li>
					<a class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="Github" href="https://github.com/betahero-org/">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-github", "class": "w-5 h-5" })}
					</a>
				</li>
			</ul>
			<div class="text-sm text-gray-700 mr-4 dark:text-slate-400">
				<a class="text-blue-600 hover:underline dark:text-gray-200" href="https://betahero.org/"> 
					${renderComponent($$result, "Logo", $$Logo, {})}
				</a>·
				All rights reserved.
			</div>
		</div>
	</div>
</footer>`;
});

const $$Astro$n = createAstro("/home/dww510/betahero/site/src/layouts/PageLayout.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$PageLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main>
		${renderSlot($$result, $$slots["default"])}
	</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
});

const $$Astro$m = createAstro("/home/dww510/betahero/site/src/components/core/Picture.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio = 1,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    class: className = "",
    ...attrs
  } = Astro2.props;
  let picture = null;
  try {
    picture = src && await getPicture({
      src,
      widths,
      formats,
      aspectRatio
    });
  } catch (e) {
  }
  const { image = {}, sources = [] } = picture || {};
  return renderTemplate`${src && image?.src && renderTemplate`${maybeRenderHead($$result)}<picture${spreadAttributes(attrs)}>
			${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
			<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${addAttribute(alt, "alt")}${addAttribute(className, "class")}>
		</picture>`}`;
});

const $$Astro$l = createAstro("/home/dww510/betahero/site/src/components/widgets/Hero.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<section>
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<div class="py-12 md:py-20">
			<div class="text-center pb-10 md:pb-16">
				<h1 class="text-5xl md:text-[3.50rem] font-bold leading-tighter tracking-tighter mb-4 font-heading">
					Heroes aren't born
					<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 sm:whitespace-nowrap">they are made</span>
				</h1>
				<div class="max-w-3xl mx-auto">
					<p class="text-xl text-gray-600 mb-8 dark:text-slate-400">
						Betahero is a non-profit organization aimed at inspiring, educating, and mentoring youth through technology. <span class="inline sm:hidden">...</span><span class="hidden sm:inline">At the same time we promote social heroes do to their great deeds through awards and honorable mentions.</span>
					</p>
					<div class="max-w-none px-6 flex flex-nowrap flex-col sm:flex-row sm:justify-center gap-4">
						<div class="flex w-full sm:w-auto">
							<a class="btn text-white border border-primary-600 bg-primary-600 hover:bg-primary-800 hover:border-primary-800 sm:mb-0 w-full" href="#features" rel="noopener">
								${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:world", "class": "w-5 h-5 mr-1 -ml-1.5" })} Get involved
							</a>
						</div>
						<div class="flex w-full sm:w-auto">
							<a class="btn text-white bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 w-full" href="https://github.com/sponsors/betahero-org/" target="_blank">
								${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:heart", "class": "w-5 h-5 mr-1 -ml-1.5" })}	Sponsor on Github
							</a>
					
						</div>
					</div>
				</div>
			</div>
			<div>
				<div class="relative mb-8 m-auto max-w-3xl">
					${renderComponent($$result, "Picture", $$Picture, { "src": import('./chunks/hero.d39d7ce7.mjs'), "class": "mx-auto rounded-md shadow-lg bg-gray-400 dark:bg-slate-700 w-full", "widths": [400, 768], "sizes": " (max-width: 767px) 400px, 768px", "alt": "Hero Image", "aspectRatio": "16:9" })}
				</div>
			</div>
		</div>
	</div>
</section>`;
});

const $$Astro$k = createAstro("/home/dww510/betahero/site/src/components/widgets/Features.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$Features;
  const items = [
    {
      title: "Headers",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:home"
    },
    {
      title: "Footers",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:faq"
    },
    {
      title: "Features",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:video-projector"
    },
    {
      title: "Call-to-Action",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:video-projector"
    },
    {
      title: "Pricing",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:calculator"
    },
    {
      title: "Testimonial",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "flat-color-icons:voice-presentation"
    }
  ];
  return renderTemplate`${maybeRenderHead($$result)}<section class="relative">
	<div class="absolute inset-0 bg-primary-50 dark:bg-slate-800 pointer-events-none mb-32" aria-hidden="true"></div>
	<div class="relative max-w-6xl mx-auto px-4 sm:px-6">
		<div class="py-4 pt-8 sm:py-6 lg:py-8 lg:pt-12">
			<div class="mb-8 text-center">
				<p class="text-base text-primary-600 dark:text-primary-200 font-semibold tracking-wide uppercase">Components</p>
				<h2 class="text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-4 font-heading">
					Most used widgets
				</h2>
				<p class="max-w-3xl mx-auto text-center text-xl text-gray-600 dark:text-slate-400">
					Provides frequently used components for building websites using Tailwind CSS
				</p>
			</div>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start my-12 dark:text-white">
				${items.map(({ title, description, icon }) => renderTemplate`<div class="relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded shadow-xl hover:shadow-lg transition dark:border dark:border-slate-800">
							<div class="flex items-center mb-4">
								${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "w-12 h-12" })}

								<div class="ml-4 text-xl font-bold">${title}</div>
							</div>
							<p class="text-gray-500 dark:text-gray-400 text-md">${description}</p>
						</div>`)}
			</div>
		</div>
	</div>
</section>`;
});

const $$Astro$j = createAstro("/home/dww510/betahero/site/src/components/widgets/Features2.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Features2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Features2;
  const items = [
    [
      {
        title: "Integration with Tailwind CSS",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      },
      {
        title: "Ready-to-use Components",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      },
      {
        title: "Best Practices",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      }
    ],
    [
      {
        title: "Excellent Page Speed",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      },
      {
        title: "Frequently updated",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      },
      {
        title: "Open to new ideas and contributions",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi risus tempus nulla."
      }
    ]
  ];
  return renderTemplate`${maybeRenderHead($$result)}<section class="scroll-mt-16" id="features">
	<div class="px-4 py-16 mx-auto max-w-6xl lg:px-8 lg:py-20 bg-primary-50 dark:bg-slate-800">
		<div class="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
			<p class="text-base text-primary-600 dark:text-primary-200 font-semibold tracking-wide uppercase">Features</p>
			<h2 class="text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-4 font-heading">
				What's interesting about <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 whitespace-nowrap">AstroWind</span>
			</h2>
			<p class="max-w-3xl mx-auto sm:text-center text-xl text-gray-600 dark:text-slate-400">
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa
				quae.
			</p>
		</div>
		<div class="grid mx-auto space-y-6 md:grid-cols-2 md:space-y-0">
			${items.map((subitems) => renderTemplate`<div class="space-y-8 sm:px-8">
						${subitems.map(({ title, description }) => renderTemplate`<div class="flex flex-row max-w-md">
								<div class="mb-4 mr-4">
									<div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500">
										<svg class="w-12 h-12 p-0.5" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
											<g fill="none" fill-rule="evenodd">
												<rect class="fill-current text-primary-600" width="64" height="64" rx="32"></rect>
												<g stroke-linecap="square" stroke-width="2">
													<path class="stroke-current text-white" d="M20.571 20.571h13.714v17.143H20.571z"></path>
													<path class="stroke-current text-primary-300" d="M38.858 26.993l6.397 1.73-4.473 16.549-13.24-3.58"></path>
												</g>
											</g>
										</svg>
									</div>
								</div>
								<div>
									<h3 class="mb-3 text-xl font-bold">${title}</h3>
									<p>${description}</p>
								</div>
							</div>`)}
					</div>`)}
		</div>
	</div>
</section>`;
});

const $$Astro$i = createAstro("/home/dww510/betahero/site/src/components/widgets/Steps.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Steps = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Steps;
  return renderTemplate`${maybeRenderHead($$result)}<section class="px-4 py-16 sm:px-6 mx-auto lg:px-8 lg:py-20 max-w-6xl">
	<div class="grid gap-6 row-gap-10 md:grid-cols-2">
		<div class="md:pb-6 md:pr-16">
			<h2 class="mb-8 text-3xl lg:text-4xl font-bold font-heading">
				Sed ac magna sit amet risus tristique interdum. hac.
			</h2>
			<div class="flex">
				<div class="flex flex-col items-center mr-4">
					<div>
						<div class="flex items-center justify-center w-10 h-10 rounded-full border-secondary-500 border-2">
							${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-down", "class": "w-6 h-6 text-gray-600 dark:text-slate-200 icon-bold" })}
						</div>
					</div>
					<div class="w-px h-full bg-gray-300 dark:bg-slate-500"></div>
				</div>
				<div class="pt-1 pb-8">
					<p class="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">Step 1</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi
						risus tempus nulla, sed porttitor est nibh at nulla. Praesent placerat enim ut ex tincidunt vehicula. Fusce
						sit amet dui tellus.
					</p>
				</div>
			</div>
			<div class="flex">
				<div class="flex flex-col items-center mr-4">
					<div>
						<div class="flex items-center justify-center w-10 h-10 rounded-full border-secondary-500 border-2">
							${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-down", "class": "w-6 h-6 text-gray-600 dark:text-slate-200 icon-bold" })}
						</div>
					</div>
					<div class="w-px h-full bg-gray-300 dark:bg-slate-500"></div>
				</div>
				<div class="pt-1 pb-8">
					<p class="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">Step 2</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi
						risus tempus nulla, sed porttitor est nibh at nulla.
					</p>
				</div>
			</div>
			<div class="flex">
				<div class="flex flex-col items-center mr-4">
					<div>
						<div class="flex items-center justify-center w-10 h-10 rounded-full border-secondary-500 border-2">
							${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-down", "class": "w-6 h-6 text-gray-600 dark:text-slate-200 icon-bold" })}
						</div>
					</div>
					<div class="w-px h-full bg-gray-300 dark:bg-slate-500"></div>
				</div>
				<div class="pt-1 pb-8">
					<p class="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">Step 3</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi
						risus tempus nulla, sed porttitor est nibh at nulla.
					</p>
				</div>
			</div>
			<div class="flex">
				<div class="flex flex-col items-center mr-4">
					<div>
						<div class="flex items-center justify-center w-10 h-10 rounded-full border-primary-600 border-2">
							${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:check", "class": "w-6 h-6 text-gray-600 dark:text-slate-200 icon-bold" })}
						</div>
					</div>
				</div>
				<div class="pt-1">
					<p class="mb-2 text-xl font-bold text-gray-900 dark:text-slate-300">Ready!</p>
					<p class="text-gray-700"></p>
				</div>
			</div>
		</div>
		<div class="relative">
			${renderComponent($$result, "Picture", $$Picture, { "class": "inset-0 object-cover object-top w-full rounded-md shadow-lg md:absolute md:h-full bg-gray-400 dark:bg-slate-700", "src": import('./chunks/astronaut.d5297d53.mjs'), "widths": [400, 768], "sizes": "(max-width: 768px) 100vw, 432px", "alt": "Astronaut", "aspectRatio": "432:768" })}
		</div>
	</div>
</section>`;
});

const $$Astro$h = createAstro("/home/dww510/betahero/site/src/components/widgets/Features3.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Features3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Features3;
  return renderTemplate`${maybeRenderHead($$result)}<section>
	<div class="max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
		<div class="py-12 md:py-20">
			<div class="py-4 sm:py-6 lg:py-8">
				<div class="flex flex-wrap md:-mx-8">
					<div class="w-full lg:w-1/2 px-0 sm:px-8">
						<div class="mb-12 lg:mb-0 pb-12 lg:pb-0 border-b lg:border-b-0">
							<h2 class="mb-4 text-3xl lg:text-4xl font-bold font-heading">
								Sed ac magna sit amet risus tristique interdum, at vel velit in hac habitasse platea dictumst.
							</h2>

							<p class="mb-8 text-xl text-gray-600 dark:text-slate-400">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis lobortis, mi
								risus tempus nulla, sed porttitor est nibh at nulla. Praesent placerat enim ut ex tincidunt vehicula.
								Fusce sit amet dui tellus.
							</p>

							<div class="w-full">
								<a class="btn text-white bg-primary-600 hover:bg-primary-800 mb-4 sm:mb-0" href="https://github.com/onwidget/astrowind" target="_blank" rel="noopener">
									${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:download", "class": "w-5 h-5 mr-1 -ml-1.5" })} Get template
								</a>
							</div>
						</div>
					</div>
					<div class="w-full lg:w-1/2 px-0 sm:px-8">
						<ul class="space-y-12">
							<li class="flex md:-mx-4">
								<div class="pr-4 sm:pl-4">
									<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold rounded-full bg-primary-50 text-primary-600">
										1</span>
								</div>
								<div class="px-4">
									<h3 class="mb-4 text-xl font-semibold font-heading">Responsive Elements</h3>
									<p class="text-gray-500 dark:text-gray-400">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis
										lobortis, mi risus tempus nulla.
									</p>
								</div>
							</li>
							<li class="flex md:-mx-4">
								<div class="pr-4 sm:pl-4">
									<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold rounded-full bg-primary-50 text-primary-600">
										2</span>
								</div>
								<div class="px-4">
									<h3 class="mb-4 text-xl font-semibold font-heading">Flexible Team</h3>
									<p class="text-gray-500 dark:text-gray-400">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis
										lobortis, mi risus tempus nulla.
									</p>
								</div>
							</li>
							<li class="flex md:-mx-4">
								<div class="pr-4 sm:pl-4">
									<span class="flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold rounded-full bg-primary-50 text-primary-600">
										3</span>
								</div>
								<div class="px-4">
									<h3 class="mb-4 text-xl font-semibold font-heading">Ecologic Software</h3>
									<p class="text-gray-500 dark:text-gray-400">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sagittis, quam nec venenatis
										lobortis, mi risus tempus nulla.
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>`;
});

const html$3 = "<h2 id=\"dictum-integer-fusce-ac-ridiculus-et-odio-sollicitudin-diam-at\">Dictum integer fusce ac ridiculus et odio sollicitudin diam at</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>\n<p>Venenatis suscipit class iaculis non velit ultrices ligula nulla mattis turpis erat, enim montes sapien rhoncus tincidunt scelerisque fermentum dapibus imperdiet risus, tempor est massa pretium at molestie morbi nec libero aptent. Morbi rhoncus massa accumsan a pharetra nec conubia at, sem justo sociis suspendisse aenean dis magna, parturient inceptos ad vestibulum lectus ullamcorper ante. In condimentum suscipit iaculis suspendisse nisl gravida risus sociis, cursus nec lectus per tristique phasellus imperdiet ultrices taciti, natoque sociosqu curae tellus hendrerit feugiat dignissim. Risus est fringilla elementum ullamcorper nibh urna sociosqu quis, netus eu mollis torquent ridiculus nisi et, sodales cum vulputate augue facilisis egestas vel. Ridiculus volutpat nisi netus venenatis vitae posuere purus, nec aliquam fusce nascetur mus iaculis, sociosqu sodales erat id tempor malesuada. Lacinia platea sagittis tincidunt semper nam magna praesent, ante ornare senectus in ligula justo, id rhoncus nullam nec maecenas aliquam. Enim aenean rutrum magnis magna duis pulvinar curae posuere massa, dui orci class dis phasellus parturient aliquet luctus eget bibendum, ultricies fringilla erat purus habitasse natoque urna aliquam.</p>\n<p>Cursus varius volutpat aliquam tellus blandit netus orci, augue eleifend molestie cubilia proin. Sagittis enim nam hendrerit risus sem laoreet commodo interdum, odio fames et nunc bibendum urna conubia cursus neque, arcu accumsan nascetur ridiculus cubilia vestibulum sapien. Luctus maecenas accumsan turpis donec dictum justo ridiculus consequat ad, habitant elementum litora magna sed rutrum tempus. Et dapibus eget feugiat dictum quam proin sem tincidunt lectus risus natoque, massa ut purus sollicitudin dignissim hac sed nibh facilisis arcu dis lacinia, cras fringilla erat sociis eleifend varius vestibulum nunc aenean neque. Penatibus curabitur aptent magna faucibus aliquam sed massa curae maecenas nibh, sodales montes nulla cursus litora justo suscipit ut neque, varius rutrum enim dignissim auctor velit luctus blandit nostra. Torquent lobortis nec volutpat aliquet vestibulum penatibus bibendum, eget platea a dictum mollis congue. Netus consequat eget cursus cubilia nostra quam etiam sollicitudin purus, imperdiet per bibendum proin duis felis montes ut tincidunt semper, ad vestibulum accumsan tortor fames potenti tristique praesent. Arcu mollis tempus tincidunt ad platea mauris, nec inceptos dis penatibus donec, primis taciti fermentum erat mi.</p>\n<p>Lacinia pellentesque dui porttitor arcu mauris turpis quam vitae rutrum in vel, sociosqu ultricies ultrices rhoncus fames taciti ut aliquet placerat ligula. Nec libero aptent nisl euismod pellentesque curae posuere magnis, fusce condimentum augue fames penatibus mollis consequat, justo ullamcorper semper nibh netus turpis est. Condimentum nisi bibendum fames placerat habitasse curabitur facilisis accumsan sagittis ante, etiam id turpis aliquam elementum habitant eget aptent nisl, duis nullam velit hac cubilia risus ultricies interdum ultrices. A praesent taciti duis tempor sollicitudin primis auctor, consequat potenti porta iaculis ad imperdiet, habitasse sagittis quam eu mus nisl. Lacus morbi aptent fusce augue curae elementum diam litora leo condimentum pharetra facilisi eros, dis bibendum primis habitasse tempus porttitor dictumst potenti justo congue hendrerit curabitur. Pretium natoque penatibus pellentesque auctor, luctus libero pharetra proin vitae, habitant nam posuere. Tortor facilisis sed venenatis nostra massa congue lobortis rutrum ornare, ullamcorper libero nibh elementum dictumst torquent felis at, nam porttitor curabitur neque natoque accumsan hac id. Dictum aenean sed facilisis interdum libero eu, praesent curae purus ac platea, natoque penatibus malesuada erat faucibus.</p>\n<p>Porta lobortis ad dapibus id vitae convallis litora vehicula molestie mattis aliquam, sociosqu nisi ridiculus netus faucibus platea aptent diam vivamus. Taciti tristique in erat ridiculus ad ultricies mollis risus, laoreet aliquam semper felis nam cubilia praesent, tempus nostra augue penatibus convallis proin quis. Lacus commodo senectus tempus suspendisse suscipit, class porttitor mi potenti at, vitae mattis a pharetra. At cras felis fermentum turpis sapien fames volutpat sollicitudin integer egestas ornare nunc, praesent mollis nibh quisque tristique vitae curae lobortis lacinia donec sagittis. Tincidunt enim morbi etiam malesuada odio laoreet lacinia, phasellus fringilla integer inceptos lobortis ridiculus suscipit massa, turpis leo molestie a mus conubia. Ridiculus magna fermentum sodales interdum posuere mi risus per rhoncus donec orci, pulvinar curabitur facilisis curae accumsan ligula scelerisque porta a porttitor, dignissim parturient facilisi felis quis malesuada litora convallis cum integer. Fringilla pulvinar consequat suspendisse aenean mollis interdum odio viverra aptent, nascetur eget magna facilisi erat fermentum turpis taciti ornare molestie, nam sollicitudin natoque gravida porta nulla rutrum condimentum.</p>\n<p>Bibendum leo etiam porta fermentum donec mauris netus nibh per non varius diam, massa aliquam elementum lacinia himenaeos sem eros platea justo neque placerat. Etiam morbi ac magna quis gravida mi molestie praesent potenti pharetra id ornare euismod congue, est sapien iaculis rhoncus platea posuere litora integer mattis lacinia cubilia rutrum sem. Facilisis est tempus ridiculus ultricies faucibus nec aenean praesent ad vel penatibus, mus hac bibendum pretium rhoncus nascetur non neque mollis curabitur lacinia, consequat ut tortor aptent et sapien ornare quisque suspendisse vitae. Et suscipit nulla mauris integer nam elementum massa, purus pellentesque placerat magnis scelerisque leo metus, sociis interdum tincidunt ac ullamcorper feugiat. Magnis inceptos justo tincidunt ad etiam conubia ultricies tortor, metus congue ullamcorper turpis bibendum sociosqu cubilia curae urna, in phasellus pellentesque quam platea imperdiet accumsan. Urna vivamus ut bibendum diam sociis euismod rutrum, consequat magnis primis curae donec quis placerat conubia, semper mattis mollis auctor fringilla erat. Suspendisse phasellus gravida mollis eleifend nascetur dictum lectus dui fringilla pulvinar feugiat, venenatis lobortis posuere dictumst porttitor bibendum ullamcorper montes ultrices congue, scelerisque lacinia viverra suscipit vel natoque inceptos dignissim habitant laoreet.</p>\n<p>Nascetur gravida mus imperdiet dapibus suspendisse cras nisl conubia, vulputate placerat senectus viverra nibh dictum et morbi pulvinar, cubilia ad non eleifend sagittis scelerisque penatibus. Auctor rutrum arcu phasellus tellus et magnis in, aliquet sociis fermentum class praesent aliquam lectus curabitur, natoque id pulvinar hac ultricies augue. Himenaeos commodo cum donec metus curae convallis sociis, facilisi lectus torquent fermentum rutrum vivamus non platea, nisl venenatis id ullamcorper mauris at. Facilisis etiam pharetra porta hendrerit eu conubia aliquam malesuada senectus, dui sociis penatibus integer mus quis turpis. Venenatis placerat ultricies tincidunt morbi himenaeos metus, diam curae aliquet neque pellentesque justo lobortis, cras sodales nam imperdiet parturient. Ligula potenti fringilla platea feugiat pulvinar dis habitant, nec nisl diam orci consequat condimentum gravida accumsan, massa vehicula euismod faucibus dignissim et. Scelerisque natoque vel eu proin etiam nostra pulvinar ullamcorper convallis facilisi, viverra vitae nunc penatibus ligula magnis cum senectus habitasse at, sagittis rhoncus faucibus netus nisl facilisis tristique parturient nulla. Condimentum massa lectus volutpat mollis curae eu, curabitur feugiat conubia mauris commodo mattis, magnis ad nullam ac sapien.</p>";

				const frontmatter$4 = {"readingTime":10,"publishDate":"Aug 08 2022","title":"AstroWind template in depth","description":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","image":"~/assets/images/hero.jpg","category":"Tutorials","tags":["astro","tailwind css","front-end"]};
				const file$4 = "/home/dww510/betahero/site/data/blog/astrowind-template-in-depth.md";
				const url$4 = undefined;
				function rawContent$4() {
					return "\n## Dictum integer fusce ac ridiculus et odio sollicitudin diam at\n\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis. \n\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur. \n\n## Sodales hendrerit malesuada et vestibulum\n\n- Luctus euismod pretium nisi et, est dui enim.\n\n- Curae eget inceptos malesuada, fermentum class.\n\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\n\n- Ligula lacus tempus ac porta, vel litora.\n\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim. \n\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla. \n\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\n\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam. \n\nVenenatis suscipit class iaculis non velit ultrices ligula nulla mattis turpis erat, enim montes sapien rhoncus tincidunt scelerisque fermentum dapibus imperdiet risus, tempor est massa pretium at molestie morbi nec libero aptent. Morbi rhoncus massa accumsan a pharetra nec conubia at, sem justo sociis suspendisse aenean dis magna, parturient inceptos ad vestibulum lectus ullamcorper ante. In condimentum suscipit iaculis suspendisse nisl gravida risus sociis, cursus nec lectus per tristique phasellus imperdiet ultrices taciti, natoque sociosqu curae tellus hendrerit feugiat dignissim. Risus est fringilla elementum ullamcorper nibh urna sociosqu quis, netus eu mollis torquent ridiculus nisi et, sodales cum vulputate augue facilisis egestas vel. Ridiculus volutpat nisi netus venenatis vitae posuere purus, nec aliquam fusce nascetur mus iaculis, sociosqu sodales erat id tempor malesuada. Lacinia platea sagittis tincidunt semper nam magna praesent, ante ornare senectus in ligula justo, id rhoncus nullam nec maecenas aliquam. Enim aenean rutrum magnis magna duis pulvinar curae posuere massa, dui orci class dis phasellus parturient aliquet luctus eget bibendum, ultricies fringilla erat purus habitasse natoque urna aliquam. \n\nCursus varius volutpat aliquam tellus blandit netus orci, augue eleifend molestie cubilia proin. Sagittis enim nam hendrerit risus sem laoreet commodo interdum, odio fames et nunc bibendum urna conubia cursus neque, arcu accumsan nascetur ridiculus cubilia vestibulum sapien. Luctus maecenas accumsan turpis donec dictum justo ridiculus consequat ad, habitant elementum litora magna sed rutrum tempus. Et dapibus eget feugiat dictum quam proin sem tincidunt lectus risus natoque, massa ut purus sollicitudin dignissim hac sed nibh facilisis arcu dis lacinia, cras fringilla erat sociis eleifend varius vestibulum nunc aenean neque. Penatibus curabitur aptent magna faucibus aliquam sed massa curae maecenas nibh, sodales montes nulla cursus litora justo suscipit ut neque, varius rutrum enim dignissim auctor velit luctus blandit nostra. Torquent lobortis nec volutpat aliquet vestibulum penatibus bibendum, eget platea a dictum mollis congue. Netus consequat eget cursus cubilia nostra quam etiam sollicitudin purus, imperdiet per bibendum proin duis felis montes ut tincidunt semper, ad vestibulum accumsan tortor fames potenti tristique praesent. Arcu mollis tempus tincidunt ad platea mauris, nec inceptos dis penatibus donec, primis taciti fermentum erat mi. \n\nLacinia pellentesque dui porttitor arcu mauris turpis quam vitae rutrum in vel, sociosqu ultricies ultrices rhoncus fames taciti ut aliquet placerat ligula. Nec libero aptent nisl euismod pellentesque curae posuere magnis, fusce condimentum augue fames penatibus mollis consequat, justo ullamcorper semper nibh netus turpis est. Condimentum nisi bibendum fames placerat habitasse curabitur facilisis accumsan sagittis ante, etiam id turpis aliquam elementum habitant eget aptent nisl, duis nullam velit hac cubilia risus ultricies interdum ultrices. A praesent taciti duis tempor sollicitudin primis auctor, consequat potenti porta iaculis ad imperdiet, habitasse sagittis quam eu mus nisl. Lacus morbi aptent fusce augue curae elementum diam litora leo condimentum pharetra facilisi eros, dis bibendum primis habitasse tempus porttitor dictumst potenti justo congue hendrerit curabitur. Pretium natoque penatibus pellentesque auctor, luctus libero pharetra proin vitae, habitant nam posuere. Tortor facilisis sed venenatis nostra massa congue lobortis rutrum ornare, ullamcorper libero nibh elementum dictumst torquent felis at, nam porttitor curabitur neque natoque accumsan hac id. Dictum aenean sed facilisis interdum libero eu, praesent curae purus ac platea, natoque penatibus malesuada erat faucibus. \n\nPorta lobortis ad dapibus id vitae convallis litora vehicula molestie mattis aliquam, sociosqu nisi ridiculus netus faucibus platea aptent diam vivamus. Taciti tristique in erat ridiculus ad ultricies mollis risus, laoreet aliquam semper felis nam cubilia praesent, tempus nostra augue penatibus convallis proin quis. Lacus commodo senectus tempus suspendisse suscipit, class porttitor mi potenti at, vitae mattis a pharetra. At cras felis fermentum turpis sapien fames volutpat sollicitudin integer egestas ornare nunc, praesent mollis nibh quisque tristique vitae curae lobortis lacinia donec sagittis. Tincidunt enim morbi etiam malesuada odio laoreet lacinia, phasellus fringilla integer inceptos lobortis ridiculus suscipit massa, turpis leo molestie a mus conubia. Ridiculus magna fermentum sodales interdum posuere mi risus per rhoncus donec orci, pulvinar curabitur facilisis curae accumsan ligula scelerisque porta a porttitor, dignissim parturient facilisi felis quis malesuada litora convallis cum integer. Fringilla pulvinar consequat suspendisse aenean mollis interdum odio viverra aptent, nascetur eget magna facilisi erat fermentum turpis taciti ornare molestie, nam sollicitudin natoque gravida porta nulla rutrum condimentum. \n\nBibendum leo etiam porta fermentum donec mauris netus nibh per non varius diam, massa aliquam elementum lacinia himenaeos sem eros platea justo neque placerat. Etiam morbi ac magna quis gravida mi molestie praesent potenti pharetra id ornare euismod congue, est sapien iaculis rhoncus platea posuere litora integer mattis lacinia cubilia rutrum sem. Facilisis est tempus ridiculus ultricies faucibus nec aenean praesent ad vel penatibus, mus hac bibendum pretium rhoncus nascetur non neque mollis curabitur lacinia, consequat ut tortor aptent et sapien ornare quisque suspendisse vitae. Et suscipit nulla mauris integer nam elementum massa, purus pellentesque placerat magnis scelerisque leo metus, sociis interdum tincidunt ac ullamcorper feugiat. Magnis inceptos justo tincidunt ad etiam conubia ultricies tortor, metus congue ullamcorper turpis bibendum sociosqu cubilia curae urna, in phasellus pellentesque quam platea imperdiet accumsan. Urna vivamus ut bibendum diam sociis euismod rutrum, consequat magnis primis curae donec quis placerat conubia, semper mattis mollis auctor fringilla erat. Suspendisse phasellus gravida mollis eleifend nascetur dictum lectus dui fringilla pulvinar feugiat, venenatis lobortis posuere dictumst porttitor bibendum ullamcorper montes ultrices congue, scelerisque lacinia viverra suscipit vel natoque inceptos dignissim habitant laoreet. \n\nNascetur gravida mus imperdiet dapibus suspendisse cras nisl conubia, vulputate placerat senectus viverra nibh dictum et morbi pulvinar, cubilia ad non eleifend sagittis scelerisque penatibus. Auctor rutrum arcu phasellus tellus et magnis in, aliquet sociis fermentum class praesent aliquam lectus curabitur, natoque id pulvinar hac ultricies augue. Himenaeos commodo cum donec metus curae convallis sociis, facilisi lectus torquent fermentum rutrum vivamus non platea, nisl venenatis id ullamcorper mauris at. Facilisis etiam pharetra porta hendrerit eu conubia aliquam malesuada senectus, dui sociis penatibus integer mus quis turpis. Venenatis placerat ultricies tincidunt morbi himenaeos metus, diam curae aliquet neque pellentesque justo lobortis, cras sodales nam imperdiet parturient. Ligula potenti fringilla platea feugiat pulvinar dis habitant, nec nisl diam orci consequat condimentum gravida accumsan, massa vehicula euismod faucibus dignissim et. Scelerisque natoque vel eu proin etiam nostra pulvinar ullamcorper convallis facilisi, viverra vitae nunc penatibus ligula magnis cum senectus habitasse at, sagittis rhoncus faucibus netus nisl facilisis tristique parturient nulla. Condimentum massa lectus volutpat mollis curae eu, curabitur feugiat conubia mauris commodo mattis, magnis ad nullam ac sapien.";
				}
				function compiledContent$4() {
					return html$3;
				}
				function getHeadings$4() {
					return [{"depth":2,"slug":"dictum-integer-fusce-ac-ridiculus-et-odio-sollicitudin-diam-at","text":"Dictum integer fusce ac ridiculus et odio sollicitudin diam at"},{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return contentFragment;
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$4,
  file: file$4,
  url: url$4,
  rawContent: rawContent$4,
  compiledContent: compiledContent$4,
  getHeadings: getHeadings$4,
  getHeaders: getHeaders$3,
  Content: Content$4,
  default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n<h2 id=\"nostra-torquent-consequat-volutpat-aliquet-neque\">Nostra torquent consequat volutpat aliquet neque</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing elit proin, aenean litora volutpat urna egestas magnis arcu non, cras ut cursus et sed morbi lectus. Integer faucibus sagittis eu nunc urna aliquet a laoreet torquent, suspendisse penatibus nulla sollicitudin congue rutrum dictum. Ornare mi habitasse fermentum phasellus dui et morbi litora sodales dictum id erat, nibh purus class ligula aenean lectus venenatis euismod cras torquent ac. Senectus sagittis conubia hendrerit at egestas porta venenatis nisi metus gravida tempor, aenean facilisis nisl ante facilisi lacus integer hac iaculis purus. Scelerisque libero torquent egestas curae tellus viverra inceptos imperdiet urna, porta suspendisse interdum primis odio morbi tempor commodo dictumst, suscipit ornare habitasse semper feugiat cras quisque lobortis.</p>\n<p>Iaculis arcu commodo dis proin vitae himenaeos, ante tristique potenti magna ligula, sagittis libero fermentum ullamcorper sociis. Sem eros non arcu natoque fringilla lacus vestibulum lacinia integer mus viverra in proin, sagittis fusce tortor erat enim rutrum vulputate curae laoreet class diam. Inceptos convallis ac nisi natoque nam quisque magnis ut nullam fringilla curae, luctus lacus purus habitant erat magna molestie class habitasse metus, nibh lobortis tortor curabitur neque phasellus feugiat netus morbi parturient. Neque malesuada mauris justo himenaeos pharetra, ullamcorper enim ligula a nulla consequat, eget vivamus velit ridiculus.</p>\n<h2 id=\"praesent-tellus-ad-sapien-erat-or\">Praesent tellus ad sapien erat or</h2>\n<ul>\n<li>\n<p>Quam orci nostra mi nulla, hac a.</p>\n</li>\n<li>\n<p>Interdum iaculis quis tellus sociis orci nulla, quam rutrum conubia tortor primis.</p>\n</li>\n<li>\n<p>Non felis sem placerat aenean duis, ornare turpis nostra.</p>\n</li>\n<li>\n<p>Habitasse duis sociis sagittis cursus, ante dictumst commodo.</p>\n</li>\n</ul>\n<p>Duis maecenas massa habitasse inceptos imperdiet scelerisque at condimentum ultrices, nam dui leo enim taciti varius cras habitant pretium rhoncus, ut hac euismod nostra metus sagittis mi aenean. Quam eleifend aliquet litora eget a tempor, ultricies integer vestibulum non felis sodales, eros diam massa libero iaculis.</p>\n<p>Nisl ligula ante magnis himenaeos pellentesque orci cras integer urna ut convallis, id phasellus libero est nunc ultrices eget blandit massa ac hac, morbi vulputate quisque tellus feugiat conubia luctus tincidunt curae fermentum. Venenatis dictumst tincidunt senectus vivamus duis dis sociis taciti porta primis, rhoncus ridiculus rutrum curae mattis ullamcorper ac sagittis nascetur curabitur erat, faucibus placerat vulputate eu at habitasse nulla nisl interdum. Varius turpis dignissim montes ac ante tristique quis parturient hendrerit faucibus, consequat auctor penatibus suspendisse rutrum erat nulla inceptos est justo, etiam mollis mauris facilisi cras sociosqu eu sapien sed.</p>\n<p>Blandit aptent conubia mollis mauris habitasse suspendisse torquent aenean, ac primis auctor congue cursus mi posuere molestie, velit elementum per feugiat libero dictumst phasellus. Convallis mollis taciti condimentum praesent id porttitor ac dictumst at, sed in eu eleifend vehicula fermentum lectus litora venenatis, gravida hac molestie cum sociosqu mus viverra torquent. Congue est fusce habitasse ridiculus integer suscipit platea volutpat, inceptos varius elementum pellentesque malesuada interdum magnis. Hac lacus eget enim purus massa commodo nec lectus natoque fames arcu, mattis class quam ut neque dui cras quis diam orci sed velit, erat morbi eros suscipit sagittis laoreet vivamus torquent nulla turpis.</p>\n<p>Ridiculus velit suscipit consequat auctor interdum magna gravida dictumst libero ut habitasse, sollicitudin vehicula suspendisse leo erat tristique at platea sagittis proin dignissim, id ornare scelerisque et urna maecenas congue tincidunt dictum malesuada. Dui vulputate accumsan scelerisque ridiculus dictum quisque et nam hac, tempus ultricies curabitur proin netus diam vivamus. Vestibulum ante ac auctor mi urna risus lacinia vulputate justo orci sociis dui semper, commodo morbi enim vivamus neque sem pellentesque velit donec hac metus odio. Tempor ultrices himenaeos massa sollicitudin mus conubia scelerisque cubilia, nascetur potenti mauris convallis et lectus gravida egestas sociis, erat eros ultricies aptent congue tortor ornare.</p>\n<p>Pretium aliquet sodales aliquam tincidunt litora lectus, erat dui nibh diam mus, sed hendrerit condimentum senectus arcu. Arcu a nibh auctor dapibus eros turpis tempus commodo, libero hendrerit dictum interdum mus class sed scelerisque, sapien dictumst enim magna molestie habitant donec. Fringilla dui sed curabitur commodo varius est vel, viverra primis habitant sapien montes mattis dignissim, gravida cubilia laoreet tempus aliquet senectus. Sociosqu purus praesent porttitor curae sollicitudin accumsan feugiat maecenas donec quis lacus, suscipit taciti convallis odio morbi eros nibh bibendum nunc orci. Magna cras nullam aliquam metus nibh sagittis facilisi tortor nec, mus varius curae ridiculus fames congue interdum erat urna, neque odio lobortis mi mattis diam cubilia arcu.</p>\n<p>Laoreet fusce nec class porttitor mus proin aenean, velit vestibulum feugiat porta egestas sapien posuere, conubia nisi tempus varius hendrerit tortor. Congue aliquam scelerisque neque vivamus habitasse semper mauris pellentesque accumsan posuere, suspendisse lectus gravida erat sagittis arcu praesent mus ornare. Habitasse nibh nam morbi mollis senectus erat risus, cum sollicitudin class platea congue mattis venenatis, luctus aenean parturient hendrerit malesuada ante. Mus auctor tincidunt consequat massa tortor nulla luctus habitasse vestibulum quis velit, laoreet sagittis cum facilisi in sem tellus leo vulputate vehicula bibendum orci, felis nisl blandit lacus convallis congue turpis magna facilisis condimentum.</p>\n<p>Dictumst pellentesque urna donec sociis suscipit montes consequat, commodo quam habitasse senectus fringilla maecenas, inceptos magna tristique eu nullam nam. Maecenas orci nibh hac eu tristique ut penatibus ultrices ante, pellentesque cubilia pharetra dis facilisis aliquam praesent malesuada vivamus, commodo cras velit convallis molestie nec tellus augue. Etiam ut convallis risus id dapibus platea laoreet accumsan, habitant et aenean netus inceptos iaculis per, mauris curae at ligula odio ad eu. Mauris erat tempor interdum sapien commodo per nullam tortor, fusce facilisis vehicula egestas dui nulla conubia ut fames, fringilla et tincidunt penatibus facilisi at mollis.</p>\n<p>Fermentum sociosqu litora primis sollicitudin fusce diam consequat vehicula per lobortis et, viverra sodales magna rutrum sed mollis faucibus molestie purus montes est, risus nostra congue venenatis lectus enim torquent eros dis dapibus. Dui suscipit scelerisque massa ligula euismod accumsan augue, magna vel lacus ante nullam senectus commodo, viverra cubilia eros eget penatibus tempor. Mattis mauris hac felis semper dui sociis faucibus mollis ornare pretium aliquam velit nisl, quis litora sem at vel duis rutrum imperdiet natoque viverra himenaeos tempor.</p>\n<p>Integer eu tristique purus luctus vivamus porttitor vel nisl, tortor malesuada augue vulputate diam velit pellentesque sodales, duis phasellus vestibulum fermentum leo facilisi porta. Hac porttitor cum dapibus volutpat quisque odio taciti nulla senectus mollis curae, accumsan suscipit cubilia tempor ligula in venenatis justo leo erat, magna tincidunt nullam lacinia luctus malesuada non vivamus praesent pharetra. Non quam felis montes pretium volutpat suspendisse lacus, torquent magna dictumst orci libero porta, feugiat taciti cras ridiculus aenean rutrum. Tellus nostra tincidunt hac in ligula mi vulputate venenatis pellentesque urna dui, at luctus tristique quisque vel a dignissim scelerisque platea pretium, suspendisse ante phasellus porttitor quis aliquam malesuada etiam enim nullam.</p>\n<p>Hendrerit taciti litora nec facilisis diam vehicula magnis potenti, parturient velit egestas nisl lobortis tincidunt rutrum cursus, fusce senectus mi massa primis mattis rhoncus. Accumsan est ac varius consequat vulputate, ligula cursus euismod sagittis inceptos scelerisque, lacus malesuada torquent dictumst. Volutpat morbi metus urna rhoncus nunc tempor molestie, congue curabitur quis interdum posuere. Mollis viverra velit tortor mus netus nunc molestie metus, sem massa himenaeos luctus feugiat taciti iaculis fames porttitor, leo arcu consequat gravida dapibus pulvinar elementum.</p>";

				const frontmatter$3 = {"readingTime":7,"publishDate":"Aug 12 2022","title":"Get started with AstroWind to create a website using Astro and Tailwind CSS","description":"Lorem ipsum dolor sit amet","excerpt":"Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat","image":"~/assets/images/steps.jpg","category":"Tutorials","tags":["astro","tailwind css"]};
				const file$3 = "/home/dww510/betahero/site/data/blog/get-started-website-with-astro-tailwind-css.md";
				const url$3 = undefined;
				function rawContent$3() {
					return "\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n## Nostra torquent consequat volutpat aliquet neque\n\nLorem ipsum dolor sit amet consectetur adipiscing elit proin, aenean litora volutpat urna egestas magnis arcu non, cras ut cursus et sed morbi lectus. Integer faucibus sagittis eu nunc urna aliquet a laoreet torquent, suspendisse penatibus nulla sollicitudin congue rutrum dictum. Ornare mi habitasse fermentum phasellus dui et morbi litora sodales dictum id erat, nibh purus class ligula aenean lectus venenatis euismod cras torquent ac. Senectus sagittis conubia hendrerit at egestas porta venenatis nisi metus gravida tempor, aenean facilisis nisl ante facilisi lacus integer hac iaculis purus. Scelerisque libero torquent egestas curae tellus viverra inceptos imperdiet urna, porta suspendisse interdum primis odio morbi tempor commodo dictumst, suscipit ornare habitasse semper feugiat cras quisque lobortis. \n\nIaculis arcu commodo dis proin vitae himenaeos, ante tristique potenti magna ligula, sagittis libero fermentum ullamcorper sociis. Sem eros non arcu natoque fringilla lacus vestibulum lacinia integer mus viverra in proin, sagittis fusce tortor erat enim rutrum vulputate curae laoreet class diam. Inceptos convallis ac nisi natoque nam quisque magnis ut nullam fringilla curae, luctus lacus purus habitant erat magna molestie class habitasse metus, nibh lobortis tortor curabitur neque phasellus feugiat netus morbi parturient. Neque malesuada mauris justo himenaeos pharetra, ullamcorper enim ligula a nulla consequat, eget vivamus velit ridiculus. \n\n## Praesent tellus ad sapien erat or\n\n- Quam orci nostra mi nulla, hac a.\n\n- Interdum iaculis quis tellus sociis orci nulla, quam rutrum conubia tortor primis.\n\n- Non felis sem placerat aenean duis, ornare turpis nostra.\n\n- Habitasse duis sociis sagittis cursus, ante dictumst commodo.\n\nDuis maecenas massa habitasse inceptos imperdiet scelerisque at condimentum ultrices, nam dui leo enim taciti varius cras habitant pretium rhoncus, ut hac euismod nostra metus sagittis mi aenean. Quam eleifend aliquet litora eget a tempor, ultricies integer vestibulum non felis sodales, eros diam massa libero iaculis. \n\nNisl ligula ante magnis himenaeos pellentesque orci cras integer urna ut convallis, id phasellus libero est nunc ultrices eget blandit massa ac hac, morbi vulputate quisque tellus feugiat conubia luctus tincidunt curae fermentum. Venenatis dictumst tincidunt senectus vivamus duis dis sociis taciti porta primis, rhoncus ridiculus rutrum curae mattis ullamcorper ac sagittis nascetur curabitur erat, faucibus placerat vulputate eu at habitasse nulla nisl interdum. Varius turpis dignissim montes ac ante tristique quis parturient hendrerit faucibus, consequat auctor penatibus suspendisse rutrum erat nulla inceptos est justo, etiam mollis mauris facilisi cras sociosqu eu sapien sed. \n\nBlandit aptent conubia mollis mauris habitasse suspendisse torquent aenean, ac primis auctor congue cursus mi posuere molestie, velit elementum per feugiat libero dictumst phasellus. Convallis mollis taciti condimentum praesent id porttitor ac dictumst at, sed in eu eleifend vehicula fermentum lectus litora venenatis, gravida hac molestie cum sociosqu mus viverra torquent. Congue est fusce habitasse ridiculus integer suscipit platea volutpat, inceptos varius elementum pellentesque malesuada interdum magnis. Hac lacus eget enim purus massa commodo nec lectus natoque fames arcu, mattis class quam ut neque dui cras quis diam orci sed velit, erat morbi eros suscipit sagittis laoreet vivamus torquent nulla turpis. \n\nRidiculus velit suscipit consequat auctor interdum magna gravida dictumst libero ut habitasse, sollicitudin vehicula suspendisse leo erat tristique at platea sagittis proin dignissim, id ornare scelerisque et urna maecenas congue tincidunt dictum malesuada. Dui vulputate accumsan scelerisque ridiculus dictum quisque et nam hac, tempus ultricies curabitur proin netus diam vivamus. Vestibulum ante ac auctor mi urna risus lacinia vulputate justo orci sociis dui semper, commodo morbi enim vivamus neque sem pellentesque velit donec hac metus odio. Tempor ultrices himenaeos massa sollicitudin mus conubia scelerisque cubilia, nascetur potenti mauris convallis et lectus gravida egestas sociis, erat eros ultricies aptent congue tortor ornare. \n\nPretium aliquet sodales aliquam tincidunt litora lectus, erat dui nibh diam mus, sed hendrerit condimentum senectus arcu. Arcu a nibh auctor dapibus eros turpis tempus commodo, libero hendrerit dictum interdum mus class sed scelerisque, sapien dictumst enim magna molestie habitant donec. Fringilla dui sed curabitur commodo varius est vel, viverra primis habitant sapien montes mattis dignissim, gravida cubilia laoreet tempus aliquet senectus. Sociosqu purus praesent porttitor curae sollicitudin accumsan feugiat maecenas donec quis lacus, suscipit taciti convallis odio morbi eros nibh bibendum nunc orci. Magna cras nullam aliquam metus nibh sagittis facilisi tortor nec, mus varius curae ridiculus fames congue interdum erat urna, neque odio lobortis mi mattis diam cubilia arcu. \n\nLaoreet fusce nec class porttitor mus proin aenean, velit vestibulum feugiat porta egestas sapien posuere, conubia nisi tempus varius hendrerit tortor. Congue aliquam scelerisque neque vivamus habitasse semper mauris pellentesque accumsan posuere, suspendisse lectus gravida erat sagittis arcu praesent mus ornare. Habitasse nibh nam morbi mollis senectus erat risus, cum sollicitudin class platea congue mattis venenatis, luctus aenean parturient hendrerit malesuada ante. Mus auctor tincidunt consequat massa tortor nulla luctus habitasse vestibulum quis velit, laoreet sagittis cum facilisi in sem tellus leo vulputate vehicula bibendum orci, felis nisl blandit lacus convallis congue turpis magna facilisis condimentum. \n\nDictumst pellentesque urna donec sociis suscipit montes consequat, commodo quam habitasse senectus fringilla maecenas, inceptos magna tristique eu nullam nam. Maecenas orci nibh hac eu tristique ut penatibus ultrices ante, pellentesque cubilia pharetra dis facilisis aliquam praesent malesuada vivamus, commodo cras velit convallis molestie nec tellus augue. Etiam ut convallis risus id dapibus platea laoreet accumsan, habitant et aenean netus inceptos iaculis per, mauris curae at ligula odio ad eu. Mauris erat tempor interdum sapien commodo per nullam tortor, fusce facilisis vehicula egestas dui nulla conubia ut fames, fringilla et tincidunt penatibus facilisi at mollis. \n\nFermentum sociosqu litora primis sollicitudin fusce diam consequat vehicula per lobortis et, viverra sodales magna rutrum sed mollis faucibus molestie purus montes est, risus nostra congue venenatis lectus enim torquent eros dis dapibus. Dui suscipit scelerisque massa ligula euismod accumsan augue, magna vel lacus ante nullam senectus commodo, viverra cubilia eros eget penatibus tempor. Mattis mauris hac felis semper dui sociis faucibus mollis ornare pretium aliquam velit nisl, quis litora sem at vel duis rutrum imperdiet natoque viverra himenaeos tempor. \n\nInteger eu tristique purus luctus vivamus porttitor vel nisl, tortor malesuada augue vulputate diam velit pellentesque sodales, duis phasellus vestibulum fermentum leo facilisi porta. Hac porttitor cum dapibus volutpat quisque odio taciti nulla senectus mollis curae, accumsan suscipit cubilia tempor ligula in venenatis justo leo erat, magna tincidunt nullam lacinia luctus malesuada non vivamus praesent pharetra. Non quam felis montes pretium volutpat suspendisse lacus, torquent magna dictumst orci libero porta, feugiat taciti cras ridiculus aenean rutrum. Tellus nostra tincidunt hac in ligula mi vulputate venenatis pellentesque urna dui, at luctus tristique quisque vel a dignissim scelerisque platea pretium, suspendisse ante phasellus porttitor quis aliquam malesuada etiam enim nullam. \n\nHendrerit taciti litora nec facilisis diam vehicula magnis potenti, parturient velit egestas nisl lobortis tincidunt rutrum cursus, fusce senectus mi massa primis mattis rhoncus. Accumsan est ac varius consequat vulputate, ligula cursus euismod sagittis inceptos scelerisque, lacus malesuada torquent dictumst. Volutpat morbi metus urna rhoncus nunc tempor molestie, congue curabitur quis interdum posuere. Mollis viverra velit tortor mus netus nunc molestie metus, sem massa himenaeos luctus feugiat taciti iaculis fames porttitor, leo arcu consequat gravida dapibus pulvinar elementum. ";
				}
				function compiledContent$3() {
					return html$2;
				}
				function getHeadings$3() {
					return [{"depth":2,"slug":"nostra-torquent-consequat-volutpat-aliquet-neque","text":"Nostra torquent consequat volutpat aliquet neque"},{"depth":2,"slug":"praesent-tellus-ad-sapien-erat-or","text":"Praesent tellus ad sapien erat or"}];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return contentFragment;
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$3,
  file: file$3,
  url: url$3,
  rawContent: rawContent$3,
  compiledContent: compiledContent$3,
  getHeadings: getHeadings$3,
  getHeaders: getHeaders$2,
  Content: Content$3,
  default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<h2 id=\"congue-justo-vulputate-nascetur-convallis-varius-orci-fringilla-nulla-pharetr\">Congue justo vulputate nascetur convallis varius orci fringilla nulla pharetr</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing elit, augue malesuada natoque in ad erat aliquam facilisi, lacus rhoncus mattis nostra et a. Mauris malesuada rutrum dis libero egestas mus vulputate, fermentum ad morbi phasellus faucibus tellus leo urna, blandit ullamcorper diam imperdiet dictumst litora. Fringilla eros malesuada lobortis mi odio metus leo, blandit imperdiet augue fames aliquam ultricies tortor massa, duis magnis hendrerit id magna sociosqu. Aptent mi imperdiet id sapien suscipit ut netus turpis, lacinia ac porttitor potenti dui taciti at egestas, fermentum neque nascetur sodales tortor nunc congue.</p>\n<p>Accumsan torquent vitae convallis duis cras risus pretium nulla mi litora sociosqu, facilisi bibendum eget faucibus metus felis egestas auctor malesuada. Erat nam orci dui turpis iaculis condimentum dictumst suscipit primis, donec consequat felis odio vitae himenaeos facilisis commodo potenti ante, habitasse quis arcu neque interdum per lobortis nunc. Ultricies lobortis ullamcorper sagittis et sollicitudin sociis sed dignissim posuere, nisi pharetra erat varius id aenean lacinia commodo morbi primis, ornare diam proin nunc volutpat nec dui egestas.</p>\n<h2 id=\"mauris-velit-laoreet-vitae-cursus-augue\">Mauris velit laoreet vitae cursus augue</h2>\n<ul>\n<li>\n<p>Massa egestas consequat nisl id volutpat, varius neque aenean.</p>\n</li>\n<li>\n<p>Venenatis tincidunt eros pretium viverra lacinia convallis, turpis orci condimentum fusce.</p>\n</li>\n<li>\n<p>Pellentesque in aliquet nisi gravida netus, commodo aptent volutpat.</p>\n</li>\n<li>\n<p>Nisi rutrum eros euismod, parturient ullamcorper mattis a, dapibus vestibulum.</p>\n</li>\n</ul>\n<p>Senectus fermentum tristique egestas bibendum per dictumst purus pharetra cras dictum pulvinar, vitae nec eros montes dis quis nullam duis netus litora, feugiat cubilia mollis porttitor velit ligula metus ante risus eu.</p>\n<p>Vitae at pretium sem curabitur nascetur a aliquet dignissim ultricies congue, imperdiet rhoncus neque dictum et natoque sapien iaculis quam varius mollis, id augue torquent tortor lacus maecenas faucibus curae placerat. Nisi commodo nunc parturient in lacus fusce orci hac magna, litora cubilia euismod congue et curae ac ornare. Orci natoque laoreet feugiat tincidunt quisque habitasse nulla magnis ultrices magna, eros habitant hendrerit elementum hac senectus accumsan porta tortor, consequat convallis erat eget himenaeos conubia primis lacinia malesuada.</p>\n<p>Felis ad nisi taciti cubilia dis nulla potenti, tincidunt nascetur integer enim est at congue, aliquet sed lectus donec nam quam. Condimentum morbi ligula senectus faucibus diam sagittis orci, molestie per commodo potenti tempus vulputate porttitor pulvinar, justo natoque taciti luctus nisi augue. Ullamcorper venenatis mauris ante lectus orci praesent tortor, mus varius fringilla et cras semper justo metus, quisque odio sed quis iaculis diam.</p>\n<p>Mus dictum ante cum lectus dapibus sed arcu accumsan facilisi convallis potenti, tincidunt duis habitant diam magna sollicitudin orci pulvinar penatibus in, aptent nascetur mollis elementum natoque nibh mattis egestas class praesent. Eget torquent purus justo aptent id euismod aenean ante fames tincidunt, varius vitae curabitur eu massa ridiculus faucibus eleifend suscipit. Per volutpat ac nascetur eleifend ligula mollis, blandit vestibulum felis eros interdum conubia maecenas, netus condimentum litora ornare integer. A eros tortor netus ultricies tellus, posuere porta ligula conubia laoreet, malesuada rhoncus potenti suspendisse.</p>\n<p>Commodo ut augue ac donec lacus nisl pharetra iaculis, venenatis mattis vivamus est pellentesque euismod tempor litora etiam, non facilisi bibendum cursus odio dui auctor. Hendrerit sociis faucibus enim nisi felis elementum, ullamcorper lacus imperdiet placerat inceptos aenean, quam himenaeos pellentesque etiam duis. Curabitur magna habitant accumsan vulputate mus fringilla integer parturient ullamcorper vehicula, mollis blandit etiam mauris consequat congue posuere condimentum ac, per viverra aptent duis urna fermentum ante aliquam diam.</p>\n<p>Rutrum velit egestas bibendum congue sem proin placerat vitae, semper hendrerit arcu maecenas dignissim nisl ac, dictum pulvinar varius interdum tempus suscipit eros. Ante vitae orci semper dignissim convallis dis hendrerit, molestie diam quam velit consequat purus curabitur, accumsan vivamus pulvinar vel leo eleifend. Gravida condimentum imperdiet est sociosqu porttitor elementum suspendisse cum ac, feugiat nulla litora dignissim convallis proin montes egestas urna massa, vestibulum mus faucibus euismod dictum velit suscipit libero.</p>\n<p>Risus pellentesque montes laoreet orci natoque erat, vivamus hac sociosqu volutpat mauris sodales, ultricies odio feugiat viverra lectus. Cum vehicula erat imperdiet pretium vulputate fringilla posuere nostra lacinia sem molestie habitant dignissim ullamcorper, rutrum tristique interdum nascetur a fermentum at fames vestibulum per mattis conubia. Nulla venenatis himenaeos eu inceptos facilisis ultricies, faucibus curae mollis luctus nascetur turpis litora, curabitur auctor laoreet enim mattis. Eget nam etiam faucibus turpis senectus varius auctor venenatis augue fringilla, suscipit sodales urna imperdiet litora interdum leo accumsan natoque.</p>\n<p>Hac proin sapien enim a turpis fusce aliquam duis quis, malesuada eget laoreet ad augue tempus cubilia potenti blandit, auctor cum at hendrerit ullamcorper donec suscipit cursus. Ligula tempus semper a metus interdum est ultrices, sapien turpis et aptent viverra dui, auctor purus platea morbi ridiculus torquent. Donec est morbi dapibus mollis ultrices metus sollicitudin platea, placerat euismod nibh luctus etiam nisi ut, ultricies vivamus vitae aenean mus nulla condimentum.</p>\n<p>Curabitur dapibus rutrum luctus mollis nunc fringilla tellus etiam curae fames euismod aliquet eu, magnis purus venenatis pharetra integer blandit elementum varius dictumst viverra donec ridiculus. Arcu libero suspendisse fermentum sodales pharetra eleifend taciti iaculis, commodo purus sollicitudin urna tempor fames gravida semper, vitae justo vulputate fusce tempus hendrerit vivamus. Vel posuere risus ultrices velit volutpat in magna maecenas, duis bibendum egestas curae auctor tristique faucibus. Sed turpis vel imperdiet risus metus mattis aliquet diam magnis fringilla, praesent molestie donec blandit himenaeos curabitur lectus varius natoque facilisis fames, ligula duis mi facilisi rhoncus gravida euismod mus ac.</p>\n<p>Nunc aptent facilisi imperdiet quam faucibus donec taciti habitant venenatis aliquam in ridiculus curabitur nostra, eu sociis cubilia accumsan sapien vitae sodales praesent lacus mi mollis varius quis. Lacinia leo sollicitudin a velit venenatis sed, laoreet in quam tempus lobortis dictumst, porttitor porta montes commodo magnis. Malesuada erat consequat varius lobortis ornare cursus nibh velit, ultrices rutrum dignissim dictum elementum dis volutpat risus at, ante ridiculus mi tempus tellus senectus duis.</p>\n<p>Donec dapibus est aliquam cum dictum potenti diam, fusce himenaeos molestie phasellus massa eros nam pulvinar, eget sociosqu sapien duis natoque nunc. Justo donec natoque mus at tempus curae ornare, aenean congue fames mauris sociosqu mattis orci, quam accumsan erat nunc senectus massa. Cum dis vestibulum litora fames mattis lacinia ligula, habitasse viverra suspendisse faucibus consequat primis, magna risus arcu vel commodo facilisis.</p>\n<p>Curae tincidunt sed enim eleifend non ornare mus interdum augue, lectus ut quis ultricies habitant varius integer fringilla, aptent volutpat eget nisi cum in conubia pretium. Vivamus ut phasellus hac venenatis ullamcorper porta ad ante class morbi, at facilisi molestie sodales erat posuere accumsan mattis turpis, sed per commodo id netus himenaeos vel justo mauris. Sapien dui vestibulum dictum massa augue lectus taciti aenean, vitae orci pellentesque donec interdum ultrices molestie, hac fames nulla nisi leo justo est.</p>\n<p>Erat tellus ultrices luctus mauris sapien lacinia ac convallis cubilia, orci lacus velit felis nisi eget hac neque, placerat fames conubia eros lobortis nostra torquent dictum. Ultricies donec ad vel pharetra purus enim leo vivamus, sagittis id tempor molestie pretium arcu nibh sem, mattis sodales mollis massa fringilla nisi faucibus. Nostra diam habitasse per convallis dignissim dictum gravida facilisis, scelerisque felis ullamcorper posuere mollis ultrices quisque laoreet, ridiculus auctor habitant aliquet arcu natoque mattis.</p>\n<p>Porttitor sollicitudin tellus vel libero mi morbi dui sem viverra taciti, pharetra habitasse placerat nullam auctor praesent risus nulla tempus proin, integer conubia eros ligula ultrices cubilia class lectus tincidunt. Morbi maecenas penatibus potenti enim platea ante, quis per lobortis curae natoque. Nec sodales tortor diam blandit venenatis eleifend nascetur eu duis, faucibus morbi magna curae ut aenean cubilia condimentum, sociosqu semper fringilla sollicitudin curabitur vulputate quis ac. Nostra purus in risus laoreet litora urna torquent faucibus, morbi commodo facilisis proin enim conubia hendrerit, nibh ornare consequat sem eu cursus aliquam.</p>\n<p>Montes vulputate fermentum sed nunc penatibus cubilia tempus malesuada dapibus, posuere semper interdum lacinia rutrum facilisis elementum sociosqu, conubia tincidunt aenean tortor porttitor phasellus vehicula eleifend. Potenti habitant pellentesque tempus praesent class curabitur scelerisque suspendisse sociosqu dis, senectus tellus nec cursus fermentum ridiculus malesuada magnis elementum, neque leo velit non nascetur mauris feugiat vel netus. Dui laoreet sem natoque diam gravida condimentum interdum faucibus elementum lacus, auctor quam etiam integer convallis tincidunt rhoncus volutpat nulla, varius odio sociis ut fermentum fusce feugiat ultricies luctus.</p>\n<p>Dignissim tristique venenatis diam auctor malesuada aenean aliquam ornare iaculis, primis vulputate libero suspendisse viverra vivamus sociosqu. Luctus cras suspendisse quis magna odio varius gravida turpis nec metus non id fringilla, parturient maecenas dapibus faucibus hendrerit felis laoreet mollis cum nostra commodo. Porttitor hendrerit dictum eleifend fusce dis fermentum at pellentesque, laoreet commodo dictumst semper dui erat montes, curabitur duis praesent facilisi sem ullamcorper inceptos.</p>\n<p>Imperdiet sagittis sapien lobortis quis consequat blandit habitant porta potenti sed, natoque dictum nulla phasellus viverra felis pretium parturient. Convallis habitasse sem turpis nunc praesent ornare mi elementum eu hendrerit, id nascetur sagittis tempor nibh quam a ligula primis imperdiet ullamcorper, nam purus luctus morbi class scelerisque vulputate magna tellus. Pharetra quisque pellentesque nam imperdiet lacinia enim, donec vitae senectus scelerisque phasellus dictumst, ac aliquam mattis urna ante.</p>\n<p>Habitant praesent pulvinar scelerisque per phasellus lobortis velit, magnis odio himenaeos primis curabitur senectus, nascetur ullamcorper convallis nunc placerat nisl. Porta tellus commodo praesent ullamcorper cursus senectus tempor vivamus, penatibus eu purus ultrices posuere mi sodales, urna quisque accumsan imperdiet convallis aptent nisl. Gravida hendrerit venenatis curabitur sollicitudin metus auctor vivamus vulputate malesuada, mauris purus maecenas ac magna duis nostra ad a massa, nisl conubia odio lacinia rhoncus felis erat montes. Nostra eros proin mi venenatis enim semper ad magnis netus, in vestibulum ornare ac fusce aliquet aptent non condimentum faucibus, tempor arcu potenti blandit magna consequat luctus nam.</p>";

				const frontmatter$2 = {"readingTime":8,"publishDate":"Aug 10 2022","title":"How to customize AstroWind template to suit your branding","description":"Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat","image":"~/assets/images/colors.jpg","tags":["astro","tailwind css","theme"]};
				const file$2 = "/home/dww510/betahero/site/data/blog/how-to-customize-astrowind-to-your-brand.md";
				const url$2 = undefined;
				function rawContent$2() {
					return "\n## Congue justo vulputate nascetur convallis varius orci fringilla nulla pharetr\n\nLorem ipsum dolor sit amet consectetur adipiscing elit, augue malesuada natoque in ad erat aliquam facilisi, lacus rhoncus mattis nostra et a. Mauris malesuada rutrum dis libero egestas mus vulputate, fermentum ad morbi phasellus faucibus tellus leo urna, blandit ullamcorper diam imperdiet dictumst litora. Fringilla eros malesuada lobortis mi odio metus leo, blandit imperdiet augue fames aliquam ultricies tortor massa, duis magnis hendrerit id magna sociosqu. Aptent mi imperdiet id sapien suscipit ut netus turpis, lacinia ac porttitor potenti dui taciti at egestas, fermentum neque nascetur sodales tortor nunc congue. \n\nAccumsan torquent vitae convallis duis cras risus pretium nulla mi litora sociosqu, facilisi bibendum eget faucibus metus felis egestas auctor malesuada. Erat nam orci dui turpis iaculis condimentum dictumst suscipit primis, donec consequat felis odio vitae himenaeos facilisis commodo potenti ante, habitasse quis arcu neque interdum per lobortis nunc. Ultricies lobortis ullamcorper sagittis et sollicitudin sociis sed dignissim posuere, nisi pharetra erat varius id aenean lacinia commodo morbi primis, ornare diam proin nunc volutpat nec dui egestas. \n\n## Mauris velit laoreet vitae cursus augue\n\n- Massa egestas consequat nisl id volutpat, varius neque aenean.\n\n- Venenatis tincidunt eros pretium viverra lacinia convallis, turpis orci condimentum fusce.\n\n- Pellentesque in aliquet nisi gravida netus, commodo aptent volutpat.\n\n- Nisi rutrum eros euismod, parturient ullamcorper mattis a, dapibus vestibulum.\n\nSenectus fermentum tristique egestas bibendum per dictumst purus pharetra cras dictum pulvinar, vitae nec eros montes dis quis nullam duis netus litora, feugiat cubilia mollis porttitor velit ligula metus ante risus eu. \n\nVitae at pretium sem curabitur nascetur a aliquet dignissim ultricies congue, imperdiet rhoncus neque dictum et natoque sapien iaculis quam varius mollis, id augue torquent tortor lacus maecenas faucibus curae placerat. Nisi commodo nunc parturient in lacus fusce orci hac magna, litora cubilia euismod congue et curae ac ornare. Orci natoque laoreet feugiat tincidunt quisque habitasse nulla magnis ultrices magna, eros habitant hendrerit elementum hac senectus accumsan porta tortor, consequat convallis erat eget himenaeos conubia primis lacinia malesuada. \n\nFelis ad nisi taciti cubilia dis nulla potenti, tincidunt nascetur integer enim est at congue, aliquet sed lectus donec nam quam. Condimentum morbi ligula senectus faucibus diam sagittis orci, molestie per commodo potenti tempus vulputate porttitor pulvinar, justo natoque taciti luctus nisi augue. Ullamcorper venenatis mauris ante lectus orci praesent tortor, mus varius fringilla et cras semper justo metus, quisque odio sed quis iaculis diam. \n\nMus dictum ante cum lectus dapibus sed arcu accumsan facilisi convallis potenti, tincidunt duis habitant diam magna sollicitudin orci pulvinar penatibus in, aptent nascetur mollis elementum natoque nibh mattis egestas class praesent. Eget torquent purus justo aptent id euismod aenean ante fames tincidunt, varius vitae curabitur eu massa ridiculus faucibus eleifend suscipit. Per volutpat ac nascetur eleifend ligula mollis, blandit vestibulum felis eros interdum conubia maecenas, netus condimentum litora ornare integer. A eros tortor netus ultricies tellus, posuere porta ligula conubia laoreet, malesuada rhoncus potenti suspendisse. \n\nCommodo ut augue ac donec lacus nisl pharetra iaculis, venenatis mattis vivamus est pellentesque euismod tempor litora etiam, non facilisi bibendum cursus odio dui auctor. Hendrerit sociis faucibus enim nisi felis elementum, ullamcorper lacus imperdiet placerat inceptos aenean, quam himenaeos pellentesque etiam duis. Curabitur magna habitant accumsan vulputate mus fringilla integer parturient ullamcorper vehicula, mollis blandit etiam mauris consequat congue posuere condimentum ac, per viverra aptent duis urna fermentum ante aliquam diam. \n\nRutrum velit egestas bibendum congue sem proin placerat vitae, semper hendrerit arcu maecenas dignissim nisl ac, dictum pulvinar varius interdum tempus suscipit eros. Ante vitae orci semper dignissim convallis dis hendrerit, molestie diam quam velit consequat purus curabitur, accumsan vivamus pulvinar vel leo eleifend. Gravida condimentum imperdiet est sociosqu porttitor elementum suspendisse cum ac, feugiat nulla litora dignissim convallis proin montes egestas urna massa, vestibulum mus faucibus euismod dictum velit suscipit libero. \n\nRisus pellentesque montes laoreet orci natoque erat, vivamus hac sociosqu volutpat mauris sodales, ultricies odio feugiat viverra lectus. Cum vehicula erat imperdiet pretium vulputate fringilla posuere nostra lacinia sem molestie habitant dignissim ullamcorper, rutrum tristique interdum nascetur a fermentum at fames vestibulum per mattis conubia. Nulla venenatis himenaeos eu inceptos facilisis ultricies, faucibus curae mollis luctus nascetur turpis litora, curabitur auctor laoreet enim mattis. Eget nam etiam faucibus turpis senectus varius auctor venenatis augue fringilla, suscipit sodales urna imperdiet litora interdum leo accumsan natoque. \n\nHac proin sapien enim a turpis fusce aliquam duis quis, malesuada eget laoreet ad augue tempus cubilia potenti blandit, auctor cum at hendrerit ullamcorper donec suscipit cursus. Ligula tempus semper a metus interdum est ultrices, sapien turpis et aptent viverra dui, auctor purus platea morbi ridiculus torquent. Donec est morbi dapibus mollis ultrices metus sollicitudin platea, placerat euismod nibh luctus etiam nisi ut, ultricies vivamus vitae aenean mus nulla condimentum. \n\nCurabitur dapibus rutrum luctus mollis nunc fringilla tellus etiam curae fames euismod aliquet eu, magnis purus venenatis pharetra integer blandit elementum varius dictumst viverra donec ridiculus. Arcu libero suspendisse fermentum sodales pharetra eleifend taciti iaculis, commodo purus sollicitudin urna tempor fames gravida semper, vitae justo vulputate fusce tempus hendrerit vivamus. Vel posuere risus ultrices velit volutpat in magna maecenas, duis bibendum egestas curae auctor tristique faucibus. Sed turpis vel imperdiet risus metus mattis aliquet diam magnis fringilla, praesent molestie donec blandit himenaeos curabitur lectus varius natoque facilisis fames, ligula duis mi facilisi rhoncus gravida euismod mus ac. \n\nNunc aptent facilisi imperdiet quam faucibus donec taciti habitant venenatis aliquam in ridiculus curabitur nostra, eu sociis cubilia accumsan sapien vitae sodales praesent lacus mi mollis varius quis. Lacinia leo sollicitudin a velit venenatis sed, laoreet in quam tempus lobortis dictumst, porttitor porta montes commodo magnis. Malesuada erat consequat varius lobortis ornare cursus nibh velit, ultrices rutrum dignissim dictum elementum dis volutpat risus at, ante ridiculus mi tempus tellus senectus duis. \n\nDonec dapibus est aliquam cum dictum potenti diam, fusce himenaeos molestie phasellus massa eros nam pulvinar, eget sociosqu sapien duis natoque nunc. Justo donec natoque mus at tempus curae ornare, aenean congue fames mauris sociosqu mattis orci, quam accumsan erat nunc senectus massa. Cum dis vestibulum litora fames mattis lacinia ligula, habitasse viverra suspendisse faucibus consequat primis, magna risus arcu vel commodo facilisis. \n\nCurae tincidunt sed enim eleifend non ornare mus interdum augue, lectus ut quis ultricies habitant varius integer fringilla, aptent volutpat eget nisi cum in conubia pretium. Vivamus ut phasellus hac venenatis ullamcorper porta ad ante class morbi, at facilisi molestie sodales erat posuere accumsan mattis turpis, sed per commodo id netus himenaeos vel justo mauris. Sapien dui vestibulum dictum massa augue lectus taciti aenean, vitae orci pellentesque donec interdum ultrices molestie, hac fames nulla nisi leo justo est. \n\nErat tellus ultrices luctus mauris sapien lacinia ac convallis cubilia, orci lacus velit felis nisi eget hac neque, placerat fames conubia eros lobortis nostra torquent dictum. Ultricies donec ad vel pharetra purus enim leo vivamus, sagittis id tempor molestie pretium arcu nibh sem, mattis sodales mollis massa fringilla nisi faucibus. Nostra diam habitasse per convallis dignissim dictum gravida facilisis, scelerisque felis ullamcorper posuere mollis ultrices quisque laoreet, ridiculus auctor habitant aliquet arcu natoque mattis. \n\nPorttitor sollicitudin tellus vel libero mi morbi dui sem viverra taciti, pharetra habitasse placerat nullam auctor praesent risus nulla tempus proin, integer conubia eros ligula ultrices cubilia class lectus tincidunt. Morbi maecenas penatibus potenti enim platea ante, quis per lobortis curae natoque. Nec sodales tortor diam blandit venenatis eleifend nascetur eu duis, faucibus morbi magna curae ut aenean cubilia condimentum, sociosqu semper fringilla sollicitudin curabitur vulputate quis ac. Nostra purus in risus laoreet litora urna torquent faucibus, morbi commodo facilisis proin enim conubia hendrerit, nibh ornare consequat sem eu cursus aliquam. \n\nMontes vulputate fermentum sed nunc penatibus cubilia tempus malesuada dapibus, posuere semper interdum lacinia rutrum facilisis elementum sociosqu, conubia tincidunt aenean tortor porttitor phasellus vehicula eleifend. Potenti habitant pellentesque tempus praesent class curabitur scelerisque suspendisse sociosqu dis, senectus tellus nec cursus fermentum ridiculus malesuada magnis elementum, neque leo velit non nascetur mauris feugiat vel netus. Dui laoreet sem natoque diam gravida condimentum interdum faucibus elementum lacus, auctor quam etiam integer convallis tincidunt rhoncus volutpat nulla, varius odio sociis ut fermentum fusce feugiat ultricies luctus. \n\nDignissim tristique venenatis diam auctor malesuada aenean aliquam ornare iaculis, primis vulputate libero suspendisse viverra vivamus sociosqu. Luctus cras suspendisse quis magna odio varius gravida turpis nec metus non id fringilla, parturient maecenas dapibus faucibus hendrerit felis laoreet mollis cum nostra commodo. Porttitor hendrerit dictum eleifend fusce dis fermentum at pellentesque, laoreet commodo dictumst semper dui erat montes, curabitur duis praesent facilisi sem ullamcorper inceptos. \n\nImperdiet sagittis sapien lobortis quis consequat blandit habitant porta potenti sed, natoque dictum nulla phasellus viverra felis pretium parturient. Convallis habitasse sem turpis nunc praesent ornare mi elementum eu hendrerit, id nascetur sagittis tempor nibh quam a ligula primis imperdiet ullamcorper, nam purus luctus morbi class scelerisque vulputate magna tellus. Pharetra quisque pellentesque nam imperdiet lacinia enim, donec vitae senectus scelerisque phasellus dictumst, ac aliquam mattis urna ante. \n\nHabitant praesent pulvinar scelerisque per phasellus lobortis velit, magnis odio himenaeos primis curabitur senectus, nascetur ullamcorper convallis nunc placerat nisl. Porta tellus commodo praesent ullamcorper cursus senectus tempor vivamus, penatibus eu purus ultrices posuere mi sodales, urna quisque accumsan imperdiet convallis aptent nisl. Gravida hendrerit venenatis curabitur sollicitudin metus auctor vivamus vulputate malesuada, mauris purus maecenas ac magna duis nostra ad a massa, nisl conubia odio lacinia rhoncus felis erat montes. Nostra eros proin mi venenatis enim semper ad magnis netus, in vestibulum ornare ac fusce aliquet aptent non condimentum faucibus, tempor arcu potenti blandit magna consequat luctus nam. ";
				}
				function compiledContent$2() {
					return html$1;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"congue-justo-vulputate-nascetur-convallis-varius-orci-fringilla-nulla-pharetr","text":"Congue justo vulputate nascetur convallis varius orci fringilla nulla pharetr"},{"depth":2,"slug":"mauris-velit-laoreet-vitae-cursus-augue","text":"Mauris velit laoreet vitae cursus augue"}];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return contentFragment;
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$2,
  file: file$2,
  url: url$2,
  rawContent: rawContent$2,
  compiledContent: compiledContent$2,
  getHeadings: getHeadings$2,
  getHeaders: getHeaders$1,
  Content: Content$2,
  default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const frontmatter$1 = {
  "readingTime": 9,
  "publishDate": "Aug 02 2022",
  "title": "Markdown elements demo post",
  "description": "Lorem ipsum dolor sit amet",
  "excerpt": "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat",
  "image": "~/assets/images/astronaut.jpg",
  "tags": ["markdown", "astro", "blog"]
};
function getHeadings$1() {
  return [{
    "depth": 2,
    "slug": "headings",
    "text": "Headings"
  }, {
    "depth": 2,
    "slug": "heading-two",
    "text": "Heading two"
  }, {
    "depth": 3,
    "slug": "heading-three",
    "text": "Heading three"
  }, {
    "depth": 4,
    "slug": "heading-four",
    "text": "Heading four"
  }, {
    "depth": 5,
    "slug": "heading-five",
    "text": "Heading five"
  }, {
    "depth": 6,
    "slug": "heading-six",
    "text": "Heading six"
  }, {
    "depth": 2,
    "slug": "paragraphs",
    "text": "Paragraphs"
  }, {
    "depth": 2,
    "slug": "blockquotes",
    "text": "Blockquotes"
  }, {
    "depth": 2,
    "slug": "lists",
    "text": "Lists"
  }, {
    "depth": 3,
    "slug": "ordered-list",
    "text": "Ordered List"
  }, {
    "depth": 3,
    "slug": "unordered-list",
    "text": "Unordered List"
  }, {
    "depth": 2,
    "slug": "horizontal-rule",
    "text": "Horizontal rule"
  }, {
    "depth": 2,
    "slug": "table",
    "text": "Table"
  }, {
    "depth": 2,
    "slug": "code",
    "text": "Code"
  }, {
    "depth": 3,
    "slug": "inline-code",
    "text": "Inline code"
  }, {
    "depth": 3,
    "slug": "highlighted",
    "text": "Highlighted"
  }, {
    "depth": 2,
    "slug": "inline-elements",
    "text": "Inline elements"
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    p: "p",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    a: "a",
    blockquote: "blockquote",
    ol: "ol",
    li: "li",
    ul: "ul",
    hr: "hr",
    table: "table",
    thead: "thead",
    tr: "tr",
    th: "th",
    tbody: "tbody",
    td: "td",
    code: "code",
    pre: "pre",
    span: "span",
    strong: "strong",
    img: "img",
    em: "em"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.h2, {
      id: "headings",
      children: [createVNode("a", {
        name: "Headings"
      }), "Headings"]
    }), "\n", createVNode(_components.p, {
      children: "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat commodo id sunt. Nostrud enim ad commodo incididunt cupidatat in ullamco ullamco Lorem cupidatat velit enim et Lorem. Ut laborum cillum laboris fugiat culpa sint irure do reprehenderit culpa occaecat. Exercitation esse mollit tempor magna aliqua in occaecat aliquip veniam reprehenderit nisi dolor in laboris dolore velit."
    }), "\n", createVNode(_components.h2, {
      id: "heading-two",
      children: "Heading two"
    }), "\n", createVNode(_components.p, {
      children: "Aute officia nulla deserunt do deserunt cillum velit magna. Officia veniam culpa anim minim dolore labore pariatur voluptate id ad est duis quis velit dolor pariatur enim. Incididunt enim excepteur do veniam consequat culpa do voluptate dolor fugiat ad adipisicing sit. Labore officia est adipisicing dolore proident eiusmod exercitation deserunt ullamco anim do occaecat velit. Elit dolor consectetur proident sunt aliquip est do tempor quis aliqua culpa aute. Duis in tempor exercitation pariatur et adipisicing mollit irure tempor ut enim esse commodo laboris proident. Do excepteur laborum anim esse aliquip eu sit id Lorem incididunt elit irure ea nulla dolor et. Nulla amet fugiat qui minim deserunt enim eu cupidatat aute officia do velit ea reprehenderit."
    }), "\n", createVNode(_components.h3, {
      id: "heading-three",
      children: "Heading three"
    }), "\n", createVNode(_components.p, {
      children: "Voluptate cupidatat cillum elit quis ipsum eu voluptate fugiat consectetur enim. Quis ut voluptate culpa ex anim aute consectetur dolore proident voluptate exercitation eiusmod. Esse in do anim magna minim culpa sint. Adipisicing ipsum consectetur proident ullamco magna sit amet aliqua aute fugiat laborum exercitation duis et."
    }), "\n", createVNode(_components.h4, {
      id: "heading-four",
      children: "Heading four"
    }), "\n", createVNode(_components.p, {
      children: "Commodo fugiat aliqua minim quis pariatur mollit id tempor. Non occaecat minim esse enim aliqua adipisicing nostrud duis consequat eu adipisicing qui. Minim aliquip sit excepteur ipsum consequat laborum pariatur excepteur. Veniam fugiat et amet ad elit anim laborum duis mollit occaecat et et ipsum et reprehenderit. Occaecat aliquip dolore adipisicing sint labore occaecat officia fugiat. Quis adipisicing exercitation exercitation eu amet est laboris sunt nostrud ipsum reprehenderit ullamco. Enim sint ut consectetur id anim aute voluptate exercitation mollit dolore magna magna est Lorem. Ut adipisicing adipisicing aliqua ullamco voluptate labore nisi tempor esse magna incididunt."
    }), "\n", createVNode(_components.h5, {
      id: "heading-five",
      children: "Heading five"
    }), "\n", createVNode(_components.p, {
      children: "Veniam enim esse amet veniam deserunt laboris amet enim consequat. Minim nostrud deserunt cillum consectetur commodo eu enim nostrud ullamco occaecat excepteur. Aliquip et ut est commodo enim dolor amet sint excepteur. Amet ad laboris laborum deserunt sint sunt aliqua commodo ex duis deserunt enim est ex labore ut. Duis incididunt velit adipisicing non incididunt adipisicing adipisicing. Ad irure duis nisi tempor eu dolor fugiat magna et consequat tempor eu ex dolore. Mollit esse nisi qui culpa ut nisi ex proident culpa cupidatat cillum culpa occaecat anim. Ut officia sit ea nisi ea excepteur nostrud ipsum et nulla."
    }), "\n", createVNode(_components.h6, {
      id: "heading-six",
      children: "Heading six"
    }), "\n", createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "paragraphs",
      children: [createVNode("a", {
        name: "Paragraphs"
      }), "Paragraphs"]
    }), "\n", createVNode(_components.p, {
      children: "Incididunt ex adipisicing ea ullamco consectetur in voluptate proident fugiat tempor deserunt reprehenderit ullamco id dolore laborum. Do laboris laboris minim incididunt qui consectetur exercitation adipisicing dolore et magna consequat magna anim sunt. Officia fugiat Lorem sunt pariatur incididunt Lorem reprehenderit proident irure. Dolore ipsum aliqua mollit ad officia fugiat sit eu aliquip cupidatat ipsum duis laborum laborum fugiat esse. Voluptate anim ex dolore deserunt ea ex eiusmod irure. Occaecat excepteur aliqua exercitation aliquip dolor esse eu eu."
    }), "\n", createVNode(_components.p, {
      children: "Officia dolore laborum aute incididunt commodo nisi velit est est elit et dolore elit exercitation. Enim aliquip magna id ipsum aliquip consectetur ad nulla quis. Incididunt pariatur dolor consectetur cillum enim velit cupidatat laborum quis ex."
    }), "\n", createVNode(_components.p, {
      children: "Officia irure in non voluptate adipisicing sit amet tempor duis dolore deserunt enim ut. Reprehenderit incididunt in ad anim et deserunt deserunt Lorem laborum quis. Enim aute anim labore proident laboris voluptate elit excepteur in. Ex labore nulla velit officia ullamco Lorem Lorem id do. Dolore ullamco ipsum magna dolor pariatur voluptate ipsum id occaecat ipsum. Dolore tempor quis duis commodo quis quis enim."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "blockquotes",
      children: [createVNode("a", {
        name: "Blockquotes"
      }), "Blockquotes"]
    }), "\n", createVNode(_components.p, {
      children: "Ad nisi laborum aute cupidatat magna deserunt eu id laboris id. Aliquip nulla cupidatat sint ex Lorem mollit laborum dolor amet est ut esse aute. Nostrud ex consequat id incididunt proident ipsum minim duis aliqua ut ex et ad quis. Laborum sint esse cillum anim nulla cillum consectetur aliqua sit. Nisi excepteur cillum labore amet excepteur commodo enim occaecat consequat ipsum proident exercitation duis id in."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Ipsum et cupidatat mollit exercitation enim duis sunt irure aliqua reprehenderit mollit. Pariatur Lorem pariatur laboris do culpa do elit irure. Eiusmod amet nulla voluptate velit culpa et aliqua ad reprehenderit sit ut."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Labore ea magna Lorem consequat aliquip consectetur cillum duis dolore. Et veniam dolor qui incididunt minim amet laboris sit. Dolore ad esse commodo et dolore amet est velit ut nisi ea. Excepteur ea nulla commodo dolore anim dolore adipisicing eiusmod labore id enim esse quis mollit deserunt est. Minim ea culpa voluptate nostrud commodo proident in duis aliquip minim."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Qui est sit et reprehenderit aute est esse enim aliqua id aliquip ea anim. Pariatur sint reprehenderit mollit velit voluptate enim consectetur sint enim. Quis exercitation proident elit non id qui culpa dolore esse aliquip consequat."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Ipsum excepteur cupidatat sunt minim ad eiusmod tempor sit."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Deserunt excepteur adipisicing culpa pariatur cillum laboris ullamco nisi fugiat cillum officia. In cupidatat nulla aliquip tempor ad Lorem Lorem quis voluptate officia consectetur pariatur ex in est duis. Mollit id esse est elit exercitation voluptate nostrud nisi laborum magna dolore dolore tempor in est consectetur."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Adipisicing voluptate ipsum culpa voluptate id aute laboris labore esse fugiat veniam ullamco occaecat do ut. Tempor et esse reprehenderit veniam proident ipsum irure sit ullamco et labore ea excepteur nulla labore ut. Ex aute minim quis tempor in eu id id irure ea nostrud dolor esse."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "lists",
      children: [createVNode("a", {
        name: "Lists"
      }), "Lists"]
    }), "\n", createVNode(_components.h3, {
      id: "ordered-list",
      children: "Ordered List"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: "Longan"
      }), "\n", createVNode(_components.li, {
        children: "Lychee"
      }), "\n", createVNode(_components.li, {
        children: "Excepteur ad cupidatat do elit laborum amet cillum reprehenderit consequat quis.\nDeserunt officia esse aliquip consectetur duis ut labore laborum commodo aliquip aliquip velit pariatur dolore."
      }), "\n", createVNode(_components.li, {
        children: "Marionberry"
      }), "\n", createVNode(_components.li, {
        children: ["Melon\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Cantaloupe"
          }), "\n", createVNode(_components.li, {
            children: "Honeydew"
          }), "\n", createVNode(_components.li, {
            children: "Watermelon"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Miracle fruit"
      }), "\n", createVNode(_components.li, {
        children: "Mulberry"
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "unordered-list",
      children: "Unordered List"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Olive"
      }), "\n", createVNode(_components.li, {
        children: ["Orange\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Blood orange"
          }), "\n", createVNode(_components.li, {
            children: "Clementine"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Papaya"
      }), "\n", createVNode(_components.li, {
        children: "Ut aute ipsum occaecat nisi culpa Lorem id occaecat cupidatat id id magna laboris ad duis. Fugiat cillum dolore veniam nostrud proident sint consectetur eiusmod irure adipisicing."
      }), "\n", createVNode(_components.li, {
        children: "Passionfruit"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "horizontal-rule",
      children: [createVNode("a", {
        name: "Horizontal"
      }), "Horizontal rule"]
    }), "\n", createVNode(_components.p, {
      children: "In dolore velit aliquip labore mollit minim tempor veniam eu veniam ad in sint aliquip mollit mollit. Ex occaecat non deserunt elit laborum sunt tempor sint consequat culpa culpa qui sit. Irure ad commodo eu voluptate mollit cillum cupidatat veniam proident amet minim reprehenderit."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: "In laboris eiusmod reprehenderit aliquip sit proident occaecat. Non sit labore anim elit veniam Lorem minim commodo eiusmod irure do minim nisi. Dolor amet cillum excepteur consequat sint non sint."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "table",
      children: [createVNode("a", {
        name: "Table"
      }), "Table"]
    }), "\n", createVNode(_components.p, {
      children: "Duis sunt ut pariatur reprehenderit mollit mollit magna dolore in pariatur nulla commodo sit dolor ad fugiat. Laboris amet ea occaecat duis eu enim exercitation deserunt ea laborum occaecat reprehenderit. Et incididunt dolor commodo consequat mollit nisi proident non pariatur in et incididunt id. Eu ut et Lorem ea ex magna minim ipsum ipsum do."
    }), "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, {
      children: [createVNode(_components.thead, {
        children: createVNode(_components.tr, {
          children: [createVNode(_components.th, {
            align: "left",
            children: "Table Heading 1"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 2"
          }), createVNode(_components.th, {
            align: "center",
            children: "Center align"
          }), createVNode(_components.th, {
            align: "right",
            children: "Right align"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 5"
          })]
        })
      }), createVNode(_components.tbody, {
        children: [createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        })]
      })]
    }), "\n", createVNode(_components.p, {
      children: "Minim id consequat adipisicing cupidatat laborum culpa veniam non consectetur et duis pariatur reprehenderit eu ex consectetur. Sunt nisi qui eiusmod ut cillum laborum Lorem officia aliquip laboris ullamco nostrud laboris non irure laboris. Cillum dolore labore Lorem deserunt mollit voluptate esse incididunt ex dolor."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "code",
      children: [createVNode("a", {
        name: "Code"
      }), "Code"]
    }), "\n", createVNode(_components.h3, {
      id: "inline-code",
      children: "Inline code"
    }), "\n", createVNode(_components.p, {
      children: ["Ad amet irure est magna id mollit Lorem in do duis enim. Excepteur velit nisi magna ea pariatur pariatur ullamco fugiat deserunt sint non sint. Duis duis est ", createVNode(_components.code, {
        children: "code in text"
      }), " velit velit aute culpa ex quis pariatur pariatur laborum aute pariatur duis tempor sunt ad. Irure magna voluptate dolore consectetur consectetur irure esse. Anim magna ", createVNode(_components.code, {
        children: "<strong>in culpa qui officia</strong>"
      }), " dolor eiusmod esse amet aute cupidatat aliqua do id voluptate cupidatat reprehenderit amet labore deserunt."]
    }), "\n", createVNode(_components.h3, {
      id: "highlighted",
      children: "Highlighted"
    }), "\n", createVNode(_components.p, {
      children: "Et fugiat ad nisi amet magna labore do cillum fugiat occaecat cillum Lorem proident. In sint dolor ullamco ad do adipisicing amet id excepteur Lorem aliquip sit irure veniam laborum duis cillum. Aliqua occaecat minim cillum deserunt magna sunt laboris do do irure ea nostrud consequat ut voluptate ex."
    }), "\n", createVNode(_components.pre, {
      className: "astro-code",
      style: {
        backgroundColor: "#0d1117",
        overflowX: "auto"
      },
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "package"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "main"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "fmt"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "net/http"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "handler"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w http.ResponseWriter, r "
          }), createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "*"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "http.Request) {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    fmt."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "Fprintf"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w, "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"Hi there, I love "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "%s"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "!\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", r.URL.Path["
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ":])"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "main"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "() {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "HandleFunc"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"/\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", handler)"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "ListenAndServe"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\":8080\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "nil"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Ex amet id ex aliquip id do laborum excepteur exercitation elit sint commodo occaecat nostrud est. Nostrud pariatur esse veniam laborum non sint magna sit laboris minim in id. Aliqua pariatur pariatur excepteur adipisicing irure culpa consequat commodo et ex id ad."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "inline-elements",
      children: [createVNode("a", {
        name: "Inline"
      }), "Inline elements"]
    }), "\n", createVNode(_components.p, {
      children: ["Sint ea anim ipsum ad commodo cupidatat do ", createVNode(_components.strong, {
        children: "exercitation"
      }), " incididunt et minim ad labore sunt. Minim deserunt labore laboris velit nulla incididunt ipsum nulla. Ullamco ad laborum ea qui et anim in laboris exercitation tempor sit officia laborum reprehenderit culpa velit quis. ", createVNode(_components.strong, {
        children: "Consequat commodo"
      }), " reprehenderit duis ", createVNode(_components.a, {
        href: "#!",
        children: "irure"
      }), " esse esse exercitation minim enim Lorem dolore duis irure. Nisi Lorem reprehenderit ea amet excepteur dolor excepteur magna labore proident voluptate ipsum. Reprehenderit ex esse deserunt aliqua ea officia mollit Lorem nulla magna enim. Et ad ipsum labore enim ipsum ", createVNode(_components.strong, {
        children: "cupidatat consequat"
      }), ". Commodo non ea cupidatat magna deserunt dolore ipsum velit nulla elit veniam nulla eiusmod proident officia."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://images.unsplash.com/photo-1471128466710-c26ff0d26143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY2MDc4MTk3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
        alt: "Super wide"
      })
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.em, {
        children: "Proident sit veniam in est proident officia adipisicing"
      }), " ea tempor cillum non cillum velit deserunt. Voluptate laborum incididunt sit consectetur Lorem irure incididunt voluptate nostrud. Commodo ut eiusmod tempor cupidatat esse enim minim ex anim consequat. Mollit sint culpa qui laboris quis consectetur ad sint esse. Amet anim anim minim ullamco et duis non irure. Sit tempor adipisicing ea laboris ", createVNode(_components.code, {
        children: "culpa ex duis sint"
      }), " anim aute reprehenderit id eu ea. Aute ", createVNode(_components.a, {
        href: "#!",
        children: "excepteur proident"
      }), " Lorem minim adipisicing nostrud mollit ad ut voluptate do nulla esse occaecat aliqua sint anim."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://placekitten.com/480/400",
        alt: "Not so big"
      })
    }), "\n", createVNode(_components.p, {
      children: ["Incididunt in culpa cupidatat mollit cillum qui proident sit. In cillum aliquip incididunt voluptate magna amet cupidatat cillum pariatur sint aliqua est ", createVNode(_components.em, {
        children: ["enim ", createVNode(_components.strong, {
          children: "anim"
        }), " voluptate"]
      }), ". Magna aliquip proident incididunt id duis pariatur eiusmod incididunt commodo culpa dolore sit. Culpa do nostrud elit ad exercitation anim pariatur non minim nisi ", createVNode(_components.strong, {
        children: ["adipisicing sunt ", createVNode(_components.em, {
          children: "officia"
        })]
      }), ". Do deserunt magna mollit Lorem commodo ipsum do cupidatat mollit enim ut elit veniam ea voluptate."]
    }), "\n", createVNode(_components.p, {
      children: ["Reprehenderit non eu quis in ad elit esse qui aute id ", createVNode(_components.a, {
        href: "#!",
        children: "incididunt"
      }), " dolore cillum. Esse laboris consequat dolor anim exercitation tempor aliqua deserunt velit magna laboris. Culpa culpa minim duis amet mollit do quis amet commodo nulla irure."]
    })]
  });
}
function MDXContent(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
__astro_tag_component__(getHeadings$1, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$1.layout);
const url$1 = "data/blog/markdown-elements-demo-post.mdx";
const file$1 = "/home/dww510/betahero/site/data/blog/markdown-elements-demo-post.mdx";
function rawContent$1() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$1() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$1 = MDXContent;

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$1,
  getHeadings: getHeadings$1,
  default: MDXContent,
  url: url$1,
  file: file$1,
  rawContent: rawContent$1,
  compiledContent: compiledContent$1,
  Content: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<h2 id=\"magna-nunc-senectus-torquent-per-fusce-sapien-ligula-tempus-cra\">Magna nunc senectus torquent per fusce sapien ligula tempus cra</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing, elit fusce imperdiet gravida velit massa, ligula aenean suscipit sociis lacinia. Sapien scelerisque rutrum sem accumsan orci imperdiet aliquam inceptos aliquet tempus ornare, netus nostra nam nunc platea pulvinar urna et suscipit pellentesque, aenean congue sociis non tellus quis proin etiam venenatis pretium. Nibh senectus lacinia volutpat nostra taciti ac posuere, dictum ultricies dictumst luctus in vehicula, mus molestie venenatis penatibus ridiculus elementum. Phasellus sollicitudin dignissim parturient tempor cubilia erat massa eleifend dapibus, condimentum cras tortor eu sem dictumst non. Faucibus neque est malesuada nostra luctus maecenas at condimentum, arcu eros vulputate curabitur blandit mollis volutpat, lectus leo dictumst duis semper tempor hendrerit. Egestas scelerisque fusce torquent cubilia consequat conubia lacus et mollis, condimentum taciti elementum sapien risus vulputate est.</p>\n<p>Tristique eleifend enim praesent mollis sem leo, molestie dictum penatibus sodales consequat ligula nulla, platea feugiat aptent sapien turpis. Mollis mus ac taciti maecenas pretium hendrerit proin accumsan, mattis dictumst netus nunc facilisi morbi cursus euismod quis, a commodo nulla integer varius enim vehicula. Consequat mi risus vulputate ullamcorper sociosqu pretium molestie cursus, parturient viverra non tempor tellus convallis vitae eleifend mus, bibendum pellentesque imperdiet vivamus nunc phasellus iaculis. Volutpat est ac dictumst eleifend maecenas torquent quam hac, mollis aliquam mattis euismod ornare risus fringilla proin nisi, sem fermentum primis ultrices varius etiam id. Posuere nunc mus curabitur condimentum lobortis euismod donec tincidunt ridiculus, tristique senectus cum taciti quam blandit leo malesuada, sociis nullam cras litora sem laoreet sed nec.</p>\n<h2 id=\"magna-lacus-tortor-luctus-platea-co\">Magna lacus tortor luctus platea co</h2>\n<ul>\n<li>\n<p>Luctus molestie taciti aliquam dictumst imperdiet, donec torquent nisi.</p>\n</li>\n<li>\n<p>Montes cursus habitant risus platea senectus, lectus sagittis mi.</p>\n</li>\n<li>\n<p>Eleifend facilisi quam ultricies, accumsan aliquet euismod velit, sem tortor.</p>\n</li>\n<li>\n<p>Senectus nisl potenti congue sociosqu at, porttitor habitant vivamus.</p>\n</li>\n</ul>\n<p>Nostra dictum porta consequat quisque diam nisl iaculis velit varius, placerat curabitur risus commodo condimentum morbi eros dictumst phasellus, tempor duis libero ultrices est rhoncus mattis nam. Quisque lectus massa lobortis nulla enim, praesent eu ut elementum. Felis placerat nibh donec erat platea rutrum taciti cursus, elementum metus semper feugiat risus tellus nulla, aliquam hendrerit faucibus inceptos commodo justo porta.</p>\n<p>Cursus imperdiet montes natoque potenti suscipit facilisi porta mollis posuere consequat, aliquam turpis tortor libero viverra rhoncus accumsan inceptos blandit convallis diam, penatibus ut pretium in duis leo auctor proin quisque. Sollicitudin inceptos quam molestie sociis habitasse class sapien vivamus facilisis, consequat ante vehicula velit tempor cum rutrum magnis, eget semper quisque turpis pretium praesent per faucibus. Ullamcorper blandit taciti primis sed pharetra inceptos duis, eu nisi ac fringilla tellus accumsan iaculis, morbi integer at purus hac est. Elementum hac lacus per in posuere erat ad, egestas dapibus malesuada suscipit nunc interdum, mi risus auctor pretium lectus massa. Condimentum nullam molestie tincidunt sodales luctus parturient est et congue hendrerit vel vulputate iaculis, curabitur sollicitudin quisque magna nostra nisl nam massa viverra donec neque class.</p>\n<p>Euismod tempus potenti interdum fusce placerat habitant, taciti turpis faucibus curabitur tempor felis porta, sed aenean mi arcu magnis. Pellentesque tincidunt aptent eget nisi convallis lobortis sapien, habitasse sollicitudin proin vehicula ridiculus duis congue, himenaeos lectus vitae nulla taciti ante. Enim commodo non taciti ultricies donec iaculis aliquet interdum, dictumst a pulvinar lacus cursus fames praesent cras ad, rutrum nostra dis accumsan primis euismod sagittis. Eu habitant euismod mattis at congue fusce ad commodo litora himenaeos aenean, porta lobortis suscipit pulvinar magna facilisi nullam ante non senectus, urna volutpat sodales vitae varius lectus tincidunt montes rutrum vulputate. Enim cum habitant morbi maecenas nisl imperdiet a egestas velit, gravida laoreet hendrerit rutrum molestie fames sapien euismod turpis metus, faucibus class sed primis leo nam malesuada fermentum.</p>\n<p>Semper etiam tellus a risus lobortis dictumst sem massa eros, eget curae gravida accumsan hac parturient nulla fringilla convallis, condimentum torquent placerat mauris conubia augue mattis leo. Dictum tincidunt quis risus volutpat netus mi suscipit parturient suspendisse vestibulum, ad lacus dictumst luctus nec fusce ultricies vivamus. Dui sociis nulla suscipit gravida mi arcu netus, vitae mus donec dapibus nascetur id ante urna, egestas viverra auctor sodales litora enim rutrum, sapien molestie imperdiet ut massa elementum. Aptent ante risus erat malesuada nec porta, ligula nascetur dictum nunc turpis natoque, tristique conubia netus arcu a.</p>\n<p>Nam scelerisque ridiculus suspendisse viverra conubia et fermentum nascetur turpis quisque, vestibulum cubilia curae per feugiat lectus rhoncus suscipit neque. Urna habitasse mus hac fringilla rutrum sodales, nullam aliquam porttitor quis vehicula arcu class, in felis placerat mattis vestibulum habitant, mauris eros dapibus penatibus viverra. Senectus tristique molestie scelerisque quisque mus augue facilisi massa, ac viverra dapibus vehicula nostra vel nam, posuere montes parturient auctor eu ultrices natoque. Quam fringilla volutpat morbi in per aliquet laoreet a maecenas, lacus velit mauris purus ultricies sociosqu pulvinar netus sodales, convallis placerat turpis tellus nullam libero leo aptent. Praesent lacus ultricies per ligula taciti aenean conubia parturient, feugiat sodales viverra urna cubilia etiam nibh curabitur congue, tristique nisl at elementum dis natoque commodo.</p>\n<p>Sagittis erat velit integer cursus congue viverra, conubia himenaeos egestas ultricies praesent, hac litora mattis non venenatis. Duis libero morbi curae potenti litora vitae sed etiam consequat magna ultricies, magnis fermentum vehicula feugiat tortor ad quis orci rhoncus per porta, ante mi gravida dis nostra tempor lobortis aenean convallis molestie. Ligula fusce blandit ac accumsan magnis rutrum nostra velit maecenas, netus lobortis himenaeos purus justo sapien posuere libero, cum etiam urna mi ultrices est sociis tortor. Neque inceptos quisque vestibulum tempor phasellus id himenaeos magna suspendisse a in nunc cursus, morbi dignissim ornare non auctor massa iaculis mus nec elementum ultricies maecenas. Scelerisque maecenas ultrices integer gravida dis cursus, sed at semper libero iaculis varius, justo augue nec tincidunt suspendisse.</p>\n<p>Rutrum augue natoque felis non vestibulum nam duis, quam praesent taciti himenaeos class vel dis rhoncus, dapibus pulvinar etiam ridiculus curae nibh blandit, scelerisque cursus nostra pretium suspendisse vehicula. Etiam sem metus eleifend suscipit felis suspendisse ut, velit fames habitant semper placerat fusce cras, nunc venenatis platea aenean euismod libero. In eu eget pellentesque libero egestas suspendisse quis tristique torquent nulla, magnis dis malesuada purus quam platea aliquet tortor odio. Accumsan nostra augue lobortis elementum justo sociosqu posuere aptent est, nisl metus conubia tellus sollicitudin lacus inceptos. Morbi mauris aenean malesuada arcu fusce libero venenatis commodo iaculis litora dis, erat parturient class sed facilisi mus a nec dictum.</p>\n<p>Senectus platea dapibus volutpat dictum pharetra cursus netus cras, arcu sociis ornare potenti porttitor tempus sollicitudin, ullamcorper duis nam convallis sapien pretium conubia. Mi metus vivamus cum id semper fringilla senectus scelerisque pretium placerat sociis rhoncus pulvinar porttitor accumsan, curae ligula fermentum mus hendrerit ridiculus condimentum per suscipit rutrum sociosqu odio pellentesque suspendisse. Dui massa nulla suscipit duis metus mollis pellentesque, scelerisque posuere interdum ligula cum dignissim sed, placerat ante ultrices mi netus augue. Eu porttitor malesuada diam morbi torquent egestas magnis tempus metus imperdiet nisl, ad sociis lectus neque mauris gravida habitant primis lobortis. Phasellus mattis nulla fames parturient pharetra pretium egestas, diam rhoncus placerat lectus maecenas dictumst sed cum, justo non ac volutpat morbi enim.</p>\n<p>Justo fringilla morbi netus habitasse varius primis eu magna, tristique accumsan mus enim lectus cubilia convallis auctor, nunc imperdiet erat mollis rutrum vel turpis. Justo purus laoreet eros turpis interdum et ridiculus torquent integer nunc, himenaeos eu tellus proin scelerisque tincidunt congue posuere ultricies vestibulum auctor, aliquet semper varius placerat imperdiet non nisl cubilia fermentum. Feugiat nisl himenaeos cum metus mi est ac, euismod elementum velit tempus dictum mauris, bibendum faucibus cubilia phasellus nulla ornare. Etiam justo venenatis varius laoreet sociis montes dignissim, elementum ligula malesuada euismod praesent magnis auctor, eleifend class egestas a vestibulum blandit. Scelerisque potenti facilisis torquent mollis nisi felis et sed, aptent tortor platea non quisque nec accumsan inceptos, velit molestie nunc enim cubilia egestas per.</p>\n<p>Ultrices morbi et potenti eros aenean condimentum magnis est felis porta, dictumst taciti inceptos etiam ultricies cubilia hac torquent tempor vulputate, sodales erat semper vestibulum dignissim sociis viverra suscipit sagittis. Justo non auctor penatibus iaculis sed in volutpat pretium feugiat lectus rutrum, curabitur sociosqu sapien semper a laoreet augue primis fringilla dui. Fringilla iaculis blandit feugiat euismod congue morbi erat eros, mi dis egestas facilisi volutpat risus cras porta, orci vivamus turpis conubia est commodo torquent. Lectus euismod maecenas potenti in ac natoque sed ullamcorper ridiculus, diam fringilla condimentum eget convallis hendrerit varius pellentesque. Feugiat cras nullam tristique leo nisl dignissim lacinia aenean vivamus potenti consequat, vulputate curabitur sed risus mus suspendisse litora sollicitudin tempor.</p>\n<p>Egestas hac arcu dapibus placerat proin aptent a pellentesque posuere, in condimentum fames facilisi maecenas semper nisl mus, sodales donec elementum praesent enim ac dictum ridiculus. Justo in nibh luctus vitae etiam nisl ac quisque fringilla, habitasse sociosqu curae inceptos semper ut mi hac, congue volutpat himenaeos sed augue morbi tellus nec. Congue libero posuere varius eleifend tristique nascetur integer ullamcorper, est leo vitae mi erat enim augue urna magnis, elementum ultricies pulvinar blandit arcu malesuada duis. Cubilia nulla vel et integer sed pellentesque gravida felis pulvinar mollis ultricies mi, montes suspendisse vestibulum aliquet dui in magna nunc ridiculus aliquam elementum. Justo erat montes enim felis eu sed vivamus faucibus imperdiet ac luctus vulputate, cursus accumsan blandit et mus sodales conubia cubilia phasellus leo.</p>\n<p>Velit in felis penatibus semper laoreet libero tristique condimentum sem montes suscipit, morbi habitant gravida tellus quisque neque torquent lobortis interdum. Ridiculus sollicitudin suscipit semper quam eleifend at, neque tincidunt magnis penatibus dui orci, praesent vulputate himenaeos feugiat vel. Habitasse senectus a sodales dapibus nulla auctor sagittis nullam molestie, imperdiet volutpat quam odio facilisis nostra magnis dictumst, sociis cum erat facilisi dignissim urna lacus magna. Primis porttitor nullam quis vestibulum mi dictumst magna dapibus taciti magnis inceptos fames, purus etiam auctor metus bibendum felis accumsan id aliquet suscipit imperdiet. Pellentesque sem velit nulla consequat vehicula cubilia curabitur, platea curae natoque tristique nullam litora, nascetur imperdiet habitant tincidunt suspendisse sociis.</p>\n<p>Platea cum auctor eget consequat elementum lacinia ad aliquet orci, imperdiet nibh penatibus ac dictum rutrum mollis ante cursus, volutpat scelerisque velit ornare in vivamus pharetra blandit. Cum mattis interdum in diam purus sapien lacinia gravida, semper montes vestibulum rhoncus auctor morbi dictum. Mus semper erat mollis taciti sapien ultrices accumsan ante magna eros at commodo, malesuada diam nullam massa curabitur lobortis felis interdum nisi duis pellentesque. Accumsan faucibus tristique augue enim hac ante feugiat, porttitor phasellus condimentum nulla maecenas dignissim at platea, facilisis nam donec primis habitasse ac. Nec convallis ridiculus potenti primis faucibus erat eget metus mollis, luctus ac fusce condimentum orci suscipit volutpat malesuada mi, velit feugiat pharetra sem turpis est accumsan porta, ligula torquent lacus tristique a senectus tortor dignissim.</p>\n<p>Pharetra eleifend vivamus potenti congue proin himenaeos, fusce mi venenatis natoque montes, suscipit commodo porta magnis mattis. Et lobortis mollis libero quis himenaeos felis dis porta, donec iaculis mattis cursus accumsan pulvinar mus etiam, habitasse leo taciti vitae suscipit suspendisse bibendum. Sodales at ante dictumst nostra est risus senectus semper morbi facilisis neque tempus, venenatis penatibus fusce mattis phasellus velit diam iaculis hac tortor class, orci ridiculus varius dis odio cras rutrum porttitor facilisi massa parturient. Augue facilisi nam proin at elementum massa, tellus vestibulum mattis tortor porta, cubilia sodales orci congue vel. Rhoncus nec quam iaculis sapien risus suspendisse dictum tincidunt, vivamus lobortis blandit metus ullamcorper torquent.</p>\n<p>Ante fermentum hac tincidunt nam sodales vestibulum pellentesque ut nulla habitasse, ornare diam facilisis aptent facilisi penatibus arcu congue lacus, lectus fringilla per primis dapibus eu imperdiet erat dictumst. Pulvinar eu ad mauris nulla ac sed nisl ullamcorper natoque etiam fames, platea aliquam dis netus odio dignissim tincidunt quam blandit laoreet, at mollis ridiculus molestie lacus metus nullam suspendisse nibh duis. Suspendisse congue vestibulum fringilla ridiculus tristique sagittis sociosqu integer, volutpat lacinia pulvinar felis aliquam pharetra faucibus dictumst ad, fusce dignissim cursus mauris eget nostra lectus. Lacinia egestas iaculis scelerisque odio gravida ullamcorper, at arcu ligula ornare parturient phasellus laoreet, augue convallis platea tortor aenean.</p>\n<p>Interdum fames lobortis sollicitudin aliquet mus aptent netus, penatibus consequat pulvinar velit enim curae accumsan, maecenas litora mi rutrum sagittis tincidunt. Lacinia malesuada id netus suscipit sapien sociosqu orci habitasse turpis, feugiat donec placerat sed quam hendrerit pellentesque. Erat accumsan ligula id sapien turpis mus nulla lobortis consequat nec, urna habitasse ultrices aliquet vulputate est suspendisse gravida senectus odio, vehicula fusce proin in sed tempor vitae convallis molestie. Nascetur semper feugiat velit hendrerit lacinia nunc, risus quis congue nullam himenaeos commodo porttitor, natoque facilisi ad maecenas faucibus. Dictum id sodales interdum accumsan habitant natoque class parturient mi venenatis aenean, est nam tortor donec lobortis non vehicula magnis lacinia. Feugiat vitae morbi litora vehicula in a, nam ad ultrices auctor sollicitudin, ullamcorper fringilla hendrerit placerat faucibus.</p>\n<p>Nulla nisi ac placerat duis semper mus cursus interdum netus vestibulum, tortor praesent proin nec rhoncus magnis commodo blandit himenaeos purus, volutpat id montes scelerisque suspendisse risus nisl erat dui. Senectus et habitant dis nulla velit faucibus venenatis sapien, dapibus etiam metus eget magnis feugiat tristique. Augue montes elementum pulvinar mollis pellentesque diam cursus tristique vel cubilia erat mus, congue curae sagittis dui quis fusce tortor consequat taciti natoque. Praesent montes erat feugiat sed euismod condimentum potenti malesuada nec, mi vitae suspendisse aptent senectus eleifend faucibus pulvinar scelerisque, augue ornare accumsan pretium magna eu iaculis metus. Suscipit accumsan massa vitae platea ad duis rhoncus fermentum vulputate, interdum pretium metus per aptent enim in facilisis eros, sollicitudin consequat iaculis erat dictumst quisque leo sociis.</p>\n<p>Tempor etiam potenti auctor est ut habitant ac nisl ultrices pulvinar, sem primis tempus lacus aliquam consequat fringilla tristique. Consequat cum rhoncus massa sociis blandit rutrum nisi quam cras vitae fusce, sociosqu erat penatibus convallis fames accumsan eros himenaeos pulvinar sagittis, habitasse primis integer odio nascetur in montes faucibus semper potenti. Diam aliquam fringilla risus phasellus habitasse aenean eu erat, netus nulla pellentesque ut morbi torquent pharetra semper, sed etiam primis in conubia hendrerit velit. Ornare magna dictum purus metus sociosqu pulvinar sed, quam faucibus posuere pretium senectus interdum. Ornare sodales in litora nascetur sociosqu senectus auctor, cras arcu fusce ac inceptos integer tempor aliquam, tristique imperdiet metus hendrerit erat eleifend.</p>";

				const frontmatter = {"readingTime":12,"publishDate":"Aug 09 2022","title":"Useful tools and resources to create a professional website","description":"Nibh senectus lacinia volutpat nostra taciti ac posuere, dictum ultricies dictumst luctus in vehicula, mus molestie venenatis penatibus ridiculus elementum. Phasellus sollicitudin dignissim parturient.","image":"~/assets/images/tools.jpg","tags":["front-end","tools","resources"]};
				const file = "/home/dww510/betahero/site/data/blog/useful-resources-to-create-websites.md";
				const url = undefined;
				function rawContent() {
					return "\n## Magna nunc senectus torquent per fusce sapien ligula tempus cra\n\nLorem ipsum dolor sit amet consectetur adipiscing, elit fusce imperdiet gravida velit massa, ligula aenean suscipit sociis lacinia. Sapien scelerisque rutrum sem accumsan orci imperdiet aliquam inceptos aliquet tempus ornare, netus nostra nam nunc platea pulvinar urna et suscipit pellentesque, aenean congue sociis non tellus quis proin etiam venenatis pretium. Nibh senectus lacinia volutpat nostra taciti ac posuere, dictum ultricies dictumst luctus in vehicula, mus molestie venenatis penatibus ridiculus elementum. Phasellus sollicitudin dignissim parturient tempor cubilia erat massa eleifend dapibus, condimentum cras tortor eu sem dictumst non. Faucibus neque est malesuada nostra luctus maecenas at condimentum, arcu eros vulputate curabitur blandit mollis volutpat, lectus leo dictumst duis semper tempor hendrerit. Egestas scelerisque fusce torquent cubilia consequat conubia lacus et mollis, condimentum taciti elementum sapien risus vulputate est. \n\nTristique eleifend enim praesent mollis sem leo, molestie dictum penatibus sodales consequat ligula nulla, platea feugiat aptent sapien turpis. Mollis mus ac taciti maecenas pretium hendrerit proin accumsan, mattis dictumst netus nunc facilisi morbi cursus euismod quis, a commodo nulla integer varius enim vehicula. Consequat mi risus vulputate ullamcorper sociosqu pretium molestie cursus, parturient viverra non tempor tellus convallis vitae eleifend mus, bibendum pellentesque imperdiet vivamus nunc phasellus iaculis. Volutpat est ac dictumst eleifend maecenas torquent quam hac, mollis aliquam mattis euismod ornare risus fringilla proin nisi, sem fermentum primis ultrices varius etiam id. Posuere nunc mus curabitur condimentum lobortis euismod donec tincidunt ridiculus, tristique senectus cum taciti quam blandit leo malesuada, sociis nullam cras litora sem laoreet sed nec. \n\n## Magna lacus tortor luctus platea co\n\n- Luctus molestie taciti aliquam dictumst imperdiet, donec torquent nisi.\n\n- Montes cursus habitant risus platea senectus, lectus sagittis mi.\n\n- Eleifend facilisi quam ultricies, accumsan aliquet euismod velit, sem tortor.\n\n- Senectus nisl potenti congue sociosqu at, porttitor habitant vivamus.\n\nNostra dictum porta consequat quisque diam nisl iaculis velit varius, placerat curabitur risus commodo condimentum morbi eros dictumst phasellus, tempor duis libero ultrices est rhoncus mattis nam. Quisque lectus massa lobortis nulla enim, praesent eu ut elementum. Felis placerat nibh donec erat platea rutrum taciti cursus, elementum metus semper feugiat risus tellus nulla, aliquam hendrerit faucibus inceptos commodo justo porta. \n\nCursus imperdiet montes natoque potenti suscipit facilisi porta mollis posuere consequat, aliquam turpis tortor libero viverra rhoncus accumsan inceptos blandit convallis diam, penatibus ut pretium in duis leo auctor proin quisque. Sollicitudin inceptos quam molestie sociis habitasse class sapien vivamus facilisis, consequat ante vehicula velit tempor cum rutrum magnis, eget semper quisque turpis pretium praesent per faucibus. Ullamcorper blandit taciti primis sed pharetra inceptos duis, eu nisi ac fringilla tellus accumsan iaculis, morbi integer at purus hac est. Elementum hac lacus per in posuere erat ad, egestas dapibus malesuada suscipit nunc interdum, mi risus auctor pretium lectus massa. Condimentum nullam molestie tincidunt sodales luctus parturient est et congue hendrerit vel vulputate iaculis, curabitur sollicitudin quisque magna nostra nisl nam massa viverra donec neque class. \n\nEuismod tempus potenti interdum fusce placerat habitant, taciti turpis faucibus curabitur tempor felis porta, sed aenean mi arcu magnis. Pellentesque tincidunt aptent eget nisi convallis lobortis sapien, habitasse sollicitudin proin vehicula ridiculus duis congue, himenaeos lectus vitae nulla taciti ante. Enim commodo non taciti ultricies donec iaculis aliquet interdum, dictumst a pulvinar lacus cursus fames praesent cras ad, rutrum nostra dis accumsan primis euismod sagittis. Eu habitant euismod mattis at congue fusce ad commodo litora himenaeos aenean, porta lobortis suscipit pulvinar magna facilisi nullam ante non senectus, urna volutpat sodales vitae varius lectus tincidunt montes rutrum vulputate. Enim cum habitant morbi maecenas nisl imperdiet a egestas velit, gravida laoreet hendrerit rutrum molestie fames sapien euismod turpis metus, faucibus class sed primis leo nam malesuada fermentum. \n\nSemper etiam tellus a risus lobortis dictumst sem massa eros, eget curae gravida accumsan hac parturient nulla fringilla convallis, condimentum torquent placerat mauris conubia augue mattis leo. Dictum tincidunt quis risus volutpat netus mi suscipit parturient suspendisse vestibulum, ad lacus dictumst luctus nec fusce ultricies vivamus. Dui sociis nulla suscipit gravida mi arcu netus, vitae mus donec dapibus nascetur id ante urna, egestas viverra auctor sodales litora enim rutrum, sapien molestie imperdiet ut massa elementum. Aptent ante risus erat malesuada nec porta, ligula nascetur dictum nunc turpis natoque, tristique conubia netus arcu a. \n\nNam scelerisque ridiculus suspendisse viverra conubia et fermentum nascetur turpis quisque, vestibulum cubilia curae per feugiat lectus rhoncus suscipit neque. Urna habitasse mus hac fringilla rutrum sodales, nullam aliquam porttitor quis vehicula arcu class, in felis placerat mattis vestibulum habitant, mauris eros dapibus penatibus viverra. Senectus tristique molestie scelerisque quisque mus augue facilisi massa, ac viverra dapibus vehicula nostra vel nam, posuere montes parturient auctor eu ultrices natoque. Quam fringilla volutpat morbi in per aliquet laoreet a maecenas, lacus velit mauris purus ultricies sociosqu pulvinar netus sodales, convallis placerat turpis tellus nullam libero leo aptent. Praesent lacus ultricies per ligula taciti aenean conubia parturient, feugiat sodales viverra urna cubilia etiam nibh curabitur congue, tristique nisl at elementum dis natoque commodo. \n\nSagittis erat velit integer cursus congue viverra, conubia himenaeos egestas ultricies praesent, hac litora mattis non venenatis. Duis libero morbi curae potenti litora vitae sed etiam consequat magna ultricies, magnis fermentum vehicula feugiat tortor ad quis orci rhoncus per porta, ante mi gravida dis nostra tempor lobortis aenean convallis molestie. Ligula fusce blandit ac accumsan magnis rutrum nostra velit maecenas, netus lobortis himenaeos purus justo sapien posuere libero, cum etiam urna mi ultrices est sociis tortor. Neque inceptos quisque vestibulum tempor phasellus id himenaeos magna suspendisse a in nunc cursus, morbi dignissim ornare non auctor massa iaculis mus nec elementum ultricies maecenas. Scelerisque maecenas ultrices integer gravida dis cursus, sed at semper libero iaculis varius, justo augue nec tincidunt suspendisse. \n\nRutrum augue natoque felis non vestibulum nam duis, quam praesent taciti himenaeos class vel dis rhoncus, dapibus pulvinar etiam ridiculus curae nibh blandit, scelerisque cursus nostra pretium suspendisse vehicula. Etiam sem metus eleifend suscipit felis suspendisse ut, velit fames habitant semper placerat fusce cras, nunc venenatis platea aenean euismod libero. In eu eget pellentesque libero egestas suspendisse quis tristique torquent nulla, magnis dis malesuada purus quam platea aliquet tortor odio. Accumsan nostra augue lobortis elementum justo sociosqu posuere aptent est, nisl metus conubia tellus sollicitudin lacus inceptos. Morbi mauris aenean malesuada arcu fusce libero venenatis commodo iaculis litora dis, erat parturient class sed facilisi mus a nec dictum. \n\nSenectus platea dapibus volutpat dictum pharetra cursus netus cras, arcu sociis ornare potenti porttitor tempus sollicitudin, ullamcorper duis nam convallis sapien pretium conubia. Mi metus vivamus cum id semper fringilla senectus scelerisque pretium placerat sociis rhoncus pulvinar porttitor accumsan, curae ligula fermentum mus hendrerit ridiculus condimentum per suscipit rutrum sociosqu odio pellentesque suspendisse. Dui massa nulla suscipit duis metus mollis pellentesque, scelerisque posuere interdum ligula cum dignissim sed, placerat ante ultrices mi netus augue. Eu porttitor malesuada diam morbi torquent egestas magnis tempus metus imperdiet nisl, ad sociis lectus neque mauris gravida habitant primis lobortis. Phasellus mattis nulla fames parturient pharetra pretium egestas, diam rhoncus placerat lectus maecenas dictumst sed cum, justo non ac volutpat morbi enim. \n\nJusto fringilla morbi netus habitasse varius primis eu magna, tristique accumsan mus enim lectus cubilia convallis auctor, nunc imperdiet erat mollis rutrum vel turpis. Justo purus laoreet eros turpis interdum et ridiculus torquent integer nunc, himenaeos eu tellus proin scelerisque tincidunt congue posuere ultricies vestibulum auctor, aliquet semper varius placerat imperdiet non nisl cubilia fermentum. Feugiat nisl himenaeos cum metus mi est ac, euismod elementum velit tempus dictum mauris, bibendum faucibus cubilia phasellus nulla ornare. Etiam justo venenatis varius laoreet sociis montes dignissim, elementum ligula malesuada euismod praesent magnis auctor, eleifend class egestas a vestibulum blandit. Scelerisque potenti facilisis torquent mollis nisi felis et sed, aptent tortor platea non quisque nec accumsan inceptos, velit molestie nunc enim cubilia egestas per. \n\nUltrices morbi et potenti eros aenean condimentum magnis est felis porta, dictumst taciti inceptos etiam ultricies cubilia hac torquent tempor vulputate, sodales erat semper vestibulum dignissim sociis viverra suscipit sagittis. Justo non auctor penatibus iaculis sed in volutpat pretium feugiat lectus rutrum, curabitur sociosqu sapien semper a laoreet augue primis fringilla dui. Fringilla iaculis blandit feugiat euismod congue morbi erat eros, mi dis egestas facilisi volutpat risus cras porta, orci vivamus turpis conubia est commodo torquent. Lectus euismod maecenas potenti in ac natoque sed ullamcorper ridiculus, diam fringilla condimentum eget convallis hendrerit varius pellentesque. Feugiat cras nullam tristique leo nisl dignissim lacinia aenean vivamus potenti consequat, vulputate curabitur sed risus mus suspendisse litora sollicitudin tempor. \n\nEgestas hac arcu dapibus placerat proin aptent a pellentesque posuere, in condimentum fames facilisi maecenas semper nisl mus, sodales donec elementum praesent enim ac dictum ridiculus. Justo in nibh luctus vitae etiam nisl ac quisque fringilla, habitasse sociosqu curae inceptos semper ut mi hac, congue volutpat himenaeos sed augue morbi tellus nec. Congue libero posuere varius eleifend tristique nascetur integer ullamcorper, est leo vitae mi erat enim augue urna magnis, elementum ultricies pulvinar blandit arcu malesuada duis. Cubilia nulla vel et integer sed pellentesque gravida felis pulvinar mollis ultricies mi, montes suspendisse vestibulum aliquet dui in magna nunc ridiculus aliquam elementum. Justo erat montes enim felis eu sed vivamus faucibus imperdiet ac luctus vulputate, cursus accumsan blandit et mus sodales conubia cubilia phasellus leo. \n\nVelit in felis penatibus semper laoreet libero tristique condimentum sem montes suscipit, morbi habitant gravida tellus quisque neque torquent lobortis interdum. Ridiculus sollicitudin suscipit semper quam eleifend at, neque tincidunt magnis penatibus dui orci, praesent vulputate himenaeos feugiat vel. Habitasse senectus a sodales dapibus nulla auctor sagittis nullam molestie, imperdiet volutpat quam odio facilisis nostra magnis dictumst, sociis cum erat facilisi dignissim urna lacus magna. Primis porttitor nullam quis vestibulum mi dictumst magna dapibus taciti magnis inceptos fames, purus etiam auctor metus bibendum felis accumsan id aliquet suscipit imperdiet. Pellentesque sem velit nulla consequat vehicula cubilia curabitur, platea curae natoque tristique nullam litora, nascetur imperdiet habitant tincidunt suspendisse sociis. \n\nPlatea cum auctor eget consequat elementum lacinia ad aliquet orci, imperdiet nibh penatibus ac dictum rutrum mollis ante cursus, volutpat scelerisque velit ornare in vivamus pharetra blandit. Cum mattis interdum in diam purus sapien lacinia gravida, semper montes vestibulum rhoncus auctor morbi dictum. Mus semper erat mollis taciti sapien ultrices accumsan ante magna eros at commodo, malesuada diam nullam massa curabitur lobortis felis interdum nisi duis pellentesque. Accumsan faucibus tristique augue enim hac ante feugiat, porttitor phasellus condimentum nulla maecenas dignissim at platea, facilisis nam donec primis habitasse ac. Nec convallis ridiculus potenti primis faucibus erat eget metus mollis, luctus ac fusce condimentum orci suscipit volutpat malesuada mi, velit feugiat pharetra sem turpis est accumsan porta, ligula torquent lacus tristique a senectus tortor dignissim. \n\nPharetra eleifend vivamus potenti congue proin himenaeos, fusce mi venenatis natoque montes, suscipit commodo porta magnis mattis. Et lobortis mollis libero quis himenaeos felis dis porta, donec iaculis mattis cursus accumsan pulvinar mus etiam, habitasse leo taciti vitae suscipit suspendisse bibendum. Sodales at ante dictumst nostra est risus senectus semper morbi facilisis neque tempus, venenatis penatibus fusce mattis phasellus velit diam iaculis hac tortor class, orci ridiculus varius dis odio cras rutrum porttitor facilisi massa parturient. Augue facilisi nam proin at elementum massa, tellus vestibulum mattis tortor porta, cubilia sodales orci congue vel. Rhoncus nec quam iaculis sapien risus suspendisse dictum tincidunt, vivamus lobortis blandit metus ullamcorper torquent. \n\nAnte fermentum hac tincidunt nam sodales vestibulum pellentesque ut nulla habitasse, ornare diam facilisis aptent facilisi penatibus arcu congue lacus, lectus fringilla per primis dapibus eu imperdiet erat dictumst. Pulvinar eu ad mauris nulla ac sed nisl ullamcorper natoque etiam fames, platea aliquam dis netus odio dignissim tincidunt quam blandit laoreet, at mollis ridiculus molestie lacus metus nullam suspendisse nibh duis. Suspendisse congue vestibulum fringilla ridiculus tristique sagittis sociosqu integer, volutpat lacinia pulvinar felis aliquam pharetra faucibus dictumst ad, fusce dignissim cursus mauris eget nostra lectus. Lacinia egestas iaculis scelerisque odio gravida ullamcorper, at arcu ligula ornare parturient phasellus laoreet, augue convallis platea tortor aenean. \n\nInterdum fames lobortis sollicitudin aliquet mus aptent netus, penatibus consequat pulvinar velit enim curae accumsan, maecenas litora mi rutrum sagittis tincidunt. Lacinia malesuada id netus suscipit sapien sociosqu orci habitasse turpis, feugiat donec placerat sed quam hendrerit pellentesque. Erat accumsan ligula id sapien turpis mus nulla lobortis consequat nec, urna habitasse ultrices aliquet vulputate est suspendisse gravida senectus odio, vehicula fusce proin in sed tempor vitae convallis molestie. Nascetur semper feugiat velit hendrerit lacinia nunc, risus quis congue nullam himenaeos commodo porttitor, natoque facilisi ad maecenas faucibus. Dictum id sodales interdum accumsan habitant natoque class parturient mi venenatis aenean, est nam tortor donec lobortis non vehicula magnis lacinia. Feugiat vitae morbi litora vehicula in a, nam ad ultrices auctor sollicitudin, ullamcorper fringilla hendrerit placerat faucibus. \n\nNulla nisi ac placerat duis semper mus cursus interdum netus vestibulum, tortor praesent proin nec rhoncus magnis commodo blandit himenaeos purus, volutpat id montes scelerisque suspendisse risus nisl erat dui. Senectus et habitant dis nulla velit faucibus venenatis sapien, dapibus etiam metus eget magnis feugiat tristique. Augue montes elementum pulvinar mollis pellentesque diam cursus tristique vel cubilia erat mus, congue curae sagittis dui quis fusce tortor consequat taciti natoque. Praesent montes erat feugiat sed euismod condimentum potenti malesuada nec, mi vitae suspendisse aptent senectus eleifend faucibus pulvinar scelerisque, augue ornare accumsan pretium magna eu iaculis metus. Suscipit accumsan massa vitae platea ad duis rhoncus fermentum vulputate, interdum pretium metus per aptent enim in facilisis eros, sollicitudin consequat iaculis erat dictumst quisque leo sociis. \n\nTempor etiam potenti auctor est ut habitant ac nisl ultrices pulvinar, sem primis tempus lacus aliquam consequat fringilla tristique. Consequat cum rhoncus massa sociis blandit rutrum nisi quam cras vitae fusce, sociosqu erat penatibus convallis fames accumsan eros himenaeos pulvinar sagittis, habitasse primis integer odio nascetur in montes faucibus semper potenti. Diam aliquam fringilla risus phasellus habitasse aenean eu erat, netus nulla pellentesque ut morbi torquent pharetra semper, sed etiam primis in conubia hendrerit velit. Ornare magna dictum purus metus sociosqu pulvinar sed, quam faucibus posuere pretium senectus interdum. Ornare sodales in litora nascetur sociosqu senectus auctor, cras arcu fusce ac inceptos integer tempor aliquam, tristique imperdiet metus hendrerit erat eleifend.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"magna-nunc-senectus-torquent-per-fusce-sapien-ligula-tempus-cra","text":"Magna nunc senectus torquent per fusce sapien ligula tempus cra"},{"depth":2,"slug":"magna-lacus-tortor-luctus-platea-co","text":"Magna lacus tortor luctus platea co"}];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter,
  file,
  url,
  rawContent,
  compiledContent,
  getHeadings,
  getHeaders,
  Content,
  default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const getNormalizedPost = async (post) => {
	const { frontmatter, Content, file } = post;
	const ID = file.split('/').pop().split('.').shift();

	return {
		id: ID,

		publishDate: frontmatter.publishDate,
		draft: frontmatter.draft,

		canonical: frontmatter.canonical,
		slug: frontmatter.slug || ID,

		title: frontmatter.title,
		description: frontmatter.description,
		image: frontmatter.image,

		Content: Content,
		// or 'body' in case you consume from API

		excerpt: frontmatter.excerpt,
		authors: frontmatter.authors,
		category: frontmatter.category,
		tags: frontmatter.tags,
		readingTime: frontmatter.readingTime,
	};
};

const load$1 = async function () {
	const posts = /* #__PURE__ */ Object.assign({"/data/blog/astrowind-template-in-depth.md": __vite_glob_0_0,"/data/blog/get-started-website-with-astro-tailwind-css.md": __vite_glob_0_1,"/data/blog/how-to-customize-astrowind-to-your-brand.md": __vite_glob_0_2,"/data/blog/markdown-elements-demo-post.mdx": __vite_glob_0_3,"/data/blog/useful-resources-to-create-websites.md": __vite_glob_0_4});

	const normalizedPosts = Object.keys(posts).map(async (key) => {
		const post = await posts[key];
		return await getNormalizedPost(post);
	});

	const results = (await Promise.all(normalizedPosts))
		.sort((a, b) => new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf())
		.filter((post) => !post.draft);
	return results;
};

let _posts;

/** */
const fetchPosts = async () => {
	_posts = _posts || load$1();

	return await _posts;
};

/** */
const findPostsByIds = async (ids) => {
	if (!Array.isArray(ids)) return [];

	const posts = await fetchPosts();

	return ids.reduce(function (r, id) {
		posts.some(function (post) {
			return id === post.id && r.push(post);
		});
		return r;
	}, []);
};

const load = async function () {
	let images = [];
	try {
		images = /* #__PURE__ */ Object.assign({"/src/assets/images/astronaut.jpg": () => import('./chunks/astronaut.d5297d53.mjs'),"/src/assets/images/colors.jpg": () => import('./chunks/colors.deb36d42.mjs'),"/src/assets/images/default.png": () => Promise.resolve().then(() => _default),"/src/assets/images/hero.jpg": () => import('./chunks/hero.d39d7ce7.mjs'),"/src/assets/images/steps.jpg": () => import('./chunks/steps.fbf7e947.mjs'),"/src/assets/images/tools.jpg": () => import('./chunks/tools.b0facf34.mjs')});
	} catch (e) {
		// continue regardless of error
	}
	return images;
};

let _images;

/** */
const fetchLocalImages = async () => {
	_images = _images || load();
	return await _images;
};

/** */
const findImage = async (imagePath) => {
	if (typeof imagePath !== 'string') {
		return null;
	}

	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}

	if (!imagePath.startsWith('~/assets')) {
		return null;
	} // For now only consume images using ~/assets alias (or absolute)

	const images = await fetchLocalImages();
	const key = imagePath.replace('~/', '/src/');

	return typeof images[key] === 'function' ? (await images[key]())['default'] : null;
};

const $$Astro$g = createAstro("/home/dww510/betahero/site/src/components/blog/HighlightedPosts.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$HighlightedPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$HighlightedPosts;
  const ids = [
    "get-started-website-with-astro-tailwind-css",
    "how-to-customize-astrowind-to-your-brand",
    "useful-resources-to-create-websites",
    "astrowind-template-in-depth"
  ];
  const items = await Promise.all(
    (await findPostsByIds(ids)).map(async (item) => ({ ...item, image: await findImage(item.image) }))
  );
  return renderTemplate`${maybeRenderHead($$result)}<section class="px-4 py-16 mx-auto max-w-6xl lg:py-20">
	<div class="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
		<h2 class="max-w-lg mb-2 text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none lg:mb-5 group font-heading">
			<span class="inline-block mb-1 sm:mb-4">Find out more content<br class="hidden md:block"> in our Blog</span>
		</h2>

		<p class="text-gray-700 dark:text-slate-400 lg:text-sm lg:max-w-md">
			The blog will be used to display AstroWind documentation. Each new article will be an important step that you will
			need to know to be an expert in creating a website using Astro + Tailwind CSS The blog does not exist yet, but
			very soon. Astro is a very interesting technology. Thanks.
		</p>
	</div>

	<div class="grid gap-6 row-gap-5 md:grid-cols-2 lg:grid-cols-4 -mb-6">
		${items.map((post) => renderTemplate`<article class="mb-6 transition">
					${renderComponent($$result, "Picture", $$Picture, { "src": post.image, "class": "object-cover w-full h-64 mb-6 rounded shadow-lg bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.title, "aspectRatio": "16:9" })}
					<h3 class="mb-2 text-xl font-bold leading-snug sm:text-2xl font-heading">
						<a${addAttribute(getPermalink(post.slug, "post"), "href")} class="hover:text-primary-600 underline underline-offset-4 decoration-1 decoration-dotted transition ease-in duration-200">
							${post.title}
						</a>
					</h3>
					<p class="text-gray-700 dark:text-gray-400">${post.excerpt || post.description}</p>
				</article>`)}
	</div>
</section>`;
});

const $$Astro$f = createAstro("/home/dww510/betahero/site/src/components/widgets/FAQs.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$FAQs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$FAQs;
  const items = [
    [
      {
        question: "What do I need to start?",
        answer: `Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds.

    Many say exploration is part of our destiny, but it\u2019s actually our duty to future generations.`
      },
      {
        question: "How to install the Astro + Tailwind CSS template?",
        answer: `Well, the way they make shows is, they make one show. That show's called a pilot.

    Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.`
      },
      {
        question: "What's something that you completely don't understand?",
        answer: `A flower in my garden, a mystery in my panties. Heart attack never stopped old Big Bear. I didn't even know we were calling him Big Bear.`
      }
    ],
    [
      {
        question: "What's an example of when you changed your mind?",
        answer: `Michael Knight a young loner on a crusade to champion the cause of the innocent. The helpless. The powerless in a world of criminals who operate above the law. Here he comes Here comes Speed Racer. He's a demon on wheels.`
      },
      {
        question: "What is something that you would really like to try again?",
        answer: `A business big enough that it could be listed on the NASDAQ goes belly up. Disappears!

      It ceases to exist without me. No, you clearly don't know who you're talking to, so let me clue you in.`
      },
      {
        question: "If you could only ask one question to each person you meet, what would that question be?",
        answer: `This is not about revenge. This is about justice. A lot of things can change in twelve years, Admiral. Well, that's certainly good to know. About four years. I got tired of hearing how young I looked.`
      }
    ]
  ];
  return renderTemplate`${maybeRenderHead($$result)}<div class="px-4 py-16 mx-auto max-w-6xl lg:py-20">
	<div class="max-w-xl sm:mx-auto lg:max-w-2xl">
		<div class="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
			<h2 class="max-w-lg mb-4 text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto font-heading">
				Frequently Asked Questions
			</h2>
		</div>
	</div>
	<div class="max-w-screen-xl sm:mx-auto">
		<div class="grid grid-cols-1 gap-x-8 gap-y-8 lg:gap-x-16 md:grid-cols-2">
			${items.map((subitems) => renderTemplate`<div class="space-y-8">
						${subitems.map(({ question, answer }) => renderTemplate`<div>
								<p class="mb-4 text-xl font-bold">
									${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-down-right", "class": "w-7 h-7 text-primary-500 inline-block icon-bold" })}
									${question}
								</p>
								${answer.split("\n\n").map((paragraph) => renderTemplate`<p class="text-gray-700 dark:text-gray-400 mb-2">${unescapeHTML(paragraph)}</p>`)}
							</div>`)}
					</div>`)}
		</div>
	</div>
</div>`;
});

const $$Astro$e = createAstro("/home/dww510/betahero/site/src/components/widgets/Stats.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Stats;
  return renderTemplate`${maybeRenderHead($$result)}<div class="px-4 py-8 md:py-16 sm:px-6 mx-auto md:px-24 lg:px-8 lg:py-20 max-w-6xl">
	<div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
		<div class="text-center md:border-r dark:md:border-slate-500 mb-10 md:mb-0">
			<div class="text-4xl font-bold lg:text-5xl xl:text-6xl text-primary-500 font-heading">132K</div>
			<p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">
				Downloads
			</p>
		</div>
		<div class="text-center md:border-r dark:md:border-slate-500 mb-10 md:mb-0">
			<div class="text-4xl font-bold lg:text-5xl xl:text-6xl text-primary-500 font-heading">24.8K</div>
			<p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">Stars</p>
		</div>
		<div class="text-center md:border-r dark:md:border-slate-500 font-heading">
			<div class="text-4xl font-bold lg:text-5xl xl:text-6xl text-primary-500">10.3K</div>
			<p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">Forks</p>
		</div>
		<div class="text-center">
			<div class="text-4xl font-bold lg:text-5xl xl:text-6xl text-primary-500 font-heading">48.4K</div>
			<p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">Users</p>
		</div>
	</div>
</div>`;
});

const $$Astro$d = createAstro("/home/dww510/betahero/site/src/components/widgets/CallToAction.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$CallToAction = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$CallToAction;
  return renderTemplate`${maybeRenderHead($$result)}<section class="relative">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<div class="py-12 md:py-20">
			<div class="max-w-3xl mx-auto text-center p-6 rounded-md shadow-xl dark:shadow-none">
				<h2 class="text-4xl md:text-4xl font-bold leading-tighter tracking-tighter mb-4 font-heading">
					<span>Heroes</span> of <br class="block sm:hidden"><span class="sm:whitespace-nowrap">Tomorrow</span>
				</h2>
				<p class="text-xl text-gray-600 dark:text-slate-400">
					Help us build the heroes of tomorrow by sponsoring our program. We love to teach youths, but can't 
					even begin to help others without your help!
				</p>

				<div class="mt-6">
					<a class="btn text-white bg-primary-600 hover:bg-primary-800 mb-4 sm:mb-0" href="https://github.com/sponsors/betahero-org" target="_blank" rel="noopener">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:heart", "class": "w-5 h-5 mr-1 -ml-1.5" })} Become a Sponsor
					</a>
				</div>
			</div>
		</div>
	</div>
</section>`;
});

const $$Astro$c = createAstro("/home/dww510/betahero/site/src/pages/index.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Index;
  const meta = {
    title: SITE.title,
    description: SITE.description,
    canonical: getCanonical(getHomePermalink())
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "Features", $$Features, {})}${renderComponent($$result, "Steps", $$Steps, {})}${renderComponent($$result, "Features2", $$Features2, {})}${renderComponent($$result, "Features3", $$Features3, {})}${renderComponent($$result, "HighlightedPosts", $$HighlightedPosts, {})}${renderComponent($$result, "FAQs", $$FAQs, {})}${renderComponent($$result, "Stats", $$Stats, {})}${renderComponent($$result, "CallToAction", $$CallToAction, {})}` })}`;
});

const $$file$5 = "/home/dww510/betahero/site/src/pages/index.astro";
const $$url$5 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const get = async () => {

	const posts = await fetchPosts();

	return rss({
		title: `${SITE.name}’s Blog`,
		description: SITE.description,
		site: 'https://betahero.org/',

		items: posts.map((post) => ({
			link: getPermalink(post.slug, 'post'),
			title: post.title,
			description: post.description,
			publishDate: post.publishDate,
		})),
	});
};

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$b = createAstro("/home/dww510/betahero/site/src/components/widgets/Error404.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Error404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Error404;
  return renderTemplate`${maybeRenderHead($$result)}<section class="flex items-center h-full p-16">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="max-w-md text-center">
			<h2 class="mb-8 font-bold text-9xl">
				<span class="sr-only">Error</span>
				<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">404</span>
			</h2>
			<p class="text-3xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
			<p class="mt-4 mb-8 text-lg text-gray-600 dark:text-slate-400">
				But dont worry, you can find plenty of other things on our homepage.
			</p>
			<a rel="noopener noreferrer"${addAttribute(getHomePermalink(), "href")} class="btn text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-800 ml-4">Back to homepage</a>
		</div>
	</div>
</section>`;
});

const $$Astro$a = createAstro("/home/dww510/betahero/site/src/pages/404.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$404;
  const title = `Error 404 \u2014 ${SITE.name}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "meta": { title } }, { "default": () => renderTemplate`${renderComponent($$result, "Error404", $$Error404, {})}` })}`;
});

const $$file$4 = "/home/dww510/betahero/site/src/pages/404.astro";
const $$url$4 = "/404";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$9 = createAstro("/home/dww510/betahero/site/src/layouts/BlogLayout.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { meta } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<section class="px-6 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-3xl">
		<header>
			<h1 class="text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8 md:mb-16 font-heading">
				${renderSlot($$result, $$slots["title"])}
			</h1>
		</header>
		${renderSlot($$result, $$slots["default"])}
	</section>` })}`;
});

const $$Astro$8 = createAstro("/home/dww510/betahero/site/src/components/atoms/Tags.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Tags;
  const { tags, class: className = "text-sm" } = Astro2.props;
  return renderTemplate`${tags && Array.isArray(tags) && renderTemplate`${maybeRenderHead($$result)}<ul${addAttribute(className, "class")}>
			${tags.map((tag) => renderTemplate`<li class="bg-gray-100 dark:bg-slate-700 inline-block mr-2 mb-2 py-0.5 px-2">
					<a${addAttribute(getPermalink(tag, "tag"), "href")}>${tag}</a>
				</li>`)}
		</ul>`}`;
});

/** */
const getFormattedDate = (date) =>
	date
		? new Date(date).toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
		  })
		: '';

const $$Astro$7 = createAstro("/home/dww510/betahero/site/src/components/blog/ListItem.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$ListItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ListItem;
  const { post } = Astro2.props;
  const image = await findImage(post.image);
  return renderTemplate`${maybeRenderHead($$result)}<article class="max-w-md mx-auto md:max-w-none grid md:grid-cols-2 gap-6 md:gap-8">
	<a class="relative block group"${addAttribute(getPermalink(post.slug, "post"), "href")}>
		<div class="relative h-0 pb-[56.25%] md:pb-[75%] md:h-80 lg:pb-[56.25%] overflow-hidden bg-gray-400 dark:bg-slate-700 rounded shadow-lg">
			${renderComponent($$result, "Picture", $$Picture, { "src": image, "class": "absolute inset-0 object-cover w-full h-full mb-6 rounded shadow-lg bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.title, "aspectRatio": "16:9" })}
		</div>
	</a>
	<div>
		<header>
			<h2 class="text-xl sm:text-2xl font-bold leading-snug mb-2 font-heading">
				<a class="hover:text-primary-600 underline underline-offset-4 decoration-1 decoration-dotted transition ease-in duration-200"${addAttribute(getPermalink(post.slug, "post"), "href")}>
					${post.title}
				</a>
			</h2>
		</header>
		<p class="text-md sm:text-lg flex-grow">
			${post.excerpt || post.description}
		</p>
		<footer class="mt-4">
			<div>
				<span class="text-gray-500 dark:text-slate-400">
					<time${addAttribute(post.publishDate, "datetime")}>${getFormattedDate(post.publishDate)}</time> ~
					${Math.ceil(post.readingTime)} min read
				</span>
			</div>
			<div class="mt-4">
				${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
			</div>
		</footer>
	</div>
</article>`;
});

const $$Astro$6 = createAstro("/home/dww510/betahero/site/src/components/blog/List.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$List = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$List;
  const { posts } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<ul>
	${posts.map((post) => renderTemplate`<li class="mb-10 md:mb-16">
				${renderComponent($$result, "Item", $$ListItem, { "post": post })}
			</li>`)}
</ul>`;
});

const $$Astro$5 = createAstro("/home/dww510/betahero/site/src/components/atoms/Pagination.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { prevUrl, nextUrl, prevText = "Newer posts", nextText = "Older posts" } = Astro2.props;
  return renderTemplate`${(prevUrl || nextUrl) && renderTemplate`${maybeRenderHead($$result)}<div class="container flex">
			<div class="flex flex-row mx-auto container justify-between">
				<a${addAttribute(prevUrl, "href")}${addAttribute(`btn px-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white shadow-none mr-2
      ${!prevUrl ? "invisible" : ""}`, "class")}>
					<div class="flex flex-row align-middle">
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-left", "class": "w-6 h-6" })}
						<p class="ml-2">${prevText}</p>
					</div>
				</a>
				<a${addAttribute(nextUrl, "href")}${addAttribute(`btn px-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white shadow-none ${!nextUrl ? "invisible" : ""}`, "class")}>
					<div class="flex flex-row align-middle">
						<span class="mr-2">${nextText}</span>
						${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:arrow-right", "class": "w-6 h-6" })}
					</div>
				</a>
			</div>
		</div>`}`;
});

const $$Astro$4 = createAstro("/home/dww510/betahero/site/src/pages/[...tags]/[tag]/[...page].astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
async function getStaticPaths$3({ paginate }) {
  if (BLOG?.disabled || BLOG?.tag?.disabled)
    return [];
  const posts = await fetchPosts();
  const tags = /* @__PURE__ */ new Set();
  posts.map((post) => {
    Array.isArray(post.tags) && post.tags.map((tag) => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).map(
    (tag) => paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.includes(tag)),
      {
        params: { tag: cleanSlug(tag), tags: TAG_BASE || void 0 },
        pageSize: BLOG.postsPerPage,
        props: { tag }
      }
    )
  );
}
const $$$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$$2;
  const { page, tag } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Posts by tag '${tag}' ${currentPage > 1 ? `\u2014 Page ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    noindex: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`
		Tag: ${tag}` })}` })}`;
});

const $$file$3 = "/home/dww510/betahero/site/src/pages/[...tags]/[tag]/[...page].astro";
const $$url$3 = "/[...tags]/[tag]/[...page]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths: getStaticPaths$3,
  default: $$$2,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("/home/dww510/betahero/site/src/pages/[...categories]/[category]/[...page].astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
async function getStaticPaths$2({ paginate }) {
  if (BLOG?.disabled || BLOG?.category?.disabled)
    return [];
  const posts = await fetchPosts();
  const categories = /* @__PURE__ */ new Set();
  posts.map((post) => {
    typeof post.category === "string" && categories.add(post.category.toLowerCase());
  });
  return Array.from(categories).map(
    (category) => paginate(
      posts.filter((post) => typeof post.category === "string" && category === post.category.toLowerCase()),
      {
        params: { category: cleanSlug(category), categories: CATEGORY_BASE || void 0 },
        pageSize: BLOG.postsPerPage,
        props: { category }
      }
    )
  );
}
const $$$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$$1;
  const { page, category } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Category '${category}' ${currentPage > 1 ? `\u2014 Page ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    noindex: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`
		Category: ${category}` })}` })}`;
});

const $$file$2 = "/home/dww510/betahero/site/src/pages/[...categories]/[category]/[...page].astro";
const $$url$2 = "/[...categories]/[category]/[...page]";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths: getStaticPaths$2,
  default: $$$1,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("/home/dww510/betahero/site/src/components/blog/SinglePost.astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
const $$SinglePost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SinglePost;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section class="py-8 sm:py-16 lg:py-20 mx-auto">
	<article>
		<header>
			<p class="max-w-3xl mx-auto text-center">
				<time${addAttribute(post.publishDate, "datetime")}>${getFormattedDate(post.publishDate)}</time> ~ ${Math.ceil(post.readingTime)} min read
			</p>
			<h1 class="px-4 sm:px-6 max-w-3xl mx-auto text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-8 font-heading">
				${post.title}
			</h1>
			${post.image && renderTemplate`${renderComponent($$result, "Picture", $$Picture, { "src": post.image, "class": "max-w-full lg:max-w-6xl mx-auto mt-4 mb-6 sm:rounded-md bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post.description, "aspectRatio": "16:9" })}`}
		</header>
		<div class="container mx-auto px-6 sm:px-6 max-w-3xl prose prose-lg lg:prose-xl dark:prose-invert dark:prose-headings:text-slate-300 prose-md prose-headings:font-heading prose-headings:leading-tighter prose-headings:tracking-tighter prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-md prose-img:shadow-lg mt-8">
			${post.Content ? renderTemplate`${renderComponent($$result, "post.Content", post.Content, {})}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(post.body)}` })}`}
		</div>
		<div class="container mx-auto px-8 sm:px-6 max-w-3xl mt-8">
			${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags })}
		</div>
	</article>
</section>`;
});

const $$Astro$1 = createAstro("/home/dww510/betahero/site/src/pages/[...blog]/[slug].astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
async function getStaticPaths$1() {
  if (BLOG?.disabled || BLOG?.post?.disabled)
    return [];
  const posts = await fetchPosts();
  return posts.map((post) => ({
    params: {
      slug: cleanSlug(post.slug),
      blog: POST_BASE || void 0
    },
    props: { post }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$slug;
  const { post } = Astro2.props;
  const meta = {
    title: `${post.title} \u2014 ${SITE.name}`,
    description: post.description,
    canonical: post.canonical || getCanonical(getPermalink(post.slug, "post")),
    image: await findImage(post.image),
    ogTitle: post.title,
    ogType: "article"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "SinglePost", $$SinglePost, { "post": { ...post, image: meta.image } })}` })}`;
});

const $$file$1 = "/home/dww510/betahero/site/src/pages/[...blog]/[slug].astro";
const $$url$1 = "/[...blog]/[slug]";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths: getStaticPaths$1,
  default: $$slug,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("/home/dww510/betahero/site/src/pages/[...blog]/[...page].astro", "https://betahero.org/", "file:///home/dww510/betahero/site/");
async function getStaticPaths({ paginate }) {
  if (BLOG?.disabled || BLOG?.blog?.disabled)
    return [];
  const posts = await fetchPosts();
  return paginate(posts, {
    params: { blog: BLOG_BASE || void 0 },
    pageSize: BLOG.postsPerPage
  });
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props;
  const currentPage = page.currentPage ?? 1;
  const meta = {
    title: `Blog ${currentPage > 1 ? `\u2014 Page ${currentPage} ` : ""}\u2014 ${SITE.name}`,
    description: SITE.description,
    canonical: getCanonical(getPermalink(page.url.current)),
    ogType: "blog",
    noindex: currentPage > 1
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogLayout, { "meta": meta }, { "default": () => renderTemplate`${renderComponent($$result, "BlogList", $$List, { "posts": page.data })}${renderComponent($$result, "Pagination", $$Pagination, { "prevUrl": page.url.prev, "nextUrl": page.url.next })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`
		News and step-by-step guides about
		${maybeRenderHead($$result)}<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">AstroWind</span>` })}` })}`;
});

const $$file = "/home/dww510/betahero/site/src/pages/[...blog]/[...page].astro";
const $$url = "/[...blog]/[...page]";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['node_modules/@astrojs/image/dist/endpoint.js', _page0],['src/pages/index.astro', _page1],['src/pages/rss.xml.js', _page2],['src/pages/404.astro', _page3],['src/pages/[...tags]/[tag]/[...page].astro', _page4],['src/pages/[...categories]/[category]/[...page].astro', _page5],['src/pages/[...blog]/[slug].astro', _page6],['src/pages/[...blog]/[...page].astro', _page7],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/rss.xml","type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/404","type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/[...tags]/[tag]/[...page]","type":"page","pattern":"^(?:\\/(.*?))?\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"...tags","dynamic":true,"spread":true}],[{"content":"tag","dynamic":true,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...tags","tag","...page"],"component":"src/pages/[...tags]/[tag]/[...page].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/[...categories]/[category]/[...page]","type":"page","pattern":"^(?:\\/(.*?))?\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"...categories","dynamic":true,"spread":true}],[{"content":"category","dynamic":true,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...categories","category","...page"],"component":"src/pages/[...categories]/[category]/[...page].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/[...blog]/[slug]","type":"page","pattern":"^(?:\\/(.*?))?\\/([^/]+?)\\/?$","segments":[[{"content":"...blog","dynamic":true,"spread":true}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["...blog","slug"],"component":"src/pages/[...blog]/[slug].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/_...page_.06583933.css"],"scripts":[{"stage":"head-inline","children":"!(function(w,p,f,c){c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[]).concat([\"dataLayer.push\"])})(window,'partytown','forward');/* Partytown 0.7.1 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,p,l){function u(){l||(l=1,\"/\"==(a=(o.lib||\"/~partytown/\")+(o.debug?\"debug/\":\"\"))[0]&&(s=e.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(d=setTimeout(w,1e4),e.addEventListener(\"pt0\",f),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||\"partytown-sw.js\"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&h()}))}),console.error):w())))}function h(t){c=e.createElement(t?\"script\":\"iframe\"),t||(c.setAttribute(\"style\",\"display:block;width:0;height:0;border:0;visibility:hidden\"),c.setAttribute(\"aria-hidden\",!0)),c.src=a+\"partytown-\"+(t?\"atomics.js?v=0.7.1\":\"sandbox-sw.html?\"+Date.now()),e.body.appendChild(c)}function w(t,n){for(f(),t=0;t<s.length;t++)(n=e.createElement(\"script\")).innerHTML=s[t].innerHTML,e.head.appendChild(n);c&&c.parentNode.removeChild(c)}function f(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){p=t,e.split(\".\").map((function(e,n,i){p=p[i[n]]=n+1<i.length?\"push\"==i[n+1]?[]:p[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),\"complete\"==e.readyState?u():(t.addEventListener(\"DOMContentLoaded\",u),t.addEventListener(\"load\",u))}(window,document,navigator,top,window.crossOriginIsolated);"}],"routeData":{"route":"/[...blog]/[...page]","type":"page","pattern":"^(?:\\/(.*?))?(?:\\/(.*?))?\\/?$","segments":[[{"content":"...blog","dynamic":true,"spread":true}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...blog","...page"],"component":"src/pages/[...blog]/[...page].astro","_meta":{"trailingSlash":"ignore"}}}],"site":"https://betahero.org/","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[null],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":true,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/home/dww510/betahero/site/src/assets/images/hero.jpg":"chunks/hero.d39d7ce7.mjs","/home/dww510/betahero/site/src/assets/images/astronaut.jpg":"chunks/astronaut.d5297d53.mjs","/home/dww510/betahero/site/src/assets/images/colors.jpg":"chunks/colors.deb36d42.mjs","/home/dww510/betahero/site/src/assets/images/steps.jpg":"chunks/steps.fbf7e947.mjs","/home/dww510/betahero/site/src/assets/images/tools.jpg":"chunks/tools.b0facf34.mjs","astro:scripts/before-hydration.js":""},"assets":["/assets/inter-cyrillic-variable-wghtOnly-normal.262a1054.woff2","/assets/inter-cyrillic-ext-variable-wghtOnly-normal.848492d3.woff2","/assets/inter-greek-variable-wghtOnly-normal.89b4a3fe.woff2","/assets/inter-greek-ext-variable-wghtOnly-normal.fe977ddb.woff2","/assets/inter-latin-variable-wghtOnly-normal.450f3ba4.woff2","/assets/inter-latin-ext-variable-wghtOnly-normal.45606f83.woff2","/assets/inter-vietnamese-variable-wghtOnly-normal.ac4e131c.woff2","/assets/hero.18ff2f2b.jpg","/assets/astronaut.034f6f11.jpg","/assets/default.c6e14b88.png","/assets/colors.98fbb1a4.jpg","/assets/steps.21b3bbe9.jpg","/assets/tools.8d72c4d8.jpg","/assets/_...page_.06583933.css","/favicon.ico","/favicon.svg","/robots.txt","/~partytown/partytown-atomics.js","/~partytown/partytown-media.js","/~partytown/partytown-sw.js","/~partytown/partytown.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };
